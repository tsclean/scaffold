import ora from "ora";
import yargs from "yargs";

import {PATHS} from "../utils/paths";
import {MESSAGES} from "../utils/messages";
import {CommandUtils} from "./CommandUtils";
import {CONSTANTS} from "../utils/constants";
import {banner, errorMessage} from "../utils/helpers";
import {EMOJIS} from "../utils/emojis";

export class CommandCreateAdapterSimple implements yargs.CommandModule {
    command = "create:adapter";
    describe = "Generate a new adapter";

    builder(args: yargs.Argv) {
        return args
            .option("name", {
                alias: "n",
                describe: "Name the adapter",
                demandOption: true
            })
    }

    async handler(args: yargs.Arguments) {

        let spinner;

        try {

            setTimeout(async () => spinner = ora(CONSTANTS.INSTALLING).start(), 1000)

            const basePath = PATHS.BASE_PATH_ADAPTER_SIMPLE();
            const filename = PATHS.FILE_NAME_ADAPTER_SIMPLE(args.name as string);

            // The path for the validation of the file input is made up.
            const path = `${basePath}${filename}`;

            // We validate if the file exists, to throw the exception.
            const fileExists = await CommandUtils.fileExists(path);

            // Throw message exception
            if (fileExists) throw MESSAGES.FILE_EXISTS(path);

            // Adapter
            await CommandUtils.createFile(PATHS.PATH_ADAPTER_SIMPLE(args.name as string), CommandCreateAdapterSimple.getRepositoryAdapter(args.name as string))

            setTimeout(() => {
                spinner.succeed(CONSTANTS.INSTALLATION_COMPLETED)
                spinner.stopAndPersist({
                    symbol: EMOJIS.ROCKET,
                    text: `${MESSAGES.FILE_SUCCESS(CONSTANTS.ADAPTER, PATHS.PATH_ADAPTER_SIMPLE(args.name as string))}`
                });
            }, 2000);

        } catch (error) {
            errorMessage(error, CONSTANTS.ADAPTER)
        }
    }

    private static getRepositoryAdapter(name: string) {
        const _param = CommandUtils.capitalizeString(name);
        return `export class ${_param}Adapter {
    // Implementation
}`
    }
}