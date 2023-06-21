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
    ]
  };
  