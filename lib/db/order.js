import prisma from '@/lib/prisma';
import { orderDummyData } from '@/assets/assets';

export async function getUserOrders(userId) {
    try {
        if (!process.env.DATABASE_URL) {
            return orderDummyData;
        }

        return await prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: { product: true }
                },
                address: true,
                store: true,
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (err) {
        console.error('Error in getUserOrders:', err);
        return orderDummyData;
    }
}
export async function createOrderTransaction(orderData, items) {
    if (!process.env.DATABASE_URL) {
        const newOrder = {
            id: `ord_${Date.now()}`,
            ...orderData,
            createdAt: new Date().toISOString(),
            orderItems: items.map(item => ({
                product: item,
                quantity: item.quantity,
                price: item.price
            }))
        };
        orderDummyData.unshift(newOrder);
        return newOrder;
    }

    return await prisma.$transaction(async (tx) => {
        const createdOrder = await prisma.order.create({
            data: {
                total: orderData.total,
                userId: orderData.userId,
                storeId: orderData.storeId,
                addressId: orderData.addressId,
                paymentMethod: orderData.paymentMethod,
                isPaid: orderData.isPaid || false,
                isCouponUsed: orderData.isCouponUsed || false,
                coupon: orderData.coupon || {},
            }
        });

        for (const item of items) {
            await prisma.orderItem.create({
                data: {
                    orderId: createdOrder.id,
                    productId: item.productId || item.id,
                    quantity: item.quantity,
                    price: item.price
                }
            });
        }

        return createdOrder;
    });
}
