/**
 * packaging service
 */

import { factories } from '@strapi/strapi';
import { PACKAGING_API_PATH } from '../../../../constants';

export default factories.createCoreService(`${PACKAGING_API_PATH}`);
