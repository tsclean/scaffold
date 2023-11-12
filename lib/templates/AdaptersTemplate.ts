import { CommandUtils } from "../commands/CommandUtils";
import { CONSTANTS } from "../utils/constants";
import { MESSAGES } from "../utils/messages";

export class AdaptersTemplate {
  /**
   * Metodo para crear el Adaptador de acuerdo al ORM que recibe como parametro
   * 
   * @param param Nombre de la entidad
   * @param orm Nombre del orm (sequelize, mongo)
   * @param manager Nombre del gestor de base de datos (mysql, pg, mongoose)
   * @return 
   * ```typescript
   * // Adapter
   * import {UserEntity} from "@/domain/entities/user";
   * import {UserModelSchema} from "@/infrastructure/driven-adapters/adapters/orm/mongo/models/user-mongoose";
   *
   * export class UserMongoRepositoryAdapter {}
   * ```
   */
  public static getRepositoryAdapter(
    param: string,
    orm: string,
    manager?: string
  ): string {
    const _param = CommandUtils.capitalizeString(param);
    const _orm = CommandUtils.capitalizeString(orm);

    switch (orm) {
      case CONSTANTS.MONGO:
        return `import {${_param}Entity} from "@/domain/entities/${param}";
import {${_param}ModelSchema} from "@/infrastructure/driven-adapters/adapters/orm/${orm}/models/${param}-${manager}";

export class ${_param}${_orm}RepositoryAdapter {
    // Implementation
}
`;
      case CONSTANTS.SEQUELIZE:
        if (manager === CONSTANTS.MYSQL || manager === CONSTANTS.POSTGRES) {
          const _manager = CommandUtils.capitalizeString(manager);
          return `import {${_param}Entity} from "@/domain/entities/${param}";
import {${_param}Model${_manager}}from "@/infrastructure/driven-adapters/adapters/orm/${orm}/models/${param}-${manager}";

export class ${_param}${_manager}RepositoryAdapter {
    // Implementation
}
`;
        } else {
          throw MESSAGES.ERROR_DATABASE(manager);
        }
    }
  }
}
