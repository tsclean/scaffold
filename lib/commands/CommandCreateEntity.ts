import ora from "ora";
import * as yargs from 'yargs'
import {CommandUtils} from './CommandUtils'
import {banner, errorMessage} from "../utils/helpers";
import {MESSAGES} from "../utils/messages";
import {EMOJIS} from "../utils/emojis";


export class EntityCreateCommand implements yargs.CommandModule {
    command = "create:entity";
    describe = "Generates a new entity.";

    builder(args: yargs.Argv) {
        return args
            .option("n", {
                alias: "name",
                describe: "Name of the entity type",
                demand: true
            })
    }

    async handler(args: yargs.Arguments) {
        let spinner
        try {

            const fileContent = EntityCreateCommand.getTemplate(args.name as any)
            const basePath = `${process.cwd()}/src/domain/models/`
            const filename = `${args.name}.ts`
            const path = basePath + filename
            const fileExists = await CommandUtils.fileExists(path)

            banner()

            setTimeout(() => (spinner = ora('Installing...').start()), 1000)

            if (fileExists) throw MESSAGES.FILE_EXISTS(path)

            await CommandUtils.createFile(path, fileContent)

            setTimeout(() => {
                spinner.succeed("Installation completed")
                spinner.stopAndPersist({
                    symbol: EMOJIS.ROCKET,
                    text: MESSAGES.FILE_SUCCESS('Entity', path)
                });
            }, 1000 * 5);
        } catch (error) {
            setTimeout(() => (spinner.fail("Installation fail"), errorMessage(error, 'entity')), 2000)
        }
    }

    /**
     * Gets content of the entity file
     *
     * @param param
     * @returns
     */
    protected static getTemplate(param: string): string {
        const name = CommandUtils.capitalizeString(param)
        return `export type ${name}Model = {
    // Attributes
}

export type Add${name}Params = Omit<${name}Model, 'id'>
`
    }
}
