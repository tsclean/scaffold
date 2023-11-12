import ora from "ora";
import yargs from "yargs";
import ts from "typescript";
import * as fs from "fs";

import { PATHS } from "../utils/paths";
import { EMOJIS } from "../utils/emojis";
import { MESSAGES } from "../utils/messages";
import { CommandUtils } from "./CommandUtils";
import { CONSTANTS } from "../utils/constants";
import { banner, errorMessage, executeCommand } from "../utils/helpers";
import { DatabaseTemplate } from "../templates/DatabaseTemplate";
import { AdaptersTemplate } from "../templates/AdaptersTemplate";
import { ModelsTemplate } from "../templates/ModelsTemplate";

export class AdapterCreateCommand implements yargs.CommandModule {
  command = "create:adapter-orm";
  describe = "Generate a new adapter for ORM";

  builder(args: yargs.Argv) {
    return args
      .option("name", {
        alias: "n",
        describe: "Name the adapter",
        demandOption: true
      })
      .option("orm", {
        alias: "orm",
        describe: "Orm",
        demandOption: true
      })
      .option("manager", {
        alias: "mn",
        describe: "Database manager",
        demandOption: true
      });
  }

  async handler(args: yargs.Arguments) {
    let spinner;

    try {
      setTimeout(
        async () => (spinner = ora(CONSTANTS.INSTALLING).start()),
        1000
      );

      const basePath = PATHS.BASE_PATH_ADAPTER(args.orm as string);
      const filename = PATHS.FILE_NAME_ADAPTER(
        args.name as string,
        args.manager as string,
        args.orm as string
      );

      // The path for the validation of the file input is made up.
      const path = `${basePath}${filename}`;

      const base = process.cwd();

      // Validate that the entity exists for importing into the ORM adapter.
      CommandUtils.readModelFiles(
        PATHS.PATH_MODELS_ENTITY(),
        args.name as string
      );

      // Validate that another manager is not implemented.
      CommandUtils.readManagerFiles(
        PATHS.PATH_MODELS_ORM(base, args.orm as string),
        args.manager as string
      );

      if (args.orm === CONSTANTS.MONGO || args.orm === CONSTANTS.SEQUELIZE) {
        // We validate if the file exists, to throw the exception.
        const fileExists = await CommandUtils.fileExists(path);

        // Throw message exception
        if (fileExists) throw MESSAGES.FILE_EXISTS(path);

        const filePath = PATHS.PATH_SINGLETON(base);
        
        // Adapter
        await CommandUtils.createFile(
          PATHS.PATH_ADAPTER(
            base,
            args.orm,
            args.name as string,
            args.manager as string
          ),
          AdaptersTemplate.getRepositoryAdapter(
            args.name as string,
            args.orm as string,
            args.manager as string
          )
        );

        // Model
        await CommandUtils.createFile(
          PATHS.PATH_MODEL(
            base,
            args.orm,
            args.name as string,
            args.manager as string
          ),
          ModelsTemplate.getModels(
            args.name as string,
            args.orm as string,
            args.manager as string
          )
        );
        if (args.orm === CONSTANTS.SEQUELIZE) {
          // Singletons for mysql, pg
          await CommandUtils.createFile(
            PATHS.PATH_SINGLETON_INSTANCES(base, args.manager as string),
            DatabaseTemplate.getMysqlAndPostgresSingleton(
              args.name as string,
              args.manager as string
            )
          );
        }

        if (args.orm === CONSTANTS.MONGO) {
          // Singletons for mongoose
          await CommandUtils.createFile(
            PATHS.PATH_SINGLETON_INSTANCES(
              base,
              args.manager as string,
              args.orm as string
            ),
            DatabaseTemplate.getMongooseSingleton(args.orm as string)
          );
        }

        // Dependencies
        const packageJsonContents = await CommandUtils.readFile(
          base + "/package.json"
        );
        await CommandUtils.createFile(
          base + "/package.json",
          AdapterCreateCommand.getPackageJson(
            packageJsonContents,
            args.orm as string,
            args.manager as string
          )
        );
        await executeCommand(CONSTANTS.NPM_INSTALL);

        // This message is only displayed in sequelize
        const env = args.manager
          ? `${EMOJIS.ROCKET} ${MESSAGES.CONFIG_ENV()}`
          : "";

        setTimeout(() => {
          spinner.succeed(CONSTANTS.INSTALLATION_COMPLETED);
          spinner.stopAndPersist({
            symbol: EMOJIS.ROCKET,
            text: `${MESSAGES.FILE_SUCCESS(CONSTANTS.ADAPTER, path)}
${env}`
          });
        }, 1000 * 5);
      } else {
        throw MESSAGES.ERROR_ORM(args.orm);
      }
    } catch (error) {
      errorMessage(error, CONSTANTS.ADAPTER);
    }
  }

  /**
   *
   * @protected
   */
  protected static generateProvider() {
    return `
export const adapters = [];

export const services = [];
        `;
  }

  /**
   *
   * @param dependencies
   * @param orm
   * @param manager
   * @private
   */
  private static getPackageJson(
    dependencies: string,
    orm: string,
    manager: string
  ) {
    const updatePackages = JSON.parse(dependencies);

    switch (orm) {
      case CONSTANTS.MONGO:
        updatePackages.dependencies["mongoose"] = "^8.0.0";
        break;
      case CONSTANTS.SEQUELIZE:
        updatePackages.dependencies["sequelize"] = "^6.33.0";
        updatePackages.dependencies["sequelize-typescript"] = "^2.1.5";
        updatePackages.devDependencies["@types/sequelize"] = "^4.28.17";
        switch (manager) {
          case CONSTANTS.MYSQL:
            updatePackages.dependencies["mysql2"] = "^3.6.3";
            break;
          case CONSTANTS.POSTGRES:
            updatePackages.dependencies["pg"] = "^8.11.3";
            updatePackages.dependencies["pg-hstore"] = "^2.3.4";
            break;
          default:
            break;
        }
    }

    return JSON.stringify(updatePackages, undefined, 3);
  }
}

/**
 * Método para incluir la instancia de conexión en el array singletonInitializers
 * en el archivo index.ts
 *
 * @param manager string
 * @param name string
 * @param orm string
 * @returns
 * ``` typescript
 * const singletonInitializers: Array<() => Promise<void>> = [
 *   async () => {
 *    const mysqlConfig = MysqlConfiguration.getInstance();
 *    await mysqlConfig.managerConnectionMysql();
 *  },
 * ];
 * ```
 */
function getCodeBlockSingleton(
  manager: string,
  name: string,
  orm: string
): string {
  const instance = manager === "mongoose" ? orm : name;
  console.log(instance);
  return `async () => {
      const ${manager}Config = ${instance}Configuration.getInstance();
      await ${manager}Config.managerConnection${instance}();
},`;
}

/**
 * Método para incluir los imports de las instancias, cuando se genera un ORM
 * en el archivo index.ts
 *
 * @param manager Nombre del gestor de base de datos (mysql, pg, mongoose)
 * @param orm Nombre del orm (sequelize, mongo)
 *
 * @returns
 * ``` typescript
 * import { MysqlConfiguration } from "@/application/config/mysql-instance";
 * ```
 */
function getCodeBlockImports(manager: string, orm: string): string {
  const nameCapitalize = CommandUtils.capitalizeString(manager as string);
  const instance = manager === "mongoose" ? orm : nameCapitalize;
  return `import { ${instance}Configuration } from "@/application/config/${manager}-instance";

`;
}

