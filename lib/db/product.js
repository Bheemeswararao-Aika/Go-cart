import prisma from '@/lib/prisma';
import { productDummyData } from '@/assets/assets';

export async function getAllProducts({ search, category } = {}) {
    try {
        if (!process.env.DATABASE_URL) {
            let list = [...productDummyData];
            if (search) {
                list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
            }
            if (category) {
                list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
            }
            return list;
        }

        const where = {};
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        if (category) {
            where.category = { equals: category, mode: 'insensitive' };
        }

        return await prisma.product.findMany({
            where,
            include: {
                store: true,
                rating: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    } catch (err) {
        console.error('Database query error in getAllProducts:', err);
        return productDummyData;
    }
}

export async function getProductById(id) {
    try {
        if (!process.env.DATABASE_URL) {
            return productDummyData.find(p => p.id === id) || null;
        }

        return await prisma.product.findUnique({
            where: { id },
            include: {
                store: true,
                rating: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    } catch (err) {
        console.error('Database query error in getProductById:', err);
        return productDummyData.find(p => p.id === id) || null;
    }
}
export async function deleteProductById(id) {
    if (!process.env.DATABASE_URL) {
        const index = productDummyData.findIndex(p => p.id === id);
        if (index !== -1) productDummyData.splice(index, 1);
        return { success: true };
    }

    // Direct deletion without handling dependent orderItems foreign key constraint
    return await prisma.product.delete({
        where: { id },
    });
}
