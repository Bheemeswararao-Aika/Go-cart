import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { productDummyData } from '@/assets/assets';
export async function POST(request) {
    try {
        const body = await request.json();

        const { name, description, mrp, price, category, images = [] } = body;

        const newProduct = {
            id: `prod_${Date.now()}`,
            name,
            description,
            mrp: parseFloat(mrp),
            price: parseFloat(price),
            category,
            images: images.length ? images : ['/assets/product_img1.png'],
            inStock: true,
            storeId: 'store_1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            rating: [],
        };

        if (!process.env.DATABASE_URL) {
            productDummyData.unshift(newProduct);
            return NextResponse.json({ success: true, product: newProduct });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                mrp: parseFloat(mrp),
                price: parseFloat(price),
                category,
                images: images.length ? images : ['/assets/product_img1.png'],
                inStock: true,
                storeId: 'cmemkqnzm000htat8u7n8cpte',
            }
        });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
