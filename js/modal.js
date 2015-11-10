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

        // While modal is open scroll must be forbidden
        // Запрет скроллинга, когда модальное окно открыто.
        $('body').addClass('no-scroll');
    };

    // Close the modal window
    // Закрывает модальное окно.
    Modal.prototype.close = function () {
        // Enable scrolling
        // разблокировать скроллинг
        $('body').removeClass('no-scroll');

        // Hide modal
        // скрыть модальное окно
        this.$wrapper.addClass('hide');

        // TODO: it should be an event, you should not call function directly
        // TODO: это должно быть событием, а не вызовом функции напрямую.
        if (this.currentView && typeof this.currentView.onClose === 'function') {
            this.currentView.onClose();
        }
    };

    // Disable events propogation
    // Предотвращает всплытие событий.
    Modal.prototype.stopPropogation = function (event) {
        event.stopPropagation();
    };

    window.modal = new Modal;
})();
