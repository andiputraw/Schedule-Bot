import { Interaction, SlashCommandBuilder } from "discord.js";

//!! Theese types is not perfect, a lot of lying. use with caution
export type customInteraction = Interaction & {
  reply: () => void;
};

export type CommandModule = {
  data: SlashCommandBuilder;
  execute: (interaction: any) => Promise<void>;
};
