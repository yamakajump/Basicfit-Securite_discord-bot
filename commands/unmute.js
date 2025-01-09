const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription("Enlever le mute d'un utilisateur.")
        .setDefaultMemberPermissions('32'), // = Gérer le serveur
        .addUserOption(option =>
            option.setName('user')
                .setDescription("L'utilisateur à rétablir.")
                .setRequired(true)
        ),
    async execute(interaction) {
        // Vérification des permissions
        if (!interaction.member.permissions.has('MUTE_MEMBERS')) {
            return interaction.reply({ content: "Vous n'avez pas les permissions pour utiliser cette commande.", ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const mutedRoleId = '1320760751509606400'; // ID du rôle 'Repos forcé'
        const mutedRole = interaction.guild.roles.cache.get(mutedRoleId);

        if (!mutedRole) {
            return interaction.reply({ content: `Le rôle avec l'ID \`${mutedRoleId}\` n'existe pas. Vérifiez l'ID avant d'utiliser cette commande.`, ephemeral: true });
        }

        if (!member.roles.cache.has(mutedRole.id)) {
            return interaction.reply({ content: `<@${user.id}> n'est pas en mute.`, ephemeral: true });
        }

        try {
            await member.roles.remove(mutedRole);
            // Message de confirmation
            await interaction.reply(`<@${user.id}> a été rétabli ! Bienvenue de retour dans les échanges constructifs.`);
        } catch (error) {
            console.error(`[ERROR] Impossible de retirer le rôle à ${user.id}:`, error);
            interaction.reply({ content: "Une erreur s'est produite lors de la suppression du rôle.", ephemeral: true });
        }
    },
};
