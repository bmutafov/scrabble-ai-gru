import chalk from "chalk";

export const memoryUsage = () => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(
    chalk.blue(`ℹ The script uses approximately `) +
      chalk.red(`${Math.round(used * 100) / 100} MB`)
  );
};
