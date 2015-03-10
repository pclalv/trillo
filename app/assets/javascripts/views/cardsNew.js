TrelloClone.Views.CardsNew = Backbone.View.extend({

  tagName: 'form',

  className: '',

  template: JST['cardsNew'],

  events: {
    "click .submit": "submit"
  },

  initialize: function (options) {
    this.list_id = options.list_id
  },

  render: function () {
    var content = this.template();
    this.$el.html(content)
    return this;
  },

  submit: function (event) {
    event.preventDefault();

    var formData = this.$el.serializeJSON()['card'];

    if (formData['title']) {
      _.extend(formData, { list_id: this.model.id })
      this.collection.create(formData);
    } else {
      this.$('#new-card-title').addClass('highlight');
    }
  }
});
