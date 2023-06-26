/**
 * category service
 */

import { factories } from '@strapi/strapi';
import { CATEGORY_API_PATH } from '../../../../constants';

export default factories.createCoreService(`${CATEGORY_API_PATH}`);
