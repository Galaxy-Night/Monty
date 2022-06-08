const axios = require('axios');

const { appId, testServer, token } = require('./config.json');
const commands = require('./commands.json');

const url = `https://discord.com/api/v10/applications/${appId}/guilds/${testServer}/commands`;

axios.put(url, commands, { headers: { 'Authorization': `Bot ${token}` } }).
	then(res => {
		console.log(`statusCode: ${res.status}`);
	}).
	catch(err => console.error(err));
