TrelloClone.Views.NewListForm = Backbone.View.extend({

  tagName: 'form',

  className: 'new-list-form',

  template: JST['newListForm'],

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
    var title = this.$("#new-list-title").val();
    this.collection.create({ title: title, board_id: this.model.id });
  }

});
