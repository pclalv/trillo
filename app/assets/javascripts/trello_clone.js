window.TrelloClone = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    TrelloClone.router = new TrelloClone.Routers.Router({ $rootEl: $('#main') });
    Backbone.history.start();
  }
};

$(document).ready(function () {
  TrelloClone.initialize();
});
