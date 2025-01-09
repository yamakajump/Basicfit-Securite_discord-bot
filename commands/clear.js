const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription("Supprime un certain nombre de messages dans ce salon.")
        .addIntegerOption(option =>
            option.setName('nombre')
                .setDescription('Nombre de messages à supprimer (entre 1 et 100).')
                .setRequired(true)
        ),
    async execute(interaction) {
        // Vérification des permissions
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply({ content: "Vous n'avez pas les permissions pour utiliser cette commande.", ephemeral: true });
        }

        const nombre = interaction.options.getInteger('nombre');

        // Vérification du nombre de messages
        if (nombre < 1 || nombre > 100) {
            return interaction.reply({ content: "Veuillez spécifier un nombre entre 1 et 100.", ephemeral: true });
        }

        try {
            const deletedMessages = await interaction.channel.bulkDelete(nombre, true); // Suppression des messages
            await interaction.reply({ content: `${deletedMessages.size} message(s) ont été supprimé(s).`, ephemeral: true });
        } catch (error) {
            console.error(`[ERROR] Impossible de supprimer les messages :`, error);
            interaction.reply({ content: "Une erreur s'est produite lors de la suppression des messages.", ephemeral: true });
        }
    },
};
