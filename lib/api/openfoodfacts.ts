// OpenFoodFacts API integration for nutrition data
// Free API with 2M+ foods, no API key required

export interface FoodProduct {
  code: string;
  product_name: string;
  brands?: string;
  categories?: string;
  image_url?: string;
  nutriments: {
    energy_kcal_100g?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    fiber_100g?: number;
    sugars_100g?: number;
    sodium_100g?: number;
    salt_100g?: number;
  };
  allergens?: string;
  allergens_tags?: string[];
  serving_size?: string;
  quantity?: string;
}

export interface SearchResult {
  products: FoodProduct[];
  count: number;
  page: number;
  page_count: number;
  page_size: number;
}

const BASE_URL = 'https://world.openfoodfacts.org/api/v0';

export class OpenFoodFactsAPI {
  // Search for foods by name
  static async searchFoods(query: string, page = 1, pageSize = 20): Promise<SearchResult> {
    try {
      const url = `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page=${page}&page_size=${pageSize}&fields=code,product_name,brands,categories,image_url,nutriments,allergens,allergens_tags,serving_size,quantity`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching foods:', error);
      throw new Error('Failed to search foods');
    }
  }

  // Get product by barcode
  static async getProductByBarcode(barcode: string): Promise<FoodProduct | null> {
    try {
      const url = `${BASE_URL}/product/${barcode}.json?fields=code,product_name,brands,categories,image_url,nutriments,allergens,allergens_tags,serving_size,quantity`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 1 && data.product) {
        return data.product;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      throw new Error('Failed to fetch product');
    }
  }

  // Get popular foods by category
  static async getFoodsByCategory(category: string, page = 1, pageSize = 20): Promise<SearchResult> {
    try {
      const url = `${BASE_URL}/cgi/search.pl?tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(category)}&action=process&json=1&page=${page}&page_size=${pageSize}&fields=code,product_name,brands,categories,image_url,nutriments,allergens,allergens_tags,serving_size,quantity`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching foods by category:', error);
      throw new Error('Failed to fetch foods by category');
    }
  }

  // Calculate nutrition per serving
  static calculateNutritionPerServing(product: FoodProduct, servingGrams: number) {
    const nutriments = product.nutriments;
    const factor = servingGrams / 100; // Convert from per 100g to per serving

    return {
      calories: Math.round((nutriments.energy_kcal_100g || 0) * factor),
      protein: Math.round((nutriments.proteins_100g || 0) * factor * 10) / 10,
      carbs: Math.round((nutriments.carbohydrates_100g || 0) * factor * 10) / 10,
      fat: Math.round((nutriments.fat_100g || 0) * factor * 10) / 10,
      fiber: Math.round((nutriments.fiber_100g || 0) * factor * 10) / 10,
      sugar: Math.round((nutriments.sugars_100g || 0) * factor * 10) / 10,
      sodium: Math.round((nutriments.sodium_100g || 0) * factor * 10) / 10,
    };
  }

  // Check for allergens
  static checkAllergens(product: FoodProduct, userAllergies: string[]): string[] {
    const foundAllergens: string[] = [];
    
    if (!product.allergens_tags || userAllergies.length === 0) {
      return foundAllergens;
    }

    // Map common allergen names to OpenFoodFacts tags
    const allergenMap: Record<string, string[]> = {
      dairy: ['en:milk'],
      eggs: ['en:eggs'],
      nuts: ['en:nuts', 'en:tree-nuts'],
      peanuts: ['en:peanuts'],
      shellfish: ['en:crustaceans', 'en:molluscs'],
      fish: ['en:fish'],
      soy: ['en:soybeans'],
      gluten: ['en:gluten'],
    };

    userAllergies.forEach(allergy => {
      const tags = allergenMap[allergy.toLowerCase()] || [allergy.toLowerCase()];
      
      tags.forEach(tag => {
        if (product.allergens_tags?.some(productTag => 
          productTag.toLowerCase().includes(tag.toLowerCase())
        )) {
          if (!foundAllergens.includes(allergy)) {
            foundAllergens.push(allergy);
          }
        }
      });
    });

    return foundAllergens;
  }

  // Get suggested serving size in grams
  static getSuggestedServingSize(product: FoodProduct): number {
    // Try to parse serving size from product
    if (product.serving_size) {
      const match = product.serving_size.match(/(\d+)\s*g/i);
      if (match) {
        return parseInt(match[1]);
      }
    }

    // Default serving sizes by category
    const categories = product.categories?.toLowerCase() || '';
    
    if (categories.includes('fruit')) return 150;
    if (categories.includes('vegetable')) return 100;
    if (categories.includes('meat')) return 100;
    if (categories.includes('fish')) return 100;
    if (categories.includes('dairy')) return 200;
    if (categories.includes('bread')) return 30;
    if (categories.includes('cereal')) return 40;
    if (categories.includes('pasta')) return 80;
    if (categories.includes('rice')) return 80;
    if (categories.includes('snack')) return 30;
    if (categories.includes('beverage')) return 250;
    
    // Default
    return 100;
  }

  // Format product for display
  static formatProduct(product: FoodProduct) {
    return {
      id: product.code,
      name: product.product_name || 'Unknown Product',
      brand: product.brands || '',
      image: product.image_url || '',
      category: product.categories?.split(',')[0] || '',
      nutrition: {
        calories: product.nutriments.energy_kcal_100g || 0,
        protein: product.nutriments.proteins_100g || 0,
        carbs: product.nutriments.carbohydrates_100g || 0,
        fat: product.nutriments.fat_100g || 0,
        fiber: product.nutriments.fiber_100g || 0,
        sugar: product.nutriments.sugars_100g || 0,
        sodium: product.nutriments.sodium_100g || 0,
      },
      allergens: product.allergens_tags || [],
      servingSize: this.getSuggestedServingSize(product),
    };
  }
}

// Popular food categories for browsing
export const FOOD_CATEGORIES = [
  'fruits',
  'vegetables',
  'meat',
  'fish',
  'dairy',
  'bread',
  'cereals',
  'pasta',
  'rice',
  'snacks',
  'beverages',
  'desserts',
  'condiments',
  'spices',
];

// Common serving sizes
export const SERVING_SIZES = [
  { label: '1 small (50g)', grams: 50 },
  { label: '1 medium (100g)', grams: 100 },
  { label: '1 large (150g)', grams: 150 },
  { label: '1 cup (200g)', grams: 200 },
  { label: '1 slice (30g)', grams: 30 },
  { label: '1 piece (25g)', grams: 25 },
  { label: '1 tablespoon (15g)', grams: 15 },
  { label: '1 teaspoon (5g)', grams: 5 },
];