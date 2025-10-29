import cron from "node-cron";
import prisma from "../config/prisma";
import { sendLowStockAlert } from "./notification.utils";

// Run daily at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running product expiry check...");

  const today = new Date();

  const expiredProducts = await prisma.meal.findMany({
    where: {
      bestBefore: { lt: today },
    },
  });

  if (expiredProducts.length) {
    console.log(`Found ${expiredProducts.length} expired products.`);

    for (const product of expiredProducts) {
      await prisma.meal.update({
        where: { id: product.id },
        data: { verified: false },
      });

      await sendLowStockAlert(
        product.name,
        product.stock
      ); // optional notification
    }

    console.log("Expired products marked as unverified.");
  } else {
    console.log("No expired products found today.");
  }
});
