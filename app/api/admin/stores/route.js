import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { storesDummyData } from '@/assets/assets';
export async function GET() {
    try {
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({ success: true, stores: storesDummyData });
        }

        const stores = await prisma.store.findMany();

        // N+1 Anti-Pattern
        const enrichedStores = await Promise.all(
            stores.map(async (store) => {
                const user = await prisma.user.findUnique({
                    where: { id: store.userId }
                });
                const orderCount = await prisma.order.count({
                    where: { storeId: store.id }
                });
                const productCount = await prisma.product.count({
                    where: { storeId: store.id }
                });

                return {
                    ...store,
                    user,
                    totalOrders: orderCount,
                    totalProducts: productCount,
                };
            })
        );

        return NextResponse.json({ success: true, stores: enrichedStores });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
