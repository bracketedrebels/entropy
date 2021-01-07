module.exports = {
  projects: {
    app: {
      schema: ["static/schema.graphql"],
      documents: ["**/*.{graphql,js,ts,jsx,tsx}"],
      extensions: {
        languageService: {
          useSchemaFileDefinitions: true,
        },
      },
    },
  },
};
