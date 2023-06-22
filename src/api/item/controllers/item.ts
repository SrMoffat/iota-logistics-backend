/**
 * item controller
 */
import { uuid } from 'uuidv4';
import { get, omit } from 'lodash';
import { factories, Strapi } from '@strapi/strapi';

import itemSchema from '../schemas/item.json';
import { ITEM_API_PATH } from '../../../../constants';
import { ItemService, Dimensions } from '../types';

export default factories.createCoreController(`${ITEM_API_PATH}`, ({ strapi }: { strapi: Strapi }) => ({
    async createNewSupplyChainItem(ctx) {
        try {
            const itemService: ItemService = strapi.service(`${ITEM_API_PATH}`)

            const auth = get(ctx.state.auth, 'credentials');
            const clearance = get(auth, 'clearance');
            const requestBody = get(ctx.request, 'body');

            const isUser = clearance === 'user'
            const isValid = itemService.validateRequest(requestBody, itemSchema)

            if (isUser) {
                return ctx.forbidden('User should only use order route')
            } else if (!isValid) {
                return ctx.badRequest('Malformed request body')
            } else {
                const dimensions: Dimensions = get(requestBody, 'dimensions')
                const volume = itemService.calculateVolume(dimensions).value
                const trackingId = itemService.generateTrackingId()

                const data = {
                    ...omit(requestBody, 'compliance'),
                    trackingId,
                    uuid: uuid(),
                    dimensions: {
                        ...dimensions,
                        volume
                    },
                }

                const newItem = await strapi.entityService.create(`${ITEM_API_PATH}`, {
                    data,
                    populate: ['category', 'weight', 'dimensions', 'handling']
                });

                ctx.body = {
                    success: true,
                    item: newItem
                };
            }
        } catch (err) {
            ctx.body = err;
        };
    },
    async updateSupplyChainItem(ctx) {
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
                message: "Update item controller finished successfully"
            };
        } catch (err) {
            ctx.body = err;
        };
    },
    async addSupplyChainItemEvent(ctx) {
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
