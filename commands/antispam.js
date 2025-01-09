const { SlashCommandBuilder } = require('discord.js');

// Variable pour suivre l'état de l'antispam
let antispamEnabled = false;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('antispam')
        .setDescription("Activer ou désactiver la protection contre les spams.")
        .addStringOption(option =>
            option.setName('etat')
                .setDescription("Activer ('on') ou désactiver ('off') la protection antispam.")
                .setRequired(true)
                .addChoices(
                    { name: 'on', value: 'on' },
                    { name: 'off', value: 'off' }
                )
        ),
    async execute(interaction) {
        const state = interaction.options.getString('etat');

        if (!interaction.member.permissions.has('MANAGE_GUILD')) {
            return interaction.reply({ content: "Vous n'avez pas les permissions pour utiliser cette commande.", ephemeral: true });
        }

        if (state === 'on') {
            antispamEnabled = true;
            await interaction.reply("🛡️ La protection contre les spams a été activée.");
        } else if (state === 'off') {
            antispamEnabled = false;
            await interaction.reply("🚫 La protection contre les spams a été désactivée.");
        } else {
            await interaction.reply({ content: "Option invalide. Utilisez 'on' pour activer ou 'off' pour désactiver.", ephemeral: true });
        }
    },
};
