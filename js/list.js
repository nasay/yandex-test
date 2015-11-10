(function () {
    'use strict';

    // Used for showing list of presentations
    // Исопользуется для отображения списка презентаций.
    var List = function (presentations) {
        this.presentations = presentations;
        this.$el = $('#presentations-list');
    };

    // Show list of presentations
    // Отображает презентации.
    List.prototype.render = function () {
        var self = this;

        var $link;
        var fragment = document.createDocumentFragment();

        // Open the presentation
        // Открывает презентацию.
        var onClick = function () {
            $.getJSON('json/' + this.dataset.id + '.json', function (data) {
                var container = new Container;
                container.show(data.result.slides);
            });
        };

        for (var i = 0; i < this.presentations.length; i++) {
            $link = $('<a/>', {
                class: 'presentation',
                'data-id': this.presentations[i].id,
                text: this.presentations[i].name,
                click: onClick
            });

            fragment.appendChild($link[0]);
        }

        this.$el.append(fragment);
    };

    window.List = List;
})();
