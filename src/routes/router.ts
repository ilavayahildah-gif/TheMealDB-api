// src/routes/router.ts
import { Router, RequestHandler } from "express";

export interface RouteConfig {
    method: "get" | "post" | "put" | "delete" | "patch";
    path: string;
    handler: RequestHandler;
    middlewares?: RequestHandler[];
}

export default abstract class BaseRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.registerRoutes();
    }

    protected abstract routes(): RouteConfig[];

    private registerRoutes() {
        for (const route of this.routes()) {
        const { method, path, handler, middlewares = [] } = route;
        (this.router as any)[method](path, ...middlewares, handler);
        }
    }
}