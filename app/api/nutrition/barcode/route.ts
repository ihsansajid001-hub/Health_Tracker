import { NextRequest, NextResponse } from 'next/server';
import { OpenFoodFactsAPI } from '@/lib/api/openfoodfacts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const barcode = searchParams.get('barcode');

    if (!barcode) {
      return NextResponse.json(
        { error: 'Barcode parameter is required' },
        { status: 400 }
      );
    }

    const product = await OpenFoodFactsAPI.getProductByBarcode(barcode);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product has basic nutrition data
    if (!product.nutriments.energy_kcal_100g) {
      return NextResponse.json(
        { error: 'Product found but nutrition data is incomplete' },
        { status:422 }
      );
    }

    const formattedProduct = OpenFoodFactsAPI.formatProduct(product);

    return NextResponse.json({
      product: formattedProduct,
    });
  } catch (error) {
    console.error('Barcode lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to lookup product' },
      { status: 500 }
    );
  }
}