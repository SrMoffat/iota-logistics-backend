/**
 * item controller
 */
import { v4 as uuid } from 'uuid';
import { get, omit } from 'lodash';
import { factories, Strapi } from '@strapi/strapi';

import createItemSchema from '../schemas/create-item.json';
import updateItemSchema from '../schemas/update-item.json';

import { ITEM_API_PATH } from '../../../../constants';
import { ItemService, Dimensions, ItemRequestBody } from '../types';

const blockUserFromAccess = (input) => {
    const { ctx, clearance, message } = input;
    const isUser = clearance === 'user';
    if (isUser) {
        return ctx.forbidden(message);
    }
    return;
};

const validateRequest = (input) => {
    const { ctx, message, service, body, schema } = input;
    const isValid = service.validateRequest(body, schema);
    if (!isValid) {
        return ctx.badRequest(message);
    };
    return;
};

export default factories.createCoreController(`${ITEM_API_PATH}`, ({ strapi }: { strapi: Strapi }) => ({
    async createNewSupplyChainItem(ctx) {
        try {
            const itemService: ItemService = strapi.service(`${ITEM_API_PATH}`);
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
            ctx.body = {
                success: true,
                ...newItem
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
}));
