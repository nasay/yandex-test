(function () {
    'use strict';

    var Router = function () {
        this.routes = {};
        this._binDEvents();
    };

    Router.prototype._bindEvents = function () {
        $(window).on('hashchange', this.onRoute);
    };

    Router.prototype.onRoute = function () {
        console.log(arguments);
    };

    this.router = new Router;
})();
