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
        path: '/supply-items/events',
        handler: 'item.addSupplyChainItemEvent'
      },
    ]
  };
  