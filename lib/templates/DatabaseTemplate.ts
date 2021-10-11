export class DatabaseTemplate {

    /**
     * Get content mongo-helper.ts file
     */
    static getTemplateMongoDatabase() {
        return `import {Collection, MongoClient} from "mongodb";

export const MongoHelper = {
    client: null as MongoClient,
    uri: null as string,

    async connect(uri: string): Promise<void> {
        this.uri = uri
        this.client = new MongoClient(uri)
        await this.client.connect()
    },

    async disconnect(): Promise<void> {
        await this.client.close()
        this.client = null
    },

    async getCollection(name: string): Promise<Collection> {
        return this.client.db().collection(name)
    },

    map: (data: any): any => {
        const {_id, ...rest} = data
        return Object.assign({}, rest, {id: _id})
    },

    mapCollection: (collection: any[]): any[] => {
        return collection.map(c => MongoHelper.map(c))
    }
}`
    }

    /**
     * Get content mysql-helper.ts file
     * @protected
     */
    static getTemplateMysqlDatabase() {
        return `import mysql from "mysql";
import {CONFIG_MYSQL} from "@/application/config/environment";

export const MysqlHelper = {
    connection: null as string,

    async connect(): Promise<void> {
        this.connection = mysql.createConnection(CONFIG_MYSQL)

        await this.connection.connect((err, result) => err ? console.log(err) : console.log("Connected MySQL."))
    },

    async disconnect(): Promise<void> {
        await this.connection.end()
    },
}`
    }

    static getTemplatePostgresDatabase() {
        return `import {Pool} from 'pg'
import {CONFIG_POSTGRES} from "@/application/config/environment";

export const PostgresHelper = {
    connection: null,

    async connect(): Promise<void> {
        this.connection = new Pool(CONFIG_POSTGRES)

        await this.connection.connect((err, result) => err ? console.log(err) : console.log("Connected Postgres."))
    },

    async disconnect():Promise<void> {
        this.connection.close()
    }
}
`
    }

    /**
     * Get content configuration for mongo in server.ts file
     */
    static getTemplateServerMongo() {
        return `import 'module-alias/register'
import {CleanFactory} from "clean-ts";

import { AppContainer } from '@/application/app';
import { MONGODB_URI, PORT } from '@/application/config/environment';
import { MongoHelper } from '@/infrastructure/driven-adapters/adapters/mongo-adapter/mongo-helper';

MongoHelper.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected DB')
        const app = await CleanFactory.create(AppContainer)
        await app.listen(PORT, () => console.log('Running on port ' + PORT))
    .catch(error => console.log(error))
})
`
    }

    /**
     * Get content configuration for mysql in server.ts file
     */
    static getTemplateServerMysql() {
        return `import 'module-alias/register'
import {CleanFactory} from "clean-ts";

import {AppContainer} from "./app";
import {PORT} from "./config/environment";
import {MysqlHelper} from "@/infrastructure/driven-adapters/adapters/mysql-adapter/mysql-helper";

MysqlHelper.connect()
    .then(async () => {
        const app = await CleanFactory.create(AppContainer)
        await app.listen(PORT, () => console.log('Running on port ' + PORT))})
    .catch(err => console.log(err))
`
    }

    /**
     * Get content configuration for postgres in server.ts file
     */
    static getTemplateServerPostgres() {
        return `import 'module-alias/register'
import {CleanFactory} from "clean-ts";

import {AppContainer} from "./app";
import {PORT} from "@/application/config/environment";
import {PostgresHelper} from "@/infrastructure/driven-adapters/adapters/postgres-adapter/postgres-helper";

PostgresHelper.connect()
    .then(async () => {
        const app = await CleanFactory.create(AppContainer)
        await app.listen(PORT, () => console.log('Running on port ' + PORT))})})
    .catch(err => console.log(err))
`
    }
}
