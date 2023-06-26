/**
 * currency service
 */

import { factories } from '@strapi/strapi';
import { CURRENCY_API_PATH } from '../../../../constants';

export default factories.createCoreService(`${CURRENCY_API_PATH}`);
