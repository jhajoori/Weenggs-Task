import { DataSource } from "typeorm";
import { Task } from "./entity/task.entity";
import { User } from "./entity/user.entity";
import * as dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
    type : "mysql",
    host : `${process.env.DB_HOST}`,
    username :`${process.env.DB_USERNAME}`,
    password : `${process.env.DB_PASSWORD}`,
    database : `${process.env.DB_NAME}`,
    entities : [ 
        Task,
        User
    ],
    synchronize :true,
    logging : false,
    migrations : [],
    subscribers : []
})