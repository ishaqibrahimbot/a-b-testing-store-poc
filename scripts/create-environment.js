/* eslint-disable @typescript-eslint/no-require-imports */
process.loadEnvFile();

const contentful = require("contentful-management");
const gitBranch = require("git-branch");
const fs = require("fs/promises");
const path = require("path");

async function createEnvironment() {
  const client = contentful.createClient(
    {
      accessToken: process.env.CMA_TOKEN,
    },
    { type: "plain" }
  );

  let branchName = gitBranch.sync();

  branchName = branchName.replace("/", "-");

  const environment = await client.environment.createWithId(
    {
      spaceId: process.env.SPACE_ID,
      environmentId: branchName,
    },
    {
      name: branchName,
    }
  );

  const mcpJsonFile = path.resolve(__dirname, "..", ".cursor", "mcp.json");

  if (!fs.lstat(mcpJsonFile)) {
    console.log(
      `Success! Copy this environment ID to your mcp.json configuration for contentful: ${branchName}`
    );
    return;
  }
  const mcpConfigRaw = await fs.readFile(mcpJsonFile, { encoding: "utf-8" });

  const mcpConfig = JSON.parse(mcpConfigRaw);

  if (mcpConfig?.mcpServers?.contentful?.env) {
    mcpConfig.mcpServers.contentful.env.ENVIRONMENT_ID = branchName;

    await fs.writeFile(mcpJsonFile, JSON.stringify(mcpConfig, null, 2), {
      encoding: "utf-8",
    });
  } else {
    console.log(
      "Looks like you don't have the contentful mcp installed. Please install that."
    );
  }
}

createEnvironment();
