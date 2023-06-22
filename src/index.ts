import { Strapi } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * application is initialized.
   */
  register({ strapi }: { strapi: Strapi }) { },

  /**
   * An asynchronous bootstrap function that runs before
   * application gets started.
   *
   *  Set up data model,
   * run jobs, or perform special logic.
   */
  bootstrap(/*{ strapi }*/) { },
};
