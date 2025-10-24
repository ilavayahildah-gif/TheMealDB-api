import path from "path";
import zod, { email } from "zod";

import z from "zod";

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[@$!%*?&]/, "Password must include at least one special character");

const usernameSchema = z
    .string()
    .min(6, "Username must be at least 6 characters long")
    .max(20, "Username must not exceed 20 characters")
    .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters,numbers,hyphen, and underscores"
    )
    .refine((value: string) => !/^\d+$/.test(value), {
        message: "Username cannot be only numbers",
    })
    .refine((value: string) => !/[@$!%*?&]/.test(value), {
        message: "Username cannot contain speciaL characters like @$!%*?&",
    });

const login = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
    });

const resetPassword = z
    .object({
        new_password: passwordSchema,
        confirm_new_password: z
        .string()
        .min(1, "Password confirmation is required"),
    })
    .refine((data: any) => data.new_password === data.confirm_new_password, {
        path: ["confirm_new_password"],
        message: "Passwords do not match",
    });

    const profile=z
    .object({
        id:z.string().min(1, "User id is required"),
        name:z.string().min(1,"User name is required"),
        email:z.string().trim().min(1,"Email is required").email("Invalid email format"),
        password: z.string().min(1, "Password is required"),
    })
const forgot_Password = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Invalid email format"),
    });

const register = z
    .object({
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email format"),
        password: passwordSchema,
        confirm_password: z.string().min(1, "Password confirmation is required"),
    })
    .refine((data: any) => data.password === data.confirm_password, {
        path: ["confirm_password"],
        message: "Passwords do not match",
    });

    const order=z.object({

    })

const authSchema = {
    register,
    login,
    profile,
    resetPassword,
    forgot_Password,
    order,
    };

export default authSchema;
