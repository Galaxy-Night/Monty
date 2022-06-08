const fs = require('node:fs');

const subcommands = new Map();
const subcommandFiles = fs.readdirSync('./commands/set');

for (const file of subcommandFiles) {
	const subcommand = require(`./set/${file}`);
	subcommands.set(subcommand.name, subcommand);
}

module.exports = {
	name: 'set',
	async execute(interaction, db) {
		const key = interaction.options.getSubcommandGroup(false) === null ? interaction.options.getSubcommand() :
			interaction.options.getSubcommandGroup();
		const subcommand = subcommands.get(key);
		if (!subcommand) return;

		try {
			await subcommand.execute(interaction, db);
		}
		catch (e) {
			console.error(e);
			await interaction.reply({ content: 'Something went wrong and I couldn\'t execute that command!',
				ephemeral: true });
		}
	}
};
