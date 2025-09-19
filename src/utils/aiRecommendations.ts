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
}

interface User {
  id: string;
  riskAppetite: 'Conservative' | 'Moderate' | 'Aggressive';
  balance: number;
  totalInvestments: number;
  portfolioValue: number;
  averageReturn: number;
}

interface Recommendation {
  product: Product;
  score: number;
  reasons: string[];
  matchPercentage: number;
}

interface PortfolioInsight {
  type: 'risk_distribution' | 'diversification' | 'performance' | 'rebalancing';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export function generateProductRecommendations(
  products: Product[],
  user: User,
  userInvestments: any[] = []
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const product of products) {
    const score = calculateRecommendationScore(product, user, userInvestments);
    const reasons = generateRecommendationReasons(product, user, userInvestments);
    const matchPercentage = Math.round(score * 100);

    if (score > 0.3) { // Only recommend products with score > 30%
      recommendations.push({
        product,
        score,
        reasons,
        matchPercentage
      });
    }
  }

  // Sort by score (highest first) and return top 5
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function calculateRecommendationScore(
  product: Product,
  user: User,
  userInvestments: any[]
): number {
  let score = 0;

  // Risk appetite matching (40% weight)
  const riskMatch = calculateRiskMatch(product.risk, user.riskAppetite);
  score += riskMatch * 0.4;

  // Yield attractiveness (25% weight)
  const yieldScore = Math.min(product.yield / 20, 1); // Normalize to 0-1, assuming 20% is max
  score += yieldScore * 0.25;

  // Investment amount feasibility (20% weight)
  const affordabilityScore = user.balance >= product.minInvestment ? 1 : 0;
  score += affordabilityScore * 0.2;

  // Portfolio diversification (15% weight)
  const diversificationScore = calculateDiversificationScore(product, userInvestments);
  score += diversificationScore * 0.15;

  return Math.min(score, 1); // Cap at 1
}

function calculateRiskMatch(productRisk: string, userRiskAppetite: string): number {
  const riskLevels = { 'Low': 1, 'Medium': 2, 'High': 3 };
  const userRisk = riskLevels[userRiskAppetite as keyof typeof riskLevels];
  const productRiskLevel = riskLevels[productRisk as keyof typeof riskLevels];

  if (userRisk === productRiskLevel) return 1;
  if (Math.abs(userRisk - productRiskLevel) === 1) return 0.7;
  return 0.3;
}

function calculateDiversificationScore(product: Product, userInvestments: any[]): number {
  if (userInvestments.length === 0) return 1; // First investment gets full score

  const existingTypes = new Set(userInvestments.map(inv => inv.type));
  const existingRisks = new Set(userInvestments.map(inv => inv.risk));

  let score = 0;
  
  // Bonus for new product type
  if (!existingTypes.has(product.type)) score += 0.5;
  
  // Bonus for different risk level
  if (!existingRisks.has(product.risk)) score += 0.3;
  
  // Penalty for too many similar products
  const similarProducts = userInvestments.filter(inv => 
    inv.type === product.type && inv.risk === product.risk
  ).length;
  
  if (similarProducts > 2) score -= 0.4;
  
  return Math.max(0, Math.min(1, score));
}

function generateRecommendationReasons(
  product: Product,
  user: User,
  userInvestments: any[]
): string[] {
  const reasons: string[] = [];

  // Risk matching reasons
  const riskMatch = calculateRiskMatch(product.risk, user.riskAppetite);
  if (riskMatch > 0.8) {
    reasons.push(`Perfect match for your ${user.riskAppetite.toLowerCase()} risk appetite`);
  } else if (riskMatch > 0.6) {
    reasons.push(`Good fit for your risk tolerance`);
  }

  // Yield reasons
  if (product.yield > 12) {
    reasons.push(`High potential returns (${product.yield}%)`);
  } else if (product.yield > 8) {
    reasons.push(`Attractive returns (${product.yield}%)`);
  }

  // Affordability reasons
  if (user.balance >= product.minInvestment * 2) {
    reasons.push(`Well within your investment capacity`);
  } else if (user.balance >= product.minInvestment) {
    reasons.push(`Affordable with your current balance`);
  }

  // Diversification reasons
  const diversificationScore = calculateDiversificationScore(product, userInvestments);
  if (diversificationScore > 0.7) {
    reasons.push(`Adds diversification to your portfolio`);
  }

  // Type-specific reasons
  switch (product.type) {
    case 'Equity Fund':
      reasons.push(`Growth potential in equity markets`);
      break;
    case 'Corporate Bond':
      reasons.push(`Stable fixed-income returns`);
      break;
    case 'REIT':
      reasons.push(`Real estate exposure with liquidity`);
      break;
    case 'Crypto Fund':
      reasons.push(`Digital asset diversification`);
      break;
  }

  // Rating reasons
  if (product.rating > 4.5) {
    reasons.push(`Highly rated by investors (${product.rating}/5)`);
  } else if (product.rating > 4.0) {
    reasons.push(`Well-rated investment option`);
  }

  return reasons.slice(0, 3); // Return top 3 reasons
}

export function generatePortfolioInsights(
  user: User,
  userInvestments: any[]
): PortfolioInsight[] {
  const insights: PortfolioInsight[] = [];

  // Risk distribution analysis
  const riskDistribution = analyzeRiskDistribution(userInvestments);
  if (riskDistribution.needsRebalancing) {
    insights.push({
      type: 'risk_distribution',
      title: 'Risk Distribution Imbalance',
      description: `Your portfolio is ${riskDistribution.dominantRisk} heavy. Consider diversifying risk levels.`,
      severity: riskDistribution.severity,
      recommendations: [
        `Add more ${riskDistribution.recommendedRisk} risk investments`,
        `Consider reducing ${riskDistribution.dominantRisk} risk exposure`,
        `Aim for a balanced risk distribution`
      ]
    });
  }

  // Diversification analysis
  const diversification = analyzeDiversification(userInvestments);
  if (diversification.score < 0.6) {
    insights.push({
      type: 'diversification',
      title: 'Portfolio Diversification',
      description: `Your portfolio lacks diversification across ${diversification.missingTypes.join(', ')}.`,
      severity: diversification.score < 0.3 ? 'high' : 'medium',
      recommendations: [
        `Consider adding ${diversification.missingTypes[0]} investments`,
        `Diversify across different asset classes`,
        `Balance between growth and income investments`
      ]
    });
  }

  // Performance analysis
  const performance = analyzePerformance(user);
  if (performance.needsAttention) {
    insights.push({
      type: 'performance',
      title: 'Performance Optimization',
      description: performance.message,
      severity: performance.severity,
      recommendations: performance.recommendations
    });
  }

  // Rebalancing suggestions
  if (userInvestments.length > 3) {
    insights.push({
      type: 'rebalancing',
      title: 'Portfolio Rebalancing',
      description: 'Your portfolio may benefit from rebalancing to maintain target allocation.',
      severity: 'low',
      recommendations: [
        'Review your investment allocation quarterly',
        'Consider automatic rebalancing features',
        'Adjust based on market conditions'
      ]
    });
  }

  return insights;
}

function analyzeRiskDistribution(investments: any[]): {
  dominantRisk: string;
  recommendedRisk: string;
  needsRebalancing: boolean;
  severity: 'low' | 'medium' | 'high';
} {
  if (investments.length === 0) {
    return {
      dominantRisk: '',
      recommendedRisk: '',
      needsRebalancing: false,
      severity: 'low'
    };
  }

  const riskCounts = investments.reduce((acc, inv) => {
    acc[inv.risk] = (acc[inv.risk] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = investments.length;
  const riskPercentages = Object.entries(riskCounts).map(([risk, count]) => ({
    risk,
    percentage: count / total
  }));

  const dominantRisk = riskPercentages.reduce((max, current) => 
    current.percentage > max.percentage ? current : max
  );

  const needsRebalancing = dominantRisk.percentage > 0.6;
  const severity = dominantRisk.percentage > 0.8 ? 'high' : 
                  dominantRisk.percentage > 0.6 ? 'medium' : 'low';

  const recommendedRisk = dominantRisk.risk === 'High' ? 'Low' : 
                         dominantRisk.risk === 'Low' ? 'Medium' : 'High';

  return {
    dominantRisk: dominantRisk.risk,
    recommendedRisk,
    needsRebalancing,
    severity
  };
}

function analyzeDiversification(investments: any[]): {
  score: number;
  missingTypes: string[];
} {
  if (investments.length === 0) {
    return { score: 0, missingTypes: ['Equity Fund', 'Corporate Bond', 'REIT'] };
  }

  const allTypes = ['Equity Fund', 'Corporate Bond', 'REIT', 'Crypto Fund', 'Government Bond', 'Sector Fund'];
  const existingTypes = new Set(investments.map(inv => inv.type));
  const missingTypes = allTypes.filter(type => !existingTypes.has(type));

  const score = 1 - (missingTypes.length / allTypes.length);
  
  return { score, missingTypes: missingTypes.slice(0, 3) };
}

function analyzePerformance(user: User): {
  needsAttention: boolean;
  message: string;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
} {
  const needsAttention = user.averageReturn < 5 || user.portfolioValue < user.balance * 0.8;
  
  if (user.averageReturn < 3) {
    return {
      needsAttention: true,
      message: 'Your portfolio is underperforming with very low returns.',
      severity: 'high',
      recommendations: [
        'Consider higher-yield investment options',
        'Review your current investment strategy',
        'Consult with a financial advisor'
      ]
    };
  } else if (user.averageReturn < 5) {
    return {
      needsAttention: true,
      message: 'Your portfolio returns are below market average.',
      severity: 'medium',
      recommendations: [
        'Diversify into growth-oriented investments',
        'Consider rebalancing your portfolio',
        'Review investment fees and costs'
      ]
    };
  }

  return {
    needsAttention: false,
    message: '',
    severity: 'low',
    recommendations: []
  };
}

export function generateProductDescription(product: Product): string {
  const templates = {
    'Equity Fund': `A professionally managed equity fund focusing on ${product.risk.toLowerCase()}-risk investments with potential for ${product.yield}% annual returns. This fund provides exposure to carefully selected stocks across various sectors, managed by experienced fund managers with a proven track record.`,
    
    'Corporate Bond': `A fixed-income investment offering ${product.yield}% annual yield with ${product.risk.toLowerCase()} risk profile. This corporate bond provides stable returns through regular interest payments and capital preservation, making it suitable for conservative investors seeking predictable income.`,
    
    'REIT': `A Real Estate Investment Trust providing exposure to commercial real estate with ${product.yield}% expected returns. This REIT offers the benefits of real estate investment with added liquidity, professional management, and regular dividend distributions.`,
    
    'Crypto Fund': `A diversified cryptocurrency fund targeting ${product.yield}% returns through strategic allocation across major digital assets. This fund provides exposure to the crypto market while managing risk through professional portfolio management and advanced risk controls.`,
    
    'Government Bond': `A government-backed security offering ${product.yield}% yield with minimal risk. This investment provides capital preservation and regular income through government-guaranteed returns, making it ideal for risk-averse investors.`,
    
    'Sector Fund': `A specialized sector fund focusing on specific industry segments with ${product.yield}% potential returns. This fund provides targeted exposure to high-growth sectors while maintaining a ${product.risk.toLowerCase()}-risk investment profile.`
  };

  return templates[product.type as keyof typeof templates] || 
         `An investment product offering ${product.yield}% returns with ${product.risk.toLowerCase()} risk profile.`;
}
