import nodemailer from "nodemailer";

export const sendLowStockAlert = async (productName: string, stock: number) => {
    if (stock < 10) {
        // Example email setup
        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        });

        await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: "admin@themealdb.com",
        subject: "Low Stock Alert",
        text: `${productName} is running low (only ${stock} left). Please restock.`,
        });
    }
};
