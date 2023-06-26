/**
 * category controller
 */

import { factories } from '@strapi/strapi';

import { CATEGORY_API_PATH } from '../../../../constants';

export default factories.createCoreController(`${CATEGORY_API_PATH}`);
