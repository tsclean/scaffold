import ora from "ora";
import * as yargs from "yargs";

import { PATHS } from "../utils/paths";
import { EMOJIS } from "../utils/emojis";
import { MESSAGES } from "../utils/messages";
import { CommandUtils } from "./CommandUtils";
import { CONSTANTS } from "../utils/constants";
import { errorMessage } from "../utils/helpers";

export class CommandCreateServiceResource implements yargs.CommandModule {
  command = "create:service-resource";
  describe = "Generate a new service resource";

  builder(args: yargs.Argv) {
    return args
      .option("name", {
        alias: "n",
        describe: "Name the service",
        demandOption: true
      })
      .option("resource", {
        alias: "r",
        describe: "Service resource",
        demandOption: true
      });
  }

  async handler(args: yargs.Arguments) {
    let spinner;

    setTimeout(async () => (spinner = ora(CONSTANTS.INSTALLING).start()), 1000);

    const basePath = PATHS.PATH_SERVICE_RESOURCE();
    const fileService = `${basePath}/${args.name}-service-resource-impl.ts`;
    const fileContract = `${process.cwd()}/src/domain/use-cases/${
      args.name
    }-service-resource.ts`;

    const fileServiceExists = await CommandUtils.fileExists(fileService);

    if (fileServiceExists) throw MESSAGES.FILE_EXISTS(fileService);

    try {
      await CommandUtils.createFile(
        `${fileContract}`,
        CommandCreateServiceResource.getServiceResourceInterface(
          args.name as string
        )
      );
      await CommandUtils.createFile(
        `${fileService}`,
        CommandCreateServiceResource.getServiceResource(args.name as string)
      );

      setTimeout(() => {
        spinner.succeed("Installation completed");
        spinner.stopAndPersist({
          symbol: EMOJIS.ROCKET,
          prefixText: MESSAGES.REPOSITORY_SUCCESS(fileContract),
          text: MESSAGES.FILE_SUCCESS("Services resource", fileService)
        });
      }, 1000 * 5);
    } catch (error) {
      setTimeout(
        () => (
          spinner.fail("Installation fail"), errorMessage(error, "service")
        ),
        2000
      );
    }
  }

  static getServiceResourceInterface(param: string): string {
    const name = CommandUtils.capitalizeString(param);
    const nameTransform = param.replace(/-/g, "_");
    const nameRef = nameTransform.toUpperCase();

    return `export const ${nameRef}_RESOURCE_SERVICE = "${nameRef}_RESOURCE_SERVICE";

export interface I${name}ResourceService {
    findAll: () => Promise<any[]>;
    save: (data: any) => Promise<any>;
    findById: (id: number) => Promise<any>;
    update: (id: number, data: any) => Promise<boolean | undefined>
}
`;
  }

  static getServiceResource(param: any): string {
    const name = CommandUtils.capitalizeString(param);
    return `import {Service} from "@tsclean/core";
import {I${name}ResourceService} from "@/domain/use-cases/${param}-service-resource";

@Service()
export class ${name}ServiceImpl implements I${name}ResourceService {
    constructor() {
    }
    
    // Se debe de tipar la devolución de la promesa
     async findAll(): Promise<any[]> {
        return Promise.resolve([]);
    }
    
    // Se debe de tipar la devolución de la promesa
    async findById(id: number): Promise<any> {
        return Promise.resolve(undefined);
    }

    // Se debe de tipar la devolución de la promesa y el input de la data
    async save(data: any): Promise<any> {
        return Promise.resolve(undefined);
    }

    // Se debe de tipar el input de la data
    async update(id: number, data: any): Promise<boolean | undefined> {
        return Promise.resolve(undefined);
    }
}`;
  }
}
