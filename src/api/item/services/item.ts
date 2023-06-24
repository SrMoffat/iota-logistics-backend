/**
 * item service
 */

import * as crypto from 'crypto';

import Ajv from 'ajv';
import { get, omit } from 'lodash';
import { factories, Strapi } from '@strapi/strapi';

import { ITEM_API_PATH } from '../../../../constants';
import {
    Dimensions,
    ItemDetails,
    ItemService,
    VolumeDetails,
    ItemRequestBody,
    BlockClearanceInput,
} from '../types';


export default factories.createCoreService(`${ITEM_API_PATH}`, ({ strapi }: { strapi: Strapi }) => ({
    async createItem(details: ItemDetails) {
        try {
            const newItem = await strapi.entityService.create(`${ITEM_API_PATH}`, {
                data: details,
                populate: ['category', 'weight', 'dimensions', 'handling']
            });
            return newItem
        } catch (error) {
            throw new Error(`Error creating item: ${error}`);
        }
    },
    async updateItem(details) {
        try {
            const itemService: ItemService = strapi.service(`${ITEM_API_PATH}`);
            const { id, ctx, body } = details;
            const entryExists = await strapi.entityService.findOne(`${ITEM_API_PATH}`, id);

            if (!entryExists) {
                return ctx.notFound('Supply chain item not found');
            }
            const dimensions: Dimensions = get(body, 'dimensions');
            const volume = itemService.calculateVolume(dimensions).value;
            const data = {
                ...omit(body, 'compliance'),
                dimensions: {
                    ...dimensions,
                    volume
                },
            }
            const updatedItem = await strapi.entityService.update(`${ITEM_API_PATH}`, entryExists.id, {
                data,
                populate: '*'
                // populate: ['category', 'weight', 'dimensions', 'handling']
            });
            return updatedItem
        } catch (error) {
            throw new Error(`Error creating item: ${error}`);
        }
    },
    generateTrackingId() {
        try {
            return `IOTA#${crypto.randomBytes(4).toString("hex")}`;
        } catch (error) {
            throw new Error(`Error generating trackingId: ${error}`);
        }
    },
    calculateVolume(dimensions: Dimensions): VolumeDetails {
        try {
            const { width, height, length, unit } = dimensions;
            const volume = parseFloat(width) * parseFloat(height) * parseFloat(length);
            const value = volume.toFixed(2);
            return {
                value: Number(value),
                representation: `${value} ${unit}\u00B3`
            };
        } catch (error) {
            throw new Error(`Error calculating volume: ${error}`);
        };
    },
    validateRequest(request: ItemRequestBody, schema: Object): Boolean {
        try {
            const ajv = new Ajv();
            const validate = ajv.compile(schema);
            return validate(request);
        } catch (error) {
            throw new Error(`Error validating request: ${error}`);
        };
    },
    blockClearanceFromAccess(input: BlockClearanceInput) {
        try {
            const { role, message } = input;
            const isUser = role === 'user'
            if (isUser) {
                throw new Error(message);
            }
        } catch (error) {
            throw new Error(`Error validating request: ${error}`);
        };
    },
}));

