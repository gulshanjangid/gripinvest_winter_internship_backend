import { useState, useEffect } from "react";
import { TrendingUp, PieChart, Activity, Calendar, DollarSign, ArrowUpIcon, ArrowDownIcon, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Pie, Area, AreaChart } from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

interface Investment {
  id: string;
  productName: string;
  amount: number;
  status: 'Active' | 'Matured' | 'Pending' | 'Cancelled';
  expectedReturn: number;
  actualReturn?: number;
  maturityDate: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  startDate: string;
  currentValue: number;
}

interface SummaryStats {
  totalInvested: number;
  activeInvestments: number;
  monthlyReturn: number;
  totalReturn: number;
}

const mockInvestments: Investment[] = [
  {
    id: "1",
    productName: "Tech Growth Fund",
    amount: 5000,
    status: "Active",
    expectedReturn: 12.5,
    actualReturn: 8.3,
    maturityDate: "2025-06-15",
    riskLevel: "High",
    startDate: "2023-06-15",
    currentValue: 5415
  },
  {
    id: "2",
    productName: "Green Energy Bond",
    amount: 3000,
    status: "Active",
    expectedReturn: 8.2,
    actualReturn: 7.8,
    maturityDate: "2024-12-20",
    riskLevel: "Low",
    startDate: "2022-12-20",
    currentValue: 3234
  },
  {
    id: "3",
    productName: "Real Estate REIT",
    amount: 7500,
    status: "Active",
    expectedReturn: 9.8,
    actualReturn: 10.2,
    maturityDate: "2026-03-10",
    riskLevel: "Medium",
    startDate: "2023-03-10",
    currentValue: 8265
  },
  {
    id: "4",
    productName: "Crypto Index Fund",
    amount: 2000,
    status: "Active",
    expectedReturn: 15.2,
    actualReturn: -5.1,
    maturityDate: "2024-08-30",
    riskLevel: "High",
    startDate: "2023-08-30",
    currentValue: 1898
  },
  {
    id: "5",
    productName: "Government Securities",
    amount: 1000,
    status: "Matured",
    expectedReturn: 6.5,
    actualReturn: 6.2,
    maturityDate: "2024-01-15",
    riskLevel: "Low",
    startDate: "2023-01-15",
    currentValue: 1062
  },
  {
    id: "6",
    productName: "Healthcare Innovation Fund",
    amount: 4000,
    status: "Pending",
    expectedReturn: 11.3,
    maturityDate: "2025-09-20",
    riskLevel: "Medium",
    startDate: "2024-01-20",
    currentValue: 4000
  }
];

const portfolioAllocationData = [
  { name: "Low Risk", value: 35, color: "hsl(142 76% 36%)" },
  { name: "Medium Risk", value: 45, color: "hsl(38 92% 50%)" },
  { name: "High Risk", value: 20, color: "hsl(0 84% 60%)" },
];

const growthData = [
  { month: "Jan 2023", value: 10000 },
  { month: "Feb 2023", value: 10250 },
  { month: "Mar 2023", value: 10800 },
  { month: "Apr 2023", value: 11200 },
  { month: "May 2023", value: 11500 },
  { month: "Jun 2023", value: 12000 },
  { month: "Jul 2023", value: 11800 },
  { month: "Aug 2023", value: 12500 },
  { month: "Sep 2023", value: 13000 },
  { month: "Oct 2023", value: 12800 },
  { month: "Nov 2023", value: 13200 },
  { month: "Dec 2023", value: 13500 },
  { month: "Jan 2024", value: 13800 },
  { month: "Feb 2024", value: 14200 },
  { month: "Mar 2024", value: 14500 },
  { month: "Apr 2024", value: 14800 },
  { month: "May 2024", value: 15000 },
  { month: "Jun 2024", value: 15200 },
  { month: "Jul 2024", value: 15500 },
  { month: "Aug 2024", value: 15800 },
  { month: "Sep 2024", value: 16000 },
  { month: "Oct 2024", value: 16200 },
  { month: "Nov 2024", value: 16500 },
  { month: "Dec 2024", value: 16800 },
];

export default function Investments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    totalInvested: 0,
    activeInvestments: 0,
    monthlyReturn: 0,
    totalReturn: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { actualTheme } = useTheme();

  // Mock API call
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setInvestments(mockInvestments);
        
        // Calculate summary stats
        const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0);
        const activeInvestments = mockInvestments.filter(inv => inv.status === 'Active').length;
        const totalCurrentValue = mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
        const totalReturn = totalCurrentValue - totalInvested;
        const monthlyReturn = totalReturn / 12; // Simplified calculation
        
        setSummaryStats({
          totalInvested,
          activeInvestments,
          monthlyReturn,
          totalReturn
        });
      } catch (err) {
        setError("Failed to fetch investments");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-success text-success-foreground";
      case "Matured": return "bg-primary text-primary-foreground";
      case "Pending": return "bg-warning text-warning-foreground";
      case "Cancelled": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-success text-success-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "High": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-gradient-card border-0 shadow-lg">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Investments</h1>
            <p className="text-muted-foreground">Track your investment portfolio performance</p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Investments</h1>
          <p className="text-muted-foreground">Track your investment portfolio performance and growth</p>
        </div>
        <Button variant="fintech" size="lg">
          <TrendingUp className="mr-2 h-4 w-4" />
          New Investment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ₹{summaryStats.totalInvested.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              Across {investments.length} investments
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {summaryStats.activeInvestments}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              Currently active
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ₹{summaryStats.monthlyReturn.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-success">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              Average monthly gain
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            <PieChart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ₹{summaryStats.totalReturn.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-success">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              {((summaryStats.totalReturn / summaryStats.totalInvested) * 100).toFixed(1)}% overall
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Allocation */}
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Investment distribution by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={portfolioAllocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {portfolioAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {portfolioAllocationData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Investment Growth */}
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Investment Growth</CardTitle>
            <CardDescription>Portfolio value over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Portfolio Value']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(221 83% 53%)" 
                    fill="hsl(221 83% 53%)"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investments Table */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Investment Details</CardTitle>
          <CardDescription>Detailed view of all your investments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expected Return</TableHead>
                  <TableHead>Actual Return</TableHead>
                  <TableHead>Maturity Date</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell className="font-medium">
                      {investment.productName}
                    </TableCell>
                    <TableCell>
                      ₹{investment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(investment.status)}>
                        {investment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{investment.expectedReturn}%</span>
                        <span className="text-xs text-muted-foreground">p.a.</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {investment.actualReturn !== undefined ? (
                        <div className={`flex items-center gap-1 ${
                          investment.actualReturn >= 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {investment.actualReturn >= 0 ? (
                            <ArrowUpIcon className="h-3 w-3" />
                          ) : (
                            <ArrowDownIcon className="h-3 w-3" />
                          )}
                          <span className="font-semibold">
                            {Math.abs(investment.actualReturn)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDate(investment.maturityDate)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(investment.riskLevel)}>
                        {investment.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">
                        ₹{investment.currentValue.toLocaleString()}
                      </div>
                      <div className={`text-xs ${
                        investment.currentValue >= investment.amount ? 'text-success' : 'text-destructive'
                      }`}>
                        {investment.currentValue >= investment.amount ? '+' : ''}
                        ₹{(investment.currentValue - investment.amount).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            AI Investment Insights
          </CardTitle>
          <CardDescription>Personalized recommendations based on your portfolio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-accent-light border border-accent/20">
            <h4 className="font-medium text-accent mb-2">Portfolio Rebalancing Suggestion</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Your portfolio is currently 20% high-risk investments. Consider reducing this to 15% 
              and increasing your medium-risk allocation to maintain optimal risk-adjusted returns.
            </p>
            <Button variant="outline" size="sm">View Rebalancing Options</Button>
          </div>
          
          <div className="p-4 rounded-lg bg-success-light border border-success/20">
            <h4 className="font-medium text-success mb-2">Performance Highlight</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Your Real Estate REIT investment is outperforming expectations by 0.4%. 
              Consider increasing your allocation to similar real estate investments.
            </p>
            <Button variant="outline" size="sm">Explore Similar Products</Button>
          </div>

          <div className="p-4 rounded-lg bg-warning-light border border-warning/20">
            <h4 className="font-medium text-warning mb-2">Risk Alert</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Your Crypto Index Fund is currently underperforming by 5.1%. 
              Monitor market conditions and consider your risk tolerance for this volatile asset class.
            </p>
            <Button variant="outline" size="sm">Review Strategy</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
