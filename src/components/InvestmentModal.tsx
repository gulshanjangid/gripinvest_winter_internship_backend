import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, DollarSign, TrendingUp } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  type: string;
  yield_rate: number;
  risk_level: string;
  minimum_investment: number;
  total_value: number;
  available_shares: number;
}

interface InvestmentModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function InvestmentModal({ product, open, onOpenChange, onSuccess }: InvestmentModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [shares, setShares] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setAmount(value);
    
    // Calculate shares based on minimum investment as share price
    const sharePrice = product.minimum_investment;
    setShares(Math.floor(numValue / sharePrice) || 1);
  };

  const handleInvest = async () => {
    if (!user) return;

    const investmentAmount = parseFloat(amount);
    if (investmentAmount < product.minimum_investment) {
      toast({
        title: "Investment Too Small",
        description: `Minimum investment is $${product.minimum_investment.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create investment record
      const { data: investment, error: investmentError } = await supabase
        .from('investments')
        .insert({
          user_id: user.id,
          product_id: product.id,
          amount: investmentAmount,
          shares: shares,
          purchase_price: investmentAmount,
          current_value: investmentAmount,
          return_percentage: 0,
          status: 'active'
        })
        .select()
        .single();

      if (investmentError) throw investmentError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          investment_id: investment.id,
          type: 'buy',
          amount: investmentAmount,
          status: 'completed',
          method: 'bank_transfer',
          description: `Investment in ${product.name}`,
          metadata: {
            product_name: product.name,
            shares: shares,
            price_per_share: investmentAmount / shares
          }
        });

      if (transactionError) throw transactionError;

      // Update portfolio summary
      const { data: portfolio } = await supabase
        .from('portfolio_summary')
        .select()
        .eq('user_id', user.id)
        .single();

      if (portfolio) {
        await supabase
          .from('portfolio_summary')
          .update({
            total_value: portfolio.total_value + investmentAmount,
            total_invested: portfolio.total_invested + investmentAmount,
            last_updated: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }

      toast({
        title: "Investment Successful",
        description: `Successfully invested $${investmentAmount.toLocaleString()} in ${product.name}`,
      });

      onSuccess?.();
      onOpenChange(false);
      setAmount('');
      setShares(1);
    } catch (error) {
      console.error('Investment error:', error);
      toast({
        title: "Investment Failed",
        description: "There was an error processing your investment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Invest in {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Product Type</span>
              <span className="capitalize">{product.type.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Risk Level</span>
              <Badge className={getRiskColor(product.risk_level)}>
                {product.risk_level}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Expected Yield</span>
              <span className="font-semibold text-success">{product.yield_rate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Minimum Investment</span>
              <span className="font-semibold">${product.minimum_investment.toLocaleString()}</span>
            </div>
          </div>

          <Separator />

          {/* Investment Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Investment Amount ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="pl-10"
                  min={product.minimum_investment}
                  step="0.01"
                />
              </div>
            </div>

            {amount && parseFloat(amount) >= product.minimum_investment && (
              <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Estimated Shares:</span>
                  <span className="font-semibold">{shares}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Price per Share:</span>
                  <span className="font-semibold">
                    ${(parseFloat(amount) / shares).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Expected Annual Return:</span>
                  <span className="font-semibold text-success">
                    ${((parseFloat(amount) * product.yield_rate) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvest}
              className="flex-1 bg-gradient-primary hover:opacity-90"
              disabled={loading || !amount || parseFloat(amount) < product.minimum_investment}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Invest Now'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}