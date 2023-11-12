import { CommandUtils } from "../commands/CommandUtils";

/**
 * Clase para generar instancias de conexión a bases de datos con el patrón singletón
 * 
 * @class DatabaseTemplate
 * @author John Piedrahita
 * @access public
 * @version 1.0.0
 */
export class DatabaseTemplate {

  /**
   * Método para generar una instancia de conexión para Mongo con el patrón Singletón
   * 
   * @param orm string mongo
   * @returns
   * ```typescript
   * import { connect, set } from "mongoose";
   * import { Logger } from "@tsclean/core";
   * import { MONGODB_URI } from "@/application/config/environment";
   *
   * export class MongoConfiguration {
   *   private logger: Logger;
   *   private static instance: MongoConfiguration;
   *
   *   private constructor() {
   *     this.logger = new Logger(MongoConfiguration.name);
   *   }
   *
   *   public static getInstance(): MongoConfiguration {
   *      if (!this.instance) {
   *          this.instance = new MongoConfiguration();
   *      }
   *      return this.instance;
   *   }
   *
   *   public async managerConnectionMongo(): Promise<void> {
   *     set("strictQuery", true);
   *
   *     try {
   *        await connect(MONGODB_URI);
   *        this.logger.log(`Connection successfully to database of Mongo: ${MONGODB_URI}`);
   *     } catch (error) {
   *        this.logger.error("Failed to connect to MongoDB", error);
   *     }
   *   }
   * }
   * ```
   */
  static getMongooseSingleton(orm: string): string {
    const nameCapitalize = CommandUtils.capitalizeString(orm);
    return `import { connect, set } from "mongoose";
import { Logger } from "@tsclean/core";
import { MONGODB_URI } from "@/application/config/environment";

export class ${nameCapitalize}Configuration {
    private logger: Logger;
    private static instance: ${nameCapitalize}Configuration;

    private constructor() {
        this.logger = new Logger(${nameCapitalize}Configuration.name);
    }

    public static getInstance(): ${nameCapitalize}Configuration {
        if (!this.instance) {
            this.instance = new ${nameCapitalize}Configuration();
        }
        return this.instance;
    }

    public async managerConnection${nameCapitalize}(): Promise<void> {
        set("strictQuery", true);

        try {
            await connect(MONGODB_URI);
            this.logger.log(\`Connection successfully to database of Mongo: \${MONGODB_URI}\`);
        } catch (error) {
            this.logger.error("Failed to connect to MongoDB", error);
        }
    }
}
`;
  }

  /**
   * Metodo que generar una instancia con el patrón Singleto para las instancias de bases de datos relacionales
   *
   * @param name Nombre del modelo
   * @param manager Gestor de base de datos (mysql, pg, mongoose)
   * @returns
   * ```typescript
   * import { Sequelize } from "sequelize-typescript";

    import { Logger } from "@tsclean/core";
    import { CONFIG_MYSQL } from "@/application/config/environment";
    import { UserModelMysql } from "@/infrastructure/driven-adapters/adapters/orm/sequelize/models/user-mysql";

    export class MysqlConfiguration {
      private logger: Logger;
      private static instance: MysqlConfiguration;

      public sequelize: Sequelize;

      private constructor() {
        this.logger = new Logger(MysqlConfiguration.name);
        this.sequelize = new Sequelize(
          CONFIG_MYSQL.database,
          CONFIG_MYSQL.user,
          CONFIG_MYSQL.password,
          {
            host: CONFIG_MYSQL.host,
            dialect: "mysql",
            // This array contains all the system models that are used for Mysql.
            models: [
              UserModelMysql
            ]
          }
        );
      }

      public static getInstance(): MysqlConfiguration {
        if (!MysqlConfiguration.instance) {
          MysqlConfiguration.instance = new MysqlConfiguration();
        }
        return MysqlConfiguration.instance;
      }

      public async managerConnectionMysql(): Promise<void> {
        try {
          await this.sequelize.authenticate();
          this.logger.log(
            `Connection successfully to database of Mysql: ${CONFIG_MYSQL.database}`
          );
        } catch (error) {
          this.logger.error("Failed to connect to Mysql", error);
        }
      }
    }
   * ```
   */
  static getMysqlAndPostgresSingleton(name: string, manager: string): string {
    const configEnv = `CONFIG_${manager.toUpperCase()}`;
    const nameCapitalize = CommandUtils.capitalizeString(name);
    const managerCapitalize = CommandUtils.capitalizeString(manager);
    const dialect = manager === "pg" ? "postgres" : "mysql";

    return `import { Sequelize } from "sequelize-typescript";

import { Logger } from "@tsclean/core";
import { ${configEnv} } from "@/application/config/environment";
import { ${nameCapitalize}Model${managerCapitalize} } from "@/infrastructure/driven-adapters/adapters/orm/sequelize/models/${name}-${manager}";

/**
 * Class that generates a connection instance for ${managerCapitalize} using the Singleton pattern
 */
export class ${managerCapitalize}Configuration {
  private logger: Logger;
  private static instance: ${managerCapitalize}Configuration;

  public sequelize: Sequelize;

  private constructor() {
    this.logger = new Logger(${managerCapitalize}Configuration.name);
    this.sequelize = new Sequelize(
      ${configEnv}.database,
      ${configEnv}.user,
      ${configEnv}.password,
      {
        host: ${configEnv}.host,
        dialect: "${dialect}",
        // This array contains all the system models that are used for ${managerCapitalize}.
        models: [
          ${nameCapitalize}Model${managerCapitalize}
        ]
      }
    );
  }

  public static getInstance(): ${managerCapitalize}Configuration {
    if (!${managerCapitalize}Configuration.instance) {
      ${managerCapitalize}Configuration.instance = new ${managerCapitalize}Configuration();
    }
    return ${managerCapitalize}Configuration.instance;
  }

  public async managerConnection${managerCapitalize}(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      this.logger.log(
        \`Connection successfully to database of ${managerCapitalize}: \${${configEnv}.database}\`
      );
    } catch (error) {
      this.logger.error("Failed to connect to ${managerCapitalize}", error);
    }
  }
}
`;
  }
}
