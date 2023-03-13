import * as fs from 'fs'
import * as path from 'path'
import mkdirp from 'mkdirp'
import {MESSAGES} from "../utils/messages";
import {CONSTANTS} from "../utils/constants";

export class CommandUtils {

    /**
     * Creates directories recursively
     *
     * @param directory
     * @returns
     */
    static createDirectories(directory: string) {
        return mkdirp(directory, 0o777)
    }

    /**
     * Creates a file with the given content in the given path
     *
     * @param filePath
     * @param content
     * @param override
     * @returns
     */
    static async createFile(filePath: string, content: string, override: boolean = true): Promise<void> {
        await CommandUtils.createDirectories(path.dirname(filePath))
        return new Promise<void>((resolve, reject) => {
            if (override === false && fs.existsSync(filePath))
                return resolve()

            fs.writeFile(filePath, content, err => err ? reject(err) : resolve())
        })
    }

    /**
     * Reads everything from a given file and returns its content as a string
     *
     * @param filePath
     * @returns
     */
    static async readFile(filePath: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(filePath, (err, data) => err ? reject(err) : resolve(data.toString()))
        })
    }

    /**
     * @param filePath
     * @returns
     */
    static async fileExists(filePath: string) {
        return fs.existsSync(filePath)
    }

    /**
     * @param filePath
     */
    static async deleteFile(filePath: string) {
        return fs.unlink(filePath, (err) => err)
    }

    /**
     * Capitalize string
     * @param param
     */
    static capitalizeString(param: string) {
        let capitalize = param.replace(/(\b\w)/g, (str) => str.toUpperCase());
        return capitalize.replace(/-/g, "")
    }

    /**
     * @param param
     */
    static transformStringToUpperCase(param: string) {
        return param.toUpperCase();
    }

    /**
     * Transforms the initial letter into lowercase
     * @param param
     */
    static transformInitialString(param: string) {
        let stringInitial = param.replace(/(\b\w)/g, (str) => str.toUpperCase());
        let lowerCaseString = stringInitial[0].toLowerCase() + stringInitial.substring(1);
        return lowerCaseString.replace(/-/g, "")
    }

    /**
     * Reads the files in the service implementation directory
     * @param directory
     */
    static injectServiceAdapter(directory: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(directory, function (error, files: string[]) {
                if (error) return error;
                resolve(files);
            });
        })
    }

    /**
     *
     * @param directory
     * @param name
     */
    static readModelFiles(directory: string, name: string) {
        fs.readdir(directory, function (error, files: string[]) {
            let fileExist: boolean;
            console.log(name, files)
            const result = files.find(item => item.slice(0, -3) === name);

            fileExist = result?.slice(0, -3) === name

            if (!fileExist) {
                console.log(MESSAGES.ERROR_MODEL(name));
                process.exit(1);
            }
        });
    }

    /**
     *
     * @param directory
     * @param manager
     */
    static readManagerFiles(directory: string, manager: string) {
        if (manager === CONSTANTS.MYSQL || manager === CONSTANTS.POSTGRES) {
            fs.readdir(directory, function (error, files) {
                if (!files === undefined) {
                    let flag: boolean;
                    const searchManager = files.slice(0)[0].split("-")[1];

                    flag = searchManager === manager
                    if (!flag) {
                        console.log(MESSAGES.ERROR_MANAGER(manager, searchManager));
                        process.exit(1);
                    }
                }
                return;
            })
        }
    }
}
