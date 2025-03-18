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
    host     : process.env.DB_HOST_MYSQL,
    user     : process.env.DB_USER_MYSQL,
    password : process.env.DB_PASSWORD_MYSQL,
    database : process.env.DATABASE_MYSQL,
    port     : process.env.DB_PORT_MYSQL
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
export const CONFIG_PG = {
    host        : process.env.DB_HOST_POSTGRES,
    user        : process.env.DB_USER_POSTGRES,
    database    : process.env.DATABASE_POSTGRES,
    password    : process.env.DB_PASSWORD_POSTGRES,
    port        : process.env.DB_PORT_POSTGRES,
}
`;
  }

  /**
   * Gets content of the app.ts file
   * @returns
   */
  static getAppTemplate(): string {
    return `import {Container} from "@tsclean/core";
import {controllers} from "@/infrastructure/entry-points/api";
import {services, adapters} from "@/infrastructure/driven-adapters/providers";

@Container({
    providers: [...services, ...adapters],
    controllers: [...controllers]
})

export class AppContainer {}
`;
  }

  /**
   * Get contents of tsconfig.json file
   * @returns
   */
  static getTsConfigTemplate(): string {
    return JSON.stringify(
      {
        compilerOptions: {
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          outDir: "./dist",
          module: "commonjs",
          target: "es2019",
          esModuleInterop: true,
          sourceMap: true,
          rootDirs: ["src", "tests"],
          baseUrl: "src",
          paths: {
            "@/tests/*": ["../tests/*"],
            "@/*": ["*"]
          }
        },
        include: ["src", "tests"],
        exclude: []
      },
      undefined,
      3
    );
  }

  /**
   * Gets contents of the new readme.md file.
   * @returns
   */
  static getReadmeTemplate(): string {
    return `## Awesome Project Build with Clean Architecture

Steps to run this project:

1. Run \`npm watch\` command

`;
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
        `;
  }

  static getDockerCompose() {
    return `version: '3.1'
services:
# Api Service
  api:
    build:
        context: .
        dockerfile: ./src/deployment/Dockerfile
    volumes:
        - ./:/app
        - /app/node_modules
    ports:
        - "9000:9000"
    environment:
        - NODE_ENV=development
        - PORT=9000
    command: sh -c 'npm install && npm run watch'
    networks:
        - api_network

#   # MySQL Service
#   mysql:
#     image: mysql:8.0
#     container_name: mysql
#     command: --default-authentication-plugin=mysql_native_password
#     restart: always
#     ports:
#       - \${DB_PORT_MYSQL}:3306
#     environment:
#       MYSQL_DATABASE: \${DATABASE_MYSQL}
#       MYSQL_ROOT_PASSWORD: \${DB_PASSWORD_MYSQL}
#       MYSQL_PASSWORD: \${DB_PASSWORD_MYSQL}
#       MYSQL_USER: \${DB_USER_MYSQL}
#       SERVICE_TAGS: dev
#       SERVICE_NAME: mysql
#     volumes:
#       - mysql_data:/var/lib/mysql
#     networks:
#       - api_network

#   # Mongo Service
#   mongo:
#     image: mongo
#     restart: always
#     container_name: mongo
#     ports:
#       - "27017:27017"
#     volumes:
#       - mongo_db:/data/db
#       - mongo_config:/data/config
#     networks:
#       - api_network

#   # Pg Service
#   postgres:
#     image: postgres:latest
#     container_name: api_postgres
#     environment:
#       POSTGRES_USER: \${DB_USER_POSTGRES}
#       POSTGRES_PASSWORD: \${DB_PASSWORD_POSTGRES}
#       POSTGRES_DB: \${DATABASE_POSTGRES}
#     ports:
#       - \${DB_PORT_POSTGRES}:5432
#     volumes:
#       - postgres_db:/var/lib/postgresql/data
#     networks:
#       - api_network

#   # pgAdmin Service
#   pgadmin:
#     image: dpage/pgadmin4:latest
#     environment:
#       PGADMIN_DEFAULT_EMAIL: admin@example.com # Change to the email you want to use to login to pgAdmin
#       PGADMIN_DEFAULT_PASSWORD: admin # Change to the password you want to use to login to pgAdmin
#     ports:
#       - "5050:80"
#     depends_on:
#       - postgres
#     networks:
#       - api_network

#   # phpAdmin Service
#   phpmyadmin:
#     image: phpmyadmin
#     depends_on:
#       - mysql
#     environment:
#       - UPLOAD_LIMIT=200M
#       - POST_MAX_SIZE=200M
#       - PHP_UPLOAD_MAX_FILESIZE=200M
#     ports:
#       - "8080:80"
#     networks:
#       - api_network

#   # mongoexpress Service
#   mongoexpress:
#     image: mongo-express
#     ports:
#       - "8081:8081"
#     depends_on:
#       - mongo
#     environment:
#       ME_CONFIG_MONGODB_URL: mongodb://mongo:27017/
#     networks:
#       - api_network

# volumes:
#   mysql_data:
#   mongo_db:
#   mongo_config:
#   postgres_db:

networks:
  api_network:
    driver: bridge
    `;
  }

  /**
   * Gets contents of the package.json file.
   * @param projectName
   * @returns
   */
  static getPackageJsonTemplate(projectName?: string): string {
    return JSON.stringify(
      {
        name: projectName || "clean-architecture",
        version: "1.0.0",
        description: "Awesome project developed with Clean Architecture",
        scripts: {},
        dependencies: {},
        devDependencies: {},
        _moduleAliases: {},
        engines: {}
      },
      undefined,
      3
    );
  }

  /**
   * Appends to a given package.json template everything needed.
   * @param packageJson
   * @returns
   */
  static appendPackageJson(packageJson: string): string {
    const packageJsonContent = JSON.parse(packageJson);

    if (!packageJsonContent.devDependencies)
      packageJsonContent.devDependencies = {};
    Object.assign(packageJsonContent.devDependencies, {
      "@types/node": "^20.8.4",
      "@types/jest": "^29.5.14",
      jest: "^29.7.0",
      nodemon: "^3.0.7",
      rimraf: "^6.0.1",
      "ts-jest": "^29.2.5",
      "ts-node": "^10.9.2",
      typescript: "^5.6.3"
    });

    packageJsonContent.dependencies["@tsclean/core"] = "^1.13.0";
    packageJsonContent.dependencies["dotenv"] = "^16.4.5";
    packageJsonContent.dependencies["helmet"] = "^8.0.0";
    packageJsonContent.dependencies["module-alias"] = "^2.2.3";

    packageJsonContent.scripts["start"] = "node ./dist/index.js";
    packageJsonContent.scripts["build"] =
      "rimraf dist && tsc -p tsconfig-build.json";
    packageJsonContent.scripts["watch"] =
      'nodemon --exec "npm run build && npm run start" --watch src --ext ts';

    packageJsonContent._moduleAliases["@"] = "dist";
    packageJsonContent.engines["node"] = ">=20.15.1";

    return JSON.stringify(packageJsonContent, undefined, 3);
  }

  static getEnvExampleTemplate() {
    return `# Mongo configuration
# If you run the project with the local configuration [docker-compose.yml],
# the host will be the Mongo container name
MONGO_DEVELOPMENT=
MONGO_PRODUCTION=

# Mysql configuration
DB_USER_MYSQL=
DB_PASSWORD_MYSQL=
DATABASE_MYSQL=
DB_PORT_MYSQL=
# If you run the project with the local configuration [docker-compose.yml],
# the host will be the MySQL container name
DB_HOST_MYSQL=

# Postgres configuration
DB_USER_POSTGRES=
DATABASE_POSTGRES=
DB_PASSWORD_POSTGRES=
DB_PORT_POSTGRES=
# If you run the project with the local configuration [docker-compose.yml],
# the host will be the postgres container name
DB_HOST_POSTGRES=

JWT_SECRET=
NODE_ENV=development
HOST=127.0.0.1
PORT=9000`;
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
}`;
  }

  static getDockerIgnore() {
    return `Dockerfile
 node_modules`;
  }

  static getIndexTemplate() {
    return `import "module-alias/register";

import helmet from 'helmet';
import { StartProjectInit } from "@tsclean/core";
        
import { AppContainer } from "@/application/app";
import { PORT } from "@/application/config/environment";
import { singletonInitializers } from "@/application/singleton";

async function init(): Promise<void> {
  /** Iterate the singleton functions */
  for (const initFn of singletonInitializers) {
    await initFn();
  }

  const app = await StartProjectInit.create(AppContainer)
  app.use(helmet());
  await app.listen(PORT, () => console.log(\`Running on port: \${PORT}\`))
}
   
void init().catch();`;
  }

  static getIndexApiTemplate() {
    return `export const controllers = [];`;
  }

  static getDockerfileTemplate(): string {
    return `FROM node:19.9.0

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install nodemon -g

COPY . .

EXPOSE 9000

CMD ["nodemon", "/dist/index.js"]
        `;
  }

  static getProvidersTemplate(): string {
    return `export const adapters = [];
        
export const services = [];`;
  }

  /**
   * Metodo para crear un array donde se alojarán los singletons de la aplicación
   *
   * @returns
   * ```typescript
   * export const singletonInitializers: Array<() => Promise<void>> = [];
   * ```
   */
  public static getSingleton(): string {
    return `/**
   * This array has all the singleton instances of the application
   */
  export const singletonInitializers: Array<() => Promise<void>> = [];
      `;
  }

  static getAdaptersIndex() {
    return ``;
  }

  static getDrivenAdaptersIndex() {
    return ``;
  }

  static getEntryPointsTemplate() {
    return ``;
  }
}
