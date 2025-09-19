import { ArrowRight, BarChart3, DollarSign, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const features = [
    {
      icon: TrendingUp,
      title: "Smart Investing",
      description: "AI-powered investment recommendations tailored to your risk profile"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Bank-grade security with end-to-end encryption for your investments"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track your portfolio performance with advanced analytics and insights"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <DollarSign className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-primary">InvestApp</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="fintech">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Your Future,{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Intelligently
              </span>{" "}
              Invested
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Build wealth with our AI-powered investment platform. Smart recommendations, 
              real-time insights, and professional portfolio management at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Start Investing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose InvestApp?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of investing with our cutting-edge platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-card">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary mb-6">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-hero rounded-2xl p-8 lg:p-16 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of investors who trust InvestApp for their financial future
            </p>
            <Link to="/signup">
              <Button variant="secondary" size="xl">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <DollarSign className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-primary">InvestApp</span>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2024 InvestApp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}