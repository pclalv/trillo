TrelloClone.Views.BoardShowList = Backbone.CompositeView.extend({

  tagName: 'li',

  className: 'board-list',

  template: JST['boardShowList'],

  cardModalTemplate: JST['cardModal'],

  events: {
    "click .new-card": "renderNewCardForm",
    "click .delete-card" : "deleteCard",
    "sortstop .cards": "finalizeNewOrder",
    "click .cards-list-item": "revealBack",
    "click .close-modal": "closeModal"
  },

  initialize: function (options) {
    this.listenTo(this.model, "sync", this.render);
    this.listenTo(this.collection, "sync remove", function () {
      this.includesForm = false;
      this.render();
    });
    this.includesForm = options.includesForm || false;
  },

  render: function () {
    var content = this.template({
      list: this.model,
      cards: this.collection
    });

    this.removeSubviews();
    this.$el.html(content);

    if (this.includesForm) { this.renderNewCardForm(); };

    this.$('ul.cards').sortable();

    return this;
  },

  renderNewCardForm: function (event) {
    event && event.preventDefault();
    Backbone.history.navigate('#/lists/' + this.model.id + '/cards/new')
    var form = new TrelloClone.Views.CardsNew({
      model: this.model,
      collection: this.collection
    });
    this.$(".new-card").remove();
    this.addSubview(".cards-list-item-new", form);
  },

  deleteCard: function (event) {
    event.preventDefault();

    var cards = this.collection,
        card_id = $(event.currentTarget).data("card-id"),
        card = cards.get(card_id);

    card.destroy({
      success: function (model) {
        cards.remove(model);
      }
    });
  },

  finalizeNewOrder: function (event, ui) {
    var newIdx,
        targetLi = ui.item,
        targetCard = this.model.cards().get(targetLi.data('card-id')),
        parentList = $(ui.item.parent()),
        endIdx = targetLi.index(),
        prevIdx = endIdx - 1,
        nextIdx = endIdx + 1,
        prevLi = $(parentList.children()[prevIdx]),
        nextLi = $(parentList.children()[nextIdx]),
        targetCard = this.model.cards().get(targetLi.data('card-id')),
        prevCard = this.model.cards().get(prevLi.data('card-id')),
        nextCard = this.model.cards().get(nextLi.data('card-id'));

    if (prevCard && nextCard) {
      newOrd = ((prevCard.get('ord') + nextCard.get('ord')) / 2);
    } else if (prevCard) {
      newOrd = (prevCard.get('ord') - 1);
    } else {
      newOrd = (nextCard.get('ord') + 1);
    }

    targetCard.save({ ord: newOrd }, {
      success: function (model) {
        this.model.cards().add(model, { merge: true });
        this.model.cards().sort();
      }.bind(this)
    });
  },

  revealBack: function (event) {
    var cover = $('<div class=cover>'),
        card = this.model.cards().get($(event.currentTarget).data('card-id')),
        cardModal = this.cardModalTemplate({ card: card });

    $('body').prepend(cover);

    this.$el.append(cardModal);
  },

  closeModal: function (event) {
    $('.modal').remove();
    $('.cover').remove();
  }

});
