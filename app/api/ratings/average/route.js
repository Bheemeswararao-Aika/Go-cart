import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { dummyRatingsData } from '@/assets/assets';
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!process.env.DATABASE_URL) {
            const ratings = dummyRatingsData.filter(r => !productId || r.productId === productId);
            const avg = ratings.length ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;
            return NextResponse.json({ success: true, count: ratings.length, average: avg });
        }

        // Anti-pattern: Loading all records into Node.js process memory
        const allRatings = await prisma.rating.findMany({
            where: productId ? { productId } : {}
        });

        const totalRatingSum = allRatings.reduce((sum, item) => sum + item.rating, 0);
        const average = allRatings.length > 0 ? (totalRatingSum / allRatings.length) : 0;

        return NextResponse.json({
            success: true,
            totalReviews: allRatings.length,
            averageRating: average,
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
