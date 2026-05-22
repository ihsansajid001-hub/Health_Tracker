import { NextRequest, NextResponse } from 'next/server';
import { OpenFoodFactsAPI } from '@/lib/api/openfoodfacts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const results = await OpenFoodFactsAPI.searchFoods(query, page, pageSize);
    
    // Format products for easier use
    const formattedProducts = results.products
      .filter(product => product.product_name && product.nutriments.energy_kcal_100g)
      .map(product => OpenFoodFactsAPI.formatProduct(product));

    return NextResponse.json({
      products: formattedProducts,
      count: results.count,
      page: results.page,
      pageCount: results.page_count,
      pageSize: results.page_size,
    });
  } catch (error) {
    console.error('Food search error:', error);
    return NextResponse.json(
      { error: 'Failed to search foods' },
      { status: 500 }
    );
  }
}