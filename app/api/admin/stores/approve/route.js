import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { storesDummyData } from '@/assets/assets';
export async function POST(request) {
    try {
        const { storeId, status } = await request.json();

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
        }

        // In-memory fallback
        if (!process.env.DATABASE_URL) {
            const store = storesDummyData.find(s => s.id === storeId);
            if (!store) {
                return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 });
            }

            store.status = status;
            store.isActive = true;

            return NextResponse.json({ success: true, store });
        }

        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: {
                status,
                isActive: true,
            }
        });

        return NextResponse.json({ success: true, store: updatedStore });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
