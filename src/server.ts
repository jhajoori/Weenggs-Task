import express, { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { AppDataSource } from "./datasource";
import { mainRouter } from "./router";
dotenv.config();


AppDataSource.initialize()
  .then(() => {
    console.log("MySql Database connected!");
    const server = express();

    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    server.use("/api-docs", swaggerUi.serve);
    server.get("/api-docs", swaggerUi.setup(require("./swagger.json")));

    server.use("/api", mainRouter);

    server.get("/", (req: Request, res: Response) => {
      return res.status(200).json({ message: "Welcome!" });
    });

    //Default Error Handler
    server.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof SyntaxError) {
        // Handle other errors
        console.error(err.stack);
        res.status(500).send("Internal Server Error!!!");
      }
    });

    server.listen(process.env.PORT || 8080, () => {
      console.log("Server started on 8080!");
    });
  })
  .catch((err) => console.log("Error while connecting DB"));
