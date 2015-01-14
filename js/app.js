$(function () {
    'use strict';

    var App = function () {};

    App.prototype.start = function () {
        var self = this;

        // Получение списка презентаций с сервера.
        $.getJSON('json/p-list.json', function (data) {
            self.list = new List(data.result);

            self.list.render();
        });
    };

    window.app = new App;
    window.app.start();
});
