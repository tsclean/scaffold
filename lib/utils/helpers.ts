import figlet from 'figlet'
import {MESSAGES} from "./messages";
import {exec} from "child_process";
import chalk from "chalk";
import {EMOJIS} from "./emojis";

export const banner = () => {
    console.log("");
    figlet.text('Clean Scaffold.', {font: 'ANSI Shadow', whitespaceBreak: true}, (err, data) => {
        if (err) return;
        console.log(data)
    });
}

export const errorMessage = (error, type) => {
    console.log(MESSAGES.ERROR_HANDLER(`Error during ${type} creation.`))
    console.error(error)
    process.exit(1)
}

export const executeCommand = (command: string) => {
    return new Promise<string>((resolve, reject) => {
        exec(command, (error: any, stdout: any, stderr: any) => {
            if (stdout) return resolve(stdout)
            if (stderr) return reject(stderr)
            if (error) return reject(error)
            resolve("")
        })
    })
}

export function structureInitialProject(name: string) {
    console.log(`
${EMOJIS.APPLICATION}  ${chalk.blue("Layer APPLICATION")}

${chalk.green("CREATE")} ${name}/src/application/app.ts
${chalk.green("CREATE")} ${name}/src/application/config/environment.ts

${EMOJIS.ROCKET} ${chalk.cyan("Layer DEPLOYMENT")}  

${chalk.green("CREATE")} ${name}/src/deployment/Dockerfile

${EMOJIS.ENTITIES} ${chalk.yellow("Layer ENTITIES - DOMAIN")}  

${chalk.green("CREATE")} ${name}/src/domain/entities

${EMOJIS.CASES} ${chalk.red("Layer USE CASES - DOMAIN")}  

${chalk.green("CREATE")} ${name}/src/domain/use-cases/impl

${EMOJIS.INFRA} ${chalk.greenBright("Layer INFRASTRUCTURE")}  

${chalk.green("CREATE")} ${name}/src/infrastructure/driven-adapters/index.ts
${chalk.green("CREATE")} ${name}/src/infrastructure/driven-adapters/adapters/index.ts
${chalk.green("CREATE")} ${name}/src/infrastructure/driven-adapters/providers/index.ts
${chalk.green("CREATE")} ${name}/src/infrastructure/entry-points/index.ts
${chalk.green("CREATE")} ${name}/src/infrastructure/entry-points/api/index.ts

${chalk.green("CREATE")} ${name}/.dockerignore          
${chalk.green("CREATE")} ${name}/.env                   
${chalk.green("CREATE")} ${name}/.env.example           
${chalk.green("CREATE")} ${name}/.gitignore             
${chalk.green("CREATE")} ${name}/README.md              
${chalk.green("CREATE")} ${name}/docker-compose.yml     
${chalk.green("CREATE")} ${name}/package.json           
${chalk.green("CREATE")} ${name}/tsconfig.build.json    
${chalk.green("CREATE")} ${name}/tsconfig.json          
${chalk.green("CREATE")} ${name}/src/index.ts
${chalk.green("CREATE")} ${name}/tests/domain
${chalk.green("CREATE")} ${name}/tests/infrastructure
`);
}
