import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Info, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import {
  CPF_SALARY_CEILING_2025,
  calculateMonthlyCPF
} from "@/lib/singapore-property";

interface AssumptionsPanelProps {
  assumptions: {
    location: string;
    income: number;
    age: number;
    citizenshipStatus: string;
    propertyCount: number;
    timeHorizon: number;
    buyPrice: number;
    propertyValuation: number;
    rentPrice: number;
    downPayment: number;
    cpfAllocation: number;
    cashOnHand: number;
    cpfBalance: number;
    existingDebts: number;
    bankInterestRate: number;
    maintenanceFees: number;
    grants: number;
    propertyType: string;
    propertyAppreciation: number;
    rentalYield: number;
    inflation: number;
    investmentReturn: number;
    incomeGrowthRate: number;
    spendingPortion: number;
    savingsPortion: number;
    savingsReturn: number;
    cpfContributionsEnabled: boolean;
  };
  onAssumptionsChange: (assumptions: any) => void;
  onReset?: () => void;
}

export function AssumptionsPanel({ assumptions, onAssumptionsChange, onReset }: AssumptionsPanelProps) {
  const [personalExpanded, setPersonalExpanded] = useState(false);
  const [buyExpanded, setBuyExpanded] = useState(true);
  const [rentExpanded, setRentExpanded] = useState(true);
  const [habitsExpanded, setHabitsExpanded] = useState(true);
  const [returnsExpanded, setReturnsExpanded] = useState(true);

  const grossMonthlyIncome = assumptions.income || 0;
  const cpfData = calculateMonthlyCPF(grossMonthlyIncome, assumptions.age);
  
  const employeeCpfMonthly = assumptions.cpfContributionsEnabled
    ? cpfData.employee
    : 0;
  const oaCpfMonthly = assumptions.cpfContributionsEnabled
    ? cpfData.oa
    : 0;

  const netMonthlyIncome = assumptions.cpfContributionsEnabled
    ? grossMonthlyIncome - employeeCpfMonthly
    : grossMonthlyIncome;

  const incomeGrowthRate = assumptions.incomeGrowthRate || 0;
  const horizonYears = assumptions.timeHorizon || 0;
  const year10 = Math.min(10, horizonYears);
  const incomeYear10 = year10
    ? assumptions.income * Math.pow(1 + incomeGrowthRate / 100, year10)
    : assumptions.income;
  const incomeYearHorizon = horizonYears
    ? assumptions.income * Math.pow(1 + incomeGrowthRate / 100, horizonYears)
    : assumptions.income;

  const updateAssumption = (key: string, value: number | string) => {
    if (key === "spendingPortion" || key === "savingsPortion") {
      const numeric = typeof value === "number" ? value : parseFloat(String(value));
      const other = key === "spendingPortion" ? assumptions.savingsPortion : assumptions.spendingPortion;
      const maxForCurrent = Math.max(0, 100 - other);
      const clamped = Math.min(Math.max(numeric || 0, 0), maxForCurrent);

      onAssumptionsChange({
        ...assumptions,
        [key]: clamped,
      });
      return;
    }

    onAssumptionsChange({ ...assumptions, [key]: value });
  };

  return (
    <Card className="p-6 bg-card border-border/50">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Assumptions</h2>
          {onReset && (
            <Button variant="ghost" size="icon" onClick={onReset} title="Reset to Defaults">
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Collapsible open={personalExpanded} onOpenChange={setPersonalExpanded}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full">
            {personalExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <h3 className="text-sm font-semibold text-foreground">Personal Profile</h3>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <div>
              <Label className="text-sm font-medium text-foreground">Location</Label>
              <Select value={assumptions.location} onValueChange={(value) => updateAssumption("location", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="central">Central Singapore</SelectItem>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-foreground">Income</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Monthly household income in SGD</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">$</span>
                  <Input
                    type="number"
                    value={assumptions.income}
                    onChange={(e) => updateAssumption("income", parseInt(e.target.value))}
                    className="w-24 text-right"
                  />
                </div>
              </div>
              <Slider
                value={[assumptions.income]}
                onValueChange={([value]) => updateAssumption("income", value)}
                min={1000}
                max={50000}
                step={1000}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-foreground">Income Growth</Label>
                  <span className="text-xs text-muted-foreground">per year</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={assumptions.incomeGrowthRate}
                    onChange={(e) => updateAssumption("incomeGrowthRate", parseFloat(e.target.value))}
                    className="w-20 text-right"
                    step="0.5"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
              {horizonYears > 0 && (
                <p className="text-xs text-muted-foreground">
                  At {year10} yrs: ${Math.round(incomeYear10).toLocaleString("en-SG")}/mo · At {horizonYears} yrs: ${Math.round(incomeYearHorizon).toLocaleString("en-SG")}/mo
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-foreground">Time Horizon</Label>
                <span className="text-sm font-medium text-foreground">{assumptions.timeHorizon} yrs</span>
              </div>
              <Slider
                value={[assumptions.timeHorizon]}
                onValueChange={([value]) => updateAssumption("timeHorizon", value)}
                min={5}
                max={50}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-foreground">Age</Label>
                <span className="text-sm font-medium text-foreground">{assumptions.age} yrs</span>
              </div>
              <Slider
                value={[assumptions.age]}
                onValueChange={([value]) => updateAssumption("age", value)}
                min={21}
                max={65}
                step={1}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground">Citizenship</Label>
                <Select
                  value={assumptions.citizenshipStatus}
                  onValueChange={(value) => updateAssumption("citizenshipStatus", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sc">Singapore Citizen</SelectItem>
                    <SelectItem value="pr">Singapore PR</SelectItem>
                    <SelectItem value="foreigner">Foreigner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground">Property Count</Label>
                <Select
                  value={assumptions.propertyCount.toString()}
                  onValueChange={(value) => updateAssumption("propertyCount", parseInt(value))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Property</SelectItem>
                    <SelectItem value="2">2nd Property</SelectItem>
                    <SelectItem value="3">3rd+ Property</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-foreground">Cash on Hand</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">$</span>
                    <Input
                      type="number"
                      value={assumptions.cashOnHand}
                      onChange={(e) => updateAssumption("cashOnHand", parseInt(e.target.value))}
                      className="w-28 text-right"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-foreground">CPF OA Balance</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">$</span>
                    <Input
                      type="number"
                      value={assumptions.cpfBalance}
                      onChange={(e) => updateAssumption("cpfBalance", parseInt(e.target.value))}
                      className="w-28 text-right"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-foreground">CPF Contributions</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle CPF salary contributions on or off. When on, income is treated as Singapore gross salary with CPF deductions and OA contributions.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  checked={assumptions.cpfContributionsEnabled}
                  onCheckedChange={(checked) =>
                    onAssumptionsChange({ ...assumptions, cpfContributionsEnabled: checked })
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Turn this off if you do not contribute to CPF (for example, if you are a foreigner or self-employed without CPF contributions). At your current income and age (Year 0), gross income is approximately ${Math.round(grossMonthlyIncome).toLocaleString("en-SG")}/mo, employee CPF is about ${Math.round(employeeCpfMonthly).toLocaleString("en-SG")}/mo, CPF OA receives about ${Math.round(oaCpfMonthly).toLocaleString("en-SG")}/mo, and net take-home income before spending, savings, and housing is roughly ${Math.round(netMonthlyIncome).toLocaleString("en-SG")}/mo. CPF OA interest is assumed at 2.5% base plus an extra 1% on the first $60,000 of combined CPF balances.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-foreground">Existing Monthly Debts</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">$</span>
                  <Input
                    type="number"
                    value={assumptions.existingDebts}
                    onChange={(e) => updateAssumption("existingDebts", parseInt(e.target.value))}
                    className="w-28 text-right"
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={habitsExpanded} onOpenChange={setHabitsExpanded}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full">
            {habitsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <h3 className="text-sm font-semibold text-foreground">Financial Habits</h3>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-foreground">Spending (% of Income)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={assumptions.spendingPortion}
                    onChange={(e) => updateAssumption("spendingPortion", parseFloat(e.target.value))}
                    className="w-20 text-right"
                  />
                  <span className="text-sm">%</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {netMonthlyIncome
                      ? `$${Math.round(netMonthlyIncome * (assumptions.spendingPortion / 100)).toLocaleString("en-SG")}/mo`
                      : "$0/mo"}
                  </span>
                </div>
              </div>
              <Slider
                value={[assumptions.spendingPortion]}
                onValueChange={([value]) => updateAssumption("spendingPortion", value)}
                min={0}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-foreground">Savings (% of Income)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={assumptions.savingsPortion}
                    onChange={(e) => updateAssumption("savingsPortion", parseFloat(e.target.value))}
                    className="w-20 text-right"
                  />
                  <span className="text-sm">%</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {netMonthlyIncome
                      ? `$${Math.round(netMonthlyIncome * (assumptions.savingsPortion / 100)).toLocaleString("en-SG")}/mo`
                      : "$0/mo"}
                  </span>
                </div>
              </div>
              <Slider
                value={[assumptions.savingsPortion]}
                onValueChange={([value]) => updateAssumption("savingsPortion", value)}
                min={0}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-sm font-medium text-foreground">Remaining (% of Income)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={Math.max(0, 100 - assumptions.spendingPortion - assumptions.savingsPortion)}
                    readOnly
                    className="w-20 text-right"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Remaining income is first used for housing costs (mortgage or rent plus maintenance). If there is any surplus after spending, housing, and savings, it is invested at your Investment Return rate, while savings contributions grow at your Savings Return rate.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-foreground">Savings Return</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={assumptions.savingsReturn}
                    onChange={(e) => updateAssumption("savingsReturn", parseFloat(e.target.value))}
                    className="w-20 text-right"
                    step="0.1"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={buyExpanded} onOpenChange={setBuyExpanded}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full">
            {buyExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <h3 className="text-sm font-semibold text-foreground">Buy</h3>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <div>
              <Label className="text-sm font-medium text-foreground">Property Type</Label>
              <Select
                value={assumptions.propertyType}
                onValueChange={(value) => updateAssumption("propertyType", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hdb_bto">HDB BTO (HDB Loan)</SelectItem>
                  <SelectItem value="hdb_resale">HDB Resale (Bank Loan)</SelectItem>
                  <SelectItem value="private_condo">Private Condo (Bank Loan)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-muted-foreground">Purchase Price</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  <Input
                    type="number"
                    value={assumptions.buyPrice}
                    onChange={(e) => updateAssumption("buyPrice", parseInt(e.target.value))}
                    className="w-32 text-right"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-muted-foreground">Valuation</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  <Input
                    type="number"
                    value={assumptions.propertyValuation}
                    onChange={(e) => updateAssumption("propertyValuation", parseInt(e.target.value))}
                    className="w-32 text-right"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-muted-foreground">Down Payment (%)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={assumptions.downPayment}
                    onChange={(e) => updateAssumption("downPayment", parseFloat(e.target.value))}
                    className="w-20 text-right"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                This is your cash portion of the property price. For bank loans, regulations typically require at least ~5% of the purchase price to be paid in cash; any remaining downpayment is assumed to come from CPF and grants.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">CPF Allocation</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={assumptions.cpfAllocation}
                  onChange={(e) => updateAssumption("cpfAllocation", parseFloat(e.target.value))}
                  className="w-full text-right"
                />
                <span className="text-sm whitespace-nowrap">%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Bank Interest Rate</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={assumptions.bankInterestRate}
                    onChange={(e) => updateAssumption("bankInterestRate", parseFloat(e.target.value))}
                    className="w-full text-right"
                    step="0.1"
                  />
                  <span className="text-sm whitespace-nowrap">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Maintenance Fees</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm whitespace-nowrap">$</span>
                  <Input
                    type="number"
                    value={assumptions.maintenanceFees}
                    onChange={(e) => updateAssumption("maintenanceFees", parseInt(e.target.value))}
                    className="w-full text-right"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Grants (HDB)</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">$</span>
                <Input
                  type="number"
                  value={assumptions.grants}
                  onChange={(e) => updateAssumption("grants", parseInt(e.target.value))}
                  className="w-full text-right"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={rentExpanded} onOpenChange={setRentExpanded}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full">
            {rentExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <h3 className="text-sm font-semibold text-foreground">Rent</h3>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-muted-foreground">Monthly Rent</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  <Input
                    type="number"
                    value={assumptions.rentPrice}
                    onChange={(e) => updateAssumption("rentPrice", parseInt(e.target.value))}
                    className="w-28 text-right"
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={returnsExpanded} onOpenChange={setReturnsExpanded}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full">
            {returnsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <h3 className="text-sm font-semibold text-foreground">Expected Returns</h3>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-muted-foreground">Property Appreciation</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={assumptions.propertyAppreciation}
                    onChange={(e) => updateAssumption("propertyAppreciation", parseFloat(e.target.value))}
                    className="w-20 text-right"
                    step="0.1"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-muted-foreground">Investment Return</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={assumptions.investmentReturn}
                    onChange={(e) => updateAssumption("investmentReturn", parseFloat(e.target.value))}
                    className="w-20 text-right"
                    step="0.1"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-muted-foreground">Inflation</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={assumptions.inflation}
                    onChange={(e) => updateAssumption("inflation", parseFloat(e.target.value))}
                    className="w-20 text-right"
                    step="0.1"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
}
