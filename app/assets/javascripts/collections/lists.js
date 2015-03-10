TrelloClone.Collections.Lists = Backbone.Collection.extend({

  // comparator: 'ord',

  comparator: function (list) {
    return -list.escape('ord');
  },

  url: 'api/lists',

  model: TrelloClone.Models.List

});
