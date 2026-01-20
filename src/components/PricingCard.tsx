import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

interface PricingCardProps {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  period?: string;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export function PricingCard({
  title,
  description,
  price,
  originalPrice,
  period = "month",
  features,
  isPopular = false,
  buttonText = "Get Started",
  onButtonClick,
  className = "",
}: PricingCardProps) {
  return (
    <Card 
      className={`relative w-full max-w-sm transition-all duration-300 hover:shadow-lg ${
        isPopular 
          ? 'border-primary shadow-md ring-1 ring-primary/20 scale-105' 
          : 'hover:border-primary/50'
      } ${className}`}
    >
      {isPopular && (
        <Badge 
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground"
        >
          <Star className="w-3 h-3 mr-1" />
          Most Popular
        </Badge>
      )}
      
      <CardHeader className="text-center pb-8 pt-6">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          {description}
        </CardDescription>
        
        <div className="mt-4">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold tracking-tight">
              ${price}
            </span>
            {originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                ${originalPrice}
              </span>
            )}
            <span className="text-muted-foreground">/{period}</span>
          </div>
          
          {originalPrice && (
            <Badge variant="secondary" className="mt-2">
              Save ${originalPrice - price}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="pt-6">
        <Button 
          className="w-full h-11 font-semibold" 
          variant={isPopular ? "default" : "outline"}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Example usage component
export function PricingSection() {
  const pricingPlans = [
    {
      title: "Starter",
      description: "Perfect for small projects and personal use",
      price: 9,
      originalPrice: 15,
      features: [
        "Up to 5 projects",
        "10GB storage",
        "Email support",
        "Basic analytics",
        "SSL certificate"
      ]
    },
    {
      title: "Professional",
      description: "Ideal for growing businesses and teams",
      price: 29,
      originalPrice: 39,
      features: [
        "Unlimited projects",
        "100GB storage",
        "Priority support",
        "Advanced analytics",
        "Custom domain",
        "Team collaboration",
        "API access"
      ],
      isPopular: true
    },
    {
      title: "Enterprise",
      description: "For large organizations with advanced needs",
      price: 99,
      features: [
        "Everything in Professional",
        "Unlimited storage",
        "24/7 phone support",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee",
        "Advanced security features"
      ]
    }
  ];

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              description={plan.description}
              price={plan.price}
              originalPrice={plan.originalPrice}
              features={plan.features}
              isPopular={plan.isPopular}
              onButtonClick={() => console.log(`Selected ${plan.title} plan`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}