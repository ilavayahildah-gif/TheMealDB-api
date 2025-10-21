import BaseRouter, { RouteConfig } from "../routes/baserouter";
import {AuthMiddleware, jwtAuth} from "../middleware/jwtauth.middleware";
import UserController from "../controllers/user.controller";
import router from "./meals.routes";

class UserRoutes extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            {
                // get user info
                method: "get",
                path: "/info", // api/user/info
                middlewares: [
                    AuthMiddleware.authenticateUser
                ],
                handler: UserController.getUser
            },
        ];
    }
}

export default new UserRoutes().router;