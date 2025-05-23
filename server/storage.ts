import { 
  categories, products, customizationOptions, newsletters, cartItems, testimonials,
  type Category, type Product, type CustomizationOption, type Newsletter, 
  type CartItem, type Testimonial, type InsertCategory, type InsertProduct,
  type InsertCustomizationOption, type InsertNewsletter, type InsertCartItem,
  type InsertTestimonial, type ProductWithCategory, type ProductWithCustomization
} from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(filters?: { categoryId?: number; search?: string; sortBy?: string }): Promise<ProductWithCategory[]>;
  getProduct(id: number): Promise<ProductWithCustomization | undefined>;
  getProductBySlug(slug: string): Promise<ProductWithCustomization | undefined>;
  getFeaturedProducts(limit?: number): Promise<ProductWithCategory[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Customization Options
  getCustomizationOptionsByProductId(productId: number): Promise<CustomizationOption[]>;
  createCustomizationOption(option: InsertCustomizationOption): Promise<CustomizationOption>;

  // Newsletter
  subscribeToNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  getNewsletterSubscription(email: string): Promise<Newsletter | undefined>;

  // Cart
  getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;

  // Testimonials
  getTestimonials(limit?: number): Promise<Testimonial[]>;
  getTestimonialsByProductId(productId: number): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category> = new Map();
  private products: Map<number, Product> = new Map();
  private customizationOptions: Map<number, CustomizationOption> = new Map();
  private newsletters: Map<number, Newsletter> = new Map();
  private cartItems: Map<number, CartItem> = new Map();
  private testimonials: Map<number, Testimonial> = new Map();
  
  private currentId = {
    categories: 1,
    products: 1,
    customizationOptions: 1,
    newsletters: 1,
    cartItems: 1,
    testimonials: 1,
  };

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categoryData: InsertCategory[] = [
      { name: "Pottery", slug: "pottery", description: "Handcrafted ceramic pieces", imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
      { name: "Textiles", slug: "textiles", description: "Handwoven fabrics and clothing", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
      { name: "Woodwork", slug: "woodwork", description: "Beautiful wooden crafts", imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
      { name: "Jewelry", slug: "jewelry", description: "Handmade jewelry pieces", imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" },
    ];

    categoryData.forEach(cat => this.createCategory(cat));

    // Seed products
    const productData: InsertProduct[] = [
      {
        name: "Artisan Ceramic Mug",
        slug: "artisan-ceramic-mug",
        description: "Hand-thrown ceramic mug with unique glaze patterns. Perfect for your morning coffee.",
        price: "32.00",
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isCustomizable: true,
        rating: "4.8",
        reviewCount: 24,
        inStock: true,
        tags: ["ceramic", "mug", "handmade", "kitchen"]
      },
      {
        name: "Handwoven Wool Scarf",
        slug: "handwoven-wool-scarf",
        description: "Luxurious wool scarf with traditional weaving patterns. Choose your favorite colors.",
        price: "68.00",
        categoryId: 2,
        imageUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isCustomizable: true,
        rating: "4.9",
        reviewCount: 18,
        inStock: true,
        tags: ["wool", "scarf", "winter", "warm"]
      },
      {
        name: "Wooden Cutting Board",
        slug: "wooden-cutting-board",
        description: "Premium hardwood cutting board with personalized engraving options available.",
        price: "45.00",
        categoryId: 3,
        imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isCustomizable: true,
        rating: "4.7",
        reviewCount: 31,
        inStock: true,
        tags: ["wood", "kitchen", "cutting board", "engraving"]
      },
      {
        name: "Silver Pendant Necklace",
        slug: "silver-pendant-necklace",
        description: "Elegant handcrafted silver pendant. Add personal engraving for a unique touch.",
        price: "89.00",
        categoryId: 4,
        imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isCustomizable: true,
        rating: "4.9",
        reviewCount: 15,
        inStock: true,
        tags: ["silver", "necklace", "jewelry", "pendant"]
      },
      {
        name: "Handwoven Storage Basket",
        slug: "handwoven-storage-basket",
        description: "Sustainable storage solution made from natural fibers. Perfect for home organization.",
        price: "38.00",
        categoryId: 2,
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isCustomizable: false,
        rating: "4.5",
        reviewCount: 22,
        inStock: true,
        tags: ["basket", "storage", "eco-friendly", "natural"]
      },
      {
        name: "Handcrafted Leather Wallet",
        slug: "handcrafted-leather-wallet",
        description: "Premium leather wallet with custom monogramming. Built to last a lifetime.",
        price: "75.00",
        categoryId: 4,
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isCustomizable: true,
        rating: "4.8",
        reviewCount: 27,
        inStock: true,
        tags: ["leather", "wallet", "monogram", "accessories"]
      },
      {
        name: "Soy Wax Candle Set",
        slug: "soy-wax-candle-set",
        description: "Hand-poured soy candles with essential oils. Choose from 12 natural scents.",
        price: "42.00",
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1602874801006-0d90c6a45494?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isCustomizable: true,
        rating: "4.6",
        reviewCount: 33,
        inStock: true,
        tags: ["candles", "soy wax", "scented", "natural"]
      },
      {
        name: "Blown Glass Ornaments",
        slug: "blown-glass-ornaments",
        description: "Delicate hand-blown glass ornaments. Each piece is unique with artistic patterns.",
        price: "28.00",
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isCustomizable: false,
        rating: "4.4",
        reviewCount: 19,
        inStock: true,
        tags: ["glass", "ornaments", "decorative", "artistic"]
      }
    ];

    productData.forEach(prod => this.createProduct(prod));

    // Seed customization options
    const customizationData: InsertCustomizationOption[] = [
      // Ceramic Mug options
      { productId: 1, type: "color", name: "Glaze Color", values: ["Blue", "Green", "Burgundy", "Natural", "Black"], priceModifier: "0" },
      { productId: 1, type: "text", name: "Custom Text", values: [], priceModifier: "5.00" },
      { productId: 1, type: "size", name: "Size", values: ["Small (8oz)", "Medium (12oz)", "Large (16oz)"], priceModifier: "0" },

      // Wool Scarf options
      { productId: 2, type: "color", name: "Color Pattern", values: ["Burgundy & Gold", "Navy & Silver", "Forest Green", "Charcoal Gray"], priceModifier: "0" },
      { productId: 2, type: "size", name: "Length", values: ["Short (60in)", "Long (72in)"], priceModifier: "0" },

      // Cutting Board options
      { productId: 3, type: "text", name: "Engraving", values: [], priceModifier: "8.00" },
      { productId: 3, type: "size", name: "Size", values: ["Small (12x8in)", "Medium (16x10in)", "Large (20x12in)"], priceModifier: "0" },

      // Silver Necklace options
      { productId: 4, type: "text", name: "Engraving", values: [], priceModifier: "12.00" },
      { productId: 4, type: "size", name: "Chain Length", values: ["16 inches", "18 inches", "20 inches"], priceModifier: "0" },

      // Leather Wallet options
      { productId: 6, type: "color", name: "Leather Color", values: ["Brown", "Black", "Tan", "Navy"], priceModifier: "0" },
      { productId: 6, type: "text", name: "Monogram", values: [], priceModifier: "10.00" },

      // Candle Set options
      { productId: 7, type: "scent", name: "Scent Selection", values: ["Lavender", "Vanilla", "Sandalwood", "Eucalyptus", "Rose", "Citrus"], priceModifier: "0" },
    ];

    customizationData.forEach(opt => this.createCustomizationOption(opt));

    // Seed testimonials
    const testimonialData: InsertTestimonial[] = [
      {
        name: "Sarah M.",
        email: "sarah@example.com",
        content: "The customized ceramic mug I ordered exceeded all expectations. The quality is outstanding and the personal touch made it the perfect gift.",
        rating: 5,
        productId: 1
      },
      {
        name: "Mike T.",
        email: "mike@example.com",
        content: "I love supporting artisans and the newsletter always keeps me updated on new collections. The craftsmanship is incredible!",
        rating: 5,
        productId: 2
      },
      {
        name: "Emma L.",
        email: "emma@example.com",
        content: "The wooden cutting board with our family name engraved is beautiful. It's become the centerpiece of our kitchen!",
        rating: 5,
        productId: 3
      }
    ];

    testimonialData.forEach(testimonial => this.createTestimonial(testimonial));
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentId.categories++;
    const category: Category = { 
      ...insertCategory, 
      id,
      description: insertCategory.description || null,
      imageUrl: insertCategory.imageUrl || null
    };
    this.categories.set(id, category);
    return category;
  }

  // Products
  async getProducts(filters?: { categoryId?: number; search?: string; sortBy?: string }): Promise<ProductWithCategory[]> {
    let products = Array.from(this.products.values());
    
    if (filters?.categoryId) {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(search)))
      );
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case "price_desc":
          products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case "rating":
          products.sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"));
          break;
        case "newest":
          products.sort((a, b) => b.id - a.id);
          break;
      }
    }

    return products.map(product => ({
      ...product,
      category: product.categoryId ? this.categories.get(product.categoryId) : undefined
    }));
  }

  async getProduct(id: number): Promise<ProductWithCustomization | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const customizationOptions = Array.from(this.customizationOptions.values()).filter(
      opt => opt.productId === id
    );
    
    return {
      ...product,
      category: product.categoryId ? this.categories.get(product.categoryId) : undefined,
      customizationOptions
    };
  }

  async getProductBySlug(slug: string): Promise<ProductWithCustomization | undefined> {
    const product = Array.from(this.products.values()).find(p => p.slug === slug);
    if (!product) return undefined;
    
    return this.getProduct(product.id);
  }

  async getFeaturedProducts(limit = 8): Promise<ProductWithCategory[]> {
    const products = await this.getProducts();
    return products.slice(0, limit);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentId.products++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Customization Options
  async getCustomizationOptionsByProductId(productId: number): Promise<CustomizationOption[]> {
    return Array.from(this.customizationOptions.values()).filter(opt => opt.productId === productId);
  }

  async createCustomizationOption(insertOption: InsertCustomizationOption): Promise<CustomizationOption> {
    const id = this.currentId.customizationOptions++;
    const option: CustomizationOption = { ...insertOption, id };
    this.customizationOptions.set(id, option);
    return option;
  }

  // Newsletter
  async subscribeToNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const existing = await this.getNewsletterSubscription(insertNewsletter.email);
    if (existing) {
      throw new Error("Email already subscribed to newsletter");
    }
    
    const id = this.currentId.newsletters++;
    const newsletter: Newsletter = { 
      ...insertNewsletter, 
      id, 
      subscribedAt: new Date(),
      isActive: true 
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }

  async getNewsletterSubscription(email: string): Promise<Newsletter | undefined> {
    return Array.from(this.newsletters.values()).find(n => n.email === email && n.isActive);
  }

  // Cart
  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    return items.map(item => ({
      ...item,
      product: this.products.get(item.productId!)!
    }));
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentId.cartItems++;
    const item: CartItem = { 
      ...insertItem, 
      id, 
      addedAt: new Date() 
    };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    Array.from(this.cartItems.entries()).forEach(([id, item]) => {
      if (item.sessionId === sessionId) {
        this.cartItems.delete(id);
      }
    });
  }

  // Testimonials
  async getTestimonials(limit = 10): Promise<Testimonial[]> {
    const testimonials = Array.from(this.testimonials.values())
      .filter(t => t.isVerified)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    
    return limit ? testimonials.slice(0, limit) : testimonials;
  }

  async getTestimonialsByProductId(productId: number): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values())
      .filter(t => t.productId === productId && t.isVerified)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentId.testimonials++;
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id, 
      createdAt: new Date(),
      isVerified: true,
      productId: insertTestimonial.productId || null
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
}

export const storage = new MemStorage();
