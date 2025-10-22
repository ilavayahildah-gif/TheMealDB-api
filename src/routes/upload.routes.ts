import BaseRouter, { RouteConfig } from "../routes/router";

import {upload} from "../middleware/upload.middleware";
import UploadController from "../controllers/upload.controller";
import {AuthMiddleware} from "../middleware/jwtauth.middleware";
import express from 'express';

const router = express.Router();

router.get("/download/:filename", UploadController.downloadFile);
class UploadRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "post",
        path: "/single",
        middlewares: [
          upload.single("file"),
        ],
        handler: UploadController.uploadSingleFile,
      },
      {
        method: "post",
        path: "/multiple",
        middlewares: [
          upload.array("files", 5),
        ],
        handler: UploadController.uploadMultipleFiles,
      },
    ];
  }
}

export default new UploadRouter().router;
