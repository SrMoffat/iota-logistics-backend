/**
 * event controller
 */

import { get } from 'lodash';
import { factories, Strapi } from '@strapi/strapi'

import { EventService } from '../types';
import { EVENT_API_PATH, ITEM_API_PATH } from '../../../../constants';

const getItemEvents = async (details) => {
    const { id, ctx, strapi } = details;
    const entryExists = await strapi.entityService.findOne(`${ITEM_API_PATH}`, id);
    if (!entryExists) {
        return ctx.notFound('Supply chain item not found');
    };
    const events = await strapi.db.query(`${EVENT_API_PATH}`).findMany({
        populate: ['status', 'stage', 'user'],
    });
    return events;
}

export default factories.createCoreController(`${EVENT_API_PATH}`, ({ strapi }: { strapi: Strapi }) => ({
    async addSupplyChainItemEvent(ctx) {
        try {
            const auth = get(ctx.state.auth, 'credentials');
            const user = get(auth, 'id');
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
            const eventService: EventService = strapi.service(`${EVENT_API_PATH}`);
            const eventDetails = await eventService.createAndPublishEvent({
                item: entryExists,
                queue: get(entryExists, 'trackingId'),
                stage: {
                    id: get(stage, 'id'),
                    name: get(stage, 'name'),
                },
                status: {
                    id: get(status, 'id'),
                    name: get(status, 'name'),
                },
                user
            });
            ctx.body = {
                success: true,
                event: eventDetails
            };
        } catch (err) {
            ctx.body = err;
        };
    },
    async getAllSupplyChainItemEvents(ctx) {
        try {
            const itemId = get(ctx.params, 'id');
            const events = await getItemEvents({
                id: itemId,
                ctx,
                strapi
            });
            const results = events.filter(event => `${event.data.id}` === `${itemId}`);
            ctx.body = {
                success: true,
                events: results.reverse()
            };
        } catch (err) {
            ctx.body = err;
        };
    },
    async getSupplyChainItemMostRecentEvents(ctx) {
        try {
            const itemId = get(ctx.params, 'id');
            const count = get(ctx.params, 'count');
            const events = await getItemEvents({
                id: itemId,
                ctx,
                strapi
            });
            const results = events.filter(event => `${event.data.id}` === `${itemId}`);
            ctx.body = {
                success: true,
                events: results.slice(0, count)
            };
        } catch (err) {
            ctx.body = err;
        };
    },
    async getAllItemQueueEvents(ctx) {
        try {
            const itemId = get(ctx.params, 'id');
            const entryExists = await strapi.entityService.findOne(`${ITEM_API_PATH}`, itemId, {
                populate: ['weight', 'dimensions', 'category', 'handling', 'events'],
            });
            if (!entryExists) {
                return ctx.notFound('Supply chain item not found');
            };
            const onMessageReceived = (message: Object) => {
                console.log('Queue message', {
                    entryExists,
                    message
                })
            };
            const eventService: EventService = strapi.service(`${EVENT_API_PATH}`);
            await eventService.consumeMessages({
                // queue: 'new-product-created',
                queue: get(entryExists, 'trackingId'),
                onMessageReceived
            });
        } catch (error) {
            ctx.body = error;
        }
    }
}));
