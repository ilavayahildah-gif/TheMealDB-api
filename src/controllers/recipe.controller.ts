import { Response } from "express";
import { PrismaClient } from "@prisma/client/edge";
import { AuthRequest } from "../middleware/jwtauth.middleware";
import { error } from "console";
import { success } from "zod";

const prisma=new PrismaClient();

export class RecipeController{
    //Generate a recipe baed on ingredients
    static async generateRecipe(req:AuthRequest, res:Response){
        const user= req.user;
        const {ingredients}= req.body;

        try{
            //---step1: Auto-generate a sample recipe
            const recipeName='Delicious ${ingredients[0]} Mix';
            const instructions= 'To make ${recipeName}, combine ${ingredients.join(",")} and cook until ready.';

            //--step2: save recipe to database
            const recipe=await prisma.recipe.create({
                data:{
                    userId: user.id,
                    name:recipeName,
                    ingredients:ingredients.join(","),
                    instructions,
                },
            });

            res.status(201).json({
                message:"Recipe generated successfully",
                recipe,
            });
        } catch (error:any){
            console.error("Database error:", error);
            res.status(500).json({
                error:"Database error",
                details:error.message || error,
            });
        }
    }

    //Get all recipes by logged-in user
    static async getUserRecipes(req:AuthRequest, res:Response){
        const user=req.user;

        try{
            const recipes=await prisma.recipe.findMany({
                where:{userId:user.id},
                orderBy:{createdAt:"desc"},
            });

            res.json(recipes);
        } catch (error:any){
            res.status(500).json({
                error:"Database error",
                details:error.message || error,
            });
        }
    }

    //Get single recipe by Id
    static async getRecipeById(req:AuthRequest,res:Response){
        const user=req.user;
        const id=Number(req.params.id);

        try{
            const recipe=await prisma.recipe.findFirst({
                where:{id, userId: user.id}
            });

            if (!recipe) return res.status(404).json({error:"Recipe not found"});

            res.json(recipe);
        } catch (error:any){
            res.status(500).json({
                error:"Database error",
                details:error.message || error,
            });
        }
    }

    //Delete a recipe
    static async deleteRecipe(req: AuthRequest,res:Response){
        const user=req.user;
        const id=Number(req.params.id);

        try{
            const deleted=await prisma.recipe.deleteMany({
                where:{id, userId: user.id},
            });

            if (deleted.count===0)
                return res.status(404).json({error:"Recipe not found or not owned by user"});

            res.json({success:true});
        } catch (error:any){
            res.status(500).json({
                error: "Database error",
                details: error.message || error,
            });
        }
    }
}