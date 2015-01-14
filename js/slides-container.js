(function () {
    'use strict';

    var Container = function () {
        // Индекс текущего слайда.
        this.currentIndex = 0;

        this.bindUIElements();
        this.bindEvents();
    };

    // Таймаут, после которого скрываются панель навигации и курсор в
    // полноэкранном режиме.
    Container.prototype.hidingTimeout = 3000;

    // Кеширование ui элементов, которые используются часто.
    Container.prototype.bindUIElements = function () {
        this.$document = $(document);
        this.$wrapper = $('#modal-wrapper');
        this.$el = this.$wrapper.find('#modal');

        this.$panel = this.$el.find('#navigation-panel');
        this.$slidesWrapper = this.$el.find('#slides-wrapper');
        this.$nextButton = this.$el.find('#next-button');
        this.$previousButton = this.$el.find('#previous-button');
        this.$fullscreenButton = this.$el.find('#fullscreen-button');
    };

    // Привязывает события.
    Container.prototype.bindEvents = function () {
        // События модального окна.
        var close = this.close.bind(this);

        this.$el.on('click', this.stopPropogation);
        this.$el.on('click', '#close', close);
        this.$wrapper.on('click', close);


        // Навигация чз кнопки панели.
        this.$nextButton.on('click', this.showNextSlide.bind(this));
        this.$previousButton.on('click', this.showPreviousSlide.bind(this));
        this.$fullscreenButton.on('click', this.toggleFullScreen.bind(this));
    };

    // Предотвращает всплытие событий.
    Container.prototype.stopPropogation = function (event) {
        event.stopPropagation();
    };

   // Отображает слайды, переданные в аргументе, в модальном окне.
   Container.prototype.show = function (slides) {
        var fragment = document.createDocumentFragment();

        for (var i = 0; i < slides.length; i++) {
            var slide = document.createElement('div');
            var content = document.createElement('div');

            slide.classList.add(slides[i].style);
            slide.classList.add('slide');

            if (i !== 0) {
                slide.classList.add('next');
            }

            // я исхожу из того, что html  код, пришедший с сервера,
            // сгенерирован нами, и ему можно доверять
            content.innerHTML = slides[i].content;
            content.className = 'content';

            slide.appendChild(content);

            fragment.appendChild(slide);
        }

        // кешируем слайды для дальнейшей навигации.
        this.$slides = $(fragment.children);

        this.$slidesWrapper.append(fragment);


        // В начале кнопка "назад" должна быть недоступной.
        this.$previousButton.prop('disabled', true);

        // Если только один слайд, то кнопка "вперед" тоже недоступна
        if (this.$slides.length === 1) {
            this.$nextButton.prop('disabled', true);
        }

        this.$wrapper.removeClass('hide');

        // Запрет скроллинга, когда модальное окно открыто.
        $('body').addClass('modal-open');

        // События при показе презентации.
        this.$document.on('keydown.shown', this.onKey.bind(this));
        this.$document.on('webkitfullscreenchange.shown mozfullscreenchange.shown' +
               ' fullscreenchange.shown MSFullscreenChange.shown', this.onFullScreen.bind(this));
    };

    // Отбражает панель навигации.
    Container.prototype.showPanel = function () {
        this.clearHidingTimeout();
        this.$panel.removeClass('hidden');
    };

    // Устанавливает таймаут, после которого панель навигации будет скрыта.
    // При этомкурсор тоже скрывается.
    Container.prototype.setPanelHidingTimeout = function () {
        var self = this;

        this.panelTimeoutID = window.setTimeout(function () {
            self.$panel.addClass('hidden');
            self.toggleCursor(true);
        }, this.hidingTimeout);
    };

    // Очищает тайматы для панели и курсора.
    Container.prototype.clearHidingTimeout = function () {
        this.clearPanelTimeout();
        this.clearCursorTimeout();
    };

    // Очищает таймаут панели.
    Container.prototype.clearPanelTimeout = function () {
        if (this.panelTimeoutID) {
            window.clearTimeout(this.panelTimeoutID);
            this.panelTimeoutID = null;
        }
    };

    // Очищает таймаут курсора.
    Container.prototype.clearCursorTimeout = function () {
        if (this.cursorTimeoutID) {
            window.clearTimeout(this.cursorTimeoutID);
            this.cursorTimeoutID = null;
        }
    };

    // Отображает/убирает курсор
    Container.prototype.toggleCursor = function (value) {
        this.$slidesWrapper.toggleClass('no-cursor', value);
    };

    // Срабатывает после успешного открытия/закрытия полноэкранного режима.
    Container.prototype.onFullScreen = function () {
        var fullScreenElement = document.fullscreenElement || document.mozFullScreenElement ||
            document.webkitFullscreenElement || document.msFullscreenElement;


        if (fullScreenElement) {
            // Отображениее курсора после движения.
            this.$slidesWrapper.on('mousemove.fullscreen', this.onMouseMove.bind(this));

            // Отображает/скрывает панель при наведении.
            this.$panel.on('mouseover.fullscreen', this.showPanel.bind(this));
            this.$panel.on('mouseout.fullscreen', this.setPanelHidingTimeout.bind(this));

        //    this.setPanelHidingTimeout();
        } else {
            // Отображение курсора и панели.
            this.showPanel();
            this.toggleCursor(false);

            // Убирает полноэкранные события
            this.$slidesWrapper.off('.fullscreen');
            this.$panel.off('.fullscreen');
        }
    };

    // Отображает курсора, заменяет существующий таймаут на новый
    Container.prototype.onMouseMove = function () {
        this.toggleCursor(false);

        this.clearCursorTimeout();
        this.cursorTimeoutID = window.setTimeout(this.toggleCursor.bind(this), this.hidingTimeout, true);
    };

    // Навигация при помощи клавиатуры: стрелочки для перехода между слайдами и
    // полноэкранный режим на F2.
    Container.prototype.onKey = function (event) {
        if (event.keyCode === 113) {
            this.toggleFullScreen();
        } else if (event.keyCode === 39) {
            this.showNextSlide();
        } else if (event.keyCode === 37) {
            this.showPreviousSlide();
        }
    };

    // Отображает следующий слайд.
    Container.prototype.showNextSlide = function () {
        this.showSlide(this.currentIndex + 1);
    };

    // Отображает предыдущий слайд.
    Container.prototype.showPreviousSlide = function () {
        this.showSlide(this.currentIndex - 1);
    };

    // Отображает слайд с заданным индексом.
    // Устанавливает доступность кнопок.
    Container.prototype.showSlide = function (index) {
        var lastIndex = this.$slides.length - 1;
        var $oldSlide, $newSlide;

        if (index < 0 || index > lastIndex || index === this.currentIndex) {
            return;
        }

        // Кнопки.
        if (index === 0) {
            this.$previousButton.prop('disabled', true);
        } else if (this.currentIndex === 0) {
            this.$previousButton.prop('disabled', false);
        }

        if (index === lastIndex) {
            this.$nextButton.prop('disabled', true);
        } else if (this.currentIndex === lastIndex) {
            this.$nextButton.prop('disabled', false);
        }

        // Отображение слайда.
        $oldSlide = this.$slides.eq(this.currentIndex);
        $newSlide = this.$slides.eq(index);

        if (index > this.currentIndex) {
            $oldSlide.addClass('previous');
            $newSlide.removeClass('next');
        } else {
            $oldSlide.addClass('next');
            $newSlide.removeClass('previous');
        }

        this.currentIndex = index;
    };

    // Закрывает модальное окно.
    Container.prototype.close = function () {
        // разблокировать скроллинг
        $('body').removeClass('modal-open');

        // скрыть модальное окно
        this.$wrapper.addClass('hide');

        // разблокировать кнопку "вперед"
        if (this.currentIndex === this.$slides.length - 1) {
            this.$nextButton.prop('disabled', false);
        }

        // удалить слайды
        this.$slidesWrapper.empty();
        this.$slides = null;
        this.currentIndex = 0;

        // отписаться от событий, работающих при показе презентации
        this.$document.off('.shown');
    };

    // MDN fullscreen API
    Container.prototype.toggleFullScreen = function () {
        var element = document.getElementById('presentation-container');

        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {

            if (document.documentElement.requestFullscreen) {
                element.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
               element.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
               element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    };

    window.Container = Container;
})();
