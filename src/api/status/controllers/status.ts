/**
 * status controller
 */

import { factories } from '@strapi/strapi'
import { STATUS_API_PATH } from '../../../../constants';

export default factories.createCoreController(`${STATUS_API_PATH}`);
