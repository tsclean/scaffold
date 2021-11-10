# Clean Architecture Scaffold

This CLI creates the structure of a NodeJs and TypeScript project based on clean architecture to build REST full APIs, it comes with the initial configuration of an Express application as a NodeJs framework and this is located in the **`application layer`**.

- [Clean Architecture Scaffold](#clean-architecture-scaffold)
- [Implementation of the plugin](#Implementation-of-the-plugin)
- [Tasks](#tasks)
  - [Project Generation](#project-generation)
  - [Model Generation](#model-generation)
  - [Interface Generation](#interface-generation)
  - [Service Generation](#service-generation)
  - [Adapter ORM Generation](#adapter-orm-generation)
  - [Controller Generate](#controller-generation)
  

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

   Example: **`--name=user, --name=user-detail, --name=post-comments-user.`**

```shell
   scaffold create:entity --name=[model name]
```

## Interface Generation

1. The **`scaffold create:interface`** command generates an interface, the location of the file is according to the
   component where it is required. where it is required. The name must have a hyphen in case it is a compound name.


   Example: **`--name=user, --name=user-detail, --name=post-comments-user.`**

```shell
   scaffold create:interface --name=user-detail --path=model
```

```shell
   scaffold create:interface --name=user-detail --path=service
```

```shell
   scaffold create:interface --name=user-detail --path=infra
```


## Service Generation

1. The **`scaffold create:service`** command will generate the interface and the service that implements it in the **`domain layer [use-cases]`**.
   **`domain layer [use-cases]`**, this task has **`--name`** as parameter and this is required. The name must have a hyphen in case it is a compound name.

   Example: **`--name=user, --name=user-detail, --name=post-comments-user.`**

```shell
   scaffold create:service --name=[service name]
```

## Adapter ORM Generation

1. The **`scaffold create:adapter-orm`** command will generate an adapter in the **`infrastructure layer`**, 
   this task has **`--name`** and **`--orm`** as parameters this is required. The name of the **`--manager`** parameter corresponds to the database manager.
   After the adapter is generated, the provider must be included in the app.ts file and then the name of the provider in the corresponding service must be passed through the constructor.


   Example: **`--name=user --orm=sequelize --manager=mysql`**


2. By convention the plugin handles names in singular, this helps to create additional code that benefits each component. 
   In this case when you create the adapter with the name that matches the entity in the domain models folder, it does the automatic import in all the component of the adapter.

- command to generate the sequelize orm.

```shell
   scaffold create:adapter-orm --name=[adapter name] --orm=sequelize --manager=[database manager]
```

- command to generate the mongoose orm.

```shell
   scaffold create:adapter--orm --name=[adapter name] --orm=mongoose 
```

## Controller Generation

1. The **`scaffold create:controller`** command will generate a controller in the **`infrastructure layer`**,
   this task has **`--name`** as parameter and this is required. The name must have a hyphen in case it is a compound name.

   Example: **`--name=user, --name=user-detail, --name=post-comments-user.`**

```shell
   scaffold create:controller --name=[controller name]
```

| HTTP verbs    | Decorators    |
| ------------- |:-------------:|
| GET           | @Get()        |
| POST          | @Post()       |   
| PUT           | @Put()        |    
| DELETE        | @Delete()     |
| BODY          | @Body()       |
| PARAMS        | @Param()      |

---

