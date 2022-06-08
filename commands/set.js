module.exports = {
	name: 'set',
	async execute(interaction, db) {
		const collection = db.collection(String(interaction.guildId));
		const name = interaction.options.getString('name');

		const setObject = {
			class: interaction.options.getString('class'),
			'ratings.charm': interaction.options.getInteger('charm'),
			'ratings.cool': interaction.options.getInteger('cool'),
			'ratings.sharp': interaction.options.getInteger('sharp'),
			'ratings.tough': interaction.options.getInteger('tough'),
			'ratings.weird': interaction.options.getInteger('weird'),
			luck: interaction.options.getInteger('luck'),
			harm: interaction.options.getInteger('harm'),
			xp: interaction.options.getInteger('experience')
		};

		// remove empty keys from setObject
		Object.keys(setObject).forEach(key => setObject[key] == null && delete setObject[key]);

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
