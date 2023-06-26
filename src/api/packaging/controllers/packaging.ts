/**
 * packaging controller
 */

import { factories } from '@strapi/strapi';
import { PACKAGING_API_PATH } from '../../../../constants';

export default factories.createCoreController(`${PACKAGING_API_PATH}`);
