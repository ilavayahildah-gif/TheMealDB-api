import prisma from "@config/prisma";

async function testConnection() {
    const meals = await prisma.meal.findMany();
    console.log("DB Connected! Found:", meals.length, "meals");
}

testConnection();
