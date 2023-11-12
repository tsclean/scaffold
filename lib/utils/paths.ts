import { CONSTANTS } from "./constants";

export const PATHS = {
  PATH_INDEX: (base: string) => `${base}/src/index.ts`,
  PATH_MODELS_ENTITY: () => `${process.cwd()}/src/domain/entities/`,
  PATH_MODELS_ORM: (base: string, args: string) =>
    `${base}/src/infrastructure/driven-adapters/adapters/orm/${args}`,
  BASE_PATH_ADAPTER: (orm: string) =>
    `${process.cwd()}/src/infrastructure/driven-adapters/adapters/orm/${orm}/`,
  BASE_PATH_ADAPTER_SIMPLE: () =>
    `${process.cwd()}/src/infrastructure/driven-adapters/adapters/`,
  FILE_NAME_ADAPTER: (name: string, manager: string, orm: string) =>
    manager
      ? `${name}-${manager}-repository-adapter.ts`
      : `${name}-${orm}-repository-adapter.ts`,
  FILE_NAME_ADAPTER_SIMPLE: (name: string) => `${name}-adapter.ts`,
  PATH_ADAPTER: (base: string, orm: string, name: string, manager: string) =>
    `${base}/src/infrastructure/driven-adapters/adapters/orm/${orm}/${name}-${manager}-repository-adapter.ts`,
  PATH_ADAPTER_SIMPLE: (name: string) =>
    `${process.cwd()}/src/infrastructure/driven-adapters/adapters/${name}-adapter.ts`,
  PATH_PROVIDER_SEQUELIZE: (
    base: string,
    orm: string,
    name: string,
    manager: string
  ) =>
    `${base}/src/infrastructure/driven-adapters/providers/orm/${orm}/${name}-${manager}-providers.ts`,
  PATH_PROVIDER_MONGOOSE: (base: string, orm: string, name: string) =>
    `${base}/src/infrastructure/driven-adapters/providers/orm/${orm}/${name}-${orm}-providers.ts`,
  PATH_SINGLETON: (base: string) => `${base}/src/application/singleton.ts`,
  PATH_SINGLETON_INSTANCES: (base: string, manager: string, orm?: string) =>
    orm === "mongoose"
      ? `${base}/src/application/config/${orm}-instance.ts`
      : `${base}/src/application/config/${manager}-instance.ts`,
  // PATH_PROVIDER: (base, orm, name, manager) => manager ? PATHS.PATH_PROVIDER_SEQUELIZE(base, orm, name, manager) : PATHS.PATH_PROVIDER_MONGOOSE(base, orm, name),
  PATH_MODEL: (base: string, orm: string, name: string, manager: string) =>
    orm === CONSTANTS.MONGOOSE
      ? `${base}/src/infrastructure/driven-adapters/adapters/orm/${orm}/models/${name}.ts`
      : `${base}/src/infrastructure/driven-adapters/adapters/orm/${orm}/models/${name}-${manager}.ts`,
  PATH_PROVIDER: (base: string) =>
    `${base}/src/infrastructure/driven-adapters/providers/index.ts`,
  PATH_SERVICE_RESOURCE: () => `${process.cwd()}/src/domain/use-cases/impl`
};
