/**
 * item service
 */

import * as crypto from 'crypto';

import Ajv from 'ajv';
import utils from '@strapi/utils';
import { get, omit } from 'lodash';
import { factories, Strapi } from '@strapi/strapi';

import { EventService } from '../../event/types';
import {
    ITEM_API_PATH,
    STAGE_API_PATH,
    EVENT_API_PATH,
    STAGES, STATUSES,
    CATEGORY_API_PATH,
    NEW_PRODUCT_QUEUE_NAME,
} from '../../../../constants';
import {
    Dimensions,
    ItemDetails,
    ItemService,
    VolumeDetails,
    ItemRequestBody,
    BlockClearanceInput,
} from '../types';

const { ApplicationError } = utils.errors;

export default factories.createCoreService(`${ITEM_API_PATH}`, ({ strapi }: { strapi: Strapi }) => ({
    async createItem(details: ItemDetails) {
        try {
            const eventService: EventService = strapi.service(`${EVENT_API_PATH}`);
            const stage = await strapi.db.query(`${STAGE_API_PATH}`).findOne({
                where: {
                    name: {
                        $contains: STAGES.WAREHOUSING
                    }
                },
                populate: ['statuses'],
            });
            const stageId = get(stage, 'id');
            const stageName = get(stage, 'name');
            const statuses = get(stage, 'statuses');
            const stockStatus = statuses.find(entry => entry.name === STATUSES.STOCKED);
            const stockStatusId = get(stockStatus, 'id');
            const stockStatusName = get(stockStatus, 'name');
            const newItem = await strapi.entityService.create(`${ITEM_API_PATH}`, {
                data: details,
                populate: ['category', 'weight', 'dimensions', 'handling']
            });
            const itemCreated = get(newItem, 'id');
            if (itemCreated) {
                //  
                const eventDetails = await eventService.createAndPublishEvent({
                    item: newItem,
                    queue: NEW_PRODUCT_QUEUE_NAME,
                    stage: {
                        id: stageId,
                        name: stageName
                    },
                    status: {
                        id: stockStatusId,
                        name: stockStatusName
                    }
                });
                return {
                    item: newItem,
                    event: eventDetails
                }
            }
        } catch (error) {
            console.error(`Error creating item: ${error}`);
            throw new ApplicationError('Something went wrong:createItem', { error });
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
            });
            return updatedItem
        } catch (error) {
            throw new ApplicationError('Something went wrong:updateItem', { error });
        }
    },
    generateTrackingId() {
        try {
            return `IOTA#${crypto.randomBytes(4).toString("hex")}`;
        } catch (error) {
            throw new ApplicationError('Something went wrong:generateTrackingId', { error });
        }
    },
    calculateVolume(dimensions: Dimensions) {
        try {
            const { width, height, length, units } = dimensions;
            const volume = parseFloat(width) * parseFloat(height) * parseFloat(length);
            const value = volume.toFixed(2);
            return {
                value: Number(value),
                representation: `${value} ${units.split("_")[1]}\u00B3`
            };
        } catch (error) {
            throw new ApplicationError('Something went wrong:calculateVolume', { error });
        };
    },
    validateRequest(request: ItemRequestBody, schema: Object): Boolean {
        try {
            const ajv = new Ajv();
            const validate = ajv.compile(schema);
            return validate(request);
        } catch (error) {
            throw new ApplicationError('Something went wrong:validateRequest', { error });
        };
    },
    blockClearanceFromAccess(input: BlockClearanceInput) {
        try {
            const { role, message } = input;
            const isUser = role === 'user'
            if (isUser) {
                throw new ApplicationError(message, { message });
            }
        } catch (error) {
            throw new ApplicationError('Something went wrong:blockClearanceFromAccess', { error });
        };
    },
}));

