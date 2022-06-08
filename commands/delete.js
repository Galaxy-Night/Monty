module.exports = {
	name: 'delete',
	async execute(interaction, db) {
		const collection = db.collection(String(interaction.guildId));
		const name = interaction.options.getString('name');

		const result = await collection.deleteOne({ nameLower: name.toLowerCase() });
		if (result.deletedCount === 0)
			await interaction.reply(`I couldn't find anyone named ${name}!`);
		else
			await interaction.reply(`${name} has been deleted!`);
	}
};
