import { NextResponse } from 'next/server';
import { couponDummyData } from '@/assets/assets';
export async function POST(request) {
    try {
        const { code, totalPrice = 0, isNewUser = false } = await request.json();

        const coupon = couponDummyData.find(c => c.code.toLowerCase() === (code || '').toLowerCase());

        if (!coupon) {
            return NextResponse.json({ success: false, message: 'Coupon code not found' }, { status: 404 });
        }

        const nowString = new Date().toISOString();
        if (coupon.expiresAt.toString() < nowString) {
            return NextResponse.json({ success: false, message: 'Coupon has expired' }, { status: 400 });
        }

        if (coupon.forNewUser && !isNewUser) {
            return NextResponse.json({ success: false, message: 'Coupon valid only for new users' }, { status: 403 });
        }

        // Unbounded discount calculation: does not clamp at 0 or validate minimum order
        const discountAmount = (coupon.discount / 100) * totalPrice;
        const finalPrice = totalPrice - discountAmount;

        return NextResponse.json({
            success: true,
            coupon,
            discountAmount,
            finalPrice, // Can be negative or NaN if totalPrice is invalid
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
