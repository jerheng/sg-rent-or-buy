
// Source: https://www.iras.gov.sg/taxes/stamp-duty/for-property/buying-or-selling-property/buyer's-stamp-duty-(bsd)
export const calculateBSD = (price: number): number => {
    let remaining = price;
    let bsd = 0;

    // Rates effective from 15 Feb 2023
    // First 180k at 1%
    const tier1 = Math.min(remaining, 180000);
    bsd += tier1 * 0.01;
    remaining -= tier1;
    if (remaining <= 0) return bsd;

    // Next 180k at 2%
    const tier2 = Math.min(remaining, 180000);
    bsd += tier2 * 0.02;
    remaining -= tier2;
    if (remaining <= 0) return bsd;

    // Next 640k at 3%
    const tier3 = Math.min(remaining, 640000);
    bsd += tier3 * 0.03;
    remaining -= tier3;
    if (remaining <= 0) return bsd;

    // Next 500k at 4%
    const tier4 = Math.min(remaining, 500000);
    bsd += tier4 * 0.04;
    remaining -= tier4;
    if (remaining <= 0) return bsd;

    // Next 1.5M at 5%
    const tier5 = Math.min(remaining, 1500000);
    bsd += tier5 * 0.05;
    remaining -= tier5;
    if (remaining <= 0) return bsd;

    // Remaining at 6%
    bsd += remaining * 0.06;

    return bsd;
};

// Source: https://www.iras.gov.sg/taxes/stamp-duty/for-property/buying-or-selling-property/additional-buyer's-stamp-duty-(absd)
export const calculateABSD = (price: number, citizenship: string, count: number = 1): number => {
    let rate = 0;

    // Rates effective from 27 Apr 2023
    if (citizenship === 'sc') {
        if (count === 1) rate = 0;
        else if (count === 2) rate = 0.20;
        else rate = 0.30;
    } else if (citizenship === 'pr') {
        if (count === 1) rate = 0.05;
        else if (count === 2) rate = 0.30;
        else rate = 0.35;
    } else {
        // Foreigner
        rate = 0.60;
    }

    return price * rate;
};

// Source: https://www.iras.gov.sg/taxes/property-tax/property-owners/property-tax-rates
// Owner-Occupied Tax Rates (Effective 1 Jan 2025)
export const calculatePropertyTax = (annualValue: number): number => {
    let tax = 0;
    let remaining = annualValue;

    // First 12k - 0%
    const tier1 = Math.min(remaining, 12000);
    remaining -= tier1;
    if (remaining <= 0) return tax;

    // Next 28k (up to 40k) - 4%
    const tier2 = Math.min(remaining, 28000);
    tax += tier2 * 0.04;
    remaining -= tier2;
    if (remaining <= 0) return tax;

    // Next 10k (up to 50k) - 6%
    const tier3 = Math.min(remaining, 10000);
    tax += tier3 * 0.06;
    remaining -= tier3;
    if (remaining <= 0) return tax;

    // Next 25k (up to 75k) - 10%
    const tier4 = Math.min(remaining, 25000);
    tax += tier4 * 0.10;
    remaining -= tier4;
    if (remaining <= 0) return tax;

    // Next 10k (up to 85k) - 14%
    const tier5 = Math.min(remaining, 10000);
    tax += tier5 * 0.14;
    remaining -= tier5;
    if (remaining <= 0) return tax;

    // Next 15k (up to 100k) - 20%
    const tier6 = Math.min(remaining, 15000);
    tax += tier6 * 0.20;
    remaining -= tier6;
    if (remaining <= 0) return tax;

    // Next 40k (up to 140k) - 26%
    const tier7 = Math.min(remaining, 40000);
    tax += tier7 * 0.26;
    remaining -= tier7;
    if (remaining <= 0) return tax;

    // Above 140k - 32%
    tax += remaining * 0.32;

    return tax;
};

// Source: https://www.iras.gov.sg/taxes/stamp-duty/for-property/renting-a-property/renting-a-property
export const calculateRentalStampDuty = (monthlyRent: number): number => {
    // 0.4% of total rent for the lease period
    // Assuming 1 year lease for simplicity in annual calculation
    return (monthlyRent * 12) * 0.004;
};

// CPF Constants and Calculations (Effective Jan 2025)
export const CPF_SALARY_CEILING_2025 = 7400;

export const getCPFContributionRates = (age: number) => {
    // Rates based on Jan 2025 implementation
    // Source: CPF Board
    if (age <= 35) {
        return { employee: 0.20, employer: 0.17, oa: 0.23 };
    } else if (age <= 45) {
        return { employee: 0.20, employer: 0.17, oa: 0.21 };
    } else if (age <= 50) {
        return { employee: 0.20, employer: 0.17, oa: 0.19 };
    } else if (age <= 55) {
        return { employee: 0.20, employer: 0.17, oa: 0.15 };
    } else if (age <= 60) {
        // Jan 2025: Total 32.5% (Emp 17% + Emplr 15.5%)
        // Allocation to OA: ~12% (approximate based on ratio) - Official: 12%
        return { employee: 0.17, employer: 0.155, oa: 0.12 };
    } else if (age <= 65) {
        // Jan 2025: Total 21.5% (Emp 11.5% + Emplr 10%)
        // Allocation to OA: 3.5%
        return { employee: 0.115, employer: 0.10, oa: 0.035 };
    } else if (age <= 70) {
        // Jan 2025: Total 15% (Emp 7.5% + Emplr 7.5%)
        // Allocation to OA: 1%
        return { employee: 0.075, employer: 0.075, oa: 0.01 };
    } else {
        // > 70
        // Jan 2025: Total 12.5% (Emp 5% + Emplr 7.5%)
        // Allocation to OA: 1%
        return { employee: 0.05, employer: 0.075, oa: 0.01 };
    }
};

export const calculateMonthlyCPF = (monthlyIncome: number, age: number) => {
    const cappedIncome = Math.min(monthlyIncome, CPF_SALARY_CEILING_2025);
    const rates = getCPFContributionRates(age);
    
    return {
        employee: cappedIncome * rates.employee,
        employer: cappedIncome * rates.employer,
        oa: cappedIncome * rates.oa
    };
};
