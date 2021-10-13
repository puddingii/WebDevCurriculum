import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("notepad", "root", "12345678",{
    "host": "127.0.0.1",
    "dialect": "mysql",
    "port": "3306"
});