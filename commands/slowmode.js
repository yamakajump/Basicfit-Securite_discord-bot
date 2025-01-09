const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription("Activer ou modifier le mode lent d'un salon.")
        .setDefaultMemberPermissions('32'), // = Gérer le serveur
        .addIntegerOption(option =>
            option.setName('temps')
                .setDescription("Durée du mode lent en secondes (0 pour désactiver).")
                .setRequired(true)
        ),
    async execute(interaction) {
        // Vérification des permissions
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply({ content: "Vous n'avez pas les permissions pour utiliser cette commande.", ephemeral: true });
        }

        const slowmodeTime = interaction.options.getInteger('temps');
        const channel = interaction.channel;

        // Vérification de la durée
        if (slowmodeTime < 0 || slowmodeTime > 21600) {
            return interaction.reply({ content: "La durée doit être comprise entre 0 et 21600 secondes (6 heures).", ephemeral: true });
        }

        try {
            // Appliquer le mode lent au salon
            await channel.setRateLimitPerUser(slowmodeTime);

            if (slowmodeTime === 0) {
                await interaction.reply(`🚀 Le mode lent a été désactivé pour le salon ${channel.name}.`);
            } else {
                await interaction.reply(`🐢 Le mode lent a été activé dans le salon ${channel.name} : ${slowmodeTime} seconde(s) entre chaque message.`);
            }
        } catch (error) {
            console.error(`[ERROR] Impossible de configurer le mode lent :`, error);
            interaction.reply({ content: "Une erreur s'est produite lors de la configuration du mode lent.", ephemeral: true });
        }
    },
};
