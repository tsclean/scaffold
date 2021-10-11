import ora from "ora";
import chalk from "chalk";
import yargs from "yargs";
import {exec} from "child_process";

import {EMOJIS} from "../utils/emojis";
import {MESSAGES} from "../utils/messages";
import { CommandUtils } from "./CommandUtils";
import {banner, errorMessage} from "../utils/helpers";
import {DatabaseTemplate} from "../templates/DatabaseTemplate";

export class DatabaseCreateCommand implements yargs.CommandModule {
    command = "create:database"
    describe = "Generate database configuration"

    builder(args: yargs.Argv) {
        return args
            .option("db", {
                alias: "database",
                describe: "Name the database",
                demandOption: true
            })
    }

    async handler(args: yargs.Arguments) {
        try {
            const fileContentMongo = DatabaseTemplate.getTemplateMongoDatabase()
            const fileContentMysql = DatabaseTemplate.getTemplateMysqlDatabase()
            const fileContentPostgres = DatabaseTemplate.getTemplatePostgresDatabase()

            const database: string = args.database as any
            const base = process.cwd()
            const basePath = `${base}/src/infrastructure/driven-adapters/adapters`
            const filename = `${args.database}-helper.ts`
            const path = `${basePath}/${args.database}-adapter/${filename}`

            banner()

            const fileExists = await CommandUtils.fileExists(path)
            if (fileExists) throw  MESSAGES.FILE_EXISTS(path)

            switch (database) {
                case "mongo":
                    return await DatabaseCreateCommand.getTemplateToCreateDatabase(base, path, fileContentMongo, database)
                case "mysql":
                   return await DatabaseCreateCommand.getTemplateToCreateDatabase(base, path, fileContentMysql, database)
                case "postgres":
                    return await DatabaseCreateCommand.getTemplateToCreateDatabase(base, path, fileContentPostgres, database)
            }
        } catch (error) {
            errorMessage(error, 'database')
        }
    }

    /**
     * Content server.ts file updated
     * @param database
     * @protected
     */
    protected static getTemplateServer(database: string): string {

        switch (database) {
            case "mongo":
                return DatabaseTemplate.getTemplateServerMongo()
            case "mysql":
                return DatabaseTemplate.getTemplateServerMysql()
            case "postgres":
                return DatabaseTemplate.getTemplateServerPostgres()
        }
    }

    /**
     * Content package.json file
     * @param packageJson
     * @param database
     * @protected
     */
    protected static appendPackageJson(packageJson: string, database: string): string {
        const packageJsonContent = JSON.parse(packageJson)

        switch (database) {
            case "mongo":
                packageJsonContent.devDependencies["@shelf/jest-mongodb"] = "^1.2.4"
                packageJsonContent.devDependencies["@types/mongodb"] = "^4.0.7"
                packageJsonContent.dependencies["mongodb"] = "^4.1.2"
                break;
            case "mysql":
                packageJsonContent.dependencies["mysql"] = "^2.18.1"
                break
            case "postgres":
                packageJsonContent.dependencies["pg"] = "^8.6.0"
                break
            default:
                break;
        }

        return JSON.stringify(packageJsonContent, undefined, 3)
    }

    /**
     * Get content generic template for database create
     * @param base
     * @param path
     * @param fileContent
     * @param database
     */
    static async getTemplateToCreateDatabase(base, path, fileContent, database) {

        await CommandUtils.deleteFile(base + "/src/application/index.ts")
        await CommandUtils.createFile(path, fileContent)

        const packageJsonContents = await CommandUtils.readFile(base + "/package.json")

        await CommandUtils.createFile(base + "/package.json", DatabaseCreateCommand.appendPackageJson(packageJsonContents, database))
        await CommandUtils.createFile(base + "/src/application/index.ts", DatabaseCreateCommand.getTemplateServer(database))

        await DatabaseCreateCommand.executeCommand("npm install", path, base)

        console.log(` ${EMOJIS.ROCKET} ${MESSAGES.CONFIG_ENV()}`)
    }

    /**
     * Generate dependencies for the project
     * @param command
     * @param path
     * @param base
     */
    static executeCommand(command: string, path, base) {
        let spinner
        setTimeout(() => (spinner = ora('Installing dependencies...\n').start()), 1000)
        return new Promise<string>((resolve, reject) => {
            exec(command, (error: any, stdout: any, stderr: any) => {
                if (stdout) return resolve(stdout)
                if (stderr) return reject(stderr)
                if (error) return reject(error)
                resolve("")
            })
            setTimeout(() => {
                spinner.stopAndPersist({
                    symbol: EMOJIS.ROCKET,
                    prefixText: ` ${EMOJIS.ROCKET} ${chalk.blue(`File ${chalk.green(base + "/src/application/server.ts")} has been updated successfully. \n`)}`,
                    text: chalk.green(`Database ${chalk.blue(path)} has been created successfully`)
                });
            }, 2000);
        })
    }
}
