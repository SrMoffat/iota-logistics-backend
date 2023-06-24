/**
 * event service
 */

import amqp, { Connection } from 'amqplib';
import { factories, Strapi } from '@strapi/strapi';


import { EVENT_API_PATH, ITEM_API_PATH } from '../../../../constants';
import { CreateAndPublishEventInput, Item, ItemService, EventService } from '../../item/types';



/**
 * newItem, `${itemCreatedId}`
 */

export default factories.createCoreService(`${EVENT_API_PATH}`, ({ strapi }: { strapi: Strapi }) => ({
    async connectToRabbitMq(url: string) {
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
    async createEvent(details: CreateAndPublishEventInput) {
        try {
            const { item, stage, status } = details;

            const data = {
                item: item.id,
                data: item,
                stage,
                status,
            };

            const newEvent = await strapi.entityService.create(`${EVENT_API_PATH}`, {
                data,
                populate: ['item']
            });
            // const newEvent = await strapi.entityService.create(`${EVENT_API_PATH}`, {
            //     data,
            //     populate: ['item', 'status']
            // });
            console.log('newEvent', data)
            console.log('newEvent', newEvent)
        } catch (error) {
            console.log('error', error)
            throw new Error(`Error creating event: ${error}`);
        }
    },
    async publishEvent(details: Item, queue: string) {
        try {
            console.log('Create and emit event')
        } catch (error) {
            throw new Error(`Error publishing event: ${error}`);
        }
    },
    async createAndPublishEvent(details: CreateAndPublishEventInput) {
        try {
            const amqpUrl = 'amqp://localhost';
            const itemService: ItemService = strapi.service(`${ITEM_API_PATH}`);
            const eventService: EventService = strapi.service(`${EVENT_API_PATH}`);

            const dbEevent = await eventService.createEvent(details)

            // const { connection, channel } = await eventService.connectToRabbitMq(amqpUrl);

            // await itemService.publishMessage({
            //     channel,
            //     queueName: queue,
            //     message: details,
            // })


            // console.log('Create and emit event', details)
        } catch (error) {
            throw new Error(`Error generating trackingId: ${error}`);
        }
    }
}));
