import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface CalculationTableProps {
    data: any[];
}

export function CalculationTable({ data }: CalculationTableProps) {
    const [open, setOpen] = useState(false);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-SG', {
            style: 'currency',
            currency: 'SGD',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>Year-by-Year Breakdown</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Detailed annual cash flow and net worth comparison.</p>
                    </div>
                    <CollapsibleTrigger asChild>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                        >
                            {open ? "Hide" : "Show"}
                            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
                        </button>
                    </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Year</TableHead>
                                        <TableHead className="text-right">Buy Net Worth</TableHead>
                                        <TableHead className="text-right">Rent Net Worth</TableHead>
                                        <TableHead className="text-right">Buy Housing Cost</TableHead>
                                        <TableHead className="text-right">Rent Housing Cost</TableHead>
                                        <TableHead className="text-right">Buyer Savings</TableHead>
                                        <TableHead className="text-right">Renter Savings</TableHead>
                                        <TableHead className="text-right">Buyer Investments</TableHead>
                                        <TableHead className="text-right">Renter Investments</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((row) => (
                                        <TableRow key={row.year}>
                                            <TableCell className="font-medium">{row.year}</TableCell>
                                            <TableCell className="text-right font-medium text-chart-buy">
                                                {formatCurrency(row.buyNetWorth)}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-chart-rent">
                                                {formatCurrency(row.rentNetWorth)}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {formatCurrency(row.buyCashFlow)}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {formatCurrency(row.rentCashFlow)}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {formatCurrency(row.buySavings ?? 0)}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {formatCurrency(row.rentSavings ?? 0)}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {formatCurrency(row.buyInvestments ?? 0)}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {formatCurrency(row.rentInvestments ?? 0)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}
