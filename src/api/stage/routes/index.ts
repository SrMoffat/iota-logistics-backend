export default {
  routes: [
    {
      method: 'POST',
      path: '/stages/seed',
      handler: 'stage.seedStagesAndStatuses'
    },
    {
      method: 'GET',
      path: '/stages/:id/events',
      handler: 'stage.getStageEvents'
    }
  ]
};
