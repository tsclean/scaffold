import yargs from 'yargs'
import {InitCommand} from "./commands/CommandInit"
import {EntityCreateCommand} from './commands/CommandCreateEntity'
import {ServiceCreateCommand} from "./commands/CommandCreateService";
import {ControllerCreateCommand} from "./commands/CommandCreateController";
import {InterfaceCreateCommand} from "./commands/CommandCreateInterface";
import {AdapterCreateCommand} from "./commands/CommandCreateAdapter";
import {CommandCreateAdapterSimple} from "./commands/CommandCreateAdapterSimple";
import {CommandCreateServiceResource} from "./commands/CommandCreateServiceResource";
import {CommandCreateInterfaceResource} from './commands/CommandCreateInterfaceResource';

yargs.scriptName("scaffold").usage("Usage: $0 <command> [options]")
    .command(new InitCommand())
    .command(new AdapterCreateCommand())
    .command(new CommandCreateAdapterSimple())
    .command(new EntityCreateCommand())
    .command(new InterfaceCreateCommand())
    .command(new CommandCreateInterfaceResource())
    .command(new ServiceCreateCommand())
    .command(new CommandCreateServiceResource())
    .command(new ControllerCreateCommand())
    .recommendCommands()
    .demandCommand(1)
    .strict()
    .alias("v", "version")
    .help("h")
    .alias("h", "help")
    .argv

require("yargonaut")
    .style("blue")
    .style("yellow", "required")
    .helpStyle("green")
    .errorsStyle("red");
