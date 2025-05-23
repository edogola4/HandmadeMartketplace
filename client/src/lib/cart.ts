// Utility functions for cart management

export interface CartCustomization {
  [key: string]: string;
}

export function formatCustomization(customization: CartCustomization): string {
  return Object.entries(customization)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
}

export function parseCustomization(customizationString: string | null): CartCustomization | null {
  if (!customizationString) return null;
  
  try {
    return JSON.parse(customizationString);
  } catch {
    return null;
  }
}

export function calculateCustomizationPrice(
  basePrice: number,
  customization: CartCustomization,
  options: Array<{ type: string; priceModifier: string }>
): number {
  let additionalCost = 0;
  
  Object.keys(customization).forEach(type => {
    const option = options.find(opt => opt.type === type);
    if (option && option.priceModifier) {
      additionalCost += parseFloat(option.priceModifier);
    }
  });
  
  return basePrice + additionalCost;
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
