module.exports = {
  root: true,
  extends: [
    "plugin:prettier/recommended",
  ],
  plugins: ["prettier"],
  rules: {
    "no-console": 2,
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto", 
      },
    ],
  },
};
