import fs from "fs";
import path from "node:path";

import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  CommandInteraction,
  ComponentBuilder,
} from "discord.js";
import config from "../config.json" assert { type: "json" };
import { CommandModule } from "./types.js";

async function getCommand(): Promise<Collection<unknown, unknown>> {
  const commands = new Collection();

  const commandsPath = path.join(
    new URL(".", import.meta.url).pathname,
    "commands"
  );
  const commandsFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    if ("data" in command && "execute" in command) {
      commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }

  return commands;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = await getCommand();

client.on(Events.InteractionCreate, async (interaction: any) => {
  if (!interaction.isChatInputCommand) return;

  const command = commands.get(interaction.commandName) as CommandModule;

  if (!command) {
    console.error(
      `Error : Command isn not found. Command : {${interaction.commandName}}`
    );
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(config.token);
