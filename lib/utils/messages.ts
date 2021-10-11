import chalk from "chalk";
import {EMOJIS} from "./emojis";

export const MESSAGES = {
    PROJECT_SUCCESS: (basePath) => chalk.green("Project created inside " + chalk.blue(basePath) + " directory."),
    PROJECT_EXISTS: (basePath) => `Project ${chalk.blue(basePath)} already exists`,
    FILE_SUCCESS: (type, path) => chalk.green(`${type} ${chalk.blue(path)} has been created successfully`),
    REPOSITORY_SUCCESS: (pathRepository) => " " + EMOJIS.ROCKET + " " + chalk.green(`Repository ${chalk.blue(pathRepository)} has been created successfully.\n`),
    PROVIDER_SUCCESS: (pathAdapter) => " " + EMOJIS.ROCKET + " " + chalk.green(`Provider ${chalk.blue(pathAdapter)} has been created successfully.\n`),
    UPDATE_FILE_SUCCESS: (base) => EMOJIS.ROCKET + " " + chalk.blue(`File ${chalk.green(base + "/src/application/server.ts")} has been updated successfully.`),
    FILE_EXISTS: (path) => `${EMOJIS.NO_ENTRY} File ${chalk.blue(path)} already exists`,
    CONFIG_ENV: () => `${chalk.green(`Continue setting the environment variables in the ${chalk.blue(".env")} file`)}`,
    ERROR_HANDLER: (message) => `${chalk.black.bgRedBright(message)}`,
}
