import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Star, Heart, ShoppingCart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CustomizationModal from "@/components/customization-modal";
import SEOHead from "@/components/seo-head";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { ProductWithCustomization, Testimonial } from "@shared/schema";

export default function ProductPage() {
  const [, params] = useRoute("/products/:slug");
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<ProductWithCustomization>({
    queryKey: [`/api/products/${params?.slug}`],
    enabled: !!params?.slug,
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: [`/api/testimonials/product/${product?.id}`],
    enabled: !!product?.id,
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-warm flex items-center justify-center">
          <p>Loading product...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-warm flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-playfair font-bold mb-4">Product Not Found</h1>
            <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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
        className={`h-5 w-5 ${
          i < Math.floor(rating) 
            ? "fill-yellow-400 text-yellow-400" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.imageUrl,
    "brand": {
      "@type": "Brand",
      "name": "Artisan Crafts"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || "0",
      "reviewCount": product.reviewCount || 0
    }
  };

  return (
    <>
      <SEOHead
        title={`${product.name} - ${product.category?.name || 'Handmade'} | Artisan Crafts`}
        description={`${product.description} Premium handcrafted ${product.category?.name?.toLowerCase() || 'item'} with ${product.isCustomizable ? 'customization options' : 'artisan quality'}. Starting at $${product.price}.`}
        keywords={`${product.tags?.join(', ')}, handmade, artisan, custom`}
        ogImage={product.imageUrl}
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-warm">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full rounded-lg shadow-lg"
                />
                {product.isCustomizable && (
                  <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                    Customizable
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute top-4 right-4 ${
                    isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"
                  }`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>
            
            {/* Product Info */}
            <div>
              <div className="mb-4">
                {product.category && (
                  <p className="text-sm text-gray-600 mb-2">{product.category.name}</p>
                )}
                <h1 className="text-4xl font-playfair font-bold text-primary mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {renderStars(parseFloat(product.rating || "0"))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                
                <p className="text-5xl font-bold text-primary mb-6">
                  ${parseFloat(product.price).toFixed(2)}
                </p>
                
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  {product.description}
                </p>
                
                <div className="space-y-4">
                  {product.isCustomizable ? (
                    <Button
                      size="lg"
                      className="w-full btn-primary text-lg py-6"
                      onClick={() => setIsCustomizationOpen(true)}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Customize & Add to Cart
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full btn-primary text-lg py-6"
                      onClick={handleQuickAdd}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                  
                  {product.isCustomizable && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white text-lg py-6"
                      onClick={handleQuickAdd}
                    >
                      Quick Add to Cart (Default)
                    </Button>
                  )}
                </div>
                
                <div className="mt-8 p-6 bg-white rounded-lg">
                  <h3 className="font-semibold mb-4">Product Features</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Handcrafted by skilled artisans</li>
                    <li>• Premium quality materials</li>
                    <li>• {product.isCustomizable ? 'Fully customizable' : 'Ready to ship'}</li>
                    <li>• Satisfaction guaranteed</li>
                    {product.tags && product.tags.map((tag, index) => (
                      <li key={index}>• {tag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({testimonials.length})</TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Care</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-8">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-playfair font-semibold mb-4">Product Description</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {product.description}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Each piece is carefully handcrafted by skilled artisans using traditional techniques 
                      passed down through generations. We source only the finest materials to ensure that 
                      every item meets our high standards of quality and durability.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-8">
                <div className="space-y-6">
                  {testimonials.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    testimonials.map((testimonial) => (
                      <Card key={testimonial.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold">{testimonial.name}</h4>
                              <div className="flex text-yellow-400 mt-1">
                                {renderStars(testimonial.rating)}
                              </div>
                            </div>
                            <Badge variant={testimonial.isVerified ? "default" : "secondary"}>
                              {testimonial.isVerified ? "Verified" : "Unverified"}
                            </Badge>
                          </div>
                          <p className="text-gray-700">"{testimonial.content}"</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="mt-8">
                <Card>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-playfair font-semibold mb-4">Shipping Information</h3>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Free shipping on orders over $50</li>
                          <li>• Standard delivery: 5-7 business days</li>
                          <li>• Express delivery: 2-3 business days</li>
                          <li>• Custom orders: 2-3 weeks production time</li>
                          <li>• International shipping available</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-playfair font-semibold mb-4">Care Instructions</h3>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Handle with care</li>
                          <li>• Clean with mild soap and water</li>
                          <li>• Avoid harsh chemicals</li>
                          <li>• Store in a dry place</li>
                          <li>• See specific care guide included with item</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <Footer />
      </div>

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
