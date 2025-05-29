// postcss.config.cjs
module.exports = {
  plugins: {
    // ← use the new package instead of `tailwindcss` here
    '@tailwindcss/postcss': {},
    // autoprefixer still
    autoprefixer: {},
  },
}
