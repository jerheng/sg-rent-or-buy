import { useState, useMemo, useEffect } from "react";
import { Home, TrendingUp, Percent, DollarSign, AlertTriangle, Github } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { ComparisonChart } from "@/components/ComparisonChart";
import { AssumptionsPanel } from "@/components/AssumptionsPanel";
import {
  calculateBSD,
  calculateABSD,
  calculatePropertyTax,
  calculateRentalStampDuty,
  calculateMonthlyCPF
} from "@/lib/singapore-property";
import { CalculationTable } from "@/components/CalculationTable";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";

const ASSUMPTIONS_STORAGE_KEY = "sg_property_calculator_assumptions";

const defaultAssumptions = {
  location: "central",
  income: 8000,
  age: 30,
  citizenshipStatus: "sc",
  propertyCount: 1,
  timeHorizon: 30,
  buyPrice: 600000,
  propertyValuation: 600000,
  rentPrice: 2500,
  downPayment: 25,
  cpfAllocation: 80,
  cashOnHand: 100000,
  cpfBalance: 150000,
  existingDebts: 0,
  bankInterestRate: 3.0,
  maintenanceFees: 350,
  grants: 0,
  propertyType: "hdb_bto",
  propertyAppreciation: 2.5,
  rentalYield: 0,
  inflation: 2.0,
  investmentReturn: 6.5,
  incomeGrowthRate: 3.0,
  spendingPortion: 30,
  savingsPortion: 20,
  savingsReturn: 2.0,
  cpfContributionsEnabled: true,
};

const Index = () => {
  const [assumptions, setAssumptions] = useState(() => {
    if (typeof window === "undefined") {
      return defaultAssumptions;
    }

    try {
      const stored = window.localStorage.getItem(ASSUMPTIONS_STORAGE_KEY);
      if (!stored) {
        return defaultAssumptions;
      }

      const parsed = JSON.parse(stored);

      if (!parsed || typeof parsed !== "object") {
        return defaultAssumptions;
      }

      return {
        ...defaultAssumptions,
        ...parsed,
      };
    } catch {
      return defaultAssumptions;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        ASSUMPTIONS_STORAGE_KEY,
        JSON.stringify(assumptions)
      );
    } catch {
    }
  }, [assumptions]);

  const {
    chartData,
    msrRatio,
    tdsrRatio,
    msrPass,
    tdsrPass,
    minCashRequired,
    caseLabel,
    bsdAmount,
    absdAmount,
  } = useMemo(() => {
    const LTV_LIMIT = 0.75;
    const HDB_INTEREST = 0.026;
    const MSR_LIMIT = 0.3;
    const TDSR_LIMIT = 0.55;
    const MIN_CASH_BANK = 0.05;
    const minDownPaymentPct = 1 - LTV_LIMIT;
    const userDownPaymentPct = (assumptions.downPayment ?? minDownPaymentPct * 100) / 100;
    const effectiveDownPaymentPct = Math.min(Math.max(userDownPaymentPct, minDownPaymentPct), 1);

    const calculateCPFInterest = (balance: number) => {
      const baseRate = 0.025;
      const bonusRate = 0.01;
      const bonusThreshold = 60000;

      const baseInterest = balance * baseRate;
      const bonusInterest = Math.min(balance, bonusThreshold) * bonusRate;

      return baseInterest + bonusInterest;
    };

    const price = assumptions.buyPrice;
    const valuation = assumptions.propertyValuation || price;

    let loanAmount = 0;
    let minCashRequired = 0;
    let caseLabel = "";
    let annualRate = 0;
    let tenureYears = 0;

    const cpfBalance = assumptions.cpfBalance;
    const grants = assumptions.grants;
    const propertyType = assumptions.propertyType;
    const maxTenureByAge = Math.max(5, 65 - assumptions.age);

    if (propertyType === "hdb_bto") {
      caseLabel = "HDB BTO (HDB Loan)";
      annualRate = HDB_INTEREST;
      tenureYears = Math.min(25, assumptions.timeHorizon, maxTenureByAge);

      const downPaymentTotal = price * effectiveDownPaymentPct;
      const availableCpfForDown = cpfBalance + grants;
      const cpfOrGrantsUsed = Math.min(downPaymentTotal, availableCpfForDown);
      minCashRequired = Math.max(0, downPaymentTotal - cpfOrGrantsUsed);

      loanAmount = price - downPaymentTotal;
    } else if (propertyType === "hdb_resale") {
      caseLabel = "HDB Resale (Bank Loan)";
      annualRate = (assumptions.bankInterestRate || 3) / 100;
      tenureYears = Math.min(30, assumptions.timeHorizon, maxTenureByAge);

      const covCash = Math.max(0, price - valuation);
      const downPaymentPct = effectiveDownPaymentPct;
      const downOnValuation = valuation * downPaymentPct;
      const minCashDown = valuation * MIN_CASH_BANK;
      const remainingDown = Math.max(0, downOnValuation - minCashDown);

      const availableCpfAndGrants = cpfBalance + grants;
      const cpfAndGrantsUsed = Math.min(remainingDown, availableCpfAndGrants);
      const extraCashForDown = Math.max(0, remainingDown - cpfAndGrantsUsed);

      minCashRequired = minCashDown + covCash + extraCashForDown;

      const rawLoanAmount = valuation - downOnValuation;
      loanAmount = Math.min(rawLoanAmount, valuation * LTV_LIMIT);
    } else {
      caseLabel = "Private Condo (Bank Loan)";
      annualRate = (assumptions.bankInterestRate || 3) / 100;
      tenureYears = Math.min(30, assumptions.timeHorizon, maxTenureByAge);

      const downPaymentPct = effectiveDownPaymentPct;
      const downPaymentTotal = price * downPaymentPct;
      const minCashDown = price * MIN_CASH_BANK;
      const remainingDown = Math.max(0, downPaymentTotal - minCashDown);
      const cpfUsedForDown = Math.min(remainingDown, cpfBalance);
      const extraCashForDown = Math.max(0, remainingDown - cpfUsedForDown);

      minCashRequired = minCashDown + extraCashForDown;

      const rawLoanAmount = price - downPaymentTotal;
      loanAmount = Math.min(rawLoanAmount, price * LTV_LIMIT);
    }

    const bsdAmount = calculateBSD(price);
    const absdAmount = calculateABSD(price, assumptions.citizenshipStatus, assumptions.propertyCount);
    const totalStampDuty = bsdAmount + absdAmount;
    const totalCashUpfront = minCashRequired + totalStampDuty;

    const monthlyRate = annualRate / 12;
    const tenureMonths = tenureYears * 12;
    const monthlyLoanPayment =
      loanAmount > 0 && monthlyRate > 0 && tenureMonths > 0
        ? (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -tenureMonths))
        : 0;

    const years = assumptions.timeHorizon;
    const data: any[] = [];
    let monthlyRent = assumptions.rentPrice;

    // Initial Costs
    // For Buy: Cash Down + Stamp Duty
    const buyInitialCashOutlay = minCashRequired + totalStampDuty;

    // For Rent: Rental Stamp Duty + Deposit (usually 1 month)
    const initialRentalStampDuty = calculateRentalStampDuty(monthlyRent);
    const rentInitialCashOutlay = initialRentalStampDuty + monthlyRent; // Assuming 1 month deposit

    // Initial Capital (Cash + CPF)
    // We assume the user has 'cashOnHand' + 'cpfBalance' available at start.
    // However, for the comparison to be fair, we should start with the SAME total wealth.
    // But the 'buy' scenario USES some of this wealth for downpayment.
    // The 'rent' scenario KEEPS it.

    // Let's track Liquid Cash and Investments separately.
    // Initial Liquid Cash = Cash On Hand
    // Initial CPF = CPF Balance

    // Buy Scenario State
    let buyPropertyValue = price;
    let buyLoanBalance = loanAmount;
    let buyLiquidCash = assumptions.cashOnHand;
    let buyCPF = assumptions.cpfBalance;
    // Note: The above CPF calculation is simplified. Realistically, CPF usage depends on the specific split.
    // Let's use the logic from before:
    // minCashRequired is calculated based on regulations.
    // The REST of the downpayment comes from CPF (up to limits).

    // Re-calculate initial state more precisely
    const downPaymentAmount = price - loanAmount;
    const cashUsedForBuy = minCashRequired + totalStampDuty;

    const nonCashDown = Math.max(0, downPaymentAmount - minCashRequired);
    const effectiveGrants = propertyType === "private_condo" ? 0 : grants;
    const grantsUsedForDown = Math.min(effectiveGrants, nonCashDown);
    let cpfUsedForBuy = Math.max(0, nonCashDown - grantsUsedForDown);
    cpfUsedForBuy = Math.min(cpfUsedForBuy, assumptions.cpfBalance);

    buyLiquidCash = assumptions.cashOnHand - cashUsedForBuy;
    buyCPF = assumptions.cpfBalance - cpfUsedForBuy;

    let buyInvestments = 0; // Assuming 0 investments to start, or we could add an input for this.
    let buyAccumulatedSavings = buyLiquidCash; // We'll treat liquid cash as "Savings"

    // Rent Scenario State
    let rentLiquidCash = assumptions.cashOnHand - rentInitialCashOutlay;
    let rentCPF = assumptions.cpfBalance;
    let rentInvestments = 0;
    let rentAccumulatedSavings = rentLiquidCash;

    // Common Income/Expense
    const baseMonthlyGrossIncome = assumptions.income;

    // We will accumulate "Surplus" into Investments.
    // Surplus = Income - Spend - SavingsTarget - HousingCost

    let buyCumulativeCost = 0;
    let rentCumulativeCost = 0;

    const annualValue = assumptions.rentPrice * 12;

    for (let year = 0; year <= years; year++) {
      const incomeGrowthRate = assumptions.incomeGrowthRate ?? 0;
      const incomeGrowthFactor = Math.pow(1 + incomeGrowthRate / 100, year);
      const monthlyGrossIncome = baseMonthlyGrossIncome * incomeGrowthFactor;
      // --- BUY SCENARIO ---
      const propertyTax = calculatePropertyTax(annualValue * Math.pow(1 + assumptions.inflation / 100, year));
      
      // Income Allocation (Buy)
      const currentAge = assumptions.age + year;
      const cpfContributionsEnabled = assumptions.cpfContributionsEnabled ?? true;
      
      const cpfData = calculateMonthlyCPF(monthlyGrossIncome, currentAge);
      
      const annualCPFContribution = cpfContributionsEnabled
        ? cpfData.oa * 12
        : 0;
      const monthlyEmployeeCPF = cpfContributionsEnabled
        ? cpfData.employee
        : 0;
      const monthlyNetIncome = monthlyGrossIncome - monthlyEmployeeCPF;
      const monthlySpend = monthlyNetIncome * (assumptions.spendingPortion / 100);
      const monthlySavingsTarget = monthlyNetIncome * (assumptions.savingsPortion / 100);
      const buyAnnualIncome = monthlyNetIncome * 12;
      const buyAnnualSpend = monthlySpend * 12;
      const buyAnnualSavingsContribution = monthlySavingsTarget * 12;

      // Calculate Housing Costs (Splitting Cash vs CPF)
      const annualLoanPayment = monthlyLoanPayment * 12;
      const annualMaintenance = assumptions.maintenanceFees * 12;
      
      // CPF Usage for Loan
      // We use the 'cpfAllocation' assumption to determine how much of the LOAN is paid by CPF.
      // Default behavior: Use CPF for loan if available/allocated.
      const cpfAllocationPct = assumptions.cpfAllocation ?? 0;
      const targetCpfForLoan = annualLoanPayment * (cpfAllocationPct / 100);
      
      // Available CPF for housing: Existing Balance + Annual OA Contributions
      // (Simplified: We allow using the full annual contribution for the year's payments)
      const availableCpfForHousing = buyCPF + annualCPFContribution; 
      const cpfUsedForLoan = Math.min(targetCpfForLoan, availableCpfForHousing);
      
      const cashUsedForLoan = annualLoanPayment - cpfUsedForLoan;
      
      const buyAnnualCashHousingCost = cashUsedForLoan + annualMaintenance + propertyTax;
      const buyAnnualTotalHousingCost = annualLoanPayment + annualMaintenance + propertyTax;

      // Investable Surplus (Buy)
      // We must pay housing cost first (CASH portion).
      // If (Income - Spend - Housing) < 0, we are in trouble (negative cashflow).
      // We assume Savings are prioritized after Housing.

      const buyAnnualSurplus = buyAnnualIncome - buyAnnualSpend - buyAnnualCashHousingCost - buyAnnualSavingsContribution;

      // Update Buy State
      buyPropertyValue *= 1 + assumptions.propertyAppreciation / 100;

      // Loan Amortization
      if (buyLoanBalance > 0 && annualRate > 0) {
        const annualInterest = buyLoanBalance * annualRate;
        const annualPrincipal = Math.max(0, (monthlyLoanPayment * 12) - annualInterest);
        buyLoanBalance = Math.max(0, buyLoanBalance - annualPrincipal);
      } else if (buyLoanBalance > 0 && annualRate === 0) {
        // 0 interest case
        const annualPrincipal = monthlyLoanPayment * 12;
        buyLoanBalance = Math.max(0, buyLoanBalance - annualPrincipal);
      }

      // Grow Savings & Investments
      buyAccumulatedSavings = buyAccumulatedSavings * (1 + assumptions.savingsReturn / 100) + buyAnnualSavingsContribution;

      // If surplus is positive, add to investments. If negative, deduct from savings/investments.
      if (buyAnnualSurplus >= 0) {
        buyInvestments = buyInvestments * (1 + assumptions.investmentReturn / 100) + buyAnnualSurplus;
      } else {
        // Deficit! Eat into savings first, then investments.
        const deficit = -buyAnnualSurplus;
        if (buyAccumulatedSavings >= deficit) {
          buyAccumulatedSavings -= deficit;
          buyInvestments = buyInvestments * (1 + assumptions.investmentReturn / 100);
        } else {
          const remainingDeficit = deficit - buyAccumulatedSavings;
          buyAccumulatedSavings = 0;
          buyInvestments = Math.max(0, buyInvestments * (1 + assumptions.investmentReturn / 100) - remainingDeficit);
        }
      }

      // Update Buy CPF (Deduct usage, Add contribution, Add Interest)
      const cpfBalanceBeforeInterest = Math.max(0, buyCPF + annualCPFContribution - cpfUsedForLoan);
      const cpfInterest = calculateCPFInterest(cpfBalanceBeforeInterest);
      const newBuyCPF = cpfBalanceBeforeInterest + cpfInterest;

      const buyNetWorth = buyPropertyValue - buyLoanBalance + buyAccumulatedSavings + buyInvestments + newBuyCPF; 
      
      buyCPF = newBuyCPF;

      buyCumulativeCost += buyAnnualTotalHousingCost;

      // --- RENT SCENARIO ---
      const rentAnnualHousingCost = monthlyRent * 12;

      // Income Allocation (Rent)
      const rentAnnualIncome = buyAnnualIncome;
      const rentAnnualSpend = buyAnnualSpend;
      const rentAnnualSavingsContribution = buyAnnualSavingsContribution;

      const rentAnnualSurplus = rentAnnualIncome - rentAnnualSpend - rentAnnualHousingCost - rentAnnualSavingsContribution;

      // Update Rent State
      rentAccumulatedSavings = rentAccumulatedSavings * (1 + assumptions.savingsReturn / 100) + rentAnnualSavingsContribution;

      if (rentAnnualSurplus >= 0) {
        rentInvestments = rentInvestments * (1 + assumptions.investmentReturn / 100) + rentAnnualSurplus;
      } else {
        const deficit = -rentAnnualSurplus;
        if (rentAccumulatedSavings >= deficit) {
          rentAccumulatedSavings -= deficit;
          rentInvestments = rentInvestments * (1 + assumptions.investmentReturn / 100);
        } else {
          const remainingDeficit = deficit - rentAccumulatedSavings;
          rentAccumulatedSavings = 0;
          rentInvestments = Math.max(0, rentInvestments * (1 + assumptions.investmentReturn / 100) - remainingDeficit);
        }
      }

      const newRentCPF = rentCPF + annualCPFContribution + calculateCPFInterest(rentCPF + annualCPFContribution);

      const rentNetWorth = rentAccumulatedSavings + rentInvestments + newRentCPF;

      rentCPF = newRentCPF;

      rentCumulativeCost += rentAnnualHousingCost;

      const advantage = rentNetWorth - buyNetWorth; // Rent minus Buy
      const buyAdvantage = buyNetWorth - rentNetWorth; // Buy minus Rent

      data.push({
        year,
        buyNetWorth: Math.round(buyNetWorth),
        rentNetWorth: Math.round(rentNetWorth),
        buyCashFlow: Math.round(-buyAnnualCashHousingCost),
        rentCashFlow: Math.round(-rentAnnualHousingCost),
        liquidSavings: Math.round(rentAccumulatedSavings), // Backwards-compat: renter liquid savings
        buySavings: Math.round(buyAccumulatedSavings),
        rentSavings: Math.round(rentAccumulatedSavings),
        buyInvestments: Math.round(buyInvestments),
        rentInvestments: Math.round(rentInvestments),
        investments: Math.round(rentInvestments), // Backwards-compat: renter investments
        advantage: Math.round(advantage),
        buyAdvantage: Math.round(buyAdvantage),
        buyCumulativeCost: Math.round(buyCumulativeCost),
        rentCumulativeCost: Math.round(rentCumulativeCost),
        buyPropertyValue: Math.round(buyPropertyValue),
      });

      monthlyRent *= 1 + assumptions.inflation / 100;
    }

    const monthlyDebtObligations = monthlyLoanPayment + assumptions.existingDebts;
    const msrRatio = assumptions.income
      ? monthlyLoanPayment / assumptions.income
      : 0;
    const tdsrRatio = assumptions.income
      ? monthlyDebtObligations / assumptions.income
      : 0;

    const msrPass = propertyType === "private_condo" ? true : msrRatio <= MSR_LIMIT;
    const tdsrPass = tdsrRatio <= TDSR_LIMIT;

    return {
      chartData: data,
      msrRatio,
      tdsrRatio,
      msrPass,
      tdsrPass,
      minCashRequired: Math.round(minCashRequired + totalStampDuty),
      caseLabel,
      bsdAmount,
      absdAmount,
    };
  }, [assumptions]);

  const finalData = chartData[chartData.length - 1];
  const firstYearData = chartData[0];

  const rentAdvantage = finalData.rentNetWorth - finalData.buyNetWorth;
  const isRentBetter = rentAdvantage >= 0;
  
  const advantagePercent = (() => {
      const diff = Math.abs(rentAdvantage);
      const base = isRentBetter ? finalData.buyNetWorth : finalData.rentNetWorth;
      
      if (base === 0) return "0";
      
      return ((diff / Math.abs(base)) * 100).toFixed(1);
  })();

  const advantageLabel = isRentBetter ? "Renting Advantage" : "Buying Advantage";
  // Always positive since we adjusted the label
  const advantageChangeType = "positive"; 
  const advantageIconColor = isRentBetter ? "text-chart-rent" : "text-chart-buy";

  const buyHousingPctIncome = assumptions.income
    ? (Math.abs(firstYearData.buyCashFlow) / (assumptions.income * 12)) * 100
    : 0;
  const rentHousingPctIncome = assumptions.income
    ? (Math.abs(firstYearData.rentCashFlow) / (assumptions.income * 12)) * 100
    : 0;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const analysisText = (() => {
    const diff = Math.abs(rentAdvantage);
    const formattedDiff = formatCurrency(diff);
    const buyPropValue = finalData.buyPropertyValue || 0;
    const rentInv = finalData.rentInvestments || 0;
    
    if (isRentBetter) {
       return `Renting is projected to be financially superior by ${formattedDiff} (+${advantagePercent}%) after ${assumptions.timeHorizon} years. This is primarily because the returns from investing your downpayment and monthly cashflow surplus (Total Investments: ${formatCurrency(rentInv)}) outperformed the property capital appreciation (Property Value: ${formatCurrency(buyPropValue)}).`;
    } else {
       return `Buying is projected to be financially superior by ${formattedDiff} (+${advantagePercent}%) after ${assumptions.timeHorizon} years. The property's capital appreciation (Value: ${formatCurrency(buyPropValue)}) and the "forced savings" from paying down the mortgage principal outweighed the returns you could have achieved by investing the difference while renting (Rent Scenario Investments: ${formatCurrency(rentInv)}).`;
    }
  })();

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all assumptions to default values?")) {
      setAssumptions(defaultAssumptions);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">SG Property Calculator</h1>
              <p className="text-sm text-muted-foreground">Rent vs Buy Comparison for Singapore</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/facts" className="text-sm font-medium text-primary hover:underline">
              View Fact Sheet
            </Link>
            <a
              href="https://github.com/jerheng/sg-rent-or-buy"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary"
              aria-label="View source on GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
          {/* Left Column - Charts and Metrics */}
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                icon={DollarSign}
                label="Rent Total NW"
                value={formatCurrency(finalData.rentNetWorth)}
                iconColor="text-chart-rent"
              />
              <MetricCard
                icon={Home}
                label="Buy Total NW"
                value={formatCurrency(finalData.buyNetWorth)}
                iconColor="text-chart-buy"
              />
              <MetricCard
                icon={TrendingUp}
                label={advantageLabel}
                value={formatCurrency(Math.abs(rentAdvantage))}
                change={`${rentAdvantage >= 0 ? "+" : ""}${advantagePercent}%`}
                changeType={advantageChangeType}
                iconColor={advantageIconColor}
              />
              <MetricCard
                icon={Percent}
                label="Rent/Purchase Price"
                value={((assumptions.rentPrice * 12 / assumptions.buyPrice) * 100).toFixed(2) + "%"}
                iconColor="text-primary"
              />
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
               <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Financial Analysis</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {analysisText}
                    </p>
                  </div>
               </div>
            </div>

            {(!msrPass || !tdsrPass) && (
              <div className="grid grid-cols-1">
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-semibold text-destructive">Loan eligibility warning</span>
                  </div>
                  <ul className="text-xs text-destructive space-y-1">
                    {!msrPass && (
                      <li>MSR exceeds the 30% limit for HDB loans.</li>
                    )}
                    {!tdsrPass && (
                      <li>TDSR exceeds the 55% total debt servicing limit.</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {assumptions.cashOnHand < minCashRequired && (
              <div className="grid grid-cols-1">
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-semibold text-destructive">Insufficient cash for purchase</span>
                  </div>
                  <p className="text-xs text-destructive">
                    You need {formatCurrency(minCashRequired)} in cash (down payment and stamp duties) but currently have {formatCurrency(assumptions.cashOnHand)}.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                icon={Home}
                label="Property Type"
                value={caseLabel}
                iconColor="text-primary"
              />
              <MetricCard
                icon={DollarSign}
                label="Min Cash Needed"
                value={formatCurrency(minCashRequired)}
                iconColor="text-primary"
              />
              <MetricCard
                icon={Percent}
                label="MSR Usage"
                value={`${(msrRatio * 100).toFixed(1)}% of 30%`}
                change={msrPass ? "Pass" : "Fail"}
                changeType={msrPass ? "positive" : "negative"}
                iconColor="text-primary"
              />
              <MetricCard
                icon={Percent}
                label="TDSR Usage"
                value={`${(tdsrRatio * 100).toFixed(1)}% of 55%`}
                change={tdsrPass ? "Pass" : "Fail"}
                changeType={tdsrPass ? "positive" : "negative"}
                iconColor="text-primary"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Income allocation (Year 0): Spending {assumptions.spendingPortion}% · Savings {assumptions.savingsPortion}% ·
              Housing (Buy) {buyHousingPctIncome.toFixed(1)}% · Housing (Rent) {rentHousingPctIncome.toFixed(1)}%
            </div>

            {/* Tax Breakdown Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard
                icon={DollarSign}
                label="Buyer's Stamp Duty (BSD)"
                value={formatCurrency(bsdAmount)}
                iconColor="text-primary"
              />
              <MetricCard
                icon={DollarSign}
                label="ABSD"
                value={formatCurrency(absdAmount)}
                iconColor="text-primary"
              />
            </div>

            {/* Chart */}
            <ComparisonChart data={chartData} />

            {/* Detailed Calculation Table */}
            <CalculationTable data={chartData} />
          </div>

          {/* Right Column - Assumptions Panel */}
          <div className="xl:sticky xl:top-6 xl:self-start xl:max-h-[calc(100vh-4rem)] xl:overflow-y-auto">
            <AssumptionsPanel
              assumptions={assumptions}
              onAssumptionsChange={setAssumptions}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
