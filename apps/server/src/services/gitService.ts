import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import { getContentDir } from "../utils/paths";

const git = simpleGit();

const getConfig = () => {
  const repoUrl = process.env.GIT_REPO_URL as string | undefined;
  const repoBranch = process.env.GIT_REPO_BRANCH || "master";
  const contentDir = getContentDir();

  if (!repoUrl) {
    throw new Error("Missing required environment variable: GIT_REPO_URL");
  }

  return {
    repoUrl,
    repoBranch,
    contentDir,
  };
};

export async function getRemoteHash() {
  try {
    const { repoUrl, repoBranch } = getConfig();
    const remoteHash = await git
      .silent(true)
      .listRemote([repoUrl, repoBranch])
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
    const { contentDir } = getConfig();
    const hash = await git.cwd(contentDir).revparse(["--short", "HEAD"]);
    return hash;
  } catch (error) {
    console.error("Error getting Git hash:", error);
    throw error;
  }
}

export async function isRepoCloned() {
  const { contentDir } = getConfig();
  return fs.existsSync(path.join(contentDir, ".git"));
}

export async function syncRepository() {
  let syncType = "cloned";
  try {
    const { repoUrl, repoBranch, contentDir } = getConfig();
    if (await isRepoCloned()) {
      console.info("Pulling latest changes from repository...");
      await git.cwd(contentDir).pull("origin", repoBranch);
      syncType = "updated";
    } else {
      console.info("Cloning repository...");
      await git.clone(repoUrl, contentDir);
    }
  } catch (error) {
    console.error("Error syncing repository:", error);
    throw error;
  }

  console.info(`Repository ${syncType} successfully.`);

  return {
    type: syncType,
    hash: await getHash(),
    // No more copying content images into the web build output.
    // The server now serves images directly from /content-assets.
    images: false,
  };
}
