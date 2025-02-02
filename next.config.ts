module.exports = {
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
