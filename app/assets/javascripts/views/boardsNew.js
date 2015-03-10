TrelloClone.Views.BoardsNew = Backbone.View.extend({

  template: JST['boardsNew'],

  tagName: 'form',

  className: 'new-board-form',

  events: {
    "submit": "submit"
  },

  render: function () {
    var content = this.template();
    this.$el.html(content);
    return this;
  },

  submit: function (event) {
    event.preventDefault();
    var title = $(event.target).find('#new-board-title').val();
    this.collection.create( { title: title } );
  }

});
