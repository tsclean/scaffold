import ora from "ora";
import yargs from "yargs";

import {EMOJIS} from "../utils/emojis";
import {MESSAGES} from "../utils/messages";
import {CommandUtils} from "./CommandUtils";
import {banner, errorMessage} from "../utils/helpers";

export class ServiceCreateCommand implements yargs.CommandModule {
    command = "create:service";
    describe = "Generates a new service.";

    builder(args: yargs.Argv) {
        return args
            .option("n", {
                alias: "name",
                describe: "Name the Service class",
                demandOption: true
            })
    };

    async handler(args: yargs.Arguments) {
        let spinner

        try {

            const fileContent = ServiceCreateCommand.getTemplateService(args.name as any)
            const fileContentRepository = ServiceCreateCommand.getTemplateIServices(args.name as any)

            const basePath = `${process.cwd()}/src/domain/use-cases/`;
            const filename = `${args.name}-service-impl.ts`;
            const path = `${basePath}impl/${filename}`;
            const pathRepository = `${basePath + args.name}-service.ts`;

            const fileExists = await CommandUtils.fileExists(path)

            banner()

            setTimeout(() => (spinner = ora('Installing...').start()), 1000)

            if (fileExists) throw MESSAGES.FILE_EXISTS(path)

            await CommandUtils.createFile(pathRepository, fileContentRepository)
            await CommandUtils.createFile(path, fileContent)

            setTimeout(() => {
                spinner.succeed("Installation completed")
                spinner.stopAndPersist({
                    symbol: EMOJIS.ROCKET,
                    prefixText: MESSAGES.REPOSITORY_SUCCESS(pathRepository),
                    text: MESSAGES.FILE_SUCCESS('Services', path)
                });
            }, 1000 * 5);

        } catch (error) {
            setTimeout(() => (spinner.fail("Installation fail"), errorMessage(error, 'service')), 2000)
        }
    }

    /**
     * Get contents services files
     * @param param
     * @protected
     */
    protected static getTemplateService(param: any) {
        const name = CommandUtils.capitalizeString(param)
        return `import {Service} from "clean-ts";
import {I${name}Service} from "@/domain/use-cases/${param}-service";

@Service()
export class ${name}ServiceImpl implements I${name}Service {
    constructor() {
    }
}`
    }

    /**
     * Get contents interface files
     * @param param
     * @protected
     */
    protected static getTemplateIServices(param: string) {
        const name = CommandUtils.capitalizeString(param)
        return `export interface I${name}Service {

}`
    }
}
