const path = require('path');
const config = require("../../config.json");
const { Event } = require("sheweny");
const mysql = require('mysql');
const { EmbedBuilder } = require('discord.js');

module.exports = class extends Event {
  constructor(client) {
    super(client, "messageCreate", {
      description: "Surveillance des codes lors de la création d'un message",
      once: false,
    });
  }

  async execute(message) {
    const db = mysql.createConnection({
      host: config.HOST,
      user: config.USER,
      port: config.PORT,
      password: config.PASSWORD,
      database: config.NAME
    });
    if (message.author.bot) return;
    if (message.channelId == config.CHANNEL_ID) {
      const code = message.content;

      const checkCodeQuery = `SELECT * FROM Link WHERE code = '${code}'`;
      db.query(checkCodeQuery, async (error, results) => {
        if (error) {
          console.error('Database Error:', error);
          return;
        }

        if (results.length > 0) {
          const userId = message.author.id;

          const checkLinkQuery = `SELECT * FROM Link WHERE ID_Discord = '${userId}'`;
          db.query(checkLinkQuery, async (error, linkResults) => {
            if (error) {
              console.error('Database Error:', error);
              return;
            }

            if (linkResults.length > 0) {
              message.reply({ content: "Votre compte est déjà lié à un joueur Minecraft!", ephemeral: true });
            } else {
              const pseudo = results[0].Pseudo_Minecraft;
              const updateQuery = `UPDATE Link SET ID_Discord = '${userId}', IsLink = '1', code = 'null' WHERE code = '${code}'`;
              const embed = new EmbedBuilder()
                  .setTitle("Liaison Minecraft")
                  .setDescription("Votre compte discord est maintenant lié au compte "+pseudo+" !")
                  .setColor("#000cad")
                  .setFooter({
                    text: "Bienvenue sur le serveur 😁 !",
                    iconURL: "https://minotar.net/avatar/_Spyk_",
                  })
                  .setTimestamp();

                  await message.reply({ embeds: [embed], ephemeral: true });

              db.query(updateQuery, (error, results) => {
                if (error) {
                  console.error('Database Error:', error);
                  return;
                }

                console.log('Valeurs mises à jour avec succès');
              });
            }
          });
        } else {
          console.log('Le code n\'existe pas dans la base de données');
          const embed = new EmbedBuilder()
            .setTitle("Liaison Minecraft")
            .setDescription("le code utilisé n'est relié à aucun compte.")
            .setColor("#000cad")
            .setTimestamp();

         await message.reply({ embeds: [embed], ephemeral: true });
        }
      });
    }
  }
}
