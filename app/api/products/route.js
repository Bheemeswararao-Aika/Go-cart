import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db/product';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || undefined;
        const category = searchParams.get('category') || undefined;

        const products = await getAllProducts({ search, category });
        return NextResponse.json({ success: true, products });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
