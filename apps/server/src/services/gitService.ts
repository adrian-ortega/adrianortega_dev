import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import { copyDirectory } from "../utils/files";
import { getContentDir, getPublicDir } from "../utils/paths";

const git = simpleGit();
const GIT_REPO_URL = process.env.GIT_REPO_URL as string;
const GIT_REPO_BRANCH = process.env.GIT_REPO_BRANCH || "main";
const GIT_CONTENT_DIR = getContentDir();

if (!GIT_REPO_URL || !GIT_CONTENT_DIR) {
  throw new Error(
    "Missing required environment variables (GIT_REPO_URL or GIT_CONTENT_DIR)."
  );
}

export async function getRemoteHash() {
  try {
    const remoteHash = await git
      .silent(true)
      .listRemote([GIT_REPO_URL, GIT_REPO_BRANCH])
      .then((result) => {
        const lines = result.trim().split("\n");
        if (lines.length > 0) {
          const parts = lines[0].trim().split(/\s+/);
          return parts[0].slice(0, 7);
        }
        return null;
      });
    return remoteHash;
  } catch (error) {
    console.error("Error getting remote Git hash:", error);
    throw error;
  }
}

export async function getHash() {
  try {
    const hash = await git.cwd(GIT_CONTENT_DIR).revparse(["--short", "HEAD"]);
    return hash;
  } catch (error) {
    console.error("Error getting Git hash:", error);
    throw error;
  }
}

export async function isRepoCloned() {
  return fs.existsSync(path.join(GIT_CONTENT_DIR, ".git"));
}

export async function syncRepository() {
  let syncType = "cloned";
  try {
    if (await isRepoCloned()) {
      console.info("Pulling latest changes from repository...");
      await git.cwd(GIT_CONTENT_DIR).pull("origin", GIT_REPO_BRANCH);
      syncType = "updated";
    } else {
      console.info("Cloning repository...");
      await git.clone(GIT_REPO_URL, GIT_CONTENT_DIR);
    }
  } catch (error) {
    console.error("Error syncing repository:", error);
    throw error;
  }

  console.info(`Repository ${syncType} successfully.`);

  return {
    type: syncType,
    hash: await getHash(),
    images: await syncImages(),
  };
}

export async function syncImages() {
  const assetsDir = path.join(GIT_CONTENT_DIR, "assets");
  const publicAssetsDir = path.join(getPublicDir(), "assets");

  if (!fs.existsSync(assetsDir)) {
    console.info("No assets directory found.");
    return false;
  }

  if (fs.existsSync(publicAssetsDir)) {
    fs.rmSync(publicAssetsDir, { recursive: true });
  }

  copyDirectory(assetsDir, publicAssetsDir);
  console.info("Images synchronized successfully.");

  return true;
}
