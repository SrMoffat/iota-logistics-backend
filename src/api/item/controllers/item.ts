/**
 * item controller
 */
import { get } from 'lodash';
import { factories } from '@strapi/strapi'

import {
    ITEM_API_PATH
} from '../../../../constants';

export default factories.createCoreController(`${ITEM_API_PATH}`, ({ strapi }) => ({
    async createNewSupplyChainItem(ctx) {
        try {
            const auth = get(ctx.state.auth, 'credentials');
            const requestBody = get(ctx.request, 'body') as Object;

            console.log({
                auth,
                requestBody
            })
            ctx.body = {
                success: true,
                message: "Add item controller finished successfully"
            };
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
}));
