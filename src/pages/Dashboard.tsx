import { ArrowUpIcon, ArrowDownIcon, DollarSign, TrendingUp, PieChart, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Pie } from "recharts";

const portfolioData = [
  { name: "Low Risk", value: 45, color: "hsl(142 76% 36%)" },
  { name: "Medium Risk", value: 35, color: "hsl(38 92% 50%)" },
  { name: "High Risk", value: 20, color: "hsl(0 84% 60%)" },
];

const performanceData = [
  { month: "Jan", value: 10000 },
  { month: "Feb", value: 12000 },
  { month: "Mar", value: 11500 },
  { month: "Apr", value: 13800 },
  { month: "May", value: 15200 },
  { month: "Jun", value: 16500 },
];

const recentInvestments = [
  { name: "Tech Growth Fund", amount: 5000, return: 12.5, risk: "Medium" },
  { name: "Green Energy Bond", amount: 3000, return: 8.2, risk: "Low" },
  { name: "Crypto Index", amount: 2000, return: -3.5, risk: "High" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your investment overview.</p>
        </div>
        <Button variant="fintech" size="lg">
          <TrendingUp className="mr-2 h-4 w-4" />
          New Investment
        </Button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">₹16,500</div>
            <div className="flex items-center text-xs text-success">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
            <PieChart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <div className="flex items-center text-xs text-muted-foreground">
              Active investments
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">+₹1,300</div>
            <div className="flex items-center text-xs text-success">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              +7.9% this month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Score</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">85/100</div>
            <div className="flex items-center text-xs text-accent">
              Excellent portfolio health
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Distribution */}
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Portfolio Distribution</CardTitle>
            <CardDescription>Investment allocation by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {portfolioData.map((item) => (
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

        {/* Performance Chart */}
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>6-month performance trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(221 83% 53%)" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(221 83% 53%)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Investments & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Investments */}
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Investments</CardTitle>
            <CardDescription>Your latest investment activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInvestments.map((investment, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{investment.name}</p>
                  <p className="text-xs text-muted-foreground">₹{investment.amount.toLocaleString()}</p>
                </div>
                <div className="text-right space-y-1">
                  <div className={`flex items-center text-sm ${
                    investment.return > 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {investment.return > 0 ? (
                      <ArrowUpIcon className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(investment.return)}%
                  </div>
                  <Badge variant={
                    investment.risk === 'Low' ? 'secondary' : 
                    investment.risk === 'Medium' ? 'default' : 'destructive'
                  }>
                    {investment.risk} Risk
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              AI Insights
            </CardTitle>
            <CardDescription>Personalized recommendations for your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-accent-light border border-accent/20">
              <h4 className="font-medium text-accent mb-2">Portfolio Rebalancing</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Consider reducing high-risk exposure by 5% to optimize your risk-adjusted returns.
              </p>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
            
            <div className="p-4 rounded-lg bg-success-light border border-success/20">
              <h4 className="font-medium text-success mb-2">New Opportunity</h4>
              <p className="text-sm text-muted-foreground mb-3">
                ESG Tech Fund matches your profile with potential 11% annual returns.
              </p>
              <Button variant="outline" size="sm">Explore</Button>
            </div>

            <div className="p-4 rounded-lg bg-warning-light border border-warning/20">
              <h4 className="font-medium text-warning mb-2">Market Alert</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Tech sector volatility expected. Consider dollar-cost averaging for new positions.
              </p>
              <Button variant="outline" size="sm">Learn More</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}