import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Heart } from "lucide-react";

export default function Footer() {
  const shopLinks = [
    { href: "/", label: "All Products" },
    { href: "/?category=pottery", label: "Pottery" },
    { href: "/?category=textiles", label: "Textiles" },
    { href: "/?category=woodwork", label: "Woodwork" },
    { href: "/?category=jewelry", label: "Jewelry" },
    { href: "/#custom-orders", label: "Custom Orders" },
  ];

  const supportLinks = [
    { href: "/#contact", label: "Contact Us" },
    { href: "/#shipping", label: "Shipping Info" },
    { href: "/#returns", label: "Returns" },
    { href: "/#size-guide", label: "Size Guide" },
    { href: "/#care", label: "Care Instructions" },
    { href: "/#faq", label: "FAQ" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-playfair font-bold mb-4">
              🔨 Artisan Crafts
            </h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Connecting you with skilled artisans worldwide. Every piece tells a story, 
              every purchase supports traditional craftsmanship.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-300 hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-accent transition-colors"
                aria-label="Pinterest"
              >
                <Heart className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-playfair font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              {shopLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-gray-300 hover:text-accent transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-playfair font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map(link => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            &copy; 2024 Artisan Crafts. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-accent transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-accent transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-300 hover:text-accent transition-colors text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
