import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { dummyUserData } from '@/assets/assets';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email } = body;

        // Mock authentication for demonstration / testing
        const user = {
            id: dummyUserData.id,
            email: email || dummyUserData.email,
            name: dummyUserData.name,
            role: email?.includes('admin') ? 'ADMIN' : email?.includes('seller') ? 'SELLER' : 'BUYER',
            storeId: 'cmemkqnzm000htat8u7n8cpte',
        };

        const token = signToken(user);

        return NextResponse.json({
            success: true,
            user,
            token,
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
