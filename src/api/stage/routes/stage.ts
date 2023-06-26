/**
 * stage router
 */

import { factories } from '@strapi/strapi';
import { STAGE_API_PATH } from '../../../../constants';

export default factories.createCoreRouter(`${STAGE_API_PATH}`);
