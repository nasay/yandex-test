(function () {
    var Modal = function () {
        this.$wrapper = $('#modal-wrapper');
        this.$content = $('#modal-content');

        var close = this.close.bind(this);

        $('#close').on('click', close);
        this.$content.on('click', this.stopPropogation);
        this.$wrapper.on('click', close);
    };

    Modal.prototype.show = function (view) {
        this.currentView = view;

        this.$content.append(view.$element);
        this.$wrapper.removeClass('hide');

        // Запрет скроллинга, когда модальное окно открыто.
        $('body').addClass('no-scroll');
    };

    // Закрывает модальное окно.
    Modal.prototype.close = function () {
        console.log('lalala');
        // разблокировать скроллинг
        $('body').removeClass('no-scroll');

        // скрыть модальное окно
        this.$wrapper.addClass('hide');

        // TODO: это должно быть событием, а не вызовом функции напрямую.
        if (this.currentView && typeof this.currentView.onClose === 'function') {
            this.currentView.onClose();
        }
    };

    // Предотвращает всплытие событий.
    Modal.prototype.stopPropogation = function (event) {
        event.stopPropagation();
    };

    window.modal = new Modal;
})();
