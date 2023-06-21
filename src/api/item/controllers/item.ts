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
                message: "Item controller finished successfully"
            };
        } catch (err) {
            ctx.body = err;
        };
    },
}));
