import { existsSync } from "fs";
import {
  ts,
  Project,
  SourceFile,
  VariableStatement,
  VariableDeclaration,
  VariableDeclarationKind,
  ArrayLiteralExpression
} from "ts-morph";
import { SingletonTypes } from "../types/SingletonTypes";
import { CommandUtils } from "../commands/CommandUtils";

/**
 * @class SingletonGenerateTemplate
 * @implements SingletonInterface
 * @access public
 * @author John Alejandro Piedrahita
 * @version 1.0.0
 */
export class SingletonGenerateTemplate {
  private static project: Project = new Project();

  static generate(params: SingletonTypes): void {
    const { filepath, manager, instance } = params;
    let sourceFile: SourceFile;
    let variableStatement: VariableStatement;
    let variableDeclaration: VariableDeclaration;
    let arrayLiteralExpression: ArrayLiteralExpression;

    if (existsSync(filepath)) {
      sourceFile =
        SingletonGenerateTemplate.project.addSourceFileAtPathIfExists(filepath);
    } else {
      sourceFile = SingletonGenerateTemplate.project.createSourceFile(
        filepath,
        "",
        {
          overwrite: true
        }
      );
    }

    /** Verifies if the variable is already declared */
    if (sourceFile.getVariableStatement("singletonInitializers")) {
      /** If the variable is already declared, retrieves the declaration and initializer */
      variableStatement = sourceFile.getVariableStatement(
        "singletonInitializers"
      )!;
      variableDeclaration = variableStatement.getDeclarations()[0];
      arrayLiteralExpression = variableDeclaration.getInitializerIfKindOrThrow(
        ts.SyntaxKind.ArrayLiteralExpression
      );
    } else {
      /** If the variable is not declared, declares it and retrieves the initializer */
      variableStatement = sourceFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: "singletonInitializers",
            type: "Array<() => Promise<void>>",
            initializer: "[]"
          }
        ],
        isExported: true
      });

      variableDeclaration = variableStatement.getDeclarations()[0];
      arrayLiteralExpression = variableDeclaration.getInitializerIfKindOrThrow(
        ts.SyntaxKind.ArrayLiteralExpression
      );
    }

    /** Adds the new function to the array */
    SingletonGenerateTemplate.getCodeBlockSingleton(
      arrayLiteralExpression,
      manager,
      instance
    );

    /** Adds imports dynamically based on the input parameters */
    SingletonGenerateTemplate.getCodeBlockImports(
      sourceFile,
      manager,
      instance
    );

    sourceFile.formatText({
      placeOpenBraceOnNewLineForFunctions: true
    });

    /** Save changes to the source file */
    sourceFile.saveSync();
  }

  /**
   * Método para incluir la instancia de conexión en el array singletonInitializers
   * en el archivo index.ts
   *
   * @param manager string
   * @param name string
   * @param orm string
   * @returns
   * ``` typescript
   * const singletonInitializers: Array<() => Promise<void>> = [
   *   async () => {
   *    const mysqlConfig = MysqlConfiguration.getInstance();
   *    await mysqlConfig.managerConnectionMysql();
   *  },
   * ];
   * ```
   */
  private static getCodeBlockSingleton(
    arrayLiteralExpression: ArrayLiteralExpression,
    manager: string,
    orm: string
  ) {
    return this.getCodeBlock(arrayLiteralExpression, null, manager, orm, false);
  }

  /**
   * Método para incluir los imports de las instancias, cuando se genera un ORM
   * en el archivo index.ts
   *
   * @param manager Nombre del gestor de base de datos (mysql, pg, mongoose)
   * @param orm Nombre del orm (sequelize, mongo)
   *
   * @returns
   * ``` typescript
   * import { MysqlConfiguration } from "@/application/config/mysql-instance";
   * ```
   */
  private static getCodeBlockImports(
    sourceFile: SourceFile,
    manager: string,
    orm: string
  ) {
    return this.getCodeBlock(null, sourceFile, manager, orm, true);
  }

  /**
   * 
   * @param arrayLiteralExpression ArrayLiteralExpression
   * @param sourceFile SourceFile
   * @param manager string
   * @param orm string
   * @param isImportBlock boolean
   * @returns 
   */
  private static getCodeBlock(
    arrayLiteralExpression: ArrayLiteralExpression,
    sourceFile: SourceFile,
    manager: string,
    orm: string,
    isImportBlock: boolean
  ) {
    const nameCapitalize = CommandUtils.capitalizeString(manager as string);
    const ormCapitalize = CommandUtils.capitalizeString(orm as string);
    const instance = manager === "mongoose" ? ormCapitalize : nameCapitalize;

    if (isImportBlock) {
      return sourceFile.addImportDeclaration({
        moduleSpecifier: `@/application/config/${manager}-instance`,
        namedImports: [`${instance}Configuration`]
      });
    } else {
      const codeBlock = `
        async () => {
            const ${manager}Config = ${instance}Configuration.getInstance();
            await ${manager}Config.managerConnection${instance}();
        },
      `;

      return arrayLiteralExpression.addElement(codeBlock);
    }
  }
}
