export default {
    routes: [
      {
        method: 'POST',
        path: '/supply-items',
        handler: 'item.createNewSupplyChainItem'
      },
      {
        method: 'PUT',
        path: '/supply-items/:id',
        handler: 'item.updateSupplyChainItem'
      },
      {
        method: 'POST',
        path: '/supply-items/:id/events',
        handler: 'item.addSupplyChainItemEvent'
      },
      {
        method: 'GET',
        path: '/supply-items/:id/events',
        handler: 'item.getAllSupplyChainItemEvents'
      },
      {
        method: 'GET',
        path: '/supply-items/:id/events/recent/:count',
        handler: 'item.getSupplyChainItemMostRecentEvent'
      },
    ]
  };
  