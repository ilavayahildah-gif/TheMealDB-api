import { z } from "zod";

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[@$!%*?&]/, "Password must include at least one special character");

const nameSchema = z
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

    const first_name = nameSchema;
    const last_name = nameSchema;

    //login schema
const login = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
    });


    //resetPassword schema
const resetPassword = z
    .object({
        new_password: passwordSchema,
        confirm_new_password: z
        .string()
        .min(1, "Password confirmation is required"),
    })
    .refine((data) => data.new_password === data.confirm_new_password, {
        path: ["confirm_new_password"],
        message: "Passwords do not match",
    });

    //profile schema
    const profile=z
    .object({
        id:z.string().min(1, "User id is required"),
        name:z.string().min(1,"User name is required"),
        email:z.string().trim().min(1,"Email is required").email("Invalid email format"),
        password: z.string().min(1, "Password is required"),
    })

//forgot_password schema
const forgot_Password = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Invalid email format"),
    });

//registration schema
const register = z
    .object({
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email format"),
        password: passwordSchema,
        confirm_password: z.string().min(1, "Password confirmation is required"),
    })
    .refine((data) => data.password === data.confirm_password, {
        path: ["confirm_password"],
        message: "Passwords do not match",
    });

    //order schema
    const order = z
    .object({
        mealId: z.number().int().positive().optional(),
        recipeId: z.number().int().positive().optional(),
        quantity: z.number().int().positive("Quantity must be greater than 0"),
    })
    .refine((data) => data.mealId || data.recipeId, {
        message: "Either mealId or recipeId is required",
        path: ["mealId"], // attaches the error to mealId field
    });

    //recipe schema
    const recipe = z.
    object({
        name: z.string().min(1, "Recipe name is required"),
        description: z.string().min(1, "Recipe description is required"),
        ingredients: z.string().min(1, "Ingredients are required"),
        instructions: z.string().min(1, "Instructions are required"),
        stock: z.number().int().min(0, "Stock must be zero or a positive number").optional(),
});


const authSchema = {
    register,
    login,
    profile,
    resetPassword,
    forgot_Password,
    order,
    recipe,
    };

export default authSchema;
