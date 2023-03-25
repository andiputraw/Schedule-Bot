import { SlashCommandBuilder, CommandInteraction } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Reply with some information");

const execute = async (interaction: CommandInteraction) => {
  await interaction.reply("Pong");
};

export { data, execute };
