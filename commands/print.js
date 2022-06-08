function generateMessage(character) {
	const charm = character.ratings.charm >= 0 ? '+' + String(character.ratings.charm) : String(character.ratings.charm);
	const cool = character.ratings.cool >= 0 ? '+' + String(character.ratings.cool) : String(character.ratings.cool);
	const sharp = character.ratings.sharp >= 0 ? '+' + String(character.ratings.sharp) : String(character.ratings.sharp);
	const tough = character.ratings.tough >= 0 ? '+' + String(character.ratings.tough) : String(character.ratings.tough);
	const weird = character.ratings.weird >= 0 ? '+' + String(character.ratings.weird) : String(character.ratings.weird);
	let message = `${character.name}, the ${character['class']}\n`;
	message += `Charm: ${charm.padEnd(5)}Cool: ${cool.padEnd(5)}Sharp: ${sharp.padEnd(5)}Tough: ${tough.padEnd(5)}` +
		`Weird: ${weird.padEnd(5)}\n`;
	message += `Luck: ${character.luck} Harm ${character.harm}${character.harm > 3 ? ' (unstable)' : '' } ` +
		`Experience: ${character.xp}` ;

	return message;
}

module.exports = {
	name: 'print',
	async execute(interaction, db) {
		const collection = db.collection(String(interaction.guildId));
		const name = interaction.options.getString('name');
		let toPrint = [];

		if (name) {
			toPrint = [await collection.findOne({ nameLower: name.toLowerCase() })];
			if (toPrint[0] === null) {
				await interaction.reply({ content: `I couldn't find anyone named ${name}!`, ephemeral: true });
				return;
			}
		}
		else {
			toPrint = await collection.find().toArray();
			if (toPrint === []) {
				await interaction.reply({ content: 'I couldn\'t find any characters to print!', ephemeral: true });
				return;
			}
		}

		let message = '';

		for (let i = 0; i < toPrint.length; i++)
			message += '```' + generateMessage(toPrint[i]) + '```';

		await interaction.reply(message);
	}
};
