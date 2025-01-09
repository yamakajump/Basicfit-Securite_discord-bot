const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription("Déverrouiller un salon pour permettre à nouveau les messages.")
        .setDefaultMemberPermissions('16'), // = Gérer les salons
    async execute(interaction) {
        // Vérification des permissions
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply({ content: "Vous n'avez pas les permissions pour utiliser cette commande.", ephemeral: true });
        }

        const channel = interaction.channel;

        try {
            // Modifier les permissions pour permettre l'envoi de messages
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SEND_MESSAGES: true,
            });

            await interaction.reply(`🔓 Le salon ${channel.name} a été déverrouillé. Les membres peuvent à nouveau envoyer des messages.`);
        } catch (error) {
            console.error(`[ERROR] Impossible de déverrouiller le salon :`, error);
            interaction.reply({ content: "Une erreur s'est produite lors du déverrouillage du salon.", ephemeral: true });
        }
    },
};
