const path = require('path');
const fs = require('fs');

const configPath = path.join(__dirname, '../../data/config.json');

function loadConfig() {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

function saveConfig(data) {
    fs.writeFileSync(configPath, JSON.stringify(data, null, 4));
}

module.exports = {
    async execute(interaction) {
        const role = interaction.options.getRole('role');

        console.log(role);

        // Charger la configuration existante
        const config = loadConfig();

        console.log(config);

        // Ajouter ou mettre à jour le rôle de mute dans la configuration
        config.muteRoleId = role.id;

        // Sauvegarder la configuration mise à jour
        saveConfig(config);

        // Répondre à l'utilisateur pour confirmer la configuration
        await interaction.reply({
            content: `✅ Le rôle de mute a été configuré avec succès : <@&${role.id}>.`,
            ephemeral: true,
        });
    },
};
