/**
 * item controller
 */
import Ajv from 'ajv';
import { get } from 'lodash';
import { factories, Strapi } from '@strapi/strapi';

import itemSchema from '../schemas/item.json';
import {
    ITEM_API_PATH
} from '../../../../constants';

const validateRequest = (request: Object, schema: Object) => {
    try {
        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        return validate(request);
    } catch (error) {
        console.log('validateRequest:error', error)
        // throw new Error(error)
    }
};



export default factories.createCoreController(`${ITEM_API_PATH}`, ({ strapi }: { strapi: Strapi }) => ({
    async createNewSupplyChainItem(ctx) {
        try {
            /**
            * 1. Validate with JSON schema?
            * 2. Create item entry
            * Exit
            */
            const auth = get(ctx.state.auth, 'credentials');
            const clearance = get(auth, 'clearance');
            const requestBody = get(ctx.request, 'body') as Object;
            const isUser = clearance === 'user'

            if (isUser) {
                return ctx.forbidden('User should only use order route')
            } else {
                const isValid = validateRequest(requestBody, itemSchema)
                if (isValid) {
                    ctx.body = {
                        success: true,
                        message: "Add item controller finished successfully"
                    };
                } else {
                    console.log('Herexxx:Not valiud')
                    return ctx.badRequest('Malformed request body')
                }
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
