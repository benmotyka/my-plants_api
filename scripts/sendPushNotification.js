const { Expo } = require('expo-server-sdk');
const { config } = require('dotenv');
config();

const main = async () => {
  const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
  const messages = [];
  const PUSH_TOKENS = ['ExponentPushToken[WfH2VLCq9-2_qG94UXtNv3]'];

  for (let pushToken of PUSH_TOKENS) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    messages.push({
      to: pushToken,
      sound: 'default',
      body: 'Water your plant!`',
      data: { withSome: 'data' },
      title: "My Plants"
    });
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }
};

main();
