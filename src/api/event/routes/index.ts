export default {
    routes: [
      {
        method: 'POST',
        path: '/supply-items/:id/events',
        handler: 'event.addSupplyChainItemEvent'
      },
      {
        method: 'GET',
        path: '/supply-items/:id/events',
        handler: 'event.getAllSupplyChainItemEvents'
      },
      {
        method: 'GET',
        path: '/supply-items/:id/events/recent/:count',
        handler: 'event.getSupplyChainItemMostRecentEvent'
      },
    ]
  };
  