/**
 * item router
 */

import { factories } from '@strapi/strapi';

import { ITEM_API_PATH } from '../../../../constants';

export default factories.createCoreRouter(`${ITEM_API_PATH}`);
