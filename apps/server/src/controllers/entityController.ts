import type { Request, Response, NextFunction } from "express";
import type { MdEntity } from "../../../shared/types";

type FetchBySlugFn<T extends MdEntity> = (slug: string) => Promise<T | null>;

/**
 * Factory that returns a standard Express handler for GET /:slug routes.
 * All single-entity slug controllers share the same shape:
 *   - validate slug
 *   - call the service
 *   - 404 on null
 *   - forward unexpected errors
 */
export function makeSlugController<T extends MdEntity>(
  fetchFn: FetchBySlugFn<T>,
  entityLabel: string,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = String(req.params.slug || "").trim();
      if (!slug) {
        const err: any = new Error(`Missing slug`);
        err.status = 400;
        throw err;
      }
      const entity = await fetchFn(slug);
      if (!entity) {
        return res.status(404).json({ error: `${entityLabel} not found` });
      }
      return res.json(entity);
    } catch (e) {
      if ((e as Error).message?.toLowerCase().includes("not found")) {
        return res.status(404).json({ error: `${entityLabel} not found` });
      }
      return next(e);
    }
  };
}
