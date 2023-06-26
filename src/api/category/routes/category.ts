/**
 * category router
 */

import { factories } from '@strapi/strapi';
import { CATEGORY_API_PATH } from '../../../../constants';

export default factories.createCoreRouter(`${CATEGORY_API_PATH}`);
