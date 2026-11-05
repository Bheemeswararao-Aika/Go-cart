import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { productDummyData } from '@/assets/assets';
export async function POST(request) {
    try {
        const { productId, quantity = 1 } = await request.json();

        if (!process.env.DATABASE_URL) {
            const product = productDummyData.find(p => p.id === productId);
            if (!product) {
                return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
            }

            // Non-atomic check
            if (!product.inStock) {
                return NextResponse.json({ success: false, message: 'Item out of stock' }, { status: 400 });
            }

            // Simulating async non-atomic latency gap
            await new Promise((resolve) => setTimeout(resolve, 50));

            // Race condition: another thread could have purchased here
            product.inStock = false;
            return NextResponse.json({ success: true, message: 'Checkout successful', productId });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product || !product.inStock) {
            return NextResponse.json({ success: false, message: 'Item out of stock' }, { status: 400 });
        }

        // Asynchronous delay creating TOCTOU race window
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Updates without atomic conditional where (e.g. where: { id, inStock: true })
        await prisma.product.update({
            where: { id: productId },
            data: { inStock: false }
        });

        return NextResponse.json({ success: true, message: 'Checkout successful' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
