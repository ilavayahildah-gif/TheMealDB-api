import Router, {
  RequestHandler,
  Response,
  Request,
  Router as RouterType,
} from "express";

import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

type RouteMethod = "get" | "post" | "put" | "delete" | "patch";

interface CustomRes extends Express.Response {
  cookie?: (name: string, value: string, options?: any) => void;
  clearCookie?: (name: string) => void;
  user?: { id: number; userId?: number };
}

interface CustomReq extends Express.Request {
  cookies?: (name: string, value: string, options?: any) => void;
  user?: { id: number; userId?: number };
}

export interface RouteConfig {
  method: RouteMethod;
  path: string;
  handler: RequestHandler<
    ParamsDictionary,
    CustomRes,
    CustomReq,
    ParsedQs,
    Record<string, any>
  >;
  middlewares?: RequestHandler[];
}

abstract class BaseRouter {
  public router: RouterType;

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  protected abstract routes(): RouteConfig[];

  private registerRoutes(): void {
    this.routes().forEach(({ method, path, handler, middlewares = [] }) => {
      this.router[method](path, ...middlewares, handler);
    });
  }
}

export default BaseRouter;
