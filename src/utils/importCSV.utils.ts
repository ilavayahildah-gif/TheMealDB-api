import fs from "fs";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface MealCSV {
    name: string;
    description: string;
    price: string;
    verified: string;
}

async function importCSV() {
    const results: MealCSV[] = [];

    fs.createReadStream("meals.csv")
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
        for (const row of results) {
            await prisma.meal.create({
            data: {
            name: row.name,
            description: row.description,
            price: parseFloat(row.price),
            verified: row.verified.toLowerCase() === "true",
        },
    });
}

        console.log("CSV data successfully imported to database!");
        await prisma.$disconnect();
    });
}

importCSV().catch((err) => {
    console.error("Error importing CSV:", err);
    prisma.$disconnect();
});
