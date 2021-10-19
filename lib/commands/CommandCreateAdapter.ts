import ora from "ora";
import yargs from "yargs";

import {PATHS} from "../utils/paths";
import {EMOJIS} from "../utils/emojis";
import {MESSAGES} from "../utils/messages";
import {CommandUtils} from "./CommandUtils";
import {CONSTANTS} from "../utils/constants";
import {banner, errorMessage, executeCommand} from "../utils/helpers";

export class AdapterCreateCommand implements yargs.CommandModule {
    command = "create:adapter-orm";
    describe = "Generate a new adapter";

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
                describe: "Database manager"
            })
    }

    async handler(args: yargs.Arguments) {
        let spinner

        try {

            banner()

            setTimeout(async () => spinner = ora(CONSTANTS.INSTALLING).start(), 1000)

            const basePath = PATHS.BASE_PATH_ADAPTER(args.orm);
            const filename = PATHS.FILE_NAME_ADAPTER(args.name, args.manager, args.orm);

            // The path for the validation of the file input is made up.
            const path = `${basePath}${filename}`;

            // We validate if the file exists, to throw the exception.
            const fileExists = await CommandUtils.fileExists(path);

            // Throw message exception
            if (fileExists) throw MESSAGES.FILE_EXISTS(path);

            const base = process.cwd();

            // Validate that the entity exists for importing into the ORM adapter.
            await CommandUtils.readModelFiles(PATHS.PATH_MODELS_ENTITY(), args.name as string);

            if (args.orm === CONSTANTS.MONGOOSE || args.orm === CONSTANTS.SEQUELIZE) {
                await CommandUtils.deleteFile(PATHS.PATH_INDEX(base));
                await CommandUtils.createFile(PATHS.PATH_INDEX(base), AdapterCreateCommand.getTemplateServer(args.name as string, args.orm, args.manager as string));
                // Adapter
                await CommandUtils.createFile(PATHS.PATH_ADAPTER(base, args.orm, args.name, args.manager), AdapterCreateCommand.getRepositoryAdapter(args.name as string, args.orm as string, args.manager as string))
                // Provider
                await CommandUtils.createFile(PATHS.PATH_PROVIDER(base, args.orm, args.name, args.manager), AdapterCreateCommand.generateProvider(args.name as string, args.orm as string, args.manager as string))
                // Model
                await CommandUtils.createFile(PATHS.PATH_MODEL(base, args.orm, args.name), AdapterCreateCommand.getModels(args.name as string, args.orm as string, args.manager as string));
                // Dependencies
                const packageJsonContents = await CommandUtils.readFile(base + "/package.json");
                await CommandUtils.createFile(base + "/package.json", AdapterCreateCommand.getPackageJson(packageJsonContents, args.orm as string, args.manager as string));
                await executeCommand(CONSTANTS.NPM_INSTALL)

                // This message is only displayed in sequelize
                const env = args.manager ? `${EMOJIS.ROCKET} ${MESSAGES.CONFIG_ENV()}` : "";

                const pathAdapter = args.manager
                    ? PATHS.PATH_PROVIDER_SEQUELIZE(base, args.orm, args.name, args.manager)
                    : PATHS.PATH_PROVIDER_MONGOOSE(base, args.orm, args.name);

                setTimeout(() => {
                    spinner.succeed(CONSTANTS.INSTALLATION_COMPLETED)
                    spinner.stopAndPersist({
                        symbol: EMOJIS.ROCKET,
                        prefixText: MESSAGES.PROVIDER_SUCCESS(pathAdapter),
                        text: `${MESSAGES.FILE_SUCCESS(CONSTANTS.ADAPTER, path)}
${env}`
                    });
                }, 1000 * 5);
            } else {
                throw MESSAGES.ERROR_ORM(args.orm);
            }
        } catch (error) {
            errorMessage(error, CONSTANTS.ADAPTER)
        }
    }

    /**
     *
     * @param manager
     * @param param
     * @param orm
     * @protected
     */
    protected static generateProvider(param: string, orm: string, manager?: string) {
        const _name = CommandUtils.capitalizeString(param);
        const _orm = CommandUtils.capitalizeString(orm);

        switch (orm) {
            case CONSTANTS.SEQUELIZE:
                const _manager = CommandUtils.capitalizeString(manager);
                return `import {Provider} from "@tsclean/core";
import {${_name}${_manager}RepositoryAdapter} from "@/infrastructure/driven-adapters/adapters/orm/${orm}/${param}-${manager}-repository-adapter";

export class ${_name}${_manager}Provider {
    static getProvider(): Provider {
        return {
            key: '${_name}${_manager}Adapter',
            classAdapter: ${_name}${_manager}RepositoryAdapter,
        }
    }
}
        `
            case CONSTANTS.MONGOOSE:
                return `import {Provider} from "@tsclean/core";
import {${_name}${_orm}RepositoryAdapter} from "@/infrastructure/driven-adapters/adapters/orm/${orm}/${param}-${orm}-repository-adapter";

export class ${_name}${_orm}Provider {
    static getProvider(): Provider {
        return {
            key: '${_name}${_orm}Adapter',
            classAdapter: ${_name}${_orm}RepositoryAdapter,
        }
    }
}
        `
        }
    }

    /**
     *
     * @param param
     * @param orm
     * @param manager
     * @protected
     */
    protected static getRepositoryAdapter(param: string, orm: string, manager?: string) {
        const _param = CommandUtils.capitalizeString(param);
        const _orm = CommandUtils.capitalizeString(orm);

        switch (orm) {
            case CONSTANTS.MONGOOSE:
                return `import {${_param}Model} from "@/domain/models/${param}";
import {${_param}ModelSchema} from "@/infrastructure/driven-adapters/adapters/orm/${orm}/models/${param}";

export class ${_param}${_orm}RepositoryAdapter {
    // Implementation
}
`
            case CONSTANTS.SEQUELIZE:
                if (manager === CONSTANTS.MYSQL || manager === CONSTANTS.POSTGRES) {
                    const _manager = CommandUtils.capitalizeString(manager);
                    return `import {${_param}Model} from "@/domain/models/${param}";
import {${_param}Model${_manager}}from "@/infrastructure/driven-adapters/adapters/orm/${orm}/models/${param}";

export class ${_param}${_manager}RepositoryAdapter {
    // Implementation
}
`
                } else {
                    throw MESSAGES.ERROR_DATABASE(manager);
                }
        }

    };

    /**
     *
     * @param param
     * @param orm
     * @param manager
     * @protected
     */
    protected static getModels(param: string, orm: string, manager?: string) {
        const _name = CommandUtils.capitalizeString(param);

        switch (orm) {
            case CONSTANTS.MONGOOSE:
                return `import { ${_name}Model } from '@/domain/models/${param}';
import { model, Schema } from "mongoose";

const schema = new Schema<${_name}Model>({
    // Implementation
});

export const ${_name}ModelSchema = model<${_name}Model>('${param}s', schema);
`;
            case CONSTANTS.SEQUELIZE:
                const _manager = CommandUtils.capitalizeString(manager);
                return `import { Table, Column, Model, Sequelize } from 'sequelize-typescript'
import { ${_name}Model } from "@/domain/models/${param}";

@Table({ tableName: '${param}s' })
export class ${_name}Model${_manager} extends Model<${_name}Model> {
    // Implementation
}`
        }
    }

    /**
     *
     * @param dependencies
     * @param orm
     * @param manager
     * @private
     */
    private static getPackageJson(dependencies: string, orm: string, manager: string) {
        const updatePackages = JSON.parse(dependencies);

        switch (orm) {
            case CONSTANTS.MONGOOSE:
                updatePackages.dependencies["mongoose"] = "^6.0.10";
                updatePackages.devDependencies["@types/mongoose"] = "^5.11.97";
                break;
            case CONSTANTS.SEQUELIZE:
                updatePackages.dependencies["sequelize"] = "^6.7.0"
                updatePackages.dependencies["sequelize-typescript"] = "^2.1.1"
                updatePackages.devDependencies["@types/sequelize"] = "^4.28.10"
                switch (manager) {
                    case CONSTANTS.MYSQL:
                        updatePackages.dependencies["mysql2"] = "^2.3.1"
                        break
                    case CONSTANTS.POSTGRES:
                        updatePackages.dependencies["pg"] = "^8.7.1"
                        updatePackages.dependencies["pg-hstore"] = "^2.3.4"
                        break
                    default:
                        break;
                }

        }

        return JSON.stringify(updatePackages, undefined, 3)
    }

    private static getTemplateServer(name: string, orm: string, manager?: string) {
        const _name = CommandUtils.capitalizeString(name);

        switch (orm) {
            case CONSTANTS.SEQUELIZE:
                const _manager = CommandUtils.capitalizeString(manager);
                switch (manager) {
                    case CONSTANTS.MYSQL:
                        return `import "module-alias/register";

import helmet from 'helmet';

import { Dialect } from 'sequelize/types';
import { Sequelize } from 'sequelize-typescript';

import {StartProjectServer} from "@tsclean/core";
        
import {AppContainer} from "@/application/app";
import {PORT, CONFIG_MYSQL} from "@/application/config/environment";
import {${_name}Model${_manager}} from "@/infrastructure/driven-adapters/adapters/orm/sequelize/models/${name}";
    
const sequelize = new Sequelize(CONFIG_MYSQL.database, CONFIG_MYSQL.user, CONFIG_MYSQL.password, {
    dialect: 'mysql',
    models: [${_name}Model${_manager}],
});

async function init() {
    await sequelize.authenticate()
    console.log("DB mysql")
    const app = await StartProjectServer.create(AppContainer)
    app.use(helmet());
    await app.listen(PORT, () => console.log('Running on port ' + PORT))
}
   
init();`
                }
                break
            case CONSTANTS.MONGOOSE:
                return `import 'module-alias/register'

import helmet from 'helmet';
import { connect } from 'mongoose';
import { StartProjectServer } from "@tsclean/core";

import { AppContainer } from "@/application/app";
import {MONGODB_URI, PORT} from "@/application/config/environment";

async function run(): Promise<void> {
  await connect(MONGODB_URI);
  console.log('DB Mongo connected')
  const app = await StartProjectServer.create(AppContainer);
   app.use(helmet());
   await app.listen(PORT, () => console.log('Running on port: ' + PORT))
}

run();
`
        }
    }
}
