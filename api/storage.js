import fs from "node:fs";
import path from "node:path";

const isVercelDeployment = Boolean(
  process.env.VERCEL || process.env.VERCEL_ENV || process.env.VERCEL_URL,
);
const runtimeDataDir = path.join("/tmp", "portfolio-data");

const bundledCandidates = (fileName) => [
  path.join(process.cwd(), "server", "data", fileName),
  path.join(process.cwd(), "data", fileName),
];

export const resolveJsonFilePath = (fileName) => {
  if (!isVercelDeployment) {
    for (const candidate of bundledCandidates(fileName)) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }

    return bundledCandidates(fileName)[0];
  }

  const runtimeFile = path.join(runtimeDataDir, fileName);
  if (fs.existsSync(runtimeFile)) {
    return runtimeFile;
  }

  const seedFile = bundledCandidates(fileName).find((candidate) =>
    fs.existsSync(candidate),
  );

  fs.mkdirSync(runtimeDataDir, { recursive: true });

  if (seedFile) {
    try {
      fs.copyFileSync(seedFile, runtimeFile);
    } catch {
      return seedFile;
    }

    if (fs.existsSync(runtimeFile)) {
      return runtimeFile;
    }
  }

  return runtimeFile;
};
