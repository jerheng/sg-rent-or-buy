import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import { TrendingUp, DollarSign, PiggyBank } from "lucide-react";

interface ChartData {
  year: number;
  buyNetWorth: number;
  rentNetWorth: number;
  buyCashFlow: number;
  rentCashFlow: number;
  buySavings?: number;
  rentSavings: number;
  buyInvestments?: number;
  rentInvestments?: number;
  advantage?: number;
  buyAdvantage?: number;
  buyCumulativeCost?: number;
  rentCumulativeCost?: number;
}

interface ComparisonChartProps {
  data: ChartData[];
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  const [activeTab, setActiveTab] = useState("networth");

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
          <TabsTrigger value="networth" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Net Worth</span>
          </TabsTrigger>
          <TabsTrigger value="advantage" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Advantage</span>
          </TabsTrigger>
          <TabsTrigger value="cashflow" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Cumulative Housing Cost</span>
          </TabsTrigger>
          <TabsTrigger value="savings" className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4" />
            <span className="hidden sm:inline">Savings</span>
          </TabsTrigger>
          <TabsTrigger value="investments" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Investments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="networth" className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
            >
              <defs>
                <linearGradient id="buyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-buy))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-buy))" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="rentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-rent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-rent))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" opacity={0.3} />
              <XAxis
                dataKey="year"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                label={{ value: "Year", position: "insideBottomRight", offset: -5 }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                label={{ value: "Net Worth (SGD)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label: number) => `Year ${label}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="buyNetWorth" 
                stroke="hsl(var(--chart-buy))" 
                fillOpacity={1} 
                fill="url(#buyGradient)"
                strokeWidth={2}
                name="Buy Net Worth"
              />
              <Area 
                type="monotone" 
                dataKey="rentNetWorth" 
                stroke="hsl(var(--chart-rent))" 
                fillOpacity={1} 
                fill="url(#rentGradient)"
                strokeWidth={2}
                name="Rent Net Worth"
              />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="investments" className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
            >
              <defs>
                <linearGradient id="buyInvestmentsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-buy))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-buy))" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="rentInvestmentsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-rent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-rent))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" opacity={0.3} />
              <XAxis 
                dataKey="year" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: "Year", position: "insideBottomRight", offset: -5 }}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: "Investments (SGD)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label: number) => `Year ${label}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="buyInvestments" 
                stroke="hsl(var(--chart-buy))" 
                fillOpacity={1} 
                fill="url(#buyInvestmentsGradient)"
                strokeWidth={2}
                name="Buyer Investments"
              />
              <Area 
                type="monotone" 
                dataKey="rentInvestments" 
                stroke="hsl(var(--chart-rent))" 
                fillOpacity={1} 
                fill="url(#rentInvestmentsGradient)"
                strokeWidth={2}
                name="Renter Investments"
              />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="advantage" className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" opacity={0.3} />
              <XAxis
                dataKey="year"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                label={{ value: "Year", position: "insideBottomRight", offset: -5 }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                label={{ value: "Advantage (SGD)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label: number) => `Year ${label}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <ReferenceLine
                y={0}
                stroke="hsl(var(--destructive))"
                strokeDasharray="4 4"
                label="Rent = Buy"
              />
              <Line
                type="monotone"
                dataKey="advantage"
                stroke="hsl(var(--chart-rent))"
                strokeWidth={2}
                dot={false}
                name="Rent Net Worth - Buy Net Worth"
              />
              <Line
                type="monotone"
                dataKey="buyAdvantage"
                stroke="hsl(var(--chart-buy))"
                strokeWidth={2}
                dot={false}
                name="Buy Net Worth - Rent Net Worth"
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="cashflow" className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
            >
              <defs>
                <linearGradient id="buyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-buy))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-buy))" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="rentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-rent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-rent))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" opacity={0.3} />
              <XAxis 
                dataKey="year" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: "Year", position: "insideBottomRight", offset: -5 }}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: "Cumulative Housing Cost (SGD)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label: number) => `Year ${label}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="buyCumulativeCost" 
                stroke="hsl(var(--chart-buy))" 
                fillOpacity={1} 
                fill="url(#buyGradient)"
                strokeWidth={2}
                name="Buy Cumulative Housing Cost"
              />
              <Area 
                type="monotone" 
                dataKey="rentCumulativeCost" 
                stroke="hsl(var(--chart-rent))" 
                fillOpacity={1} 
                fill="url(#rentGradient)"
                strokeWidth={2}
                name="Rent Cumulative Housing Cost"
              />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="savings" className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
            >
              <defs>
                <linearGradient id="buySavingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-buy))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-buy))" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="rentSavingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-rent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-rent))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" opacity={0.3} />
              <XAxis 
                dataKey="year" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: "Year", position: "insideBottomRight", offset: -5 }}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: "Savings / Investments (SGD)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label: number) => `Year ${label}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="buySavings" 
                stroke="hsl(var(--chart-buy))" 
                fillOpacity={1} 
                fill="url(#buySavingsGradient)"
                strokeWidth={2}
                name="Buyer Savings"
              />
              <Area 
                type="monotone" 
                dataKey="rentSavings" 
                stroke="hsl(var(--chart-rent))" 
                fillOpacity={1} 
                fill="url(#rentSavingsGradient)"
                strokeWidth={2}
                name="Renter Savings"
              />
              <Line
                type="monotone"
                dataKey="buyInvestments"
                stroke="hsl(var(--chart-buy))"
                strokeDasharray="4 4"
                strokeWidth={2}
                dot={false}
                name="Buyer Investments"
              />
              <Line
                type="monotone"
                dataKey="rentInvestments"
                stroke="hsl(var(--chart-rent))"
                strokeDasharray="4 4"
                strokeWidth={2}
                dot={false}
                name="Renter Investments"
              />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
