/**
 * event router
 */

import { factories } from '@strapi/strapi';
import { EVENT_API_PATH } from '../../../../constants';

export default factories.createCoreRouter(`${EVENT_API_PATH}`);
