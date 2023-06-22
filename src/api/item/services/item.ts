/**
 * item service
 */

import Ajv from 'ajv';
import * as crypto from 'crypto';
import { factories } from '@strapi/strapi';

import { ITEM_API_PATH } from '../../../../constants';
import { Dimensions, VolumeDetails, ItemRequestBody } from '../types';

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
    validateRequest(request: ItemRequestBody, schema: Object): Boolean {
        try {
            const ajv = new Ajv();
            const validate = ajv.compile(schema);
            return validate(request);
        } catch (error) {
            throw new Error(`Error validating request: ${error}`);
        }
    },
}));

