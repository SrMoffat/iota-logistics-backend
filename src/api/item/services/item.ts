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
    ItemService,
    VolumeDetails,
    ItemRequestBody,
    RabbitMQConnection,
    BlockClearanceInput,
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
            }
        } catch (error) {
            throw new Error(`Error calculating volume: ${error}`);
        }
    },
    // TODO: Transform into middlware
    validateRequest(request: ItemRequestBody, schema: Object): Boolean {
        try {
            const ajv = new Ajv();
            const validate = ajv.compile(schema);
            return validate(request);
        } catch (error) {
            throw new Error(`Error validating request: ${error}`);
        }
    },
    // TODO: Transform into middlware
    blockClearanceFromAccess(input: BlockClearanceInput) {
        try {
            const { role, message } = input;
            const isUser = role === 'user'

            if (isUser) {
                throw new Error(message);
            }
        } catch (error) {
            throw new Error(`Error validating request: ${error}`);
        }
    },
    async connectToRabbitMq() {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        return { connection, channel };
    },
    async publishMessage() {
        let connection: RabbitMQConnection;
        try {
            // const itemService: ItemService = strapi.service(`${ITEM_API_PATH}`);
            // const { connection, channel } = itemService.connectToRabbitMq()
            // console.log({
            //     connection,
            //     channel
            // })
            connection = await amqp.connect("amqp://localhost");

            const channel = await connection.createChannel();

            await channel.assertQueue(queue, { durable: true });

            channel.sendToQueue(queue, Buffer.from(JSON.stringify({
                name: 'me',
                email: 'me@mail.com'
            })));

            await channel.close();
        } catch (error) {
            throw new Error(`Error publishing message: ${error}`);
        } finally {
            if (connection) await connection.close();
        }
    },
    async consumeMessages() {
        let connection: RabbitMQConnection;

        try {
            connection = await amqp.connect("amqp://localhost");

            const channel = await connection.createChannel();

            await channel.assertQueue(queue);

            channel.consume(queue, (message) => {
                const messageContent = JSON.parse(message.content.toString());
                channel.ack(message);
                console.log({
                    message,
                    messageContent
                })
            });

        } catch (error) {
            throw new Error(`Error consuming message: ${error}`);
        } finally {
            if (connection) await connection.close();
        }
    },
}));

