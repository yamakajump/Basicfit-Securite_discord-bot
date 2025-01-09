const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription("Verrouiller un salon pour empêcher les messages."),
        .setDefaultMemberPermissions('32'), // = Gérer le serveur
    async execute(interaction) {
        // Vérification des permissions
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply({ content: "Vous n'avez pas les permissions pour utiliser cette commande.", ephemeral: true });
        }

        const channel = interaction.channel;

        try {
            // Modifier les permissions pour empêcher les membres de parler
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SEND_MESSAGES: false,
            });

            await interaction.reply(`🔒 Le salon ${channel.name} a été verrouillé. Les membres ne peuvent plus envoyer de messages.`);
        } catch (error) {
            console.error(`[ERROR] Impossible de verrouiller le salon :`, error);
            interaction.reply({ content: "Une erreur s'est produite lors du verrouillage du salon.", ephemeral: true });
        }
    },
};
