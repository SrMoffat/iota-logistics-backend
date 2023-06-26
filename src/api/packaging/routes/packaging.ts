/**
 * packaging router
 */

import { factories } from '@strapi/strapi';
import { PACKAGING_API_PATH } from '../../../../constants';

export default factories.createCoreRouter(`${PACKAGING_API_PATH}`);
