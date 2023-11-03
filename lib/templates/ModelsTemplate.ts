import { CommandUtils } from "../commands/CommandUtils";
import { CONSTANTS } from "../utils/constants";

export class ModelsTemplate {
  /**
   * Metodo para crear el modelo del adaptador de acuero al ORM
   *
   * @param param Nombre de la entidad
   * @param orm Nombre del orm (sequelize, mongo)
   * @param manager Nombre del gestor de base de datos (mysql, pg, mongoose)
   * ```typescript
   * // Model
   * import { model, Schema } from "mongoose";
   * import { UserEntity } from '@/domain/entities/user';
   *
   * const schema = new Schema<UserEntity>({});
   *
   * export const UserModelSchema = model<UserEntity>('users', schema);
   * ```
   */
  public static getModels(param: string, orm: string, manager?: string) {
    const _name = CommandUtils.capitalizeString(param);

    switch (orm) {
      case CONSTANTS.MONGO:
        return `import { model, Schema } from "mongoose";
import { ${_name}Entity } from '@/domain/entities/${param}';

const schema = new Schema<${_name}Entity>({
    // Implementation
});

export const ${_name}ModelSchema = model<${_name}Entity>('${param}s', schema);
`;
      case CONSTANTS.SEQUELIZE:
        const _manager = CommandUtils.capitalizeString(manager);
        return `import { Table, Column, Model, Sequelize } from 'sequelize-typescript'
import { ${_name}Entity } from "@/domain/entities/${param}";

@Table({ tableName: '${param}s' })
export class ${_name}Model${_manager} extends Model<${_name}Entity> {
    // Implementation
}`;
    }
  }
}
