import 'dotenv/config';
import Discord, { TextChannel } from 'discord.js';
import fetch from 'node-fetch';
import { ethers } from "ethers";

const OPENSEA_SHARED_STOREFRONT_ADDRESS = '0x495f947276749Ce646f68AC8c248420045cb7b5e';

const discordBot = new Discord.Client();

// module.exports = {
//   name: 'reply',
//   category: 'Test',
//   run: (client, message, args) => {
//     message.lineReply('This is reply with @mention');
//   }
// }

// const  discordSetup = async (): Promise<TextChannel> => {
//   return new Promise<TextChannel>((resolve, reject) => {
//     ['DISCORD_BOT_TOKEN', 'DISCORD_CHANNEL_ID'].forEach((envVar) => {
//       if (!process.env[envVar]) reject(`${envVar} not set`)
//     })
//
//     discordBot.login(process.env.DISCORD_BOT_TOKEN);
//     discordBot.on('ready', async () => {
//       const channel = await discordBot.channels.fetch(process.env.DISCORD_CHANNEL_ID!);
//       resolve(channel as TextChannel);
//     });
//   })
// }

// const buildMessage = (sale: any) => (
//   new Discord.MessageEmbed()
// 	.setColor('#0099ff')
// 	.setTitle(sale.asset.name + ' sold!')
// 	.setURL(sale.asset.permalink)
// 	.setThumbnail(sale.asset.collection.image_url)
// 	.addFields(
// 		{ name: 'Name', value: sale.asset.name },
// 		{ name: 'Amount', value: `${ethers.utils.formatEther(sale.total_price || '0')}${ethers.constants.EtherSymbol}`},
// 		{ name: 'Buyer', value: sale?.winner_account?.address, },
// 		{ name: 'Seller', value: sale?.seller?.address,  },
// 	)
//   .addField("View", "https://kinesis.art/api/generator/" + sale.asset.token_id)
//   .setURL("https://kinesis.art/api/generator/" + sale.asset.token_id)
//   .setImage(sale.asset.image_url)
// 	.setTimestamp(Date.parse(`${sale?.created_date}Z`))
// 	.setFooter('Sold on OpenSea', 'https://files.readme.io/566c72b-opensea-logomark-full-colored.png')
// )
//
// async function main(channel: TextChannel) {
//   const seconds = process.env.SECONDS ? parseInt(process.env.SECONDS) : 60;
//   const hoursAgo = (Math.round(new Date().getTime() / 1000) - (seconds)); // in the last hour, run hourly?
//
//   const params = new URLSearchParams({
//     offset: '0',
//     event_type: 'successful',
//     only_opensea: 'false',
//     occurred_after: hoursAgo.toString(),
//     collection_slug: process.env.COLLECTION_SLUG!,
//
//   })
//
//
//   if (process.env.CONTRACT_ADDRESS !== OPENSEA_SHARED_STOREFRONT_ADDRESS) {
//     params.append('asset_contract_address', process.env.CONTRACT_ADDRESS!)
//   }
//
  // const openSeaResponse = await fetch(
  //   "https://api.opensea.io/api/v1/events?" + params, {
  //     method: 'GET',
  //     headers: {
  //       'X-API-KEY':process.env.OS_API_KEY
  //     },
  //   }).then((resp) => resp.json());
//
//   return await Promise.all(
//     openSeaResponse?.asset_events?.reverse().map(async (sale: any) => {
//       const message = buildMessage(sale);
//       return channel.send(message)
//     })
//   );
// }


// function go(channel: TextChannel) {
//   main(channel)
//   .then(async res =>{
//     if (!res.length) console.log("No recent sales, pausing for 60 seconds");
//     await new Promise(resolve => setTimeout(resolve, 60000));
//     console.log("Trying again...");
//     go(channel);
//   })
//   .catch(error => {
//     console.error(error);
//     process.exit(1);
//   });
// }


// https://kinesis.art/api/metadata/2889

const  discordSetup = async (): Promise<TextChannel> => {
  return new Promise<TextChannel>((resolve, reject) => {
    ['DISCORD_BOT_TOKEN', 'DISCORD_CHANNEL_ID'].forEach((envVar) => {
      if (!process.env[envVar]) reject(`${envVar} not set`)
    })

    discordBot.login(process.env.DISCORD_BOT_TOKEN);
    discordBot.on('ready', async () => {
      const channel = await discordBot.channels.fetch(process.env.DISCORD_CHANNEL_ID!);
      resolve(channel as TextChannel);
    });
  })
}

const buildMessage = (id: any) => (

  new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle("Atlanta #" + id)
	.setURL("https://kinesis.art/api/generator/" + id)
  .setImage("https://kinesis.art/api/image/" + id)
  .setThumbnail("https://kinesis.art/api/generator/" + id)
  .addField("OpenSea", "https://opensea.io/assets/0xeb113c5d09bfc3a7b27a75da4432fb3484f90c6a/" + id)
  .setURL("https://opensea.io/assets/0xeb113c5d09bfc3a7b27a75da4432fb3484f90c6a/" + id)
  .addField("View", "https://kinesis.art/api/generator/" + id)
  .setURL("https://kinesis.art/api/generator/" + id)
)


async function start(){
  const channel = await discordSetup();
  // go(channel);
}

start();

discordBot.on('ready', () => {
  console.log(discordBot.user.tag)
});

discordBot.on('message', async message => {
  if (message.content.startsWith('!atlanta')) {
    const tokens = message.content.split(" ");
    if(tokens.length != 2 ) message.reply("Invalid command: please follow format '!atlanta id'");
    else if (isNaN(parseInt(tokens[1])) || parseInt(tokens[1]) >= 3600 || parseInt(tokens[1]) < 0) message.reply("Invalid ID: please follow format '!atlanta id'");
    else { message.reply(buildMessage(parseInt(tokens[1]))); }
  }
});
