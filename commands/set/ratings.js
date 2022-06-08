module.exports = {
	name: 'ratings',
	async execute(interaction, db) {
		const collection = db.collection(String(interaction.guildId));
		const name = interaction.options.getString('name');

		const setObject = {
			'ratings.charm': interaction.options.getInteger('charm'),
			'ratings.cool': interaction.options.getInteger('cool'),
			'ratings.sharp': interaction.options.getInteger('sharp'),
			'ratings.tough': interaction.options.getInteger('tough'),
			'ratings.weird': interaction.options.getInteger('weird')
		};

		Object.keys(setObject).forEach(e => setObject[e] == null && delete setObject[e]);

		if (Object.keys(setObject).length === 0) {
			await interaction.reply({ content: 'I need at least one rating to set!', ephemeral: true });
			return;
		}

		const character = await collection.findOne({ nameLower: name.toLowerCase() });

		if (character === null) {
			await interaction.reply({ content: `I couldn't find anyone named ${name}!`, ephemeral: true });
			return;
		}

		const result = await collection.updateOne({ nameLower: name.toLowerCase() },
			{ $set: setObject });

		if (result.updatedCount === 0)
			await interaction.reply(`Something went wrong and I couldn't update ${name}'s ability scores!`);
		else
			await interaction.reply(`${name}'s ability scores have been updated!`);
	}
};
