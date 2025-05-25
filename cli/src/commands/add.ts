import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import path from "path";
import { findComponents } from "../utils/component-find";
import { copyComponentFiles } from "../utils/file-copier";

export const addCommand = new Command("add")
  .description("Add a component to your project")
  .argument("[component]", "The component to add")
  .action(async (componentName) => {
    try {
      const rootDir = path.resolve(__dirname, "../../../");
      const components = await findComponents(rootDir);
    } catch (e) {}
  });
//   let selectedComponent: string | undefined = componentName;

//   if (!selectedComponent) {
//     // If no component specified, show interactive prompt
//     const { component } = await inquirer.prompt([
//       {
//         type: "list",
//         name: "component",
//         message: "Select a component to add:",
//         choices: Object.entries(components).map(([key, value]) => ({
//           name: `${value.name} - ${value.description}`,
//           value: key,
//         })),
//       },
//     ]);
//     selectedComponent = component;
//   }

//   const component = components[selectedComponent?.toLowerCase() as string];
//   if (!component) {
//     console.error(chalk.red(`Component "${selectedComponent}" not found.`));
//     process.exit(1);
//   }

//   // Get the current working directory
//   const cwd = process.cwd();

//   // Copy component files
//   await copyComponentFiles(rootDir, cwd, component.files);

//   console.log(
//     chalk.green(`\nSuccessfully added ${component.name} component!`)
//   );
// } catch (error) {
//   console.error(chalk.red("Error:"), error);
//   process.exit(1);
// }
