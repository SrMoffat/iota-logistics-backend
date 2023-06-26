/**
 * stage controller
 */

import { factories } from '@strapi/strapi'

import { STAGE_API_PATH } from '../../../../constants';

export default factories.createCoreController(`${STAGE_API_PATH}`);
