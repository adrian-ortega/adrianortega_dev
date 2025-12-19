import type { Request, Response } from "express";
import { getHash, isRepoCloned, syncRepository } from "../services/gitService";

export async function sync(_req: Request, res: Response) {
  return res.json({
    sync: await syncRepository()
  })
}

export async function showSyncStatus(_req: Request, res: Response) {
  const cloned = await isRepoCloned();
  return res.json({
    cloned,
    hash: cloned ? await getHash() : null,
  })
}
