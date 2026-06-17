import { Router } from "express";
import { healthRouter } from "./health";
import { pagesRouter } from "./pages";
import { postsRouter } from "./posts";
import { widgetsRouter } from "./widgets";
import { sidebarsRouter } from "./sidebars";
import { notificationsRouter } from "./notifications";
import { tagsRouter } from "./tags";

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/pages', pagesRouter);
apiRouter.use('/tags', tagsRouter);
apiRouter.use('/sidebars', sidebarsRouter);
apiRouter.use('/notifications', notificationsRouter);
apiRouter.use('/widgets', widgetsRouter);
