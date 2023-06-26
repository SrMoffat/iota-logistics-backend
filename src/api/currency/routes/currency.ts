/**
 * currency router
 */

import { factories } from '@strapi/strapi';
import { CURRENCY_API_PATH } from '../../../../constants';

export default factories.createCoreRouter(`${CURRENCY_API_PATH}`);
