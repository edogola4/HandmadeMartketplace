import { useState } from "react";
import { Link } from "wouter";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { ProductWithCategory } from "@shared/schema";
import CustomizationModal from "./customization-modal";

interface ProductCardProps {
  product: ProductWithCategory;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleQuickAdd = async () => {
    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
        customization: null,
      });
      
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? "fill-yellow-400 text-yellow-400" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <>
      <Card className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            {product.isCustomizable && (
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                Customizable
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-4 right-4 ${
              isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </Button>
        </div>
        
        <CardContent className="p-6">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-playfair font-semibold text-lg mb-2 hover:text-primary transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-primary">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {renderStars(parseFloat(product.rating || "0"))}
              </div>
              <span className="text-sm text-gray-600">({product.reviewCount})</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {product.isCustomizable ? (
              <Button
                className="w-full btn-primary"
                onClick={() => setIsCustomizationOpen(true)}
              >
                Customize & Add to Cart
              </Button>
            ) : (
              <Button
                className="w-full btn-primary"
                onClick={handleQuickAdd}
              >
                Add to Cart
              </Button>
            )}
            
            {product.isCustomizable && (
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                onClick={handleQuickAdd}
              >
                Quick Add to Cart
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {product.isCustomizable && (
        <CustomizationModal
          product={product}
          isOpen={isCustomizationOpen}
          onClose={() => setIsCustomizationOpen(false)}
        />
      )}
    </>
  );
}
