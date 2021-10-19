import figlet from 'figlet'
import {MESSAGES} from "./messages";
import {exec} from "child_process";

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
