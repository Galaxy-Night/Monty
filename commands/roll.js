module.exports = {
	name: 'roll',
	async execute(interaction, db) {
		const collection = db.collection(String(interaction.guildId));
		const name = interaction.options.getString('name');
		const toRoll = interaction.options.getString('roll');

		const character = await collection.findOne({ nameLower: name.toLowerCase() });

		if (character === null) {
			await interaction.reply({ content: `I couldn't find anyone named ${name}!`, ephemeral: true });
			return;
		}

		const mod = character.ratings[toRoll];
		const modString = mod >= 0 ? '+' + String(mod) : String(mod);
		const roll1 = Math.floor(Math.random() * 6) + 1;
		const roll2 = Math.floor(Math.random() * 6) + 1;
		const value = mod + roll1 + roll2;

		await interaction.reply(`Rolling ${toRoll} for ${name}:\n2d6${modString} => ${roll1}+${roll2}${modString} => ` +
			`${value}`);
	}
};
