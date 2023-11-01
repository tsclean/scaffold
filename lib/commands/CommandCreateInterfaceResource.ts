import ora from "ora";
import yargs from "yargs";

import { PATHS } from "../utils/paths";
import { EMOJIS } from "../utils/emojis";
import { MESSAGES } from "../utils/messages";
import { CommandUtils } from "./CommandUtils";
import { errorMessage } from "../utils/helpers";

export class CommandCreateInterfaceResource implements yargs.CommandModule {
  command = "create:interface-resource";
  describe = "Generate a new interface resource";

  builder(args: yargs.Argv) {
    return args
      .option("n", {
        alias: "name",
        describe: "Name the Interface",
        demandOption: true
      })
      .option("r", {
        alias: "resource",
        describe: "Interface resource",
        demandOption: true
      });
  }

  async handler(args: yargs.Arguments) {
    let spinner;
    let basePath: string;
    let fileName: string;
    let path: string;
    let fileExists: boolean;

    try {
      const fileContent = CommandCreateInterfaceResource.getTemplateInterface(
        args.name as any
      );

      setTimeout(() => (spinner = ora("Installing...").start()), 1000);

      CommandUtils.readModelFiles(
        PATHS.PATH_MODELS_ENTITY(),
        args.name as string
      );

      basePath = `${process.cwd()}/src/domain/entities/contracts`;
      fileName = `${args.name}-resource-repository.ts`;

      path = `${basePath}/${fileName}`;
      fileExists = await CommandUtils.fileExists(path);
      if (fileExists) throw MESSAGES.FILE_EXISTS(path);

      await CommandUtils.createFile(path, fileContent);

      setTimeout(() => {
        spinner.succeed("Installation completed");
        spinner.stopAndPersist({
          symbol: EMOJIS.ROCKET,
          text: MESSAGES.FILE_SUCCESS("Interface", path)
        });
      }, 1000 * 5);
    } catch (error) {
      setTimeout(
        () => (
          spinner.fail("Installation fail"), errorMessage(error, "interface")
        ),
        2000
      );
    }
  }

  /**
   * Get contents interface files
   * @param param
   * @protected
   */
  protected static getTemplateInterface(param: string) {
    const name = CommandUtils.capitalizeString(param);
    const nameTransform = param.replace(/-/g, "_");
    const nameRef = nameTransform.toUpperCase();
    
    return `import {Add${name}Params, ${name}Entity} from "@/domain/entities/${param}";

export const ${nameRef}_RESOURCE_REPOSITORY = "${nameRef}_RESOURCE_REPOSITORY";

export interface I${name}ResourceRepository {
    findAll: () => Promise<${name}Entity[]>;
    save: (data: Add${name}Params) => Promise<${name}Entity>;
    findById: (id: number) => Promise<${name}Entity>;
    update: (id: number, data: any) => Promise<boolean | undefined>
}
`;
  }
}
