const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

// Fonction pour charger la configuration
function loadConfig() {
    const configPath = path.join(__dirname, '../data/config.json');
    if (!fs.existsSync(configPath)) {
        throw new Error('Le fichier de configuration config.json est introuvable.');
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription("Enlever le mute d'un utilisateur.")
        .setDefaultMemberPermissions('4194304') // = Mute des membres
        .addUserOption(option =>
            option.setName('user')
                .setDescription("L'utilisateur à rétablir.")
                .setRequired(true)
        ),
    async execute(interaction) {
        // Vérification des permissions
        if (!interaction.member.permissions.has('MUTE_MEMBERS')) {
            return interaction.reply({ content: "❌ Vous n'avez pas les permissions pour utiliser cette commande.", ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);

        // Charger la configuration pour récupérer le rôle mute
        let config;
        try {
            config = loadConfig();
        } catch (error) {
            console.error(`[ERROR] ${error.message}`);
            return interaction.reply({ content: "❌ Impossible de charger la configuration du bot.", ephemeral: true });
        }

        const mutedRoleId = config.muteRoleId;
        if (!mutedRoleId) {
            return interaction.reply({ content: "❌ Aucun rôle de mute configuré. Veuillez configurer un rôle avec `/config add_muterole`.", ephemeral: true });
        }

        const mutedRole = interaction.guild.roles.cache.get(mutedRoleId);

        if (!mutedRole) {
            return interaction.reply({ content: `❌ Le rôle avec l'ID \`${mutedRoleId}\` n'existe pas sur ce serveur.`, ephemeral: true });
        }

        if (!member.roles.cache.has(mutedRole.id)) {
            return interaction.reply({ content: `❌ <@${user.id}> n'est pas en mute.`, ephemeral: true });
        }

        try {
            await member.roles.remove(mutedRole);
            // Répondre à l'utilisateur avec succès
            await interaction.reply(`✅ <@${user.id}> a été rétabli avec succès !`);
        } catch (error) {
            console.error(`[ERROR] Impossible de retirer le rôle à ${user.id}:`, error);
            interaction.reply({ content: "❌ Une erreur s'est produite lors de la suppression du rôle de mute.", ephemeral: true });
        }
    },
};
