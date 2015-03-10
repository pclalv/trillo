TrelloClone.Routers.Router = Backbone.Router.extend({

  routes: {
    "": "renderBoardsIndex",
    "boards/new": "renderBoardsIndexWithNew",
    "boards/:id": "renderBoardShow",
    "lists/:list_id/cards/new": "renderBoardsShowWithNew"
  },

  initialize: function (options) {
    this.$rootEl = options.$rootEl;
    this._boards = new TrelloClone.Collections.Boards();
  },

  renderBoardsIndex: function (options) {
    this._boards.fetch();

    var options = options || {};
    _.extend(options, { collection: this._boards });

    var boardsIndex = new TrelloClone.Views.BoardsIndex(options);
    this._swapView(boardsIndex);
  },

  renderBoardsIndexWithNew: function () {
    this.renderBoardsIndex({ includesForm: true });
  },

  renderBoardShow: function (id, options) {
    var boardShow,
        board = this._boards.getOrFetch(id),
        options = options || {};

    _.extend(options, { model: board })

    boardShow = new TrelloClone.Views.BoardShow(options);
    this._swapView(boardShow);
  },

  renderBoardsShowWithNew: function (list_id) {
    var list = new TrelloClone.Models.List({ id: list_id });

    list.fetch({
      success: function (model) {
        this.renderBoardShow(model.escape('board_id'), { includesFormForList: list_id });
      }.bind(this)
    });
  },

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  }
});
