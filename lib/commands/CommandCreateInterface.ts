import ora from "ora";
import yargs from "yargs";

import { EMOJIS } from "../utils/emojis";
import { MESSAGES } from "../utils/messages";
import { CommandUtils } from "./CommandUtils";
import { banner, errorMessage } from "../utils/helpers";

export class InterfaceCreateCommand implements yargs.CommandModule {
    command = "create:interface";
    describe = "Generate a new interface"

    builder(args: yargs.Argv) {
        return args
            .option("n", {
                alias: "name",
                describe: "Name the Interface",
                demandOption: true
            })
            .option("p", {
                alias: "path",
                describe: "File location",
                demandOption: true
            })
    };

    async handler(args: yargs.Arguments) {
        let spinner
        let basePath: string
        let fileName: string
        let path: string
        let fileExists: boolean

        try {
            const fileContent = InterfaceCreateCommand.getTemplateInterface(args.name as any, args.path as any)

            setTimeout(() => (spinner = ora('Installing...').start()), 1000);

            if (args.path as string === "entities" || args.path as string === "service" || args.path as string === "infra") {
                switch (args.path) {
                    case "entities":
                        basePath = `${process.cwd()}/src/domain/entities/contracts`
                        fileName = `${args.name}-repository.ts`
                        break
                    case "service":
                        basePath = `${process.cwd()}/src/domain/use-cases`
                        fileName = `${args.name}-service.ts`
                        break
                    case "infra":
                        basePath = `${process.cwd()}/src/infrastructure/entry-points/contracts`
                        fileName = `${args.name}.ts`
                        break
                }

                path = `${basePath}/${fileName}`
                fileExists = await CommandUtils.fileExists(path)
                if (fileExists) throw MESSAGES.FILE_EXISTS(path)

                await CommandUtils.createFile(path, fileContent)
                setTimeout(() => {
                    spinner.succeed("Installation completed")
                    spinner.stopAndPersist({
                        symbol: EMOJIS.ROCKET,
                        text: MESSAGES.FILE_SUCCESS('Interface', path)
                    });
                }, 1000 * 5);
            } else {
                throw MESSAGES.ERROR_INTERFACE(args.path);
            }
        } catch (error) {
            setTimeout(() => (spinner.fail("Installation fail"), errorMessage(error, 'interface')), 2000)
        }
    }

    /**
     * Get contents interface files
     * @param param
     * @param path
     * @protected
     */
    protected static getTemplateInterface(param: string, path: string) {

        const nameRef = param.toUpperCase().replace(/-/g, "_");

        const string = param
            .split("-")
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join("");

        const repositoryConst = `export const ${nameRef}_REPOSITORY = '${nameRef}_REPOSITORY';`;

        switch (path) {
            case 'entities':
                return `${repositoryConst}

export interface I${string}Repository {
    
}`
            case 'service':
                return `${repositoryConst}
                
export interface I${string}Service {
    
}`
            case 'infra':
                return `${repositoryConst}

export interface I${string} {
    
}`
        }
    }
}
