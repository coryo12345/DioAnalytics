import { REST, Routes } from "discord.js";
import commands from "./commands.json";

export async function registerCommands(botToken, clientId) {
  const rest = new REST({ version: "10" }).setToken(botToken);
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}
