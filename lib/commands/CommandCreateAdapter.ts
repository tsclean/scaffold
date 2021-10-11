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
            const directoryImplementation = `${process.cwd()}/src/domain/models/gateways`;
            const files = await CommandUtils.injectServiceAdapter(directoryImplementation);

            if (files === undefined) throw MESSAGES.ERROR_HANDLER('The interface to connect the domain layer with the infrastructure layer has not been created.')

            const basePath = `${process.cwd()}/src/infrastructure/driven-adapters/mongo-adapter/`;
            const filename = `${args.name}-mongo-repository-adapter.ts`;
            const path = `${basePath}${filename}`;

            const fileExists = await CommandUtils.fileExists(path);

            banner()

            setTimeout(async () => spinner = ora('Installing...').start(),1000)

            if (fileExists) throw MESSAGES.FILE_EXISTS(path)

            const database: string = args.database as any
            const base = process.cwd()

            // Adapter
            await CommandUtils.createFile(`${base}/src/infrastructure/driven-adapters/adapters/mongo-adapter/${args.name}-mongo-repository-adapter.ts`, AdapterCreateCommand.getMongoRepositoryAdapter(args.name as string, files as any))

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
        } catch (error) {
            errorMessage(error, 'adapter')
        }
    }

    protected static generateProvider(database: string, param: string) {
        const name = CommandUtils.capitalizeString(param);
        switch (database) {
            case "mongo":
                return `import {Provider} from "clean-ts";
import {${name}MongoRepositoryAdapter} from "@/infrastructure/driven-adapters/adapters/mongo-adapter/${param}-mongo-repository-adapter";

export const ${name}MongoProvider: Provider = {
    provide: '${name}MongoAdapter',
    useClass: ${name}MongoRepositoryAdapter,
};
        `
        }
    }

    protected static getMongoRepositoryAdapter(param: string, files: string[]) {
        let nameRepository: string = "";

        for (const file of files) {
            let name = file.slice(0, -14);
            if (name === param) {
                nameRepository = name;
                const nameCapitalizeRepository = CommandUtils.capitalizeString(nameRepository);

                return `import {Injectable} from "clean-ts";
import {I${nameCapitalizeRepository}Repository} from "@/domain/models/gateways/${param}-repository";

@Injectable()
export class ${nameCapitalizeRepository}MongoRepositoryAdapter implements I${nameCapitalizeRepository}Repository {
    // Implementation
}
`
            };
        }
    }

    static appendServiceImplementation(param: string | undefined): string | Uint8Array {
        const name = CommandUtils.capitalizeString(param);

        return `import {Adapter} from "clean-ts";
import {I${name}Service} from "@/domain/use-cases/${param}-service";
import {I${name}Repository} from "@/domain/models/gateways/${param}-repository";

export class ${name}ServiceImpl implements I${name}Service {
    constructor(
        @Adapter('${name}MongoAdapter')
        private readonly ${param}Repository: I${name}Repository
    ) {
    }
}`
    }
}