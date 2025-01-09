const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription("Réinitialiser un salon en supprimant tout son contenu.")
        .setDefaultMemberPermissions('16'), // = Gérer le serveur
    async execute(interaction) {
        // Vérification des permissions
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply({ content: "Vous n'avez pas les permissions pour utiliser cette commande.", ephemeral: true });
        }

        const channel = interaction.channel;

        try {
            // Cloner le salon actuel
            const clonedChannel = await channel.clone({
                name: channel.name,
                permissions: channel.permissionOverwrites.cache,
                topic: channel.topic,
                nsfw: channel.nsfw,
                parent: channel.parentId,
                position: channel.position,
                rateLimitPerUser: channel.rateLimitPerUser,
            });

            // Supprimer l'ancien salon
            await channel.delete();

            // Envoyer un message de confirmation dans le nouveau salon
            await clonedChannel.send("Le salon a été réinitialisé avec succès !");
        } catch (error) {
            console.error(`[ERROR] Impossible de réinitialiser le salon :`, error);
            interaction.reply({ content: "Une erreur s'est produite lors de la réinitialisation du salon.", ephemeral: true });
        }
    },
};
