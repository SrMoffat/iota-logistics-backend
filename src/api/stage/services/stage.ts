/**
 * stage service
 */

import { factories } from '@strapi/strapi';
import { STAGE_API_PATH } from '../../../../constants';

export default factories.createCoreService(`${STAGE_API_PATH}`);
