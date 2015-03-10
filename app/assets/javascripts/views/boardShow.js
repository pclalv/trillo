TrelloClone.Views.BoardShow = Backbone.CompositeView.extend({

  tagName: "figure",

  className: "board-show",

  template: JST['boardShow'],

  boardDeleteTemplate: JST['boardDelete'],

  events: {
    "click .new-list": 'renderNewListForm',
    "click .delete": 'renderDeletePrompt',
    "click .delete-for-real": "deleteBoard",
    "click .cancel": "removeDeletePrompt",
    "click .add-member": "addMember"
  },

  initialize: function (options) {
    this.listenTo(this.model, "sync", this.render);
    this.listenTo(this.model.lists(), "sync", this.render);
    this.includesFormForList = options.includesFormForList || -1;
  },

  render: function () {
    this.removeSubviews();

    var content = this.template({ board: this.model });
    this.$el.html(content)

    this.model.lists().each(function (list) {
      var listItem,
          includesForm = (this.includesFormForList == list.id)
                       ? true
                       : false

      listItem = new TrelloClone.Views.BoardShowList({
        model: list,
        collection: list.cards(),
        includesForm: includesForm,
        attributes: {
          "data-list-id": list.id
        }
      });

      this.addSubview('.lists-list', listItem, { prepend: true });
    }, this);

    return this;
  },

  renderDeletePrompt: function (event) {
    event.preventDefault();
    var boardDelete = this.boardDeleteTemplate({ board: this.model }),
        cover = $('<div class="cover">');

    $('body').prepend(cover);

    this.$el.append(boardDelete);
  },

  removeDeletePrompt: function (event) {
    $('.cover').remove();
    this.$('.modal').remove();
  },

  deleteBoard: function () {
    $('.cover').remove();
    $('.modal').remove();
    this.model.destroy();
    Backbone.history.navigate('', { trigger: true })
  },

  finalizeNewOrder: function (event, ui) {
    var newIdx,
        targetLi = ui.item,
        targetList = this.model.cards().get(targetLi.data('list-id')),
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


  renderNewListForm: function (event) {
    event.preventDefault();
    this.$('.new-list').remove();
    var form = new TrelloClone.Views.NewListForm({
      model: this.model,
      collection: this.model.lists()
    });
    this.addSubview('.board-list-new', form);
  },

  addMember: function () {

  }

});
