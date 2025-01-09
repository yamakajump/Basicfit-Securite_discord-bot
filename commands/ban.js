const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription("Bannir définitivement un utilisateur du serveur.")
        .setDefaultMemberPermissions('4') // = Banir des membres
        .addUserOption(option =>
            option.setName('user')
                .setDescription("L'utilisateur à bannir.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription("La raison du bannissement.")
                .setRequired(false)
        ),
    async execute(interaction) {
        // Vérification des permissions
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: "Vous n'avez pas les permissions pour utiliser cette commande.", ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const reason = interaction.options.getString('reason') || 'Aucune raison spécifiée.';

        if (!member) {
            return interaction.reply({ content: "L'utilisateur n'existe pas ou n'est pas présent sur ce serveur.", ephemeral: true });
        }

        try {
            await member.ban({ reason });
            // Message de confirmation
            await interaction.reply(`<@${user.id}> a été banni définitivement du serveur. Raison : ${reason}`);
        } catch (error) {
            console.error(`[ERROR] Impossible de bannir ${user.id}:`, error);
            interaction.reply({ content: "Une erreur s'est produite lors du bannissement de l'utilisateur.", ephemeral: true });
        }
    },
};
