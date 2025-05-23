import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Gift } from "lucide-react";

interface NewsletterSignupProps {
  variant?: "hero" | "secondary";
  className?: string;
}

export default function NewsletterSignup({ variant = "hero", className = "" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await apiRequest("POST", "/api/newsletter/subscribe", { email });
      
      toast({
        title: "Thank you for subscribing!",
        description: "Check your email for your 15% discount code.",
      });
      
      setEmail("");
    } catch (error: any) {
      const message = error.message.includes("already subscribed") 
        ? "You're already subscribed to our newsletter!"
        : "Failed to subscribe. Please try again.";
        
      toast({
        title: error.message.includes("already subscribed") ? "Already subscribed" : "Error",
        description: message,
        variant: error.message.includes("already subscribed") ? "default" : "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "hero") {
    return (
      <Card className={`bg-white/95 backdrop-blur-sm ${className}`}>
        <CardHeader>
          <CardTitle className="text-2xl font-playfair text-primary text-center">
            Join Our Newsletter
          </CardTitle>
          <p className="text-gray-600 text-center">
            Get 15% off your first order and exclusive artisan updates
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Subscribing..." : "Subscribe & Save 15%"}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-3 text-center">
            No spam, unsubscribe anytime
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-8 ${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="flex-1 bg-white text-gray-800"
        />
        <Button 
          type="submit" 
          className="btn-accent px-8"
          disabled={isLoading}
        >
          {isLoading ? "Joining..." : "Join Newsletter"}
        </Button>
      </form>
      <div className="flex items-center justify-center mt-4 text-sm">
        <Gift className="h-4 w-4 mr-2" />
        <span>Join 5,000+ subscribers and get 15% off your first order</span>
      </div>
    </div>
  );
}
