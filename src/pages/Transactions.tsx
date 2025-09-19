import { useState, useEffect } from "react";
import { Search, Filter, RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useTheme } from "@/contexts/ThemeContext";

interface Transaction {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status: number;
  statusText: string;
  errorMessage?: string;
  timestamp: string;
  user: string;
  email: string;
  duration: number;
  responseSize: number;
}

interface TransactionStats {
  totalTransactions: number;
  successRate: number;
  errorRate: number;
  averageResponseTime: number;
  mostCommonError: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    endpoint: "/api/investments",
    method: "POST",
    status: 201,
    statusText: "Created",
    timestamp: "2024-01-15T10:30:00Z",
    user: "john.doe",
    email: "john.doe@example.com",
    duration: 245,
    responseSize: 1024
  },
  {
    id: "2",
    endpoint: "/api/products",
    method: "GET",
    status: 200,
    statusText: "OK",
    timestamp: "2024-01-15T10:25:00Z",
    user: "jane.smith",
    email: "jane.smith@example.com",
    duration: 89,
    responseSize: 2048
  },
  {
    id: "3",
    endpoint: "/api/auth/login",
    method: "POST",
    status: 401,
    statusText: "Unauthorized",
    errorMessage: "Invalid credentials",
    timestamp: "2024-01-15T10:20:00Z",
    user: "unknown",
    email: "unknown@example.com",
    duration: 12,
    responseSize: 256
  },
  {
    id: "4",
    endpoint: "/api/user/profile",
    method: "PUT",
    status: 200,
    statusText: "OK",
    timestamp: "2024-01-15T10:15:00Z",
    user: "mike.wilson",
    email: "mike.wilson@example.com",
    duration: 156,
    responseSize: 512
  },
  {
    id: "5",
    endpoint: "/api/investments/123",
    method: "GET",
    status: 404,
    statusText: "Not Found",
    errorMessage: "Investment not found",
    timestamp: "2024-01-15T10:10:00Z",
    user: "sarah.jones",
    email: "sarah.jones@example.com",
    duration: 45,
    responseSize: 128
  },
  {
    id: "6",
    endpoint: "/api/transactions",
    method: "GET",
    status: 200,
    statusText: "OK",
    timestamp: "2024-01-15T10:05:00Z",
    user: "alex.brown",
    email: "alex.brown@example.com",
    duration: 78,
    responseSize: 1536
  },
  {
    id: "7",
    endpoint: "/api/products/456",
    method: "GET",
    status: 500,
    statusText: "Internal Server Error",
    errorMessage: "Database connection failed",
    timestamp: "2024-01-15T10:00:00Z",
    user: "emma.davis",
    email: "emma.davis@example.com",
    duration: 5000,
    responseSize: 0
  },
  {
    id: "8",
    endpoint: "/api/investments",
    method: "POST",
    status: 400,
    statusText: "Bad Request",
    errorMessage: "Invalid investment amount",
    timestamp: "2024-01-15T09:55:00Z",
    user: "david.miller",
    email: "david.miller@example.com",
    duration: 23,
    responseSize: 256
  },
  {
    id: "9",
    endpoint: "/api/user/risk-profile",
    method: "PUT",
    status: 200,
    statusText: "OK",
    timestamp: "2024-01-15T09:50:00Z",
    user: "lisa.garcia",
    email: "lisa.garcia@example.com",
    duration: 134,
    responseSize: 384
  },
  {
    id: "10",
    endpoint: "/api/products",
    method: "GET",
    status: 200,
    statusText: "OK",
    timestamp: "2024-01-15T09:45:00Z",
    user: "robert.taylor",
    email: "robert.taylor@example.com",
    duration: 67,
    responseSize: 1792
  }
];

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats>({
    totalTransactions: 0,
    successRate: 0,
    errorRate: 0,
    averageResponseTime: 0,
    mostCommonError: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { actualTheme } = useTheme();

  // Mock API call
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
        
        // Calculate stats
        const totalTransactions = mockTransactions.length;
        const successfulTransactions = mockTransactions.filter(t => t.status >= 200 && t.status < 300).length;
        const errorTransactions = mockTransactions.filter(t => t.status >= 400).length;
        const successRate = (successfulTransactions / totalTransactions) * 100;
        const errorRate = (errorTransactions / totalTransactions) * 100;
        const averageResponseTime = mockTransactions.reduce((sum, t) => sum + t.duration, 0) / totalTransactions;
        
        // Find most common error
        const errorMessages = mockTransactions
          .filter(t => t.errorMessage)
          .map(t => t.errorMessage!);
        const mostCommonError = errorMessages.length > 0 
          ? errorMessages.reduce((a, b, i, arr) => 
              arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
            )
          : "No errors";

        setStats({
          totalTransactions,
          successRate,
          errorRate,
          averageResponseTime,
          mostCommonError
        });
      } catch (err) {
        setError("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.errorMessage && transaction.errorMessage.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Method filter
    if (methodFilter !== "all") {
      filtered = filtered.filter(transaction => transaction.method === methodFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(transaction => {
        const status = transaction.status;
        switch (statusFilter) {
          case "success": return status >= 200 && status < 300;
          case "client_error": return status >= 400 && status < 500;
          case "server_error": return status >= 500;
          default: return true;
        }
      });
    }

    // User filter
    if (userFilter !== "all") {
      filtered = filtered.filter(transaction => transaction.user === userFilter);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [transactions, searchTerm, methodFilter, statusFilter, userFilter]);

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) {
      return <CheckCircle className="h-4 w-4 text-success" />;
    } else if (status >= 400 && status < 500) {
      return <XCircle className="h-4 w-4 text-warning" />;
    } else if (status >= 500) {
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    } else {
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) {
      return "bg-success text-success-foreground";
    } else if (status >= 400 && status < 500) {
      return "bg-warning text-warning-foreground";
    } else if (status >= 500) {
      return "bg-destructive text-destructive-foreground";
    } else {
      return "bg-muted text-muted-foreground";
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-primary text-primary-foreground";
      case "POST": return "bg-success text-success-foreground";
      case "PUT": return "bg-warning text-warning-foreground";
      case "DELETE": return "bg-destructive text-destructive-foreground";
      case "PATCH": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDuration = (duration: number) => {
    if (duration < 1000) {
      return `${duration}ms`;
    } else {
      return `${(duration / 1000).toFixed(2)}s`;
    }
  };

  const formatResponseSize = (size: number) => {
    if (size < 1024) {
      return `${size}B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)}KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)}MB`;
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Get unique users for filter
  const uniqueUsers = Array.from(new Set(transactions.map(t => t.user)));

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
            <h1 className="text-3xl font-bold text-foreground">Transaction Logs</h1>
            <p className="text-muted-foreground">Monitor API transactions and system health</p>
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
          <h1 className="text-3xl font-bold text-foreground">Transaction Logs</h1>
          <p className="text-muted-foreground">Monitor API transactions and system health</p>
        </div>
        <Button variant="outline" size="lg">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalTransactions}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              Last 24 hours
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.successRate.toFixed(1)}%
            </div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="mr-1 h-3 w-3" />
              +2.1% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.errorRate.toFixed(1)}%
            </div>
            <div className="flex items-center text-xs text-destructive">
              <TrendingDown className="mr-1 h-3 w-3" />
              -0.5% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatDuration(stats.averageResponseTime)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              Across all endpoints
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search endpoints, users, or error messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success (2xx)</SelectItem>
                  <SelectItem value="client_error">Client Error (4xx)</SelectItem>
                  <SelectItem value="server_error">Server Error (5xx)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>
            Showing {currentTransactions.length} of {filteredTransactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Response Size</TableHead>
                  <TableHead>Error Message</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {transaction.endpoint}
                    </TableCell>
                    <TableCell>
                      <Badge className={getMethodColor(transaction.method)}>
                        {transaction.method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.user}</div>
                        <div className="text-xs text-muted-foreground">{transaction.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {formatDuration(transaction.duration)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {formatResponseSize(transaction.responseSize)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {transaction.errorMessage ? (
                        <div className="max-w-xs truncate text-destructive text-sm">
                          {transaction.errorMessage}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatTimestamp(transaction.timestamp)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Summarizer */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            AI Transaction Summarizer
          </CardTitle>
          <CardDescription>Intelligent analysis of your transaction patterns and errors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-accent-light border border-accent/20">
            <h4 className="font-medium text-accent mb-2">Most Common Error</h4>
            <p className="text-sm text-muted-foreground mb-3">
              "{stats.mostCommonError}" appears in {transactions.filter(t => t.errorMessage === stats.mostCommonError).length} transactions. 
              This suggests a systematic issue that should be addressed.
            </p>
            <Button variant="outline" size="sm">View Error Details</Button>
          </div>
          
          <div className="p-4 rounded-lg bg-success-light border border-success/20">
            <h4 className="font-medium text-success mb-2">Performance Insight</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Your API response times are averaging {formatDuration(stats.averageResponseTime)}, 
              which is within acceptable limits. Consider implementing caching for frequently accessed endpoints.
            </p>
            <Button variant="outline" size="sm">Optimize Performance</Button>
          </div>

          <div className="p-4 rounded-lg bg-warning-light border border-warning/20">
            <h4 className="font-medium text-warning mb-2">User Activity Pattern</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Peak transaction times are between 10:00-11:00 AM and 2:00-3:00 PM. 
              Consider scaling resources during these periods to maintain optimal performance.
            </p>
            <Button variant="outline" size="sm">View Usage Analytics</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
