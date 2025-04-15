import { existsSync } from "fs";
import {
  ts,
  Project,
  SourceFile,
  VariableStatement,
  VariableDeclaration,
  VariableDeclarationKind,
  ArrayLiteralExpression,
  ArrowFunction,
  SyntaxKind
} from "ts-morph";
import { SingletonTypes } from "../types/SingletonTypes";
import { CommandUtils } from "../commands/CommandUtils";

export class SingletonGenerateTemplate {
  private static project: Project = new Project();

  static generate(params: SingletonTypes): void {
    const { filepath, manager, instance } = params;
    let sourceFile: SourceFile;
    let variableStatement: VariableStatement;
    let variableDeclaration: VariableDeclaration;
    let arrayLiteralExpression: ArrayLiteralExpression;

    if (existsSync(filepath)) {
      sourceFile = SingletonGenerateTemplate.project.addSourceFileAtPathIfExists(filepath);
    } else {
      sourceFile = SingletonGenerateTemplate.project.createSourceFile(filepath, "", { overwrite: true });
    }

    if (sourceFile.getVariableStatement("singletonInitializers")) {
      variableStatement = sourceFile.getVariableStatement("singletonInitializers")!;
      variableDeclaration = variableStatement.getDeclarations()[0];
      arrayLiteralExpression = variableDeclaration.getInitializerIfKindOrThrow(ts.SyntaxKind.ArrayLiteralExpression);
    } else {
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
      arrayLiteralExpression = variableDeclaration.getInitializerIfKindOrThrow(ts.SyntaxKind.ArrayLiteralExpression);
    }

    SingletonGenerateTemplate.getCodeBlockSingleton(arrayLiteralExpression, manager, instance);
    SingletonGenerateTemplate.getCodeBlockImports(sourceFile, manager, instance);

    sourceFile.formatText({ placeOpenBraceOnNewLineForFunctions: true });
    sourceFile.saveSync();
  }

  private static getCodeBlockSingleton(
    arrayLiteralExpression: ArrayLiteralExpression,
    manager: string,
    orm: string
  ) {
    const nameCapitalize = CommandUtils.capitalizeString(manager);
    const ormCapitalize = CommandUtils.capitalizeString(orm);
    const instance = manager === "mongoose" ? ormCapitalize : nameCapitalize;
    const varName = `${manager}Config`;
    const expectedSnippet = `const ${varName} = ${instance}Configuration.getInstance();`;

    const alreadyExists = arrayLiteralExpression.getElements().some((el) => {
      const arrowFn = el.asKind(SyntaxKind.ArrowFunction);
      if (!arrowFn) return false;

      const bodyText = arrowFn.getBody().getText();
      return bodyText.includes(expectedSnippet);
    });

    if (!alreadyExists) {
      arrayLiteralExpression.addElement(`async () => {
        const ${varName} = ${instance}Configuration.getInstance();
        await ${varName}.managerConnection${instance}();
      }`);
    }
  }

  private static getCodeBlockImports(
    sourceFile: SourceFile,
    manager: string,
    orm: string
  ) {
    const nameCapitalize = CommandUtils.capitalizeString(manager);
    const ormCapitalize = CommandUtils.capitalizeString(orm);
    const instance = manager === "mongoose" ? ormCapitalize : nameCapitalize;

    const alreadyImported = sourceFile.getImportDeclarations().some((decl) => {
      return decl.getNamedImports().some((imp) => imp.getName() === `${instance}Configuration`);
    });

    if (!alreadyImported) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: `@/application/config/${manager}-instance`,
        namedImports: [`${instance}Configuration`]
      });
    }
  }
}
