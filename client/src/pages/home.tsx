import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Search, Filter, Palette, PencilIcon, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import NewsletterSignup from "@/components/newsletter-signup";
import SEOHead from "@/components/seo-head";
import type { Category, ProductWithCategory, Testimonial } from "@shared/schema";

export default function Home() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const categoryFilter = urlParams.get('category');
  const searchFilter = urlParams.get('search');

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts = [] } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products/featured", { limit: 8 }],
  });

  const { data: products = [] } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products", { 
      search: searchFilter || searchQuery,
      sortBy: sortBy === "popular" ? undefined : sortBy 
    }],
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials", { limit: 3 }],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.history.pushState({}, '', `/?search=${encodeURIComponent(searchQuery.trim())}`);
      window.location.reload(); // Trigger re-render with new URL params
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Artisan Crafts",
    "description": "Handmade products with customization options. Premium handcrafted items made with love.",
    "url": "https://artisancrafts.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://artisancrafts.com/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <SEOHead
        title="Artisan Crafts - Handmade Products with Custom Options | Newsletter Exclusive Deals"
        description="Discover unique handmade products with personalization options. Join our newsletter for exclusive artisan deals and custom craft updates. Premium handcrafted items made with love."
        keywords="handmade crafts, artisan products, custom crafts, personalized gifts, handcrafted items, artisan marketplace"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-warm">
        <Header />
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-secondary text-white py-20">
          <div 
            className="absolute inset-0 bg-black/40"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
          
          <div className="relative container mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-6xl font-playfair font-bold mb-6">
              Handcrafted with <span className="font-dancing text-accent">Love</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover unique artisan products with personalization options. Join our newsletter for exclusive deals and custom craft updates.
            </p>
            
            <NewsletterSignup variant="hero" className="max-w-md mx-auto" />
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-playfair font-bold text-center mb-12 text-primary">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link key={category.id} href={`/?category=${category.slug}`}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={category.imageUrl || ""}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-playfair font-semibold text-lg">{category.name}</h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-warm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <h2 className="text-4xl font-playfair font-bold text-primary mb-4 md:mb-0">
                Featured Products
              </h2>
              <div className="flex space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Sort by Popular</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-gray-300">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {(searchFilter || searchQuery ? products : featuredProducts).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {!searchFilter && !searchQuery && (
              <div className="text-center mt-12">
                <Button className="btn-primary px-8 py-4 text-lg">
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* How Customization Works */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-playfair font-bold text-center mb-12 text-primary">
              How Customization Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-accent/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Palette className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair font-semibold text-xl mb-4">Choose Your Style</h3>
                <p className="text-gray-600">
                  Select colors, patterns, sizes, and materials that match your vision. 
                  Our intuitive interface makes it easy.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-accent/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <PencilIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair font-semibold text-xl mb-4">Add Personal Touches</h3>
                <p className="text-gray-600">
                  Include custom text, monograms, or special requests. 
                  Each piece becomes uniquely yours.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-accent/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Hammer className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair font-semibold text-xl mb-4">Handcrafted Just for You</h3>
                <p className="text-gray-600">
                  Our skilled artisans bring your vision to life with traditional 
                  techniques and modern quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-warm">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-playfair font-bold text-center mb-12 text-primary">
              What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-white shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex text-yellow-400 mb-4">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < testimonial.rating ? "★" : "☆"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                        <span className="text-gray-600 font-semibold">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-gray-600 text-sm">
                          {testimonial.isVerified ? "Verified Buyer" : "Customer"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-to-r from-secondary to-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-playfair font-bold mb-6">
              Stay Connected with Our Artisan Community
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get exclusive access to limited editions, behind-the-scenes content, 
              and special discounts on custom orders.
            </p>
            
            <NewsletterSignup variant="secondary" className="max-w-lg mx-auto" />
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
