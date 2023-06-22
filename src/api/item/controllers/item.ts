/**
 * item controller
 */
import * as crypto from 'crypto';

import Ajv from 'ajv';
import { uuid } from 'uuidv4';
import { get, omit } from 'lodash';
import { factories, Strapi } from '@strapi/strapi';

import itemSchema from '../schemas/item.json';
import {
    ITEM_API_PATH
} from '../../../../constants';

type Dimensions = {
    length: string
    width: string
    height: string
    unit: string
}

type Handling = {
    type: string
    instructions: string
}

type Weight = {
    value: number
    unit: string
}

type Compliance = {
    customs: string
    regulatory: string
    certificates: string[]
}

type ItemRequestBody = {
    name: string
    quantity: number
    supplier: string
    description: string
    manufacturer: string
    colour: string
    category: number
    weight: Weight
    dimensions: Dimensions
    handling: Handling
    compliance: Compliance
}

const validateRequest = (request: ItemRequestBody, schema: Object): Boolean => {
    try {
        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        return validate(request);
    } catch (error) {
        console.log('validateRequest:error', error)
        throw new Error(error)
    }
};

const generateTrackingId = (): String => {
    try {
        return `IOTA#${crypto.randomBytes(4).toString("hex")}`;
    } catch (error) {
        console.log("Error generating order number", error);
    }
}

const calculateVolume = (dimensions: Dimensions): { value: string, representation: string } => {
    const { width, height, length, unit } = dimensions;
    const volume = parseFloat(width) * parseFloat(height) * parseFloat(length);

    const value = volume.toFixed(2);

    return {
        value,
        representation: `${value} ${unit}\u00B3`
    }
}

export default factories.createCoreController(`${ITEM_API_PATH}`, ({ strapi }: { strapi: Strapi }) => ({
    async createNewSupplyChainItem(ctx) {
        try {
            const auth = get(ctx.state.auth, 'credentials');
            const clearance = get(auth, 'clearance');
            const requestBody = get(ctx.request, 'body');

            const isUser = clearance === 'user'
            const isValid = validateRequest(requestBody, itemSchema)

            if (isUser) {
                return ctx.forbidden('User should only use order route')
            } else if (!isValid) {
                return ctx.badRequest('Malformed request body')
            } else {
                const dimensions = get(requestBody, 'dimensions')
                let dimensionsWithVolume = {
                    ...dimensions,
                    volume: Number(calculateVolume(dimensions).value)
                };

                const newItem = await strapi.entityService.create(`${ITEM_API_PATH}`, {
                    data: {
                        ...omit(requestBody, 'compliance'),
                        dimensions: dimensionsWithVolume,
                        uuid: uuid(),
                        trackingId: generateTrackingId(),
                    },
                    // populate: ['paper']
                });
                console.log(newItem);

                ctx.body = {
                    success: true,
                    message: "Add item controller finished successfully"
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
