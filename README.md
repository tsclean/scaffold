# Clean Architecture Scaffold

This CLI creates the structure of a NodeJs and TypeScript project based on clean architecture to build REST full APIs, it comes with the initial configuration of an Express application as a NodeJs framework and this is located in the **`application layer`**.

- [Clean Architecture Scaffold](#clean-architecture-scaffold)
- [Implementation of the plugin](#Implementation-of-the-plugin)
- [Tasks](#tasks)
  - [Project Generation](#project-generation)
  - [Model Generation](#model-generation)
  - [Interface Generation](#interface-generation)
  - [Interface Resource Generation](#interface-resource-generation)
  - [Service Generation](#service-generation)
  - [Service Resource Generation](#service-resource-generation)
  - [Adapter ORM Generation](#adapter-orm-generation)
  - [Adapter Simple Generation](#adapter-simple-generation)
  - [Controller Generate](#controller-generation)
  - [Decorators](#decorators)
  - [Example of use case](#example-of-use-case)
  

# Implementation of the plugin

We install the plugin globally in our computer, to be able to access the commands that generate the tasks.
the tasks.

```shell
    npm i -g @tsclean/scaffold
```
   
# Tasks

## Project Generation

1. We generate the project structure with the command **`scaffold create:project`**, which receives one parameter **`--name`**.

```shell
   scaffold create:project --name=[project name]
```

```shell
   cd project name
```

## Model Generation

1. The **`scaffold create:entity`** command will generate a model in the **`domain layer [models]`**, this task has **`--name`** as parameter and this is required.
   The name must have a middle hyphen in case it is compound.

   Example: **`--name=user`**

```shell
   scaffold create:entity --name=user
```

## Interface Generation

1. The **`scaffold create:interface`** command generates an interface, the location of the file is according to the
   component where it is required. where it is required. The name must have a hyphen in case it is a compound name.


   Example: **`--name=user, --name=user-detail, --name=post-comments-user.`**

```shell
   scaffold create:interface --name=user-detail --path=entities
```

```shell
   scaffold create:interface --name=user-detail --path=service
```

```shell
   scaffold create:interface --name=user-detail --path=infra
```

## Interface Resource Generation

1. The command **`scaffold create:interface-resource`** generates an interface, this task has **`--name`** and **`--resource`** as parameters this is required.
   The name must be in lower case, as it is in the model.


    Example: **`--name=user`**

```shell
   scaffold create:interface-resource --name=user --resource
```

## Service Generation

1. The **`scaffold create:service`** command will generate the interface and the service that implements it in the **`domain layer [use-cases]`**, this task has **`--name`** as parameter and this is required. The name must be hyphenated if it is a compound name.

   Example: **`--name=user, --name=user-detail, --name=post-comments-user.`**

```shell
   scaffold create:service --name=user
```

## Service Resource Generation

1. The **`scaffold create:service-resource`** command will generate the interface and the service that implements it in the **`domain layer [use-cases]`**,
   this task has **`--name`** as parameter and **`--resource`** this is required. The name must be in lower case, as it is in the model.


   Example: **`--name=user --resource`**

```shell
   scaffold create:service --name=user --resource
```


## Adapter ORM Generation

1. The **`scaffold create:adapter-orm`** command will generate an adapter in the **`infrastructure layer`**, 
   this task has **`--name`** and **`--orm`** as parameters this is required. The name of the **`--manager`** parameter corresponds to the database manager.
   After the adapter is generated, the provider must be included in the app.ts file and then the name of the provider in the corresponding service must be passed through the constructor.


   Example: **`--name=user --orm=sequelize --manager=mysql`**


2. By convention the plugin handles names in singular, this helps to create additional code that benefits each component. 
   In this case when you create the adapter with the name that matches the entity in the domain models folder, it does the automatic import in all the component of the adapter.

- command to generate sequelize orm.

```shell
   scaffold create:adapter-orm --name=user --orm=sequelize --manager=mysql
```

- command to generate the mongoose orm.

```shell
   scaffold create:adapter-orm --name=user --orm=mongoose 
```

## Adapter Simple Generation

1. The **`scaffold create:adapter`** command will generate an adapter simple in the **`infrastructure layer`**,
   this task has **`--name`** as parameter and this is required.

```shell
   scaffold create:adapter --name=jwt
```

## Controller Generation

1. The **`scaffold create:controller`** command will generate a controller in the **`infrastructure layer`**,
   this task has **`--name`** as parameter and this is required. The name must have a hyphen in case it is a compound name.

   Example: **`--name=user, --name=user-detail, --name=post-comments-user.`**

```shell
   scaffold create:controller --name=user-detail
```

## Decorators

Decorators allow us to add annotations and metadata or change the behavior of classes, properties, methods, parameters and accessors.

`@Services` Decorator to inject the logic of this class as a service.

```typescript
@Services
export class UserServiceImpl {}
```

`@Adapter` Decorator to keep the reference of an interface and to be able to apply the SOLID principle of Dependency Inversion.

```typescript
// Constant to have the interface reference.
export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository<T> {
    save: (data: T) => Promise<T>
}

@service
export class UserServiceImpl {
    constructor(
        @Adapter(USER_REPOSITORY)
        private readonly userRespository: IUserRepository
    ) {}
}
```

`@Mapping` Decorator that allows us to create the path of an end point.

```typescript
@Mapping('api/v1/users')
export class UserController {}
```

#### Decorators HTTP

`@Get()` Decorator to solve a request for a specific resource.

`@Post()` Decorator used to send an entity to a specific resource.

`@Put()` Decorator that replaces the current representations of the target resource with the payload of the request.

`@Delete()` Decorator that deletes the specific resource.

`@Params()` Decorator to read the parameters specified in a method.

`@Body()` Decorator that passes the payload of a method in the request.

```typescript
@Mapping('api/v1/users')
export class UserController {
    
    @Get()
    getAllUsers() {}
    
    @Get(':id')
    getByIdUser(@Params() id: string | number) {}
    
    @Post()
    saveUser(@Body() data: T) {}
    
    @Put(':id')
    updateByIdUser(@Params() id: string | number, @Body data: T) {}
    
    @Delete(':id')
    deleteByIdUser(@Params() id: string | number) {}
}
```

## Example of use case

- Create a user in the store

1. Create the project.

```shell
scaffold create:project --name=store
```
2. Create entity user

```shell
scaffold create:entity --name=user
```

```typescript
// src/domain/entities/user.ts
export type UserEntity = {
    id: string | number;
    name: string;
    email: string;
}

export type AddUserParams = Omit<UserEntity, 'id'>
```

3. Create the contract to create the user.
```shell
scaffold create:interface --name=user --path=entities
```

```typescript
// src/domain/models/contracts/user-repository.ts
import {AddUserParams, UserModel} from "@/domain/entities/user";

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
    save: (data:AddUserParams) => Promise<UserModel>;
}
```

4. Create services user
```shell
scaffold create:service --name=user
```

```typescript
// src/domain/use-cases/user-service.ts
import {AddUserParams, UserEntity} from "@/domain/entities/user";

export const USER_SERVICE = 'USER_SERVICE';

export interface IUserService {
    save: (data: AddUserParams) => Promise<UserEntity>;
}
```

```typescript
// src/domain/use-cases/impl/user-service-impl.ts
import {Adapter, Service} from "@tsclean/core";
import {IUserService} from "@/domain/use-cases/user-service";
import {UserModel} from "@/domain/models/user";
import {IUserRepository, USER_REPOSITORY} from "@/domain/models/contracts/user-repository";

@Service()
export class UserServiceImpl implements IUserService {

    constructor(
        // Decorator to keep the reference of the Interface, by means of the constant.
        @Adapter(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}

    /**
     * Method to send the data to the repository.
     * @param data {@code UserEntity}
     */
    async save(data: AddUserParams): Promise<UserEntity> {
        // Send the data to the repository.
        return this.userRepository.save({...data});
    }
}
```

5. Create mongoose adapter and additionally you must include the url of the connection in the `.env` file

```shell
scaffold create:adapter-orm --name=user --orm=mongoose 
```
```typescript
// src/infrastructure/driven-adapters/adapters/orm/mongoose/models/user.ts
import { UserEntity } from '@/domain/entities/user';
import { model, Schema } from "mongoose";

const schema = new Schema<UserEntity>({
    id: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    }
}, {strict: false});

export const UserModelSchema = model<UserEntity>('users', schema);
```

```typescript
// src/infrastructure/driven-adapters/adapters/orm/mongoose/user-mongoose-repository-adapter.ts
import {AddUserParams, UserEntity} from "@/domain/entities/user";
import {IUserRepository} from "@/domain/models/contracts/user-repository";
import {UserModelSchema as Schema} from "@/infrastructure/driven-adapters/adapters/orm/mongoose/models/user";

export class UserMongooseRepositoryAdapter implements IUserRepository {
    async save(data: AddUserParams): Promise<UserEntity> {
        return Schema.create(data);
    }
}
```

6. Pass the key:value to do the dependency injections

```typescript
// src/infrastructure/driven-adapters/providers/index.ts
import {USER_SERVICE} from "@/domain/use-cases/user-service";
import {USER_REPOSITORY} from "@/domain/models/contracts/user-repository";
import {UserServiceImpl} from "@/domain/use-cases/impl/user-service-impl";
import {
    UserMongooseRepositoryAdapter
} from "@/infrastructure/driven-adapters/adapters/orm/mongoose/user-mongoose-repository-adapter";

export const adapters = [
    {
        // Constant referring to the interface
        provide: USER_REPOSITORY,
        // Class that implements the interface
        useClass: UserMongooseRepositoryAdapter
    }
];

export const services = [
    {
        // Constant referring to the interface
        provide: USER_SERVICE,
        // Class that implements the interface
        useClass: UserServiceImpl
    }
];
```

7. Create controller user

```shell
scaffold create:controller --name=user
```

```typescript
// src/infrastructure/entry-points/api/user-controller.ts
import {Mapping, Post, Body} from "@tsclean/core";

import {AddUserParams, ModelUser} from "@/domain/models/user";
import {IUserService, USER_SERVICE} from "@/domain/use-cases/user-service";

@Mapping('api/v1/users')
export class UserController {

    constructor(
        // Decorator to keep the reference of the Interface, by means of the constant.
        @Adapter(USER_SERVICE)
        private readonly userService: IUserService
    ) {}

    @Post()
    async saveUserController(@Body() data: AddUserParams): Promise<ModelUser | any> {
        // Send the data to the service through the interface.
        const user = await this.userService.save(data);

        return {
            message: 'User created successfully',
            user
        }
    }
}
```

8. Finally you can test this endpoint `http://localhost:9000/api/v1/users`, method `POST` in the rest client of your choice and send the corresponding data.
---

