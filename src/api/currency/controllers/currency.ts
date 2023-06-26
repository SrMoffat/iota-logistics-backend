/**
 * currency controller
 */

import { factories } from '@strapi/strapi';

import { CURRENCY_API_PATH } from '../../../../constants';

export default factories.createCoreController(`${CURRENCY_API_PATH}`);
