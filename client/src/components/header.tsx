import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import CartSidebar from "./cart-sidebar";

export default function Header() {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navItems = [
    { href: "/", label: "Shop" },
    { href: "/?category=pottery", label: "Pottery" },
    { href: "/?category=textiles", label: "Textiles" },
    { href: "/?category=woodwork", label: "Woodwork" },
    { href: "/?category=jewelry", label: "Jewelry" },
    { href: "/#custom-orders", label: "Custom Orders" },
  ];

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <h1 className="text-2xl font-playfair font-bold text-primary cursor-pointer">
                  🔨 Artisan Crafts
                </h1>
              </Link>
              
              <nav className="hidden md:flex space-x-6">
                {navItems.map(item => (
                  <Link key={item.href} href={item.href}>
                    <a className="text-gray-700 hover:text-primary transition-colors">
                      {item.label}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative hidden lg:block">
                <Input
                  type="search"
                  placeholder="Search handmade items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pr-10"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
              
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="flex flex-col space-y-6 mt-6">
                    <form onSubmit={handleSearch} className="flex space-x-2">
                      <Input
                        type="search"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" size="sm">
                        <Search className="h-4 w-4" />
                      </Button>
                    </form>
                    
                    <nav className="flex flex-col space-y-4">
                      {navItems.map(item => (
                        <Link key={item.href} href={item.href}>
                          <a
                            className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.label}
                          </a>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
