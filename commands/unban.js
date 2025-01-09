const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription("Débannir un utilisateur du serveur.")
        .setDefaultMemberPermissions('32'), // = Gérer le serveur
        .addStringOption(option =>
            option.setName('user_id')
                .setDescription("L'ID de l'utilisateur à débannir.")
                .setRequired(true)
        ),
    async execute(interaction) {
        // Vérification des permissions
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: "Vous n'avez pas les permissions pour utiliser cette commande.", ephemeral: true });
        }

        const userId = interaction.options.getString('user_id');

        try {
            // Vérifie si l'utilisateur est banni
            const banList = await interaction.guild.bans.fetch();
            const bannedUser = banList.get(userId);

            if (!bannedUser) {
                return interaction.reply({ content: `L'utilisateur avec l'ID \`${userId}\` n'est pas banni.`, ephemeral: true });
            }

            // Débannir l'utilisateur
            await interaction.guild.members.unban(userId);
            await interaction.reply(`<@${userId}> a été débanni et peut maintenant réintégrer la communauté.`);
        } catch (error) {
            console.error(`[ERROR] Impossible de débannir ${userId}:`, error);
            interaction.reply({ content: "Une erreur s'est produite lors du débannissement de l'utilisateur.", ephemeral: true });
        }
    },
};
