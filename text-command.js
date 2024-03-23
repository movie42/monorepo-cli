const readline = require("readline");
const { spawn } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const packages = ["A", "B"];
const workspaces = ["admin", "client", "check"];

const askForPackageToInstall = async () => {
  const customCommandInput = await new Promise((resolve) => {
    rl.question("Enter the custom command (e.g., add react): ", resolve);
  });
  return customCommandInput;
};

const askQuestion = (question, choices) => {
  return new Promise((resolve) => {
    console.log(question);
    choices.forEach((choice, index) => {
      console.log(`${index + 1}: ${choice}`);
    });
    rl.question("Enter your choice (number): ", (answer) => {
      const choiceIndex = parseInt(answer, 10) - 1;
      if (choiceIndex >= 0 && choiceIndex < choices.length) {
        resolve(choices[choiceIndex]);
      } else {
        console.log("Invalid choice, please try again.");
        resolve(askQuestion(question, choices));
      }
    });
  });
};

const runCommand = (workspace, package, command) => {
  const args = [`workspace`, `@${package}/${workspace}`, ...command.split(" ")];

  console.log(`Executing: yarn ${args.join(" ")}`);

  childProcess = spawn("yarn", args, { stdio: "inherit" });

  childProcess.on("error", (error) => {
    console.error(`Error: ${error}`);
    process.exit(1);
  });

  childProcess.on("close", (code) => {
    console.log(`Process exited with code ${code}`);
    process.exit();
  });
};

process.on("SIGINT", () => {
  console.log("Received SIGINT. Cleaning up...");

  rl.close();

  process.stdin.destroy();

  if (childProcess) {
    childProcess.on("exit", function () {
      process.exit();
    });

    childProcess.kill("SIGINT");
  } else {
    process.exit();
  }
});

const main = async () => {
  const workspace = await askQuestion("Select a workspace:", workspaces);
  const package = await askQuestion("Select a package:", packages);
  const command = await askForPackageToInstall();
  runCommand(workspace, package, command);
};

main();
