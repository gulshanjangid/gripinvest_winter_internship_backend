import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DollarSign, Eye, EyeOff, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { analyzePasswordStrength, generateStrongPassword } from "@/utils/passwordStrength";

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
    feedback: "",
    suggestions: [] as string[],
    isStrong: false
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const evaluatePassword = (password: string) => {
    const analysis = analyzePasswordStrength(password, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email
    });
    setPasswordStrength(analysis);
  };

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    evaluatePassword(password);
  };

  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword(12);
    setFormData(prev => ({ ...prev, password: newPassword }));
    evaluatePassword(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        riskAppetite: formData.riskAppetite as 'Conservative' | 'Moderate' | 'Aggressive'
      });
      
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score >= 4) return "text-success";
    if (passwordStrength.score >= 2) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen flex">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

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
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGeneratePassword}
                      className="text-xs"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Generate
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {formData.password && (
                    <div className="space-y-3">
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
                        <Badge className={getPasswordStrengthColor()}>
                          {passwordStrength.feedback}
                        </Badge>
                      </div>
                      
                      {passwordStrength.suggestions.length > 0 && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground mb-2">AI Suggestions:</p>
                          <ul className="text-xs space-y-1">
                            {passwordStrength.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
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
                  disabled={!formData.acceptTerms || passwordStrength.score < 2 || isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
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