import ora from "ora";
import yargs from "yargs";

import {EMOJIS} from "../utils/emojis";
import {MESSAGES} from "../utils/messages";
import {CommandUtils} from "./CommandUtils";
import {banner, errorMessage} from "../utils/helpers";

export class ControllerCreateCommand implements yargs.CommandModule {
    command = "create:controller"
    describe = "Generates a new controller."

    builder(args: yargs.Argv) {
        return args
            .option('n', {
                alias: "name",
                describe: "Name the Controller class",
                demandOption: true
            })
    }

    async handler(args: yargs.Arguments) {
        let spinner

        try {

            const directoryImplementation = `${process.cwd()}/src/domain/use-cases/impl`;
            const files = await CommandUtils.injectServiceAdapter(directoryImplementation);

            const fileContent = ControllerCreateCommand.getTemplateController(args.name as any, files)
            const basePath = `${process.cwd()}/src/infrastructure/entry-points/api/`
            const filename = `${args.name}-controller.ts`
            const path = `${basePath}${filename}`
            const fileExists = await CommandUtils.fileExists(path)

            banner()

            setTimeout(() => (spinner = ora('Installing...').start()), 1000)

            if (fileExists) throw MESSAGES.FILE_EXISTS(path)

            await CommandUtils.createFile(path, fileContent)

            setTimeout(() => {
                spinner.succeed("Installation completed")
                spinner.stopAndPersist({
                    symbol: EMOJIS.ROCKET,
                    text: MESSAGES.FILE_SUCCESS('Controller', path)
                });
            }, 1000 * 5);

        } catch (error) {
            setTimeout(() => (spinner.fail("Installation fail"), errorMessage(error, 'controller')), 2000)
        }
    }

    /**
     * Get content controllers files
     * @param param
     * @param files
     * @protected
     */
    protected static getTemplateController(param: string, files: string[]) {
        let nameService: string = "";
        let nameCapitalize: string = CommandUtils.capitalizeString(param);

        // This loop when the name of the controller matches the service, to then be injected through the constructor.
        for (const file of files) {
            let name = file.slice(0, -16);
            if(name === param) {
                nameService = name;
                const nameCapitalizeService = CommandUtils.capitalizeString(nameService);
                const transformString = CommandUtils.transformInitialString(nameCapitalizeService);

                return `import {Mapping} from "clean-ts";
import {${nameCapitalizeService}ServiceImpl} from "@/domain/use-cases/impl/${nameService}-service-impl";

@Mapping('api/v1/${nameService}')
export class ${nameCapitalizeService}Controller {

    constructor(
        private readonly ${transformString}Service: ${nameCapitalizeService}ServiceImpl
    ) {
    }
}
`
            };
        }

        return `import {Mapping} from "clean-ts";

@Mapping('')
export class ${nameCapitalize}Controller {
    constructor() {
        
    }
}
`
    }
}
