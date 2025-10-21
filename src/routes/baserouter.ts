// src/routes/router.ts
import express, {Router} from "express";

export interface RouteConfig {
    method: string;
    path: string;
    handler: any;
    middlewares?: any[];
}

export default abstract class BaseRouter {
    public router: Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    protected abstract routes(): RouteConfig[];

    private initializeRoutes(): void {
        const routes = this.routes();
        routes.forEach((route)=>{
            (this.router as any) [route.method](
                route.path,
                ...(route.middlewares || []),
                route.handler
            );
        });
    }
}