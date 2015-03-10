TrelloClone.Views.BoardsIndex = Backbone.CompositeView.extend({

  tagName: 'ul',

  className: 'boards-index-list',

  template: JST['boardsIndex'],

  events: {
    "click .new-board": "renderNewBoardForm"
  },

  initialize: function (options) {
    this.listenTo(this.collection, "sync add remove", this.render);
    this.includesForm = options.includesForm || false
  },

  render: function () {
    this.removeSubviews();
    var content = this.template({ boards: this.collection });
    this.$el.html(content);

    if (this.includesForm) {
      this.renderNewBoardForm();
    };

    return this;
  },

  renderNewBoardForm: function (event) {
    event && event.preventDefault();
    Backbone.history.navigate("#/boards/new")
    this.$('.new-board').remove();
    var form =
      new TrelloClone.Views.BoardsNew({ collection: this.collection });
    this.addSubview('.boards-index-item-new', form);
  }

});
