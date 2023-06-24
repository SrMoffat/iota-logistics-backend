/**
 * item controller
 */
import { v4 as uuid } from 'uuid';
import { get, omit } from 'lodash';
import { factories, Strapi } from '@strapi/strapi';

import createItemSchema from '../schemas/create-item.json';
import updateItemSchema from '../schemas/update-item.json';

import { ItemService, Dimensions, EventService, ItemRequestBody } from '../types';
import {
    STAGES,
    STATUSES,
    ITEM_API_PATH,
    EVENT_API_PATH,
    NEW_PRODUCT_QUEUE_NAME,
} from '../../../../constants';

const blockUserFromAccess = (input) => {
    const { ctx, clearance, message } = input;
    const isUser = clearance === 'user';
    if (isUser) {
        return ctx.forbidden(message);
    }
};

const validateRequest = (input) => {
    const { ctx, message, service, body, schema } = input;
    const isValid = service.validateRequest(body, schema);
    if (!isValid) {
        return ctx.badRequest(message);
    };
};

export default factories.createCoreController(`${ITEM_API_PATH}`, ({ strapi }: { strapi: Strapi }) => ({
    async createNewSupplyChainItem(ctx) {
        try {
            const itemService: ItemService = strapi.service(`${ITEM_API_PATH}`);
            const eventService: EventService = strapi.service(`${EVENT_API_PATH}`);
            const auth = get(ctx.state.auth, 'credentials');
            const clearance = get(auth, 'clearance');
            const requestBody: ItemRequestBody = get(ctx.request, 'body');
            const dimensions: Dimensions = get(requestBody, 'dimensions');
            const volume = itemService.calculateVolume(dimensions).value;
            const trackingId = itemService.generateTrackingId();
            blockUserFromAccess({
                ctx,
                clearance,
                message: 'User should only use order route'
            });
            validateRequest({
                ctx,
                body: requestBody,
                service: itemService,
                schema: createItemSchema,
                message: 'Malformed create item request body'
            });
            const newItem = await itemService.createItem({
                ...omit(requestBody, 'compliance'),
                trackingId,
                uuid: uuid(),
                dimensions: {
                    ...dimensions,
                    volume
                },
            })
            const itemCreated = get(newItem, 'id');
            if (itemCreated) {
                await eventService.createAndPublishEvent({
                    item: newItem,
                    queue: NEW_PRODUCT_QUEUE_NAME,
                    stage: STAGES.WAREHOUSING,
                    status: STATUSES.STOCKED
                });
            }
            ctx.body = {
                success: true,
                item: newItem
            };
        } catch (err) {
            ctx.body = err;
        };
    },
    async updateSupplyChainItem(ctx) {
        try {
            const itemService: ItemService = strapi.service(`${ITEM_API_PATH}`);
            const itemId = get(ctx.params, 'id');
            const auth = get(ctx.state.auth, 'credentials');
            const clearance = get(auth, 'clearance');
            const requestBody = get(ctx.request, 'body');
            blockUserFromAccess({
                ctx,
                clearance,
                message: 'User should only use order route'
            });
            validateRequest({
                ctx,
                body: requestBody,
                service: itemService,
                schema: updateItemSchema,
                message: 'Malformed update item request body'
            });
            const updatedItem = await itemService.updateItem({
                id: itemId,
                ctx,
                body: requestBody,
            });
            ctx.body = {
                success: true,
                item: updatedItem
            };
        } catch (err) {
            ctx.body = err;
        };
    },
    async addSupplyChainItemEvent(ctx) {
        try {
            const amqpUrl = 'amqp://localhost';

            const eventService: EventService = strapi.service(`${ITEM_API_PATH}`);
            const { connection, channel } = await eventService.connectToRabbitMq(amqpUrl);
            // Create event entry and link it to this item
            // Emit an event to the topic with the new event details
            await eventService.publishMessage({
                channel,
                queueName: 'test_queue',
                message: {
                    name: 'ungowami'
                },
            })
            await eventService.consumeMessages({
                channel,
                queueName: 'test_queue',
                onMessageReceived: () => {
                    console.log('received');
                }
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
