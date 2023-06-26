/**
 * status service
 */

import { factories } from '@strapi/strapi';
import { STATUS_API_PATH } from '../../../../constants';

export default factories.createCoreService(`${STATUS_API_PATH}`);
