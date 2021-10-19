export const PATHS = {
    PATH_MODELS_ENTITY: () => `${process.cwd()}/src/domain/models/`,
    BASE_PATH_ADAPTER: (orm) => `${process.cwd()}/src/infrastructure/driven-adapters/adapters/orm/${orm}/`,
    FILE_NAME_ADAPTER: (name, manager, orm) => manager ? `${name}-${manager}-repository-adapter.ts` : `${name}-${orm}-repository-adapter.ts`,
    PATH_ADAPTER_SEQUELIZE: (base, orm, name, manager) => `${base}/src/infrastructure/driven-adapters/adapters/orm/${orm}/${name}-${manager}-repository-adapter.ts`,
    PATH_ADAPTER_MONGOOSE: (base, orm, name) => `${base}/src/infrastructure/driven-adapters/adapters/orm/${orm}/${name}-${orm}-repository-adapter.ts`,
    PATH_ADAPTER: (base, orm, name, manager) => manager ? PATHS.PATH_ADAPTER_SEQUELIZE(base, orm, name, manager) : PATHS.PATH_ADAPTER_MONGOOSE(base, orm, name),
    PATH_PROVIDER_SEQUELIZE: (base, orm, name, manager) => `${base}/src/infrastructure/driven-adapters/providers/orm/${orm}/${name}-${manager}-providers.ts`,
    PATH_PROVIDER_MONGOOSE: (base, orm, name) => `${base}/src/infrastructure/driven-adapters/providers/orm/${orm}/${name}-${orm}-providers.ts`,
    PATH_PROVIDER: (base, orm, name, manager) => manager ? PATHS.PATH_PROVIDER_SEQUELIZE(base, orm, name, manager) : PATHS.PATH_PROVIDER_MONGOOSE(base, orm, name),
    PATH_MODEL: (base, orm, name) => `${base}/src/infrastructure/driven-adapters/adapters/orm/${orm}/models/${name}.ts`,
}