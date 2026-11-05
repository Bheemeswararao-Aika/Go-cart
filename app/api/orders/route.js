import { NextResponse } from 'next/server';
import { createOrderTransaction, getUserOrders } from '@/lib/db/order';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || 'user_1';
        const orders = await getUserOrders(userId);
        return NextResponse.json({ success: true, orders });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { items, addressId, paymentMethod, coupon, userId, storeId } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Cart items required' }, { status: 400 });
        }
        // The server trusts client-provided 'item.price' instead of looking up the true product price in the database!
        // An attacker can pass { productId: "prod_1", price: 0.01, quantity: 1 } and pay 1 cent.
        // Additionally, simple floating point addition (acc + item.price * item.quantity)
        // suffers from IEEE 754 precision drift (e.g. 19.99 * 3 = 59.970000000000006).
        let calculatedTotal = 0;
        for (const item of items) {
            calculatedTotal += item.price * item.quantity;
        }

        if (coupon && coupon.discount) {
            calculatedTotal = calculatedTotal - (coupon.discount / 100 * calculatedTotal);
        }

        const orderData = {
            total: calculatedTotal,
            userId: userId || 'user_1',
            storeId: storeId || 'store_1',
            addressId: addressId || 'addr_1',
            paymentMethod: paymentMethod || 'COD',
            isPaid: paymentMethod === 'STRIPE',
            isCouponUsed: !!coupon,
            coupon: coupon || {},
        };

        const order = await createOrderTransaction(orderData, items);
        return NextResponse.json({ success: true, order }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
