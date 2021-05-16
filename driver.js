'use strict';

const uuid = require('uuid').v4;
const { Producer } = require('sqs-producer');
const { Consumer } = require('sqs-consumer');

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/693761890222/packages.fifo',
  handleMessage: async (message) => {
    const parcel = JSON.parse(JSON.parse(message.Body).Message);
    console.log("Picked up", parcel);
    setTimeout(async () => {
      Producer.create({
        queueUrl: `https://sqs.us-west-2.amazonaws.com/693761890222/${parcel.vendorId}`,
        region: 'us-west-2'
      });
      await Producer.send({
        id: uuid(),
        body: JSON.stringify(parcel),
      });
      console.log(`Delivered ${parcel.orderId}`);
    }, 5000)
  }, pollingWaitTimeMs: 20000
});

app.start();
