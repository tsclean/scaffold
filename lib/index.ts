import yargs from 'yargs'
import {InitCommand} from "./commands/CommandInit"
import {EntityCreateCommand} from './commands/CommandCreateEntity'
import {ServiceCreateCommand} from "./commands/CommandCreateService";
import {ControllerCreateCommand} from "./commands/CommandCreateController";
import {DatabaseCreateCommand} from "./commands/CommandCreateDatabase"
import {InterfaceCreateCommand} from "./commands/CommandCreateInterface";
import {AdapterCreateCommand} from "./commands/CommandCreateAdapter";

yargs.usage("Usage: $0 <command> [options]")
    .command(new InitCommand())
    .command(new DatabaseCreateCommand())
    .command(new AdapterCreateCommand())
    .command(new EntityCreateCommand())
    .command(new InterfaceCreateCommand())
    .command(new ServiceCreateCommand())
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
