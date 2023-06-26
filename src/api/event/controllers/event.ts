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
                }
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
