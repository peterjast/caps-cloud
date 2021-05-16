'use strict';

const faker = require('faker');
const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
const sns = new AWS.SNS();
const topic = 'arn:aws:sqs:us-west-2:693761890222:packages.fifo';
const vendorId = 'generic-vendor';

setInterval(() => {
  const parcel = {
    orderId: faker.datatype.uuid(),
    customer: faker.name.findName(),
    address: faker.address.streetAddress(),
    vendorId: vendorId
  };
  const payload = {
    Message: JSON.stringify(parcel),
    TopicArn: topic,
  };
  sns.publish(payload).promise().then(result => {console.log("Requested parcel pickup")}).catch(err => console.error(err.message));
}, Math.floor(Math.random() * 1000));

const app = Consumer.create({
  queueUrl: `https://sqs.us-west-2.amazonaws.com/693761890222/${vendorId}`,
  handleMessage: async(message) => console.log("Delivered:", message.Body), 
  pollingWaitTimeMs: 20000
});

app.start();
