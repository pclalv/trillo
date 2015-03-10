TrelloClone.Collections.Cards = Backbone.Collection.extend({

  url: 'api/cards',

  comparator: function (card) {
    return -card.get('ord');
  },

  model: TrelloClone.Models.Card

});
