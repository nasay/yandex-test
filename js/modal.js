(function () {
    'use strict';

    var Modal = function () {
        this.$wrapper = $('#modal-wrapper');
        this.$el = this.wrapper.find('#modal');
        this.$wrapper.on('click', this.close.bind(this));
    };

    Modal.prototype.close = function () {
        this.$el.empty();
        this.$wrapper.addClass('hide');
    }
})();
