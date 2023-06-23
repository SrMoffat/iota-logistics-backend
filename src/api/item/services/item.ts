/**
 * item service
 */

import * as crypto from 'crypto';

import Ajv from 'ajv';
import amqp from 'amqplib';
import { factories } from '@strapi/strapi';

import { ITEM_API_PATH } from '../../../../constants';
import {
    Dimensions,
    VolumeDetails,
    ItemRequestBody,
    BlockClearanceInput,
    PublishMessageInput,
    ConsumerMessageInput,
} from '../types';

let queue = 'test_queue';

export default factories.createCoreService(`${ITEM_API_PATH}`, ({ strapi }) => ({
    generateTrackingId() {
        try {
            return `IOTA#${crypto.randomBytes(4).toString("hex")}`;
        } catch (error) {
            throw new Error(`Error generating trackingId: ${error}`);
        }
    },
    calculateVolume(dimensions: Dimensions): VolumeDetails {
        try {
            const { width, height, length, unit } = dimensions;
            const volume = parseFloat(width) * parseFloat(height) * parseFloat(length);
            const value = volume.toFixed(2);
            return {
                value: Number(value),
                representation: `${value} ${unit}\u00B3`
            };
        } catch (error) {
            throw new Error(`Error calculating volume: ${error}`);
        };
    },
    validateRequest(request: ItemRequestBody, schema: Object): Boolean {
        try {
            const ajv = new Ajv();
            const validate = ajv.compile(schema);
            return validate(request);
        } catch (error) {
            throw new Error(`Error validating request: ${error}`);
        };
    },
    blockClearanceFromAccess(input: BlockClearanceInput) {
        try {
            const { role, message } = input;
            const isUser = role === 'user'

            if (isUser) {
                throw new Error(message);
            }
        } catch (error) {
            throw new Error(`Error validating request: ${error}`);
        };
    },
    async connectToRabbitMq() {
        let connection;
        try {
            connection = await amqp.connect('amqp://localhost');
            const channel = await connection.createChannel();
            return { connection, channel };
        } catch (error) {
            console.log('New Galctica-error-->', error)
            throw new Error(`Error connecting to RabbitMQ: ${error}`);
        } finally {
            // if (connection) await connection.close();
        }
    },
    async publishMessage(details: PublishMessageInput) {
        try {
            const { channel: messageChannel, queueName, message } = details;
            await messageChannel.assertQueue(queueName);
            messageChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
            // await messageChannel.close();
        } catch (error) {
            console.log('New AI-error-->', error)
            throw new Error(`Error publishing message: ${error}`);
        }
    },
    async consumeMessages(details: ConsumerMessageInput) {
        try {
            const { channel: messageChannel, queueName, onMessageReceived } = details;
            await messageChannel.assertQueue(queue);

            messageChannel.consume(queueName, (message) => {
                const messageContent = JSON.parse(message.content.toString());
                messageChannel.ack(message);
                console.log({
                    message,
                    messageContent
                })
                onMessageReceived()
            });

        } catch (error) {
            throw new Error(`Error consuming message: ${error}`);
        }
    },
}));

