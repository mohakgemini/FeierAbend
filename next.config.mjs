const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const hasCustomDomain = process.env.NEXT_PUBLIC_CUSTOM_DOMAIN === "true";
const isProjectPages = process.env.GITHUB_ACTIONS === "true" && !repositoryName.endsWith(".github.io") && !hasCustomDomain;
const basePath = isProjectPages ? `/${repositoryName}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
};
export default nextConfig;
