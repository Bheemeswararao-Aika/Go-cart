import { NextResponse } from 'next/server';
import { getProductById, deleteProductById } from '@/lib/db/product';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const product = await getProductById(id);
        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, product });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await deleteProductById(id);
        return NextResponse.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message,
            code: error.code || 'UNKNOWN_ERROR',
        }, { status: 500 });
    }
}
