import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DollarSign, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - in real app, this would call an API
    localStorage.setItem("isAuthenticated", "true");
    navigate("/dashboard");
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
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your account to continue investing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Link to="/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" variant="fintech" className="w-full" size="lg">
                  Sign In
                </Button>
              </form>

              <div className="mt-6">
                <Separator />
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary font-medium hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-6 bg-gradient-hero">
        <div className="text-center text-primary-foreground max-w-md">
          <h2 className="text-3xl font-bold mb-4">
            Smart Investment Decisions
          </h2>
          <p className="text-lg opacity-90">
            Join thousands of investors building wealth with our AI-powered platform
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold">$2.5M+</div>
              <div className="opacity-80">Invested</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold">15,000+</div>
              <div className="opacity-80">Investors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}