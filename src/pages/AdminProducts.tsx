import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Search, Filter, RefreshCw, TrendingUp, Shield, Clock, DollarSign, Star, ChevronRight, Save, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductForm {
  name: string;
  type: string;
  yield: number;
  risk: string;
  tenure: string;
  minInvestment: number;
  description: string;
  features: string[];
  isActive: boolean;
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
    image: "/api/placeholder/300/200",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
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
    image: "/api/placeholder/300/200",
    isActive: true,
    createdAt: "2023-02-20T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z"
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
    image: "/api/placeholder/300/200",
    isActive: true,
    createdAt: "2023-03-10T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z"
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
    image: "/api/placeholder/300/200",
    isActive: false,
    createdAt: "2023-04-15T00:00:00Z",
    updatedAt: "2023-12-20T00:00:00Z"
  }
];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: "",
    type: "",
    yield: 0,
    risk: "",
    tenure: "",
    minInvestment: 0,
    description: "",
    features: [],
    isActive: true
  });
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { actualTheme } = useTheme();

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>Access denied. Admin privileges required.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Mock API call
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(product => product.type === typeFilter);
    }

    if (riskFilter !== "all") {
      filtered = filtered.filter(product => product.risk === riskFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(product => {
        if (statusFilter === "active") return product.isActive;
        if (statusFilter === "inactive") return !product.isActive;
        return true;
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, typeFilter, riskFilter, statusFilter]);

  const handleCreateProduct = () => {
    setProductForm({
      name: "",
      type: "",
      yield: 0,
      risk: "",
      tenure: "",
      minInvestment: 0,
      description: "",
      features: [],
      isActive: true
    });
    setIsEditing(false);
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      type: product.type,
      yield: product.yield,
      risk: product.risk,
      tenure: product.tenure,
      minInvestment: product.minInvestment,
      description: product.description,
      features: product.features,
      isActive: product.isActive
    });
    setIsEditing(true);
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditing && selectedProduct) {
        // Update existing product
        const updatedProducts = products.map(p => 
          p.id === selectedProduct.id 
            ? { ...p, ...productForm, risk: productForm.risk as 'Low' | 'Medium' | 'High', updatedAt: new Date().toISOString() }
            : p
        );
        setProducts(updatedProducts);
      } else {
        // Create new product
        const newProduct: Product = {
          id: Date.now().toString(),
          ...productForm,
          risk: productForm.risk as 'Low' | 'Medium' | 'High',
          rating: 0,
          totalInvestors: 0,
          image: "/api/placeholder/300/200",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setProducts([...products, newProduct]);
      }
      
      setShowProductModal(false);
      setProductForm({
        name: "",
        type: "",
        yield: 0,
        risk: "",
        tenure: "",
        minInvestment: 0,
        description: "",
        features: [],
        isActive: true
      });
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedProducts = products.filter(p => p.id !== productToDelete.id);
      setProducts(updatedProducts);
      setShowDeleteDialog(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setSaving(false);
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
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
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
            <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
            <p className="text-muted-foreground">Manage investment products and offerings</p>
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
          <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
          <p className="text-muted-foreground">Manage investment products and offerings</p>
        </div>
        <Button onClick={handleCreateProduct} variant="fintech" size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>Manage all investment products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Yield</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Min Investment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Investors</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getTypeIcon(product.type)}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.tenure}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-lg font-semibold text-success">
                        {product.yield}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(product.risk)}>
                        {product.risk}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      ₹{product.minInvestment.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-semibold">{product.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({product.totalInvestors.toLocaleString()})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(product.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Product" : "Create New Product"}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "Update product information" : "Add a new investment product"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Product Type</Label>
                <Select value={productForm.type} onValueChange={(value) => setProductForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Equity Fund">Equity Fund</SelectItem>
                    <SelectItem value="Corporate Bond">Corporate Bond</SelectItem>
                    <SelectItem value="REIT">REIT</SelectItem>
                    <SelectItem value="Crypto Fund">Crypto Fund</SelectItem>
                    <SelectItem value="Government Bond">Government Bond</SelectItem>
                    <SelectItem value="Sector Fund">Sector Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yield">Expected Yield (%)</Label>
                <Input
                  id="yield"
                  type="number"
                  value={productForm.yield}
                  onChange={(e) => setProductForm(prev => ({ ...prev, yield: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="risk">Risk Level</Label>
                <Select value={productForm.risk} onValueChange={(value) => setProductForm(prev => ({ ...prev, risk: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minInvestment">Min Investment (₹)</Label>
                <Input
                  id="minInvestment"
                  type="number"
                  value={productForm.minInvestment}
                  onChange={(e) => setProductForm(prev => ({ ...prev, minInvestment: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenure">Tenure</Label>
              <Input
                id="tenure"
                value={productForm.tenure}
                onChange={(e) => setProductForm(prev => ({ ...prev, tenure: e.target.value }))}
                placeholder="e.g., 3-5 years"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter product description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Features (one per line)</Label>
              <Textarea
                value={productForm.features.join('\n')}
                onChange={(e) => setProductForm(prev => ({ 
                  ...prev, 
                  features: e.target.value.split('\n').filter(f => f.trim()) 
                }))}
                placeholder="Enter features, one per line"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={productForm.isActive}
                onChange={(e) => setProductForm(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isActive">Active Product</Label>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowProductModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProduct}
                disabled={saving}
                className="flex-1"
              >
                {saving ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={saving}
              className="flex-1"
            >
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
