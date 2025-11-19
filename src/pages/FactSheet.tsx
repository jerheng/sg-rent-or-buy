import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Home, Github } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";

const FactSheet = () => {
    return (
        <div className="min-h-screen bg-background">
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
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Calculator
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

            <div className="container mx-auto px-4 py-8">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-foreground">Singapore Property Fact Sheet (2025)</h2>
                    <p className="text-sm text-muted-foreground">Key definitions, taxes, and methodology used in this calculator.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Definitions Section */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Key Definitions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-primary">MSR (Mortgage Servicing Ratio)</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        The portion of a borrower's gross monthly income that goes towards repaying all property loans.
                                        <br />
                                        <strong>Limit:</strong> 30% of gross monthly income.
                                        <br />
                                        <strong>Applicability:</strong> HDB flats (BTO and Resale) only.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-primary">TDSR (Total Debt Servicing Ratio)</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        The portion of a borrower's gross monthly income that goes towards repaying all monthly debt obligations (including the property loan being applied for).
                                        <br />
                                        <strong>Limit:</strong> 55% of gross monthly income.
                                        <br />
                                        <strong>Applicability:</strong> All property loans (HDB and Private).
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-primary">LTV (Loan-to-Value) Limit</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        The maximum amount an individual can borrow for a housing loan based on the property value.
                                        <br />
                                        <strong>HDB Loan:</strong> Up to 75%.
                                        <br />
                                        <strong>Bank Loan:</strong> Up to 75%.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Buyer's Stamp Duty (BSD)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Tax paid on the acceptance of the Option to Purchase (OTP) or Sale & Purchase Agreement.
                                </p>
                                <div className="rounded-md border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr className="text-left">
                                                <th className="p-2 font-medium">Purchase Price / Market Value</th>
                                                <th className="p-2 font-medium">Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-t">
                                                <td className="p-2">First $180,000</td>
                                                <td className="p-2">1%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">Next $180,000</td>
                                                <td className="p-2">2%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">Next $640,000</td>
                                                <td className="p-2">3%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">Next $500,000</td>
                                                <td className="p-2">4%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">Next $1,500,000</td>
                                                <td className="p-2">5%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">Remaining Amount</td>
                                                <td className="p-2">6%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
                                    Source: <a href="https://www.iras.gov.sg/taxes/stamp-duty/for-property/buying-or-acquiring-property/buyer's-stamp-duty-(bsd)" target="_blank" rel="noreferrer" className="underline flex items-center gap-1 hover:text-primary">IRAS <ExternalLink className="h-3 w-3" /></a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Taxes Section */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Buyer's Stamp Duty (ABSD)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Additional tax payable on top of BSD, depending on your profile.
                                </p>
                                <div className="rounded-md border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr className="text-left">
                                                <th className="p-2 font-medium">Profile</th>
                                                <th className="p-2 font-medium">1st Property</th>
                                                <th className="p-2 font-medium">2nd Property</th>
                                                <th className="p-2 font-medium">3rd+ Property</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-t">
                                                <td className="p-2 font-medium">Singapore Citizen</td>
                                                <td className="p-2">0%</td>
                                                <td className="p-2">20%</td>
                                                <td className="p-2">30%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2 font-medium">Permanent Resident</td>
                                                <td className="p-2">5%</td>
                                                <td className="p-2">30%</td>
                                                <td className="p-2">35%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2 font-medium">Foreigner</td>
                                                <td className="p-2">60%</td>
                                                <td className="p-2">60%</td>
                                                <td className="p-2">60%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
                                    Source: <a href="https://www.iras.gov.sg/taxes/stamp-duty/for-property/buying-or-acquiring-property/additional-buyer's-stamp-duty-(absd)" target="_blank" rel="noreferrer" className="underline flex items-center gap-1 hover:text-primary">IRAS <ExternalLink className="h-3 w-3" /></a>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Property Tax (Owner-Occupied)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Annual tax based on the Annual Value (AV) of the property.
                                </p>
                                <div className="rounded-md border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr className="text-left">
                                                <th className="p-2 font-medium">Annual Value (AV)</th>
                                                <th className="p-2 font-medium">Tax Rate (2025)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-t">
                                                <td className="p-2">First $12,000</td>
                                                <td className="p-2">0%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">Next $28,000</td>
                                                <td className="p-2">4%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">Next $10,000</td>
                                                <td className="p-2">6%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">Next $25,000</td>
                                                <td className="p-2">10%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">Next $10,000</td>
                                                <td className="p-2">14%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">Next $15,000</td>
                                                <td className="p-2">20%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">Next $40,000</td>
                                                <td className="p-2">26%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">Above $140,000</td>
                                                <td className="p-2">32%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
                                    Source: <a href="https://www.iras.gov.sg/taxes/property-tax/property-owners/property-tax-rates" target="_blank" rel="noreferrer" className="underline flex items-center gap-1 hover:text-primary">IRAS <ExternalLink className="h-3 w-3" /></a>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>CPF Contribution Rates (Jan 2025)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Monthly contribution rates for Private Sector Employees (Pensionable).
                                </p>
                                <div className="rounded-md border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr className="text-left">
                                                <th className="p-2 font-medium">Age Group</th>
                                                <th className="p-2 font-medium">Employee</th>
                                                <th className="p-2 font-medium">Employer</th>
                                                <th className="p-2 font-medium">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-t">
                                                <td className="p-2">≤ 55 years</td>
                                                <td className="p-2">20%</td>
                                                <td className="p-2">17%</td>
                                                <td className="p-2">37%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">55 - 60 years</td>
                                                <td className="p-2">17%</td>
                                                <td className="p-2">15.5%</td>
                                                <td className="p-2">32.5%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">60 - 65 years</td>
                                                <td className="p-2">11.5%</td>
                                                <td className="p-2">10%</td>
                                                <td className="p-2">21.5%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">65 - 70 years</td>
                                                <td className="p-2">7.5%</td>
                                                <td className="p-2">7.5%</td>
                                                <td className="p-2">15%</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-2">{">"} 70 years</td>
                                                <td className="p-2">5%</td>
                                                <td className="p-2">7.5%</td>
                                                <td className="p-2">12.5%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 text-xs text-muted-foreground">
                                    <strong>Ordinary Account (OA) Allocation:</strong><br />
                                    ≤35: ~23% wage | 35-45: ~21% | 45-50: ~19% | 50-55: ~15% | 55-60: ~12% | 60-65: 3.5% | {">"}65: 1%
                                </div>
                                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                                    Source: <a href="https://www.cpf.gov.sg/" target="_blank" rel="noreferrer" className="underline flex items-center gap-1 hover:text-primary">CPF Board <ExternalLink className="h-3 w-3" /></a>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>

                {/* Formulas Section */}
                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Formulas & Methodology</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-primary">Total Wealth Model</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    This calculator uses a "Total Wealth" approach, tracking your complete financial picture over time.
                                    <br />
                                    <code>Net Worth = Property Equity + Liquid Savings + Investments + CPF Balance</code>
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <h3 className="font-semibold text-primary">Income Allocation</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Your monthly income is allocated in the following order:
                                    <ol className="list-decimal list-inside mt-2 space-y-1">
                                        <li><strong>Spending:</strong> Living expenses (based on your % input).</li>
                                        <li><strong>Housing:</strong> Mortgage/Rent + Maintenance + Tax.</li>
                                        <li><strong>Savings:</strong> Cash savings (based on your % input).</li>
                                        <li><strong>Investments:</strong> Any remaining surplus is automatically invested.</li>
                                    </ol>
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <h3 className="font-semibold text-primary">Investment Growth</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    <ul>
                                        <li><strong>Savings:</strong> Grows at the "Savings Return" rate (e.g., High Yield Savings Account).</li>
                                        <li><strong>Investments:</strong> Grows at the "Investment Return" rate (e.g., Stocks/ETFs).</li>
                                        <li><strong>Property:</strong> Grows at the "Property Appreciation" rate.</li>
                                    </ul>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
};

export default FactSheet;
