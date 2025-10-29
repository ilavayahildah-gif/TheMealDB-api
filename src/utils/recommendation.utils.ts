import prisma from "@config/prisma";

export const getRecommendedMeals = async (productId: string) => {
    const meal = await prisma.meal.findUnique({ where: { id: MealController } });
    if (!meal) return [];

    // Fetch similar products in same category
    const related = await prisma.meal.findMany({
        where: {
        name: meal.name,
        id: { not: meal.id },
        verified: true,
        },
        take: 5,
    });

    return related;
};
