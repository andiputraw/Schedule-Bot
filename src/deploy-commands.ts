import { REST, Routes } from "discord.js";
import config from "../config.json" assert { type: "json" };
import { CommandModule } from "./types.js";

import fs from "node:fs";
import path from "node:path";

const commands = [];

const commandPath = path.join(
  new URL(".", import.meta.url).pathname,
  "commands"
);
const commandFile = fs
  .readdirSync(commandPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFile) {
  const command = (await import("./commands/" + file)) as CommandModule;
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(config.token);

try {
  console.log(`Started refreshing ${commands.length} appliction (/) commands`);
  const data = await rest.put(
    Routes.applicationGuildCommands(config.clientId, config.guildId),
    { body: commands }
  );

  console.log(`Succesfully reloaded ${commands.length} Commands`);
} catch (error) {
  console.error(error);
}
