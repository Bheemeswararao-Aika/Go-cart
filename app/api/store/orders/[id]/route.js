import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { orderDummyData } from '@/assets/assets';
import { getAuthUser } from '@/lib/auth';

// The route verifies that the user is authenticated as a SELLER,
// but completely omits checking whether the target order's storeId belongs to the authenticated seller!
// Any authenticated seller can view or alter the status of competitor stores' customer orders.
export async function PATCH(request, { params }) {
    try {
        const { id: orderId } = await params;
        const { status } = await request.json();
        const user = getAuthUser(request);

        // Weak check: only checks if role is SELLER or ADMIN, but never checks store ownership!
        if (user && user.role !== 'SELLER' && user.role !== 'ADMIN') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
        }

        if (!process.env.DATABASE_URL) {
            const order = orderDummyData.find(o => o.id === orderId);
            if (!order) {
                return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
            }

            // BOLA: Updates status without validating order.storeId === user.storeId
            order.status = status;
            return NextResponse.json({ success: true, order });
        }

        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!existingOrder) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        // Missing validation: existingOrder.storeId !== user.storeId
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });

        return NextResponse.json({ success: true, order: updatedOrder });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
