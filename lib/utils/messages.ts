import chalk from "chalk";
import { EMOJIS } from "./emojis";

export const MESSAGES = {
  PROJECT_SUCCESS: (basePath) =>
    chalk.green(
      "Project created inside " + chalk.blue(basePath) + " directory."
    ),
  PROJECT_EXISTS: (basePath) =>
    `Project ${chalk.blue(basePath)} already exists`,
  FILE_SUCCESS: (type, path) =>
    chalk.green(`${type} ${chalk.blue(path)} has been created successfully`),
  REPOSITORY_SUCCESS: (pathRepository) =>
    " " +
    EMOJIS.ROCKET +
    " " +
    chalk.green(
      `Repository ${chalk.blue(
        pathRepository
      )} has been created successfully.\n`
    ),
  PROVIDER_SUCCESS: (pathAdapter) =>
    " " +
    EMOJIS.ROCKET +
    " " +
    chalk.green(
      `Provider ${chalk.blue(pathAdapter)} has been created successfully.\n`
    ),
  UPDATE_FILE_SUCCESS: (base) =>
    EMOJIS.ROCKET +
    " " +
    chalk.blue(
      `File ${chalk.green(
        base + "/src/application/server.ts"
      )} has been updated successfully.`
    ),
  FILE_EXISTS: (path) =>
    `${EMOJIS.NO_ENTRY} File ${chalk.blue(path)} already exists`,
  CONFIG_ENV: () =>
    `${chalk.green(
      `Continue setting the environment variables in the ${chalk.blue(
        ".env"
      )} file`
    )}`,
  ERROR_HANDLER: (message) => `${chalk.black.bgRedBright(message)}`,
  ERROR_MODEL: (name) =>
    `${EMOJIS.NO_ENTRY} First you must create the entity ${chalk.red(
      name
    )} in order to be imported into the file.`,
  ERROR_MANAGER: (manager, args) =>
    `${EMOJIS.NO_ENTRY} The manager ${chalk.red(
      manager
    )} can not be implemented because it already has the implementation of ${chalk.blue(
      args
    )}`,
  ERROR_INTERFACE: (path) =>
    `${EMOJIS.NO_ENTRY} Path ${chalk.blue(
      path
    )} does not correspond to models, service the infra.`,
  ERROR_ORM: (orm) =>
    `${EMOJIS.NO_ENTRY} ORM ${chalk.blue(
      orm
    )} does not correspond to mongoose the sequelize.`,
  ERROR_DATABASE: (manager) =>
    `${EMOJIS.NO_ENTRY} Database manager ${chalk.blue(
      manager
    )} does not correspond to mysql the postgres.`,
  MESSAGE_ERROR_HANDLER: `${chalk.white(
    "The interface to connect the domain layer with the infrastructure layer has not been created."
  )}`,
  ERROR_UPDATE_INDEX: (filePath: string) =>
    `${EMOJIS.NO_ENTRY} SingletonInitializers array not found in ${chalk.red(
      filePath
    )} this configuration must exist in order to create the Adapter. \n
    Example: export const singletonInitializers: Array<() => Promise<void>> = []; \n
    if it does not exist, please include it in the file ${chalk.blue(
      filePath
    )}`,
  UPDATE_INDEX_SUCCESSFULLY: (filePath: string) =>
    `${chalk.green(
      `The file ${chalk.blue(`${filePath}`)} was updated correctly`
    )}`
};
