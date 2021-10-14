import ora from "ora";
import yargs from "yargs";

import {EMOJIS} from "../utils/emojis";
import {MESSAGES} from "../utils/messages";
import {CommandUtils} from "./CommandUtils";
import {banner, errorMessage} from "../utils/helpers";

export class AdapterCreateCommand implements yargs.CommandModule {
    command = "create:adapter";
    describe = "Generate a new adapter";

    builder(args: yargs.Argv) {
        return args
            .option("name", {
                alias: "n",
                describe: "Name the adapter",
                demandOption: true
            })
            .option("database", {
                alias: "db",
                describe: "Database manager",
                demandOption: true
            });
    }

    async handler(args: yargs.Arguments) {
        let spinner

        try {

            banner()

            setTimeout(async () => spinner = ora('Installing...').start(),1000)

            const basePath = `${process.cwd()}/src/infrastructure/driven-adapters/mongo-adapter/`;
            const filename = `${args.name}-mongo-repository-adapter.ts`;
            const path = `${basePath}${filename}`;

            const fileExists = await CommandUtils.fileExists(path);

            if (fileExists) throw MESSAGES.FILE_EXISTS(path);

            const database: string = args.database as any
            const base = process.cwd()

            if(args.database === 'mongo' || args.database === 'postgres' || args.database === 'mysql') {
                // Adapter
                await CommandUtils.createFile(`${base}/src/infrastructure/driven-adapters/adapters/mongo-adapter/${args.name}-mongo-repository-adapter.ts`, AdapterCreateCommand.getMongoRepositoryAdapter(args.name as string))

                // Provider
                await CommandUtils.createFile(`${base}/src/infrastructure/driven-adapters/providers/${args.database}-providers.ts`, AdapterCreateCommand.generateProvider(database, args.name as string))

                const pathAdapter = `${base}/src/infrastructure/driven-adapters/providers/${args.database}-providers.ts`;

                setTimeout(() => {
                    spinner.succeed("Installation completed")
                    spinner.stopAndPersist({
                        symbol: EMOJIS.ROCKET,
                        prefixText: MESSAGES.PROVIDER_SUCCESS(pathAdapter),
                        text: MESSAGES.FILE_SUCCESS('Adapter', path)
                    });
                }, 1000 * 5);
            } else {
                throw MESSAGES.ERROR_DATABASE(args.database);
            }
        } catch (error) {
            errorMessage(error, 'adapter')
        }
    }

    protected static generateProvider(database: string, param: string) {
        const name = CommandUtils.capitalizeString(param);
        switch (database) {
            case "mongo":
                return `import {Provider} from "@tsclean/core";
import {${name}MongoRepositoryAdapter} from "@/infrastructure/driven-adapters/adapters/mongo-adapter/${param}-mongo-repository-adapter";

export const ${name}MongoProvider: Provider = {
    provide: '${name}MongoAdapter',
    useClass: ${name}MongoRepositoryAdapter,
};
        `
        }
    }

    protected static getMongoRepositoryAdapter(param: string) {
        const nameCapitalizeRepository = CommandUtils.capitalizeString(param);

        return `import {Injectable} from "@tsclean/core";

@Injectable()
export class ${nameCapitalizeRepository}MongoRepositoryAdapter {
    // Implementation
}
`
    };
}
