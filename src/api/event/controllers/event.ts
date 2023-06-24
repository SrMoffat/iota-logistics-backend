/**
 * event controller
 */

import { get } from 'lodash';
import { factories, Strapi } from '@strapi/strapi'

import { EventService } from '../types';
import { EVENT_API_PATH, ITEM_API_PATH } from '../../../../constants';

export default factories.createCoreController(`${EVENT_API_PATH}`, ({ strapi }: { strapi: Strapi }) => ({
    async addSupplyChainItemEvent(ctx) {
        try {
            const itemId = get(ctx.params, 'id');
            const requestBody = get(ctx.request, 'body');
            const stage = get(requestBody, 'stage');
            const status = get(requestBody, 'status');

            const entryExists = await strapi.entityService.findOne(`${ITEM_API_PATH}`, itemId, {
                populate: ['weight', 'dimensions', 'category', 'handling', 'events'],
            });

            if (!entryExists) {
                return ctx.notFound('Supply chain item not found');
            }

            const amqpUrl = 'amqp://localhost';
            const eventService: EventService = strapi.service(`${ITEM_API_PATH}`);

            const data = {
                item: itemId,
                data: entryExists,
                stage,
                status,
            };
            const newEvent = await strapi.entityService.create(`${EVENT_API_PATH}`, {
                data,
                populate: ['item']
            });

            console.log('Ebunmandini', entryExists);
            console.log('newEvent', newEvent);

            // const { connection, channel } = await eventService.connectToRabbitMq(amqpUrl);
            // // Create event entry and link it to this item
            // // Emit an event to the topic with the new event details

            

            // await eventService.publishMessage({
            //     channel,
            //     queueName: 'test_queue',
            //     message: {
            //         name: 'ungowami'
            //     },
            // })
            // await eventService.consumeMessages({
            //     channel,
            //     queueName: 'test_queue',
            //     onMessageReceived: () => {
            //         console.log('received');
            //     }
            // })
            ctx.body = {
                success: true,
                message: "Add item event controller finished successfully"
            };
        } catch (err) {
            ctx.body = err;
        };
    },
    async getAllSupplyChainItemEvents(ctx) {
        try {
            const auth = get(ctx.state.auth, 'credentials');
            const params = get(ctx.params, 'id');
            const requestBody = get(ctx.request, 'body') as Object;

            console.log({
                auth,
                params,
                requestBody
            })
            ctx.body = {
                success: true,
                message: "Get item events controller finished successfully"
            };
        } catch (err) {
            ctx.body = err;
        };
    },
    async getSupplyChainItemMostRecentEvent(ctx) {
        try {
            const auth = get(ctx.state.auth, 'credentials');
            const params = get(ctx.params, 'id');
            const requestBody = get(ctx.request, 'body') as Object;

            console.log({
                auth,
                params,
                requestBody
            })
            ctx.body = {
                success: true,
                message: "Get item most recent event controller finished successfully"
            };
        } catch (err) {
            ctx.body = err;
        };
    },
}));
