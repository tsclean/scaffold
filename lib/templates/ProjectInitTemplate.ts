export class ProjectInitTemplate {

    /**
     * Get contents of environment.ts file
     * @returns
     */
    static getEnvironmentTemplate(): string {
        return `import dotenv from "dotenv";

dotenv.config({ path: ".env" })


/**
|----------------------------------------------------------------------------------------|
    App Configuration
|----------------------------------------------------------------------------------------|
*/
export const ENVIRONMENT = process.env.NODE_ENV;
const PROD = ENVIRONMENT === "production"
export const PORT = process.env.PORT


/**
|----------------------------------------------------------------------------------------|
    Authentication Configuration
|----------------------------------------------------------------------------------------|
*/

export const SESSION_SECRET = process.env.JWT_SECRET || ""

/**
* Use only if you include jwt
*/
// if (!SESSION_SECRET) process.exit(1)


/**
|----------------------------------------------------------------------------------------|
    Databases Configuration
|----------------------------------------------------------------------------------------|
*/

/**
*  MySQL
*/
export const CONFIG_MYSQL = {
    host     : process.env.HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DATABASE
}

/**
*  Mongo DB
*/
export const MONGODB_URI = PROD
    ? process.env.MONGO_PRODUCTION
    : process.env.MONGO_DEVELOPMENT
    
/**
 * Postgres
 */
export const CONFIG_POSTGRES = {
    host    : process.env.HOST,
    user    : process.env.DB_USER_POSTGRES,
    database: process.env.DATABASE_POSTGRES,
    password: process.env.DB_PASSWORD_POSTGRES,
    port: 5432,
}
`

    }

    /**
     * Gets content of the app.ts file
     * @returns
     */
    static getAppTemplate(): string {
        return `import {Container} from "@tsclean/core";

@Container({
    imports: [],
    controllers: [],
    providers: []
})

export class AppContainer {}
`
    }

    /**
     * Get contents of tsconfig.json file
     * @returns
     */
    static getTsConfigTemplate(): string {
        return JSON.stringify({
            "compilerOptions": {
                "experimentalDecorators": true,
                "emitDecoratorMetadata": true,
                "outDir": "./dist",
                "module": "commonjs",
                "target": "es2019",
                "esModuleInterop": true,
                "sourceMap": true,
                "rootDirs": ["src", "tests"],
                "baseUrl": "src",
                "paths": {
                    "@/tests/*": ["../tests/*"],
                    "@/*": ["*"]
                },
            },
            "include": ["src", "tests"],
            "exclude": []
        }, undefined, 3)
    }

    /**
     * Gets contents of the new readme.md file.
     * @returns
     */
    static getReadmeTemplate(): string {
        return `## Awesome Project Build with Clean Architecture

Steps to run this project:

1. Run \`npm watch\` command

`
    }

    /**
     *
     * @returns
     */
    static getGitIgnoreFile(): string {
        return `.idea/
.vscode/
node_modules/
build/
.env
package-lock.json
dist
        `
    }

    /**
     * Gets contents of the package.json file.
     * @param projectName
     * @returns
     */
    static getPackageJsonTemplate(projectName?: string): string {
        return JSON.stringify({
            name: projectName || "clean-architecture",
            version: "1.0.0",
            description: "Awesome project developed with Clean Architecture",
            scripts: {},
            dependencies: {},
            devDependencies: {},
            _moduleAliases: {}
        }, undefined, 3)
    }

    /**
     * Appends to a given package.json template everything needed.
     * @param packageJson
     * @param database
     * @returns
     */
    static appendPackageJson(packageJson: string, database: string): string {
        const packageJsonContent = JSON.parse(packageJson)

        if (!packageJsonContent.devDependencies) packageJsonContent.devDependencies = {}
        Object.assign(packageJsonContent.devDependencies, {
            "@types/node": "^16.9.1",
            "@types/jest": "^27.0.1",
            "nodemon": "^2.0.9",
            "rimraf": "^3.0.2",
            "ts-jest": "^27.0.5",
            "ts-node": "^10.2.1",
            "typescript": "^4.4.3"
        })

        switch (database) {
            case "mongodb":
                packageJsonContent.devDependencies["@shelf/jest-mongodb"] = "^2.0.3"
                packageJsonContent.devDependencies["@types/mongodb"] = "^4.0.7"
                packageJsonContent.dependencies["mongodb"] = "^4.1.1"
                break;
            default:
                break;
        }

        packageJsonContent.dependencies["@tsclean/core"] = "^1.0.1"
        packageJsonContent.dependencies["dotenv"] = "^10.0.0"
        packageJsonContent.dependencies["helmet"] = "^4.6.0"
        packageJsonContent.dependencies["module-alias"] = "^2.2.2"

        packageJsonContent.scripts["start"] = "node ./dist/index.js"
        packageJsonContent.scripts["build"] = "rimraf dist && tsc -p tsconfig-build.json"
        packageJsonContent.scripts["watch"] = "nodemon --exec \"npm run build && npm run start\" --watch src --ext ts"

        packageJsonContent._moduleAliases["@"] = "dist"

        return JSON.stringify(packageJsonContent, undefined, 3)
    }

    static getEnvExampleTemplate() {
        return `# Mongo configuration
MONGO_DEVELOPMENT=
MONGO_PRODUCTION=

# Mysql configuration
DB_USER=
DB_PASSWORD=
DATABASE=

# Postgres configuration
DB_USER_POSTGRES=
DATABASE_POSTGRES=
DB_PASSWORD_POSTGRES=
DB_PORT_POSTGRES=

JWT_SECRET=
NODE_ENV=development
HOST=127.0.0.1
PORT=9000`
    }

    static getTsConfigBuildTemplate() {
        return `{
  "extends": "./tsconfig.json",
  "exclude": [
    "coverage",
    "jest.config.js",
    "**/*.spec.ts",
    "**/*.test.ts",
    "**/tests"
  ]
}`
    }

    static getIndexTemplate() {
        return `import "module-alias/register";

import helmet from 'helmet';
import {StartProjectServer} from "@tsclean/core";
        
import {AppContainer} from "@/application/app";
import {PORT} from "@/application/config/environment";
    
async function init() {
    const app = await StartProjectServer.create(AppContainer)
    app.use(helmet());
    await app.listen(PORT, () => console.log('Running on port ' + PORT))
}
   
init();`
    }
}
