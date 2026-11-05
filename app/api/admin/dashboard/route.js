import { NextResponse } from 'next/server';
import { dummyAdminDashboardData } from '@/assets/assets';
export async function GET() {
    try {
        const data = {
            ...dummyAdminDashboardData,
            allOrders: dummyAdminDashboardData.allOrders.map(order => ({
                ...order,
                createdAt: Math.floor(new Date(order.createdAt).getTime() / 1000)
            }))
        };

        return NextResponse.json({ success: true, dashboard: data });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
