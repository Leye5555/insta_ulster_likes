const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { version } = require("../../package.json");
const logger = require("./logger");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Instagram Clone API",
      version,
      description: "Instagram Clone API",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
  basePath: "/v1",
};

const specs = swaggerJsDoc(options);

function swaggerDocs(app, port) {
  // swagger page
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  // swagger json
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });

  logger.info(`Docs available at http://localhost:${port}/api-docs`);
}

module.exports = { specs, swaggerUi, swaggerDocs };
