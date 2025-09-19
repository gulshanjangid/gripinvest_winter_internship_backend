import { useState, useEffect } from "react";
import { Search, Filter, TrendingUp, Shield, Clock, DollarSign, Star, ChevronRight, Sparkles, Target, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { generateProductRecommendations, generatePortfolioInsights, generateProductDescription } from "@/utils/aiRecommendations";

interface Product {
  id: string;
  name: string;
  type: string;
  yield: number;
  risk: 'Low' | 'Medium' | 'High';
  tenure: string;
  minInvestment: number;
  description: string;
  features: string[];
  rating: number;
  totalInvestors: number;
  image: string;
}

interface InvestmentForm {
  amount: number;
  notes: string;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Tech Growth Fund",
    type: "Equity Fund",
    yield: 12.5,
    risk: "High",
    tenure: "3-5 years",
    minInvestment: 1000,
    description: "A diversified equity fund focusing on technology companies with high growth potential. Managed by experienced fund managers with a track record of outperforming the market.",
    features: ["Diversified portfolio", "Professional management", "Liquidity options", "Tax benefits"],
    rating: 4.8,
    totalInvestors: 15420,
    image: "/api/placeholder/300/200"
  },
  {
    id: "2",
    name: "Green Energy Bond",
    type: "Corporate Bond",
    yield: 8.2,
    risk: "Low",
    tenure: "2-3 years",
    minInvestment: 500,
    description: "Fixed-income investment in renewable energy projects. Provides stable returns while supporting environmental sustainability initiatives.",
    features: ["Fixed returns", "ESG compliant", "Regular payouts", "Capital protection"],
    rating: 4.6,
    totalInvestors: 8930,
    image: "/api/placeholder/300/200"
  },
  {
    id: "3",
    name: "Real Estate REIT",
    type: "REIT",
    yield: 9.8,
    risk: "Medium",
    tenure: "5+ years",
    minInvestment: 2500,
    description: "Real Estate Investment Trust focusing on commercial properties in prime locations. Offers regular dividend income and potential capital appreciation.",
    features: ["Real estate exposure", "Dividend income", "Professional management", "Liquidity"],
    rating: 4.7,
    totalInvestors: 12350,
    image: "/api/placeholder/300/200"
  },
  {
    id: "4",
    name: "Crypto Index Fund",
    type: "Crypto Fund",
    yield: 15.2,
    risk: "High",
    tenure: "1-3 years",
    minInvestment: 2000,
    description: "Diversified cryptocurrency fund tracking major digital assets. Managed by crypto experts with advanced risk management strategies.",
    features: ["Crypto diversification", "Expert management", "Risk controls", "24/7 monitoring"],
    rating: 4.3,
    totalInvestors: 6780,
    image: "/api/placeholder/300/200"
  },
  {
    id: "5",
    name: "Government Securities",
    type: "Government Bond",
    yield: 6.5,
    risk: "Low",
    tenure: "1-2 years",
    minInvestment: 100,
    description: "Ultra-safe investment in government-backed securities. Ideal for conservative investors seeking capital preservation.",
    features: ["Government backed", "Capital guarantee", "Regular interest", "High liquidity"],
    rating: 4.9,
    totalInvestors: 45600,
    image: "/api/placeholder/300/200"
  },
  {
    id: "6",
    name: "Healthcare Innovation Fund",
    type: "Sector Fund",
    yield: 11.3,
    risk: "Medium",
    tenure: "3-4 years",
    minInvestment: 1500,
    description: "Specialized fund investing in healthcare and biotechnology companies. Focuses on companies with innovative medical solutions.",
    features: ["Sector expertise", "Growth potential", "Innovation focus", "Regular rebalancing"],
    rating: 4.5,
    totalInvestors: 9870,
    image: "/api/placeholder/300/200"
  }
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [portfolioInsights, setPortfolioInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [yieldFilter, setYieldFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [investmentForm, setInvestmentForm] = useState<InvestmentForm>({ amount: 0, notes: "" });
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [investing, setInvesting] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const { actualTheme } = useTheme();
  const { user } = useAuth();

  // Mock API call
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        
        // Generate AI recommendations and insights
        if (user) {
          const aiRecommendations = generateProductRecommendations(mockProducts, user);
          const aiInsights = generatePortfolioInsights(user, []);
          setRecommendations(aiRecommendations);
          setPortfolioInsights(aiInsights);
        }
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(product => product.type === typeFilter);
    }

    // Risk filter
    if (riskFilter !== "all") {
      filtered = filtered.filter(product => product.risk === riskFilter);
    }

    // Yield filter
    if (yieldFilter !== "all") {
      filtered = filtered.filter(product => {
        const yieldValue = product.yield;
        switch (yieldFilter) {
          case "low": return yieldValue < 8;
          case "medium": return yieldValue >= 8 && yieldValue < 12;
          case "high": return yieldValue >= 12;
          default: return true;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, typeFilter, riskFilter, yieldFilter]);

  const handleInvest = async () => {
    if (!selectedProduct || investmentForm.amount < selectedProduct.minInvestment) {
      return;
    }

    setInvesting(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful investment
      console.log("Investment created:", {
        productId: selectedProduct.id,
        amount: investmentForm.amount,
        notes: investmentForm.notes
      });

      setShowInvestmentModal(false);
      setInvestmentForm({ amount: 0, notes: "" });
      setSelectedProduct(null);
      
      // Show success message (you could use a toast here)
      alert("Investment created successfully!");
    } catch (err) {
      console.error("Investment failed:", err);
    } finally {
      setInvesting(false);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Equity Fund": return <TrendingUp className="h-4 w-4" />;
      case "Corporate Bond": return <Shield className="h-4 w-4" />;
      case "REIT": return <DollarSign className="h-4 w-4" />;
      case "Crypto Fund": return <Star className="h-4 w-4" />;
      case "Government Bond": return <Shield className="h-4 w-4" />;
      case "Sector Fund": return <TrendingUp className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-gradient-card border-0 shadow-lg">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
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
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground">Explore our investment products</p>
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
          <h1 className="text-3xl font-bold text-foreground">Investment Products</h1>
          <p className="text-muted-foreground">Discover and invest in our curated selection of financial products</p>
        </div>
        <Button variant="fintech" size="lg">
          <TrendingUp className="mr-2 h-4 w-4" />
          View Portfolio
        </Button>
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
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Equity Fund">Equity Fund</SelectItem>
                  <SelectItem value="Corporate Bond">Corporate Bond</SelectItem>
                  <SelectItem value="REIT">REIT</SelectItem>
                  <SelectItem value="Crypto Fund">Crypto Fund</SelectItem>
                  <SelectItem value="Government Bond">Government Bond</SelectItem>
                  <SelectItem value="Sector Fund">Sector Fund</SelectItem>
                </SelectContent>
              </Select>

              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>

              <Select value={yieldFilter} onValueChange={setYieldFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Yield" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Yield</SelectItem>
                  <SelectItem value="low">Low (&lt;8%)</SelectItem>
                  <SelectItem value="medium">Medium (8-12%)</SelectItem>
                  <SelectItem value="high">High (&gt;12%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              AI Recommendations for You
            </CardTitle>
            <CardDescription>
              Personalized product suggestions based on your risk profile and investment history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.slice(0, 3).map((rec, index) => (
                <Card key={rec.product.id} className="border border-accent/20 bg-accent-light/10">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(rec.product.type)}
                        <span className="font-medium text-sm">{rec.product.name}</span>
                      </div>
                      <Badge className="bg-accent text-accent-foreground">
                        {rec.matchPercentage}% match
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Expected Yield</span>
                        <span className="font-semibold text-success">{rec.product.yield}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Risk Level</span>
                        <Badge className={getRiskColor(rec.product.risk)}>
                          {rec.product.risk}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-accent">Why this product:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {rec.reasons.slice(0, 2).map((reason, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <div className="w-1 h-1 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowRecommendations(false)}
              >
                Hide Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="bg-gradient-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(product.type)}
                  <Badge variant="outline" className="text-xs">
                    {product.type}
                  </Badge>
                </div>
                <Badge className={getRiskColor(product.risk)}>
                  {product.risk} Risk
                </Badge>
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {product.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {product.tenure}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Min: ₹{product.minInvestment.toLocaleString()}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Image Placeholder */}
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-muted-foreground text-sm">Product Image</div>
              </div>

              {/* Yield and Rating */}
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {product.yield}%
                  </div>
                  <div className="text-xs text-muted-foreground">Expected Yield</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-semibold">{product.rating}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {product.totalInvestors.toLocaleString()} investors
                  </div>
                </div>
              </div>

              {/* Invest Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full" 
                    variant="fintech"
                    onClick={() => setSelectedProduct(product)}
                  >
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {getTypeIcon(product.type)}
                      {product.name}
                    </DialogTitle>
                    <DialogDescription>
                      {product.type} • {product.tenure} • Min Investment: ₹{product.minInvestment.toLocaleString()}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Product Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Expected Yield</Label>
                        <div className="text-2xl font-bold text-success">{product.yield}%</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Risk Level</Label>
                        <Badge className={getRiskColor(product.risk)}>
                          {product.risk} Risk
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Rating</Label>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="font-semibold">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({product.totalInvestors.toLocaleString()} investors)
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Minimum Investment</Label>
                        <div className="text-lg font-semibold">₹{product.minInvestment.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">Description</Label>
                        <Badge variant="outline" className="text-xs">
                          <Lightbulb className="h-3 w-3 mr-1" />
                          AI Generated
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {generateProductDescription(product)}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Key Features</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {product.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Invest Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" variant="fintech" size="lg">
                          Invest Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invest in {product.name}</DialogTitle>
                          <DialogDescription>
                            Enter your investment amount and any additional notes
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="amount">Investment Amount</Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder={`Minimum: ₹${product.minInvestment.toLocaleString()}`}
                              value={investmentForm.amount || ""}
                              onChange={(e) => setInvestmentForm(prev => ({ 
                                ...prev, 
                                amount: parseFloat(e.target.value) || 0 
                              }))}
                              min={product.minInvestment}
                            />
                            <p className="text-xs text-muted-foreground">
                              Minimum investment: ₹{product.minInvestment.toLocaleString()}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                              id="notes"
                              placeholder="Any additional notes about this investment..."
                              value={investmentForm.notes}
                              onChange={(e) => setInvestmentForm(prev => ({ 
                                ...prev, 
                                notes: e.target.value 
                              }))}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1" 
                              variant="outline"
                              onClick={() => setShowInvestmentModal(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              className="flex-1" 
                              variant="fintech"
                              onClick={handleInvest}
                              disabled={investmentForm.amount < product.minInvestment || investing}
                            >
                              {investing ? "Processing..." : "Confirm Investment"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find more products.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
