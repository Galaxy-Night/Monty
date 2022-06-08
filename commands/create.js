module.exports = {
	name: 'create',
	async execute(interaction, db) {
		const collection = db.collection(String(interaction.guildId));
		const name = interaction.options.getString('name');
		const _class = interaction.options.getString('class');

		// make sure no other characters exist with the given name
		if (await collection.findOne({ nameLower: name.toLowerCase() })) {
			await interaction.reply(`${name} already exists!`);
			return;
		}

		const character = require('./characterBase.json');
		character.name = name;
		character.nameLower = name.toLowerCase();
		if (_class !== null) character['class'] = _class;

		const result = await collection.insertOne(character);
		if (!result.insertedId)
			await interaction.reply(`Something went wrong and I couldn't create ${name}!`);
		else
			await interaction.reply(`${name} has been created!`);
	}
};
