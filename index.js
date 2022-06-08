const fs = require('node:fs');
const { Client, Intents, Collection } = require('discord.js');
const { token, dbUri } = require('./config.json');
const { MongoClient } = require('mongodb');

const dbClient = new MongoClient(dbUri);
let db;

// dynamically generate command list
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// fires when the client has connected to Discord
client.once('ready', async () => {
	try {
		await dbClient.connect();
		db = dbClient.db('monty');
		await db.command({ ping: 1 });
		console.log('Connected to database');
	}
	catch (err) {
		console.error(err);
	}
	console.log('Connected to Discord');
});

// Executes commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, db);
	}
	catch (e) {
		console.error(e);
		await interaction.reply({ content: 'Something went wrong and I couldn\'t execute that command!',
			ephemeral: true });
	}
});

client.on('guildDelete', async guild => {
	db.collection(String(guild.id)).drop();
});

client.login(token);
