/**
 * event service
 */

import { get } from 'lodash';
import amqp, { Connection, Channel } from 'amqplib';
import { factories, Strapi } from '@strapi/strapi';

import { EVENT_API_PATH } from '../../../../constants';
import {
    Event,
    EventService,
    PublishMessageInput,
    ConsumerMessageInput,
    CreateAndPublishEventInput,
} from '../types';


export default factories.createCoreService(`${EVENT_API_PATH}`, ({ strapi }: { strapi: Strapi }) => ({
    async connectToRabbitMq(url: string): Promise<{ connection: Connection; channel: Channel; }> {
        let connection: Connection;
        try {
            connection = await amqp.connect(url);
            const channel = await connection.createChannel();
            return { connection, channel };
        } catch (error) {
            console.log('New Galctica-error-->', error)
            throw new Error(`Error connecting to RabbitMQ: ${error}`);
        } finally {
            // if (connection) await connection.close();
        }
    },
    async createEvent(details: CreateAndPublishEventInput): Promise<Event> {
        try {
            const { item, stage, status } = details;
            const data = {
                item: item.id,
                data: item,
                stage: stage.id,
                status: status.id,
            };
            const newEvent = await strapi.entityService.create(`${EVENT_API_PATH}`, {
                data,
                populate: ['item']
            });
            return newEvent
        } catch (error) {
            console.log('error', error)
            throw new Error(`Error creating event: ${error}`);
        }
    },
    async publishMessage(details: PublishMessageInput): Promise<void> {
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
            await messageChannel.assertQueue(queueName);
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
    async createAndPublishEvent(details: CreateAndPublishEventInput): Promise<Event> {
        try {
            const amqpUrl = 'amqp://localhost';
            const eventService: EventService = strapi.service(`${EVENT_API_PATH}`);
            const dbEevent = await eventService.createEvent(details)
            const { channel } = await eventService.connectToRabbitMq(amqpUrl);
            const stage = get(details.stage, 'name')
            const status = get(details.status, 'name')
            await eventService.publishMessage({
                channel,
                queueName: details.queue,
                message: { ...details, stage, status }
            })
            return dbEevent
        } catch (error) {
            throw new Error(`Error creating and publishing event: ${error}`);
        }
    }
}));
