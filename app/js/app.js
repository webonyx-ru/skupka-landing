(function () {

    function YOURAPPNAME(doc) {
        var _self = this;

        _self.doc = doc;
        _self.window = window;

        _self.bootstrap();
    }

    YOURAPPNAME.prototype.bootstrap = function () {
        var _self = this;

        _self.maskInit(".js-input-mask");

        _self.modal();
    };

    // Window load types (loading, dom, full)
    YOURAPPNAME.prototype.appLoad = function (type, callback) {
        var _self = this;

        switch (type) {
            case 'loading':
                if (_self.doc.readyState === 'loading') callback();

                break;
            case 'dom':
                _self.doc.onreadystatechange = function () {
                    if (_self.doc.readyState === 'complete') callback();
                };

                break;
            case 'full':
                _self.window.onload = function (e) {
                    callback(e);
                };

                break;
            default:
                callback();
        }
    };

    YOURAPPNAME.prototype.initSwitcher = function () {
        var _self = this;

        var switchers = _self.doc.querySelectorAll('[data-switcher]');

        if (switchers && switchers.length > 0) {
            for (var i = 0; i < switchers.length; i++) {
                var switcher = switchers[i],
                    switcherOptions = _self.options(switcher.dataset.switcher),
                    switcherElems = switcher.children,
                    switcherTargets = _self.doc.querySelector('[data-switcher-target="' + switcherOptions.target + '"]').children;

                for (var y = 0; y < switcherElems.length; y++) {
                    var switcherElem = switcherElems[y],
                        parentNode = switcher.children,
                        switcherTarget = switcherTargets[y];

                    if (switcherElem.classList.contains('active')) {
                        for (var z = 0; z < parentNode.length; z++) {
                            parentNode[z].classList.remove('active');
                            switcherTargets[z].classList.remove('active');
                        }
                        switcherElem.classList.add('active');
                        switcherTarget.classList.add('active');
                    }

                    switcherElem.children[0].addEventListener('click', function (elem, target, parent, targets) {
                        return function (e) {
                            e.preventDefault();
                            if (!elem.classList.contains('active')) {
                                for (var z = 0; z < parentNode.length; z++) {
                                    parent[z].classList.remove('active');
                                    targets[z].classList.remove('active');
                                }
                                elem.classList.add('active');
                                target.classList.add('active');
                            }
                        };

                    }(switcherElem, switcherTarget, parentNode, switcherTargets));
                }
            }
        }
    };

    YOURAPPNAME.prototype.str2json = function (str, notevil) {
        try {
            if (notevil) {
                return JSON.parse(str
                    .replace(/([\$\w]+)\s*:/g, function (_, $1) {
                        return '"' + $1 + '":';
                    })
                    .replace(/'([^']+)'/g, function (_, $1) {
                        return '"' + $1 + '"';
                    })
                );
            } else {
                return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
            }
        } catch (e) {
            return false;
        }
    };

    YOURAPPNAME.prototype.options = function (string) {
        var _self = this;

        if (typeof string != 'string') return string;

        if (string.indexOf(':') != -1 && string.trim().substr(-1) != '}') {
            string = '{' + string + '}';
        }

        var start = (string ? string.indexOf("{") : -1), options = {};

        if (start != -1) {
            try {
                options = _self.str2json(string.substr(start));
            } catch (e) {
            }
        }

        return options;
    };

    YOURAPPNAME.prototype.popups = function (options) {
        var _self = this;

        var defaults = {
            reachElementClass: '.js-popup',
            closePopupClass: '.js-close-popup',
            currentElementClass: '.js-open-popup',
            changePopupClass: '.js-change-popup'
        };

        options = $.extend({}, options, defaults);

        var plugin = {
            reachPopups: $(options.reachElementClass),
            bodyEl: $('body'),
            topPanelEl: $('.top-panel-wrapper'),
            htmlEl: $('html'),
            closePopupEl: $(options.closePopupClass),
            openPopupEl: $(options.currentElementClass),
            changePopupEl: $(options.changePopupClass),
            bodyPos: 0
        };

        plugin.openPopup = function (popupName) {
            plugin.reachPopups.filter('[data-popup="' + popupName + '"]').addClass('opened');
            plugin.bodyEl.css('overflow-y', 'scroll');
            plugin.topPanelEl.css('padding-right', scrollSettings.width);
            plugin.htmlEl.addClass('popup-opened');
        };

        plugin.closePopup = function (popupName) {
            plugin.reachPopups.filter('[data-popup="' + popupName + '"]').removeClass('opened');
            setTimeout(function () {
                plugin.bodyEl.removeAttr('style');
                plugin.htmlEl.removeClass('popup-opened');
                plugin.topPanelEl.removeAttr('style');
            }, 500);
        };

        plugin.changePopup = function (closingPopup, openingPopup) {
            plugin.reachPopups.filter('[data-popup="' + closingPopup + '"]').removeClass('opened');
            plugin.reachPopups.filter('[data-popup="' + openingPopup + '"]').addClass('opened');
        };

        plugin.init = function () {
            plugin.bindings();
        };

        plugin.bindings = function () {
            plugin.openPopupEl.on('click', function (e) {
                e.preventDefault();
                var pop = $(this).attr('data-open-popup');
                plugin.openPopup(pop);
            });

            plugin.closePopupEl.on('click', function (e) {
                var pop;
                if (this.hasAttribute('data-close-popup')) {
                    pop = $(this).attr('data-close-popup');
                } else {
                    pop = $(this).closest(options.reachElementClass).attr('data-popup');
                }

                plugin.closePopup(pop);
            });

            plugin.changePopupEl.on('click', function (e) {
                var closingPop = $(this).attr('data-closing-popup');
                var openingPop = $(this).attr('data-opening-popup');

                plugin.changePopup(closingPop, openingPop);
            });

            plugin.reachPopups.on('click', function (e) {
                var target = $(e.target);
                var className = options.reachElementClass.replace('.', '');
                if (target.hasClass(className)) {
                    plugin.closePopup($(e.target).attr('data-popup'));
                }
            });
        };

        if (options)
            plugin.init();

        return plugin;
    };

    YOURAPPNAME.prototype.maskInit = function (className) {
        $(className).mask("+7 (999) 999-99-99");
    };

    YOURAPPNAME.prototype.modal = function () {
        var _self = this;

        var modal = {};

        modal.init = function () {
            var popupOverlays = _self.doc.querySelectorAll('.popup-overlay');

            for (var i = 0; i < popupOverlays.length; i++) {
                popupOverlays[i].addEventListener('click', function (e) {
                    if(e.target.classList.contains('popup-overlay')) {
                        modal.closeModal();
                    }
                });
            }

            var closeButtons = _self.doc.querySelectorAll('.js-close-popup');

            for (var i = 0; i < closeButtons.length; i++) {
                closeButtons[i].addEventListener('click', function (e) {
                    var popupName = this.closest('.popup').getAttribute('data-popup');

                    modal.closeModal(popupName);
                });
            }

            var openPopupsBtns = _self.doc.querySelectorAll('.js-open-popup');

            for (var i = 0; i < openPopupsBtns.length; i++) {
                openPopupsBtns[i].addEventListener('click', function (e) {
                    var popupName = this.getAttribute('data-popup-name');

                    modal.openModal(popupName);
                });
            }
        };

        modal.openModal = function (popupName) {
            _self.doc.querySelector('.popup-overlay').classList.add('opened');
            var popup = _self.doc.querySelector('[data-popup="'+popupName+'"]');

            popup.classList.add('opened');
        };

        modal.closeModal = function (popupName) {
            _self.doc.querySelector('.popup-overlay').classList.remove('opened');
            if(popupName) {
                var popup = _self.doc.querySelector('[data-popup="'+popupName+'"]');
                popup.classList.remove('opened');
            } else {
                var popups = _self.doc.querySelectorAll('[data-popup]');

                for(var i = 0; i < popups.length; i++) {
                    popups[i].classList.remove('opened');
                }
            }
        };

        modal.init();

        return modal;
    };

    var app = new YOURAPPNAME(document);

    app.appLoad('loading', function () {
        // console.log('App is loading... Paste your app code here.');
        // App is loading... Paste your app code here. 4example u can run preloader event here and stop it in action appLoad dom or full
    });

    app.appLoad('dom', function () {
        // console.log('DOM is loaded! Paste your app code here (Pure JS code).');
        // DOM is loaded! Paste your app code here (Pure JS code).
        // Do not use jQuery here cause external libs do not loads here...

        app.initSwitcher(); // data-switcher="{target='anything'}" , data-switcher-target="anything"
    });

    app.appLoad('full', function (e) {
        $('form').submit(function (e) {
            var that = $(this),
                form = e.target,
                serialized = serializeForm(form),
                url = './mail.php',
                modal = app.modal();

            if (serialized.phone !== '') {
                $.post(url, serialized, function(response) {
                    console.log(response);
                    if(response === 1) {
                        if(response) {
                            that.find("input[name='phone']").removeClass("error");
                            modal.closeModal();
                            modal.openModal('successfully');
                        }
                    }
                });
            } else {
                that.find("input[name='phone']").addClass("error");
            }

            return false;
        });

        function serializeForm($form) {
            var returnObject = {},

                tempMeta = {}, hasMeta = false;

            for(var i=0; i<$form.length; i++) {

                if($form[i].type !== 'submit' && $form[i].name !== 'thumbnail' && $form[i].name !== '') {
                    var tempName = $form[i].name.toString(),
                        tempVal = $form[i].value;

                    if(tempName.indexOf('meta') !== -1) {
                        var meta = tempName.split('.');

                        hasMeta = true;
                        tempMeta[meta[1]] = tempVal;
                    } else returnObject[tempName] = tempVal;

                    if($form[i].type === 'checkbox') {
                        if($form[i].checked === true) returnObject[tempName] = 1;
                        else returnObject[tempName] = 0;
                    }
                }
            }

            if(hasMeta) returnObject['meta'] = tempMeta;

            return returnObject;
        };



    });

})();
