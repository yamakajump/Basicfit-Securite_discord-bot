const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute un utilisateur en lui attribuant un rôle.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription("L'utilisateur à mute")
                .setRequired(true)
        ),
    async execute(interaction) {
        // Vérification des permissions
        if (!interaction.member.permissions.has('MUTE_MEMBERS')) {
            return interaction.reply({ content: "Vous n'avez pas les permissions pour utiliser cette commande.", ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const mutedRoleId = '1326895723324903444'; // ID du rôle
        const mutedRole = interaction.guild.roles.cache.get(mutedRoleId);

        if (!mutedRole) {
            return interaction.reply({ content: `Le rôle avec l'ID \`${mutedRoleId}\` n'existe pas. Vérifiez l'ID avant d'utiliser cette commande.`, ephemeral: true });
        }

        if (member.roles.cache.has(mutedRole.id)) {
            return interaction.reply({ content: `<@${user.id}> est déjà mute.`, ephemeral: true });
        }

        try {
            await member.roles.add(mutedRole);
            // Répondre à l'utilisateur via interaction.reply() avec la mention
            await interaction.reply(`<@${user.id}> a été mis en silence pour maintenir la discipline sur le serveur. Reviens plus tard avec une attitude constructive.`);
        } catch (error) {
            console.error(`[ERROR] Impossible d'ajouter le rôle à ${user.id}:`, error);
            interaction.reply({ content: "Une erreur s'est produite lors de l'attribution du rôle.", ephemeral: true });
        }
    },
};
