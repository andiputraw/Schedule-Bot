import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  CommandInteractionOption,
  TextChannel,
} from "discord.js";
import { PrismaClient } from "@prisma/client";

const data = new SlashCommandBuilder()
  .setName("schedule")
  .setDescription("Embed Schedule to the pointed Channel")
  .addStringOption((option) => {
    return option
      .setName("channel-id")
      .setDescription("Id Channel")
      .setRequired(true);
  });

const execute = async (interaction: CommandInteraction) => {
  const prisma = new PrismaClient();

  const jadwal = await prisma.schedules.findMany({
    include: {
      mapel: true,
    },
  });

  console.log(jadwal);

  //Nested loop, bad
  //Tapi untuk aplikasi kecil ya bisa aja
  //TODO tambah fitur caching
  const field = jadwal.map((jadwal) => {
    return {
      name: jadwal.day,
      value: jadwal.mapel.map((el) => el.mapel).join(" || "),
      inline: false,
    };
  });

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("Jadwal Minggu Ini")
    .addFields(field);

  console.log(interaction);

  //This code makes me insane help pls
  //@ts-ignore
  const channelID = interaction.options.getString("channel-id") as any;
  (interaction.client.channels.cache.get(channelID) as TextChannel).send({
    embeds: [embed],
  });

  interaction.reply({ content: "Success created schedule", ephemeral: true });
};

export { data, execute };
