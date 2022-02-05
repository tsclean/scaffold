import ora from 'ora'
import * as yargs from 'yargs'

import {PATHS} from "../utils/paths";
import {EMOJIS} from "../utils/emojis";
import {MESSAGES} from "../utils/messages";
import {CommandUtils} from "./CommandUtils";
import {CONSTANTS} from "../utils/constants";
import {banner, errorMessage, executeCommand} from "../utils/helpers";

export class CommandCreateServiceResource implements yargs.CommandModule {
    command = 'create:service-resource';
    describe = 'Generate a new service resource';

    builder(args: yargs.Argv) {
        return args
            .option('name', {
                alias: 'n',
                describe: 'Name the service',
                demandOption: true
            })
            .option('resource', {
                alias: 'r',
                describe: 'Service resource',
                demandOption: true
            });
    }

    async handler (args: yargs.Arguments) {
        let spinner;

        setTimeout(async () => spinner = ora(CONSTANTS.INSTALLING).start(), 1000)

        const basePath = PATHS.PATH_SERVICE_RESOURCE();
        const fileService = `${basePath}/${args.name}-service-resource-impl.ts`;
        const fileContract = `${process.cwd()}/src/domain/use-cases/${args.name}-service-resource.ts`;

        const fileServiceExists = await CommandUtils.fileExists(fileService);

        if (fileServiceExists) throw MESSAGES.FILE_EXISTS(fileService);

        CommandUtils.readModelFiles(PATHS.PATH_MODELS_ENTITY(), args.name as string);

        try {
            await CommandUtils.createFile(`${fileContract}`, CommandCreateServiceResource.getServiceResourceInterface(args.name as string));
            await CommandUtils.createFile(`${fileService}`, CommandCreateServiceResource.getServiceResource(args.name as string));

            setTimeout(() => {
                spinner.succeed("Installation completed")
                spinner.stopAndPersist({
                    symbol: EMOJIS.ROCKET,
                    prefixText: MESSAGES.REPOSITORY_SUCCESS(fileContract),
                    text: MESSAGES.FILE_SUCCESS('Services resource', fileService)
                });
            }, 1000 * 5);

        } catch (error) {
            setTimeout(() => (spinner.fail("Installation fail"), errorMessage(error, 'service')), 2000)
        }
    }

    static getServiceResourceInterface(param: string): string {
        const name = CommandUtils.capitalizeString(param);
        const toUpperCase = CommandUtils.transformStringToUpperCase(param);

        return `import {Add${name}Params, ${name}Model} from "@/domain/models/${param}";

export const ${toUpperCase}_RESOURCE_SERVICE = "${toUpperCase}_RESOURCE_SERVICE";

export interface I${name}ResourceService {
    findAll: () => Promise<${name}Model[]>;
    save: (data: Add${name}Params) => Promise<${name}Model>;
    findById: (id: number) => Promise<${name}Model>;
    update: (id: number, data: any) => Promise<boolean | undefined>
}
`;

    }

    static getServiceResource(param: any): string {
        const name = CommandUtils.capitalizeString(param)
        return `import {Service} from "@tsclean/core";
import {Add${name}Params, ${name}Model} from "@/domain/models/${param}";
import {I${name}ResourceService} from "@/domain/use-cases/${param}-service-resource";

@Service()
export class ${name}ServiceImpl implements I${name}ResourceService {
    constructor() {
    }
    
     async findAll(): Promise<${name}Model[]> {
        return Promise.resolve([]);
    }
    
    async findById(id: number): Promise<${name}Model> {
        return Promise.resolve(undefined);
    }

    async save(data: Add${name}Params): Promise<${name}Model> {
        return Promise.resolve(undefined);
    }

    async update(id: number, data: any): Promise<boolean | undefined> {
        return Promise.resolve(undefined);
    }
}`
    };
}