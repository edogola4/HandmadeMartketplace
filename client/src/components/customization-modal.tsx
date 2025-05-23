import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { ProductWithCategory, CustomizationOption } from "@shared/schema";

interface CustomizationModalProps {
  product: ProductWithCategory;
  isOpen: boolean;
  onClose: () => void;
}

interface CustomizationValues {
  [key: string]: string;
}

export default function CustomizationModal({ product, isOpen, onClose }: CustomizationModalProps) {
  const [customizationValues, setCustomizationValues] = useState<CustomizationValues>({});
  const [totalPrice, setTotalPrice] = useState(parseFloat(product.price));
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: customizationOptions = [] } = useQuery<CustomizationOption[]>({
    queryKey: [`/api/products/${product.id}/customization`],
    enabled: isOpen && product.isCustomizable,
  });

  useEffect(() => {
    if (customizationOptions.length > 0) {
      // Set default values and calculate initial price
      const defaults: CustomizationValues = {};
      let additionalCost = 0;
      
      customizationOptions.forEach(option => {
        if (option.values && option.values.length > 0) {
          defaults[option.type] = option.values[0];
        }
        if (customizationValues[option.type] && option.priceModifier) {
          additionalCost += parseFloat(option.priceModifier);
        }
      });
      
      setCustomizationValues(prev => ({ ...defaults, ...prev }));
      setTotalPrice(parseFloat(product.price) + additionalCost);
    }
  }, [customizationOptions, product.price]);

  useEffect(() => {
    // Recalculate price when customization values change
    let additionalCost = 0;
    customizationOptions.forEach(option => {
      if (customizationValues[option.type] && option.priceModifier) {
        additionalCost += parseFloat(option.priceModifier);
      }
    });
    setTotalPrice(parseFloat(product.price) + additionalCost);
  }, [customizationValues, customizationOptions, product.price]);

  const handleValueChange = (type: string, value: string) => {
    setCustomizationValues(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
        customization: JSON.stringify(customizationValues),
      });
      
      toast({
        title: "Added to cart!",
        description: `Customized ${product.name} has been added to your cart.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderCustomizationOption = (option: CustomizationOption) => {
    switch (option.type) {
      case "color":
        return (
          <div key={option.id} className="space-y-3">
            <Label className="font-semibold">{option.name}</Label>
            <div className="grid grid-cols-6 gap-3">
              {option.values?.map((color, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    customizationValues[option.type] === color
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-gray-300 hover:border-primary"
                  }`}
                  style={{
                    backgroundColor: color.toLowerCase().includes("blue") ? "#3B82F6" :
                                   color.toLowerCase().includes("green") ? "#10B981" :
                                   color.toLowerCase().includes("red") || color.toLowerCase().includes("burgundy") ? "#EF4444" :
                                   color.toLowerCase().includes("yellow") || color.toLowerCase().includes("gold") ? "#F59E0B" :
                                   color.toLowerCase().includes("purple") ? "#8B5CF6" :
                                   color.toLowerCase().includes("black") ? "#1F2937" :
                                   color.toLowerCase().includes("brown") || color.toLowerCase().includes("tan") ? "#8B4513" :
                                   color.toLowerCase().includes("navy") ? "#1E3A8A" :
                                   color.toLowerCase().includes("gray") || color.toLowerCase().includes("charcoal") ? "#6B7280" :
                                   color.toLowerCase().includes("natural") ? "#F5F5DC" :
                                   "#9CA3AF"
                  }}
                  onClick={() => handleValueChange(option.type, color)}
                  title={color}
                />
              ))}
            </div>
            {customizationValues[option.type] && (
              <p className="text-sm text-gray-600">Selected: {customizationValues[option.type]}</p>
            )}
          </div>
        );

      case "size":
        return (
          <div key={option.id} className="space-y-3">
            <Label className="font-semibold">{option.name}</Label>
            <div className="grid grid-cols-3 gap-3">
              {option.values?.map((size, index) => (
                <Button
                  key={index}
                  variant={customizationValues[option.type] === size ? "default" : "outline"}
                  className={customizationValues[option.type] === size ? "btn-primary" : ""}
                  onClick={() => handleValueChange(option.type, size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        );

      case "text":
        return (
          <div key={option.id} className="space-y-3">
            <Label htmlFor={`text-${option.id}`} className="font-semibold">
              {option.name} {option.priceModifier && parseFloat(option.priceModifier) > 0 && (
                <span className="text-sm text-gray-600">(+${parseFloat(option.priceModifier).toFixed(2)})</span>
              )}
            </Label>
            <Input
              id={`text-${option.id}`}
              placeholder={`Enter your ${option.name.toLowerCase()}...`}
              value={customizationValues[option.type] || ""}
              onChange={(e) => handleValueChange(option.type, e.target.value)}
              maxLength={20}
            />
            <p className="text-xs text-gray-500">Up to 20 characters</p>
          </div>
        );

      case "font":
        return (
          <div key={option.id} className="space-y-3">
            <Label className="font-semibold">{option.name}</Label>
            <Select
              value={customizationValues[option.type] || ""}
              onValueChange={(value) => handleValueChange(option.type, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font style" />
              </SelectTrigger>
              <SelectContent>
                {option.values?.map((font, index) => (
                  <SelectItem key={index} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "scent":
        return (
          <div key={option.id} className="space-y-3">
            <Label className="font-semibold">{option.name}</Label>
            <Select
              value={customizationValues[option.type] || ""}
              onValueChange={(value) => handleValueChange(option.type, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose scent" />
              </SelectTrigger>
              <SelectContent>
                {option.values?.map((scent, index) => (
                  <SelectItem key={index} value={scent}>
                    {scent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return (
          <div key={option.id} className="space-y-3">
            <Label className="font-semibold">{option.name}</Label>
            <Select
              value={customizationValues[option.type] || ""}
              onValueChange={(value) => handleValueChange(option.type, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${option.name.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {option.values?.map((value, index) => (
                  <SelectItem key={index} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair">Customize Your Product</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Product Preview */}
          <div>
            <h4 className="font-playfair font-semibold text-lg mb-4">Product Preview</h4>
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
              />
              <p className="text-sm text-gray-600 mt-4">Preview updates as you customize</p>
            </div>
          </div>
          
          {/* Customization Options */}
          <div className="space-y-6">
            {customizationOptions.map(renderCustomizationOption)}
            
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total Price:</span>
                <span className="text-2xl font-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="space-y-3">
                <Button
                  className="w-full btn-primary"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={onClose}
                >
                  Save for Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
