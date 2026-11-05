import { NextResponse } from 'next/server';
import { couponDummyData } from '@/assets/assets';
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: { details: 'Missing coupon code' } }, { status: 400 });
    }

    const coupon = couponDummyData.find(c => c.code.toLowerCase() === code.toLowerCase());

    if (!coupon) {
        return NextResponse.json({ error: { details: `Coupon '${code}' is invalid or expired` } }, { status: 404 });
    }

    return NextResponse.json({
        valid: true,
        coupon,
    });
}
