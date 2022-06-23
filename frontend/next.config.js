/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ['.'], // Run ESLint on all folders within /src. Used by 'yarn lint' command
  },
};

module.exports = nextConfig;
