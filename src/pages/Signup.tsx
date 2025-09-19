import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DollarSign, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    riskAppetite: "",
    acceptTerms: false
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ""
  });
  const navigate = useNavigate();

  const evaluatePassword = (password: string) => {
    let score = 0;
    let feedback = "Weak";
    
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score >= 4) feedback = "Strong";
    else if (score >= 2) feedback = "Medium";
    
    setPasswordStrength({ score, feedback });
  };

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    evaluatePassword(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration - in real app, this would call an API
    localStorage.setItem("isAuthenticated", "true");
    navigate("/dashboard");
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score >= 4) return "text-success";
    if (passwordStrength.score >= 2) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <DollarSign className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-primary">InvestApp</span>
          </div>

          <Card className="border-0 shadow-lg bg-gradient-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>
                Start your investment journey with us today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {formData.password && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 w-4 rounded-full ${
                              level <= passwordStrength.score
                                ? passwordStrength.score >= 4 
                                  ? "bg-success" 
                                  : passwordStrength.score >= 2 
                                    ? "bg-warning" 
                                    : "bg-destructive"
                                : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className={getPasswordStrengthColor()}>
                        {passwordStrength.feedback}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riskAppetite">Risk Appetite</Label>
                  <Select value={formData.riskAppetite} onValueChange={(value) => setFormData(prev => ({ ...prev, riskAppetite: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your risk preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative (Low Risk)</SelectItem>
                      <SelectItem value="moderate">Moderate (Medium Risk)</SelectItem>
                      <SelectItem value="aggressive">Aggressive (High Risk)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: !!checked }))}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  variant="fintech" 
                  className="w-full" 
                  size="lg"
                  disabled={!formData.acceptTerms || passwordStrength.score < 2}
                >
                  Create Account
                </Button>
              </form>

              <div className="mt-6">
                <Separator />
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary font-medium hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Benefits */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-6 bg-gradient-hero">
        <div className="text-center text-primary-foreground max-w-md">
          <h2 className="text-3xl font-bold mb-6">
            Why Join InvestApp?
          </h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-success-foreground mt-0.5" />
              <div>
                <h3 className="font-semibold">AI-Powered Recommendations</h3>
                <p className="text-sm opacity-90">Get personalized investment advice based on your profile</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-success-foreground mt-0.5" />
              <div>
                <h3 className="font-semibold">Low Fees</h3>
                <p className="text-sm opacity-90">Industry-leading low fees with transparent pricing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-success-foreground mt-0.5" />
              <div>
                <h3 className="font-semibold">Secure Platform</h3>
                <p className="text-sm opacity-90">Bank-grade security with 256-bit encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}