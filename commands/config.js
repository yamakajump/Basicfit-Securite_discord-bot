const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configure les différentes fonctionnalités du bot.')
        .setDefaultMemberPermissions('32') // = Gérer le serveur
        .addSubcommand(subcommand =>
            subcommand
                .setName('toggle_startup_message')
                .setDescription('Active ou désactive le message au lancement du bot.')
                .addBooleanOption(option =>
                    option.setName('etat')
                        .setDescription('Activer ou désactiver ?')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Message à envoyer au lancement (optionnel).')
                )
                .addChannelOption(option =>
                    option.setName('salon')
                        .setDescription('Salon où envoyer le message de démarrage (optionnel).')
                )
        ),
    async execute(interaction) {
        // Vérification explicite des permissions "Gérer le serveur"
        if (!interaction.member.permissions.has('ManageGuild')) { // 'ManageGuild' correspond à "Gérer le serveur"
            return interaction.reply({
                content: "❌ Vous n'avez pas la permission d'utiliser cette commande.",
                ephemeral: true,
            });
        }

        const subcommand = interaction.options.getSubcommand();

        try {
            // Charger dynamiquement le fichier de la sous-commande
            const subcommandFile = require(`./config/${subcommand}.js`);
            await subcommandFile.execute(interaction);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de la sous-commande ${subcommand}:`, error);
            await interaction.reply({
                content: `Une erreur est survenue lors de l'exécution de la commande \`${subcommand}\`.`,
                ephemeral: true,
            });
        }
    },
};
