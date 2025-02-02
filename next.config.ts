module.exports = {
  typescript: {
    // WARNING: This allows production builds to complete even if there are type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if there are lint errors.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/pasaydan/com",
        permanent: true, // This makes it a permanent 301 redirect
      },
    ];
  },
};
