import {CONSTANTS} from "./constants";

export const PATHS = {
    PATH_INDEX: (base) => `${base}/src/index.ts`,
    PATH_MODELS_ENTITY: () => `${process.cwd()}/src/domain/entities/`,
    PATH_MODELS_ORM: (base, args) => `${base}/src/infrastructure/driven-adapters/adapters/orm/${args}`,
    BASE_PATH_ADAPTER: (orm) => `${process.cwd()}/src/infrastructure/driven-adapters/adapters/orm/${orm}/`,
    BASE_PATH_ADAPTER_SIMPLE: () => `${process.cwd()}/src/infrastructure/driven-adapters/adapters/`,
    FILE_NAME_ADAPTER: (name, manager, orm) => manager ? `${name}-adapter.ts` : `${name}-${orm}-repository-adapter.ts`,
    FILE_NAME_ADAPTER_SIMPLE: (name) => `${name}-adapter.ts`,
    PATH_ADAPTER_SEQUELIZE: (base, orm, name, manager) => `${base}/src/infrastructure/driven-adapters/adapters/orm/${orm}/${name}-${manager}-repository-adapter.ts`,
    PATH_ADAPTER_MONGOOSE: (base, orm, name) => `${base}/src/infrastructure/driven-adapters/adapters/orm/${orm}/${name}-${orm}-repository-adapter.ts`,
    PATH_ADAPTER: (base, orm, name, manager) => manager ? PATHS.PATH_ADAPTER_SEQUELIZE(base, orm, name, manager) : PATHS.PATH_ADAPTER_MONGOOSE(base, orm, name),
    PATH_ADAPTER_SIMPLE: (name) => `${process.cwd()}/src/infrastructure/driven-adapters/adapters/${name}-adapter.ts`,
    PATH_PROVIDER_SEQUELIZE: (base, orm, name, manager) => `${base}/src/infrastructure/driven-adapters/providers/orm/${orm}/${name}-${manager}-providers.ts`,
    PATH_PROVIDER_MONGOOSE: (base, orm, name) => `${base}/src/infrastructure/driven-adapters/providers/orm/${orm}/${name}-${orm}-providers.ts`,
    // PATH_PROVIDER: (base, orm, name, manager) => manager ? PATHS.PATH_PROVIDER_SEQUELIZE(base, orm, name, manager) : PATHS.PATH_PROVIDER_MONGOOSE(base, orm, name),
    PATH_MODEL: (base, orm, name, manager) => orm === CONSTANTS.MONGOOSE
        ? `${base}/src/infrastructure/driven-adapters/adapters/orm/${orm}/models/${name}.ts`
        : `${base}/src/infrastructure/driven-adapters/adapters/orm/${orm}/models/${name}-${manager}.ts`,
    PATH_PROVIDER: (base) => `${base}/src/infrastructure/driven-adapters/providers/index.ts`,
    PATH_SERVICE_RESOURCE: () => `${process.cwd()}/src/domain/use-cases/impl`,
}
