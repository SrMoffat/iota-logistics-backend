/**
 * stage controller
 */
import { get } from 'lodash';
import utils from '@strapi/utils';
import { factories, Strapi } from '@strapi/strapi'

import {
    CURRENCIES,
    STAGE_API_PATH,
    EVENT_API_PATH,
    STATUS_API_PATH,
    CATEGORY_API_PATH,
    CURRENCY_API_PATH,
    PRODUCT_CATEGORIES,
    STAGE_DESCRIPTIONS,
    STAGES_AND_STATUS_MAPPING,
} from '../../../../constants';

const { ApplicationError } = utils.errors;

export default factories.createCoreController(`${STAGE_API_PATH}`, ({ strapi }: { strapi: Strapi }) => ({
    async find(ctx) {
        try {
            const { meta } = await super.find(ctx);
            const data = await strapi.db.query(`${STAGE_API_PATH}`).findMany({
                populate: ['statuses']
            });
            return { data, meta };
        } catch (error) {
            throw new ApplicationError('Something went wrong:find', { error });
        }
    },
    async seedStagesAndStatuses(ctx) {
        try {
            const requestBody = get(ctx.request, 'body');
            if (requestBody.data) {
                // TODO: Check permissions, validate request body and if admin, use data to seed DB
            } else {
                // Get stages hard coded data and feed table with stages and status
                Object.keys(STAGES_AND_STATUS_MAPPING).forEach(async key => {
                    const statuses = STAGES_AND_STATUS_MAPPING[key];
                    const description = STAGE_DESCRIPTIONS[key];
                    const details = {
                        name: key,
                        description,
                    };
                    const newStage = await strapi.entityService.create(`${STAGE_API_PATH}`, {
                        data: details
                    });
                    if (newStage.id) {
                        statuses.forEach(async entry => {
                            const data = {
                                name: entry.name,
                                description: entry.description,
                                stage: newStage.id
                            };
                            await strapi.entityService.create(`${STATUS_API_PATH}`, {
                                data
                            });
                        })
                    }
                });
                PRODUCT_CATEGORIES.forEach(async (category) => {
                    const details = {
                        name: category,
                        description: category,
                    };
                    await strapi.entityService.create(`${CATEGORY_API_PATH}`, {
                        data: details
                    });

                })
                CURRENCIES.forEach(async (currency) => {
                    const parts = currency.split(":");
                    const details = {
                        code: parts[0],
                        name: parts[1],
                    };
                    await strapi.entityService.create(`${CURRENCY_API_PATH}`, {
                        data: details
                    });

                })
            }
            ctx.body = {
                success: true,
                message: "Seed was successful for Stage, Status, Category and Currency models"
            };
        } catch (error) {
            throw new ApplicationError('Something went wrong:seedStagesAndStatuses', { error });
        }
    },
    async getStageEvents(ctx) {
        try {
            const stageId = get(ctx.params, 'id');
            const stage = await strapi.db.query(`${STAGE_API_PATH}`).findOne({
                where: {
                    id: {
                        $eq: stageId
                    }
                }
            });
            if (!stage) {
                return ctx.notFound('Milestone item not found');
            }
            const stages = await strapi.db.query(`${EVENT_API_PATH}`).findMany({
                populate: ['item', 'stage', 'status'],
            });
            const events = stages.filter(entry => `${entry.stage.id}` === `${stageId}`);
            return events
        } catch (error) {
            throw new ApplicationError('Something went wrong:getStageEvents', { error });
        }
    }
}));
