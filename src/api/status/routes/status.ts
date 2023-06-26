/**
 * status router
 */

import { factories } from '@strapi/strapi';
import { STATUS_API_PATH } from '../../../../constants';

export default factories.createCoreRouter(`${STATUS_API_PATH}`);
