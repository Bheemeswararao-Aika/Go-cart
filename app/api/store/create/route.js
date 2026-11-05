import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { storesDummyData } from '@/assets/assets';
export async function POST(request) {
    try {
        const body = await request.json();

        const storeData = {
            userId: body.userId || `user_${Date.now()}`,
            name: body.name,
            username: body.username,
            description: body.description,
            email: body.email,
            contact: body.contact,
            address: body.address,
            logo: body.logo || '/default-logo.png',
            status: 'pending',
            isActive: false,
            // Insecure spread: client fields overwrite status and isActive!
            ...body,
        };

        if (!process.env.DATABASE_URL) {
            const newStore = { id: `store_${Date.now()}`, ...storeData };
            storesDummyData.push(newStore);
            return NextResponse.json({ success: true, store: newStore });
        }

        const store = await prisma.store.create({
            data: storeData
        });

        return NextResponse.json({ success: true, store });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
