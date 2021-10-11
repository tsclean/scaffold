import figlet from 'figlet'
import {MESSAGES} from "./messages";

export const banner = () => {
    console.log("");
    figlet.text('Clean Scaffold.', {font: 'ANSI Shadow', width: 80, whitespaceBreak: true}, (err, data) => {
        if (err) return;
        console.log(data)
    });
}

export const errorMessage = (error, type) => {
    console.log(MESSAGES.ERROR_HANDLER(`Error during ${type} creation.`))
    console.error(error)
    process.exit(1)
}
