/**
 * item service
 */

import * as crypto from 'crypto';

import Ajv from 'ajv';
import { get } from 'lodash';
import { factories } from '@strapi/strapi';

import { ITEM_API_PATH } from '../../../../constants';
import {
    Dimensions,
    ItemService,
    VolumeDetails,
    ItemRequestBody,
    BlockClearanceInput,
    ValidationSequenceInput,
} from '../types';

export default factories.createCoreService(`${ITEM_API_PATH}`, ({ strapi }) => ({
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
            }
        } catch (error) {
            throw new Error(`Error calculating volume: ${error}`);
        }
    },
    // TODO: Transform into middlware
    validateRequest(request: ItemRequestBody, schema: Object): Boolean {
        try {
            const ajv = new Ajv();
            const validate = ajv.compile(schema);
            return validate(request);
        } catch (error) {
            throw new Error(`Error validating request: ${error}`);
        }
    },
    // TODO: Transform into middlware
    blockClearanceFromAccess(input: BlockClearanceInput) {
        try {
            const { role, message } = input;
            const isUser = role === 'user'

            if (isUser) {
                throw new Error(message);
            }
        } catch (error) {
            throw new Error(`Error validating request: ${error}`);
        }
    },
    validationSequence(context: ValidationSequenceInput) {
        try {
            const itemService: ItemService = strapi.service(`${ITEM_API_PATH}`)
            
            const block = get(context, 'block');

            itemService.blockClearanceFromAccess({
                role: block,
                message: 'User should only use order route'
            })
            // console.log(context)

            // const ctx = get(context, 'ctx');





            // console.log(context)
        } catch (error) {
            throw new Error(`Error validating request: ${error}`);
        }
    }
}));

