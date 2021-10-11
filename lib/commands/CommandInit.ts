import ora from "ora";
import * as path from "path";
import * as yargs from "yargs";
import {exec} from "child_process";

import {EMOJIS} from "../utils/emojis";
import {MESSAGES} from "../utils/messages";
import {CommandUtils} from "./CommandUtils";
import {banner, errorMessage} from "../utils/helpers";
import {ProjectInitTemplate} from "../templates/ProjectInitTemplate";

export class InitCommand implements yargs.CommandModule {
    command = "create:project"
    describe = "Generate initial Clean Architecture project structure."
    
    builder(args: yargs.Argv) {
        return args
            .option("n", {
                alias: "name",
                describe: "Name of project directory",
                demandOption: true
            })
            .option("db", {
                alias: "database",
                describe: "Database type you'll use in your project."
            })
    }
   
    async handler(args: yargs.Arguments) {

        let spinner

        try {
            const database: string = args.database as any || "mysql"
            const basePath = process.cwd() + (args.name ? ("/" + args.name) : "")
            const projectName = args.name ? path.basename(args.name as any) : undefined

            const fileExists = await CommandUtils.fileExists(basePath)

            banner()

            setTimeout(async () => {
                spinner = ora('Installing...').start()
            }, 1000)

            if (fileExists) throw  MESSAGES.PROJECT_EXISTS(basePath)

            await CommandUtils.createFile(basePath + "/.env", ProjectInitTemplate.getEnvExampleTemplate())
            await CommandUtils.createFile(basePath + "/.env.example", ProjectInitTemplate.getEnvExampleTemplate())
            await CommandUtils.createFile(basePath + "/.gitignore", ProjectInitTemplate.getGitIgnoreFile())
            await CommandUtils.createFile(basePath + "/package.json", ProjectInitTemplate.getPackageJsonTemplate(projectName), false)
            await CommandUtils.createFile(basePath + "/README.md", ProjectInitTemplate.getReadmeTemplate())
            await CommandUtils.createFile(basePath + "/tsconfig.json", ProjectInitTemplate.getTsConfigTemplate())
            await CommandUtils.createFile(basePath + "/tsconfig-build.json", ProjectInitTemplate.getTsConfigBuildTemplate())

            await CommandUtils.createFile(basePath + "/src/application/config/environment.ts", ProjectInitTemplate.getEnvironmentTemplate())
            await CommandUtils.createFile(basePath + "/src/application/app.ts", ProjectInitTemplate.getAppTemplate())
            await CommandUtils.createFile(basePath + "/src/application/index.ts", ProjectInitTemplate.getIndexTemplate())

            await CommandUtils.createDirectories(basePath + "/src/domain/models")
            await CommandUtils.createDirectories(basePath + "/src/domain/use-cases/impl")
            await CommandUtils.createDirectories(basePath + "/src/infrastructure/driven-adapters/adapters")
            await CommandUtils.createDirectories(basePath + "/src/infrastructure/driven-adapters/providers")
            await CommandUtils.createDirectories(basePath + "/src/infrastructure/entry-points/api")

            await CommandUtils.createDirectories(basePath + "/tests/domain")
            await CommandUtils.createDirectories(basePath + "/tests/infrastructure")

            const packageJsonContents = await CommandUtils.readFile(basePath + "/package.json")
            await CommandUtils.createFile(basePath + "/package.json", ProjectInitTemplate.appendPackageJson(packageJsonContents, database))

            if (args.name) {
                setTimeout( async () => {
                    spinner.succeed("Installation completed")
                    spinner.stopAndPersist({
                        symbol: EMOJIS.ROCKET,
                        text: MESSAGES.PROJECT_SUCCESS(basePath)
                    });
                }, 1000 * 20);
            }

            await InitCommand.executeCommand("npm install", basePath)
        } catch (error) {
            setTimeout(() => (spinner.fail("Installation fail"), errorMessage(error, 'project')), 2000)
        }
    }

    protected static executeCommand(command: string, basePath: string) {
        return new Promise<string>((resolve, reject) => {
            exec(`cd ${basePath} && ${command}`, (error: any, stdout: any, stderr: any) => {
                if (stdout) return resolve(stdout)
                if (stderr) return reject(stderr)
                if (error) return reject(error)
                resolve("")
            })
        })
    }
}
