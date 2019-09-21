/*!
 * angular-datatables - v0.5.3
 * https://github.com/l-lin/angular-datatables
 * License: MIT
 */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
   module.exports = 'datatables';
}
(function (window, document, $, angular) {

'use strict';

angular.module('datatables.directive', ['datatables.instances', 'datatables.renderer', 'datatables.options', 'datatables.util'])
    .directive('datatable', dataTable);
function dataTable($q, $http, DTRendererFactory, DTRendererService, DTPropertyUtil) {
    compileDirective.$inject = ['tElm'];
    ControllerDirective.$inject = ['$scope'];
    return {
        restrict: 'A',
        scope: {
            dtOptions: '=',
            dtColumns: '=',
            dtColumnDefs: '=',
            datatable: '@',
            dtInstance: '='
        },
        compile: compileDirective,
        controller: ControllerDirective
    };
    function compileDirective(tElm) {
        var _staticHTML = tElm[0].innerHTML;

        return function postLink($scope, $elem, iAttrs, ctrl) {
            function handleChanges(newVal, oldVal) {
                if (newVal !== oldVal) {
                    ctrl.render($elem, ctrl.buildOptionsPromise(), _staticHTML);
                }
            }
            var watchFunction = iAttrs.dtDisableDeepWatchers ? '$watchCollection' : '$watch';
            angular.forEach(['dtColumns', 'dtColumnDefs', 'dtOptions'], function(tableDefField) {
                $scope[watchFunction].call($scope, tableDefField, handleChanges, true);
            });
            DTRendererService.showLoading($elem, $scope);
            ctrl.render($elem, ctrl.buildOptionsPromise(), _staticHTML);
        };
    }
    function ControllerDirective($scope) {
        var _dtInstance;
        var vm = this;
        vm.buildOptionsPromise = buildOptionsPromise;
        vm.render = render;

        function buildOptionsPromise() {
            var defer = $q.defer();
            $q.all([
                $q.when($scope.dtOptions),
                $q.when($scope.dtColumns),
                $q.when($scope.dtColumnDefs)
            ]).then(function(results) {
                var dtOptions = results[0],
                    dtColumns = results[1],
                    dtColumnDefs = results[2];
                DTPropertyUtil.deleteProperty(dtOptions, '$promise');
                DTPropertyUtil.deleteProperty(dtColumns, '$promise');
                DTPropertyUtil.deleteProperty(dtColumnDefs, '$promise');
                var options;
                if (angular.isDefined(dtOptions)) {
                    options = {};
                    angular.extend(options, dtOptions);
                    if (angular.isArray(dtColumns)) {
                        options.aoColumns = dtColumns;
                    }
                    if (angular.isArray(dtColumnDefs)) {
                        options.aoColumnDefs = dtColumnDefs;
                    }
                    if (options.language && options.language.url) {
                        var languageDefer = $q.defer();
                        $http.get(options.language.url).success(function(language) {
                            languageDefer.resolve(language);
                        });
                        options.language = languageDefer.promise;
                    }

                }
                return DTPropertyUtil.resolveObjectPromises(options, ['data', 'aaData', 'fnPromise']);
            }).then(function(options) {
                defer.resolve(options);
            });
            return defer.promise;
        }

        function render($elem, optionsPromise, staticHTML) {
            optionsPromise.then(function(options) {
                DTRendererService.preRender(options);

                var isNgDisplay = $scope.datatable && $scope.datatable === 'ng';
                if (_dtInstance && _dtInstance._renderer) {
                    _dtInstance._renderer.withOptions(options)
                        .render($elem, $scope, staticHTML).then(function(dtInstance) {
                            _dtInstance = dtInstance;
                            _setDTInstance(dtInstance);
                        });
                } else {
                    DTRendererFactory.fromOptions(options, isNgDisplay)
                        .render($elem, $scope, staticHTML).then(function(dtInstance) {
                            _dtInstance = dtInstance;
                            _setDTInstance(dtInstance);
                        });
                }
            });
        }

        function _setDTInstance(dtInstance) {
            if (angular.isFunction($scope.dtInstance)) {
                $scope.dtInstance(dtInstance);
            } else if (angular.isDefined($scope.dtInstance)) {
                $scope.dtInstance = dtInstance;
            }
        }
    }
}
dataTable.$inject = ['$q', '$http', 'DTRendererFactory', 'DTRendererService', 'DTPropertyUtil'];

'use strict';
angular.module('datatables.factory', [])
    .factory('DTOptionsBuilder', dtOptionsBuilder)
    .factory('DTColumnBuilder', dtColumnBuilder)
    .factory('DTColumnDefBuilder', dtColumnDefBuilder)
    .factory('DTLoadingTemplate', dtLoadingTemplate);
function dtOptionsBuilder() {
    var DTOptions = {
        hasOverrideDom: false,
        withOption: function(key, value) {
            if (angular.isString(key)) {
                this[key] = value;
            }
            return this;
        },
        withSource: function(ajax) {
            this.ajax = ajax;
            return this;
        },
        withDataProp: function(sAjaxDataProp) {
            this.sAjaxDataProp = sAjaxDataProp;
            return this;
        },
        withFnServerData: function(fn) {
            if (!angular.isFunction(fn)) {
                throw new Error('The parameter must be a function');
            }
            this.fnServerData = fn;
            return this;
        },
        withPaginationType: function(sPaginationType) {
            if (angular.isString(sPaginationType)) {
                this.sPaginationType = sPaginationType;
            } else {
                throw new Error('The pagination type must be provided');
            }
            return this;
        },
        withLanguage: function(language) {
            this.language = language;
            return this;
        },
        withLanguageSource: function(languageSource) {
            return this.withLanguage({
                url: languageSource
            });
        },
        withDisplayLength: function(iDisplayLength) {
            this.iDisplayLength = iDisplayLength;
            return this;
        },
        withFnPromise: function(fnPromise) {
            this.fnPromise = fnPromise;
            return this;
        },
        withDOM: function(dom) {
            this.dom = dom;
            return this;
        }
    };

    return {
        newOptions: function() {
            return Object.create(DTOptions);
        },
        fromSource: function(ajax) {
            var options = Object.create(DTOptions);
            options.ajax = ajax;
            return options;
        },
        fromFnPromise: function(fnPromise) {
            var options = Object.create(DTOptions);
            options.fnPromise = fnPromise;
            return options;
        }
    };
}

function dtColumnBuilder() {
    var DTColumn = {
        withOption: function(key, value) {
            if (angular.isString(key)) {
                this[key] = value;
            }
            return this;
        },
        withTitle: function(sTitle) {
            this.sTitle = sTitle;
            return this;
        },
        withClass: function(sClass) {
            this.sClass = sClass;
            return this;
        },
        notVisible: function() {
            this.bVisible = false;
            return this;
        },
        notSortable: function() {
            this.bSortable = false;
            return this;
        },
        renderWith: function(mRender) {
            this.mRender = mRender;
            return this;
        }
    };

    return {
        newColumn: function(mData, sTitle) {
            if (angular.isUndefined(mData)) {
                throw new Error('The parameter "mData" is not defined!');
            }
            var column = Object.create(DTColumn);
            column.mData = mData;
            if (angular.isDefined(sTitle)) {
                column.sTitle = sTitle;
            }
            return column;
        },
        DTColumn: DTColumn
    };
}
function dtColumnDefBuilder(DTColumnBuilder) {
    return {
        newColumnDef: function(targets) {
            if (angular.isUndefined(targets)) {
                throw new Error('The parameter "targets" must be defined! See https://datatables.net/reference/option/columnDefs.targets');
            }
            var column = Object.create(DTColumnBuilder.DTColumn);
            if (angular.isArray(targets)) {
                column.aTargets = targets;
            } else {
                column.aTargets = [targets];
            }
            return column;
        }
    };
}
dtColumnDefBuilder.$inject = ['DTColumnBuilder'];

function dtLoadingTemplate($compile, DTDefaultOptions, DT_LOADING_CLASS) {
    return {
        compileHtml: function($scope) {
            return $compile(angular.element('<div class="' + DT_LOADING_CLASS + '">' + DTDefaultOptions.loadingTemplate + '</div>'))($scope);
        },
        isLoading: function(elem) {
            return elem.hasClass(DT_LOADING_CLASS);
        }
    };
}
dtLoadingTemplate.$inject = ['$compile', 'DTDefaultOptions', 'DT_LOADING_CLASS'];

'use strict';

angular.module('datatables.instances', ['datatables.util'])
    .factory('DTInstanceFactory', dtInstanceFactory);

function dtInstanceFactory() {
    var DTInstance = {
        reloadData: reloadData,
        changeData: changeData,
        rerender: rerender
    };
    return {
        newDTInstance: newDTInstance,
        copyDTProperties: copyDTProperties
    };

    function newDTInstance(renderer) {
        var dtInstance = Object.create(DTInstance);
        dtInstance._renderer = renderer;
        return dtInstance;
    }

    function copyDTProperties(result, dtInstance) {
        dtInstance.id = result.id;
        dtInstance.DataTable = result.DataTable;
        dtInstance.dataTable = result.dataTable;
    }

    function reloadData(callback, resetPaging) {
        this._renderer.reloadData(callback, resetPaging);
    }

    function changeData(data) {
        this._renderer.changeData(data);
    }

    function rerender() {
        this._renderer.rerender();
    }
}

'use strict';

angular.module('datatables', ['datatables.directive', 'datatables.factory'])
    .run(initAngularDataTables);
function initAngularDataTables() {
    if ($.fn.DataTable.Api) {
        $.fn.DataTable.Api.register('ngDestroy()', function(remove) {
            remove = remove || false;

            return this.iterator('table', function(settings) {
                var orig = settings.nTableWrapper.parentNode;
                var classes = settings.oClasses;
                var table = settings.nTable;
                var tbody = settings.nTBody;
                var thead = settings.nTHead;
                var tfoot = settings.nTFoot;
                var jqTable = $(table);
                var jqTbody = $(tbody);
                var jqWrapper = $(settings.nTableWrapper);
                var rows = $.map(settings.aoData, function(r) {
                    return r.nTr;
                });
                var ien;
                settings.bDestroying = true;
                $.fn.DataTable.ext.internal._fnCallbackFire(settings, 'aoDestroyCallback', 'destroy', [settings]);
                if (!remove) {
                    new $.fn.DataTable.Api(settings).columns().visible(true);
                }
                jqWrapper.unbind('.DT').find(':not(tbody *)').unbind('.DT');
                $(window).unbind('.DT-' + settings.sInstance);
                if (table !== thead.parentNode) {
                    jqTable.children('thead').detach();
                    jqTable.append(thead);
                }

                if (tfoot && table !== tfoot.parentNode) {
                    jqTable.children('tfoot').detach();
                    jqTable.append(tfoot);
                }
                jqTable.detach();
                jqWrapper.detach();

                settings.aaSorting = [];
                settings.aaSortingFixed = [];
                $.fn.DataTable.ext.internal._fnSortingClasses(settings);

                $(rows).removeClass(settings.asStripeClasses.join(' '));

                $('th, td', thead).removeClass(classes.sSortable + ' ' +
                    classes.sSortableAsc + ' ' + classes.sSortableDesc + ' ' + classes.sSortableNone
                );

                if (settings.bJUI) {
                    $('th span.' + classes.sSortIcon + ', td span.' + classes.sSortIcon, thead).detach();
                    $('th, td', thead).each(function() {
                        var wrapper = $('div.' + classes.sSortJUIWrapper, this);
                        $(this).append(wrapper.contents());
                        wrapper.detach();
                    });
                }
                if (!remove && orig) {
                    if (orig.contains(settings.nTableReinsertBefore)) {
                        orig.insertBefore(table, settings.nTableReinsertBefore);
                    } else {
                        orig.appendChild(table);
                    }
                }
                jqTable
                    .css('width', settings.sDestroyWidth)
                    .removeClass(classes.sTable);
                ien = settings.asDestroyStripes.length;

                if (ien) {
                    jqTbody.children().each(function(i) {
                        $(this).addClass(settings.asDestroyStripes[i % ien]);
                    });
                }
                var idx = $.inArray(settings, $.fn.DataTable.settings);
                if (idx !== -1) {
                    $.fn.DataTable.settings.splice(idx, 1);
                }
            });
        });
    }
}

'use strict';
angular.module('datatables.options', [])
    .constant('DT_DEFAULT_OPTIONS', {
        dom: 'lfrtip',
        sAjaxDataProp: '',
        aoColumns: []
    })
    .constant('DT_LOADING_CLASS', 'dt-loading')
    .service('DTDefaultOptions', dtDefaultOptions);

function dtDefaultOptions() {
    var options = {
        loadingTemplate: '<h3>Loading...</h3>',
        bootstrapOptions: {},
        setLoadingTemplate: setLoadingTemplate,
        setLanguageSource: setLanguageSource,
        setLanguage: setLanguage,
        setDisplayLength: setDisplayLength,
        setBootstrapOptions: setBootstrapOptions
    };

    return options;
    function setLoadingTemplate(loadingTemplate) {
        options.loadingTemplate = loadingTemplate;
        return options;
    }
    function setLanguageSource(sLanguageSource) {
        $.ajax({
            dataType: 'json',
            url: sLanguageSource,
            success: function(json) {
                $.extend(true, $.fn.dataTable.defaults, {
                    oLanguage: json
                });
            }
        });
        return options;
    }
    function setLanguage(oLanguage) {
        $.extend(true, $.fn.dataTable.defaults, {
            oLanguage: oLanguage
        });
        return options;
    }
    function setDisplayLength(iDisplayLength) {
        $.extend($.fn.dataTable.defaults, {
            iDisplayLength: iDisplayLength
        });
        return options;
    }
    function setBootstrapOptions(oBootstrapOptions) {
        options.bootstrapOptions = oBootstrapOptions;
        return options;
    }
}

'use strict';
angular.module('datatables.renderer', ['datatables.instances', 'datatables.factory', 'datatables.options', 'datatables.instances'])
    .factory('DTRendererService', dtRendererService)
    .factory('DTRenderer', dtRenderer)
    .factory('DTDefaultRenderer', dtDefaultRenderer)
    .factory('DTNGRenderer', dtNGRenderer)
    .factory('DTPromiseRenderer', dtPromiseRenderer)
    .factory('DTAjaxRenderer', dtAjaxRenderer)
    .factory('DTRendererFactory', dtRendererFactory);
function dtRendererService(DTLoadingTemplate) {
    var plugins = [];
    var rendererService = {
        showLoading: showLoading,
        hideLoading: hideLoading,
        renderDataTable: renderDataTable,
        hideLoadingAndRenderDataTable: hideLoadingAndRenderDataTable,
        registerPlugin: registerPlugin,
        postRender: postRender,
        preRender: preRender
    };
    return rendererService;

    function showLoading($elem, $scope) {
        var $loading = angular.element(DTLoadingTemplate.compileHtml($scope));
        $elem.after($loading);
        $elem.hide();
        $loading.show();
    }

    function hideLoading($elem) {
        $elem.show();
        var next = $elem.next();
        if (DTLoadingTemplate.isLoading(next)) {
            next.remove();
        }
    }

    function renderDataTable($elem, options) {
        var dtId = '#' + $elem.attr('id');
        if ($.fn.dataTable.isDataTable(dtId) && angular.isObject(options)) {
            options.destroy = true;
        }
        var DT = $elem.DataTable(options);
        var dt = $elem.dataTable();

        var result = {
            id: $elem.attr('id'),
            DataTable: DT,
            dataTable: dt
        };

        postRender(options, result);

        return result;
    }

    function hideLoadingAndRenderDataTable($elem, options) {
        rendererService.hideLoading($elem);
        return rendererService.renderDataTable($elem, options);
    }

    function registerPlugin(plugin) {
        plugins.push(plugin);
    }

    function postRender(options, result) {
        angular.forEach(plugins, function(plugin) {
            if (angular.isFunction(plugin.postRender)) {
                plugin.postRender(options, result);
            }
        });
    }

    function preRender(options) {
        angular.forEach(plugins, function(plugin) {
            if (angular.isFunction(plugin.preRender)) {
                plugin.preRender(options);
            }
        });
    }
}
dtRendererService.$inject = ['DTLoadingTemplate'];

function dtRenderer() {
    return {
        withOptions: function(options) {
            this.options = options;
            return this;
        }
    };
}
function dtDefaultRenderer($q, DTRenderer, DTRendererService, DTInstanceFactory) {
    return {
        create: create
    };

    function create(options) {
        var _oTable;
        var _$elem;
        var _$scope;
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTDefaultRenderer';
        renderer.options = options;
        renderer.render = render;
        renderer.reloadData = reloadData;
        renderer.changeData = changeData;
        renderer.rerender = rerender;

        function render($elem, $scope) {
            _$elem = $elem;
            _$scope = $scope;
            var dtInstance = DTInstanceFactory.newDTInstance(renderer);
            var result = DTRendererService.hideLoadingAndRenderDataTable($elem, renderer.options);
            _oTable = result.DataTable;
            DTInstanceFactory.copyDTProperties(result, dtInstance);
            return $q.when(dtInstance);
        }

        function reloadData() {
        }

        function changeData() {
        }

        function rerender() {
            _oTable.destroy();
            DTRendererService.showLoading(_$elem, _$scope);
            render(_$elem);
        }
        return renderer;
    }
}
dtDefaultRenderer.$inject = ['$q', 'DTRenderer', 'DTRendererService', 'DTInstanceFactory'];
function dtNGRenderer($log, $q, $compile, $timeout, DTRenderer, DTRendererService, DTInstanceFactory) {
    return {
        create: create
    };

    function create(options) {
        var _staticHTML;
        var _oTable;
        var _$elem;
        var _parentScope;
        var _newParentScope;
        var dtInstance;
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTNGRenderer';
        renderer.options = options;
        renderer.render = render;
        renderer.reloadData = reloadData;
        renderer.changeData = changeData;
        renderer.rerender = rerender;
        return renderer;

        function render($elem, $scope, staticHTML) {
            _staticHTML = staticHTML;
            _$elem = $elem;
            _parentScope = $scope.$parent;
            dtInstance = DTInstanceFactory.newDTInstance(renderer);

            var defer = $q.defer();
            var _expression = $elem.find('tbody').html();
            var _match = _expression.match(/^\s*.+?\s+in\s+(\S*)\s*/m);

            if (!_match) {
                throw new Error('Expected expression in form of "_item_ in _collection_[ track by _id_]" but got "{0}".', _expression);
            }
            var _ngRepeatAttr = _match[1];

            var _alreadyRendered = false;

            _parentScope.$watchCollection(_ngRepeatAttr, function() {
                if (_oTable && _alreadyRendered) {
                    _destroyAndCompile();
                }
                $timeout(function() {
                    _alreadyRendered = true;
                    DTRendererService.preRender(renderer.options);
                    var result = DTRendererService.hideLoadingAndRenderDataTable(_$elem, renderer.options);
                    _oTable = result.DataTable;
                    DTInstanceFactory.copyDTProperties(result, dtInstance);
                    defer.resolve(dtInstance);
                }, 0, false);
            }, true);
            return defer.promise;
        }

        function reloadData() {
            $log.warn('The Angular Renderer does not support reloading data. You need to do it directly on your model');
        }

        function changeData() {
            $log.warn('The Angular Renderer does not support changing the data. You need to change your model directly.');
        }

        function rerender() {
            _destroyAndCompile();
            DTRendererService.showLoading(_$elem, _parentScope);
            DTRendererService.preRender(options);
            $timeout(function() {
                var result = DTRendererService.hideLoadingAndRenderDataTable(_$elem, renderer.options);
                _oTable = result.DataTable;
                DTInstanceFactory.copyDTProperties(result, dtInstance);
            }, 0, false);
        }

        function _destroyAndCompile() {
            if (_newParentScope) {
                _newParentScope.$destroy();
            }
            _oTable.ngDestroy();
            _$elem.html(_staticHTML);
            _newParentScope = _parentScope.$new();
            $compile(_$elem.contents())(_newParentScope);
        }
    }
}
dtNGRenderer.$inject = ['$log', '$q', '$compile', '$timeout', 'DTRenderer', 'DTRendererService', 'DTInstanceFactory'];
function dtPromiseRenderer($q, $timeout, $log, DTRenderer, DTRendererService, DTInstanceFactory) {
    return {
        create: create
    };

    function create(options) {
        var _oTable;
        var _loadedPromise = null;
        var _$elem;
        var _$scope;

        var dtInstance;
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTPromiseRenderer';
        renderer.options = options;
        renderer.render = render;
        renderer.reloadData = reloadData;
        renderer.changeData = changeData;
        renderer.rerender = rerender;
        return renderer;

        function render($elem, $scope) {
            var defer = $q.defer();
            dtInstance = DTInstanceFactory.newDTInstance(renderer);
            _$elem = $elem;
            _$scope = $scope;
            _resolve(renderer.options.fnPromise, DTRendererService.renderDataTable).then(function(result) {
                _oTable = result.DataTable;
                DTInstanceFactory.copyDTProperties(result, dtInstance);
                defer.resolve(dtInstance);
            });
            return defer.promise;
        }

        function reloadData(callback, resetPaging) {
            var previousPage = _oTable && _oTable.page() ? _oTable.page() : 0;
            if (angular.isFunction(renderer.options.fnPromise)) {
                _resolve(renderer.options.fnPromise, _redrawRows).then(function(result) {
                    if (angular.isFunction(callback)) {
                        callback(result.DataTable.data());
                    }
                    if (resetPaging === false) {
                        result.DataTable.page(previousPage).draw(false);
                    }
                });
            } else {
                $log.warn('In order to use the reloadData functionality with a Promise renderer, you need to provide a function that returns a promise.');
            }
        }

        function changeData(fnPromise) {
            renderer.options.fnPromise = fnPromise;
            _$scope.dtOptions.fnPromise = fnPromise;
            _resolve(renderer.options.fnPromise, _redrawRows);
        }

        function rerender() {
            _oTable.destroy();
            DTRendererService.showLoading(_$elem, _$scope);
            DTRendererService.preRender(options);
            render(_$elem, _$scope);
        }

        function _resolve(fnPromise, callback) {
            var defer = $q.defer();
            if (angular.isUndefined(fnPromise)) {
                throw new Error('You must provide a promise or a function that returns a promise!');
            }
            if (_loadedPromise) {
                _loadedPromise.then(function()  {
                    defer.resolve(_startLoading(fnPromise, callback));
                });
            } else  {
                defer.resolve(_startLoading(fnPromise, callback));
            }
            return defer.promise;
        }

        function _startLoading(fnPromise, callback) {
            var defer = $q.defer();
            if (angular.isFunction(fnPromise)) {
                _loadedPromise = fnPromise();
            } else {
                _loadedPromise = fnPromise;
            }
            _loadedPromise.then(function(result) {
                var data = result;
                if (renderer.options.sAjaxDataProp) {
                    var properties = renderer.options.sAjaxDataProp.split('.');
                    while (properties.length) {
                        var property = properties.shift();
                        if (property in data) {
                            data = data[property];
                        }
                    }
                }
                _loadedPromise = null;
                defer.resolve(_doRender(renderer.options, _$elem, data, callback));
            });
            return defer.promise;
        }

        function _doRender(options, $elem, data, callback) {
            var defer = $q.defer();
            delete data.$promise;
            options.aaData = data;
            $timeout(function() {
                DTRendererService.hideLoading($elem);
                options.bDestroy = true;
                defer.resolve(callback($elem, options));
            }, 0, false);
            return defer.promise;
        }

        function _redrawRows($elem, options) {
            _oTable.clear();
            _oTable.rows.add(options.aaData).draw(options.redraw);
            return {
                id: dtInstance.id,
                DataTable: dtInstance.DataTable,
                dataTable: dtInstance.dataTable
            };
        }
    }
}
dtPromiseRenderer.$inject = ['$q', '$timeout', '$log', 'DTRenderer', 'DTRendererService', 'DTInstanceFactory'];
function dtAjaxRenderer($q, $timeout, DTRenderer, DTRendererService, DT_DEFAULT_OPTIONS, DTInstanceFactory) {
    return {
        create: create
    };

    function create(options) {
        var _oTable;
        var _$elem;
        var _$scope;
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTAjaxRenderer';
        renderer.options = options;
        renderer.render = render;
        renderer.reloadData = reloadData;
        renderer.changeData = changeData;
        renderer.rerender = rerender;
        return renderer;

        function render($elem, $scope) {
            _$elem = $elem;
            _$scope = $scope;
            var defer = $q.defer();
            var dtInstance = DTInstanceFactory.newDTInstance(renderer);
            if (angular.isUndefined(renderer.options.sAjaxDataProp)) {
                renderer.options.sAjaxDataProp = DT_DEFAULT_OPTIONS.sAjaxDataProp;
            }
            if (angular.isUndefined(renderer.options.aoColumns)) {
                renderer.options.aoColumns = DT_DEFAULT_OPTIONS.aoColumns;
            }
            _doRender(renderer.options, $elem).then(function(result) {
                _oTable = result.DataTable;
                DTInstanceFactory.copyDTProperties(result, dtInstance);
                defer.resolve(dtInstance);
            });
            return defer.promise;
        }

        function reloadData(callback, resetPaging) {
            if (_oTable) {
                _oTable.ajax.reload(callback, resetPaging);
            }
        }

        function changeData(ajax) {
            renderer.options.ajax = ajax;
            _$scope.dtOptions.ajax = ajax;
        }

        function rerender() {
            DTRendererService.preRender(options);
            render(_$elem, _$scope);
        }

        function _doRender(options, $elem) {
                var defer = $q.defer();
                options.bDestroy = true;
                if (_oTable) {
                    _oTable.destroy();
                    DTRendererService.showLoading(_$elem, _$scope);
                    $elem.empty();
                }
                DTRendererService.hideLoading($elem);
                if (_shouldDeferRender(options)) {
                    $timeout(function() {
                        defer.resolve(DTRendererService.renderDataTable($elem, options));
                    }, 0, false);
                } else {
                    defer.resolve(DTRendererService.renderDataTable($elem, options));
                }
                return defer.promise;
            }
        function _shouldDeferRender(options) {
            if (angular.isDefined(options) && angular.isDefined(options.dom)) {
                return options.dom.indexOf('S') >= 0;
            }
            return false;
        }
    }
}
dtAjaxRenderer.$inject = ['$q', '$timeout', 'DTRenderer', 'DTRendererService', 'DT_DEFAULT_OPTIONS', 'DTInstanceFactory'];
function dtRendererFactory(DTDefaultRenderer, DTNGRenderer, DTPromiseRenderer, DTAjaxRenderer) {
    return {
        fromOptions: fromOptions
    };

    function fromOptions(options, isNgDisplay)  {
        if (isNgDisplay) {
            if (options && options.serverSide) {
                throw new Error('You cannot use server side processing along with the Angular renderer!');
            }
            return DTNGRenderer.create(options);
        }
        if (angular.isDefined(options)) {
            if (angular.isDefined(options.fnPromise) && options.fnPromise !== null) {
                if (options.serverSide) {
                    throw new Error('You cannot use server side processing along with the Promise renderer!');
                }
                return DTPromiseRenderer.create(options);
            }
            if (angular.isDefined(options.ajax) && options.ajax !== null ||
                angular.isDefined(options.ajax) && options.ajax !== null) {
                return DTAjaxRenderer.create(options);
            }
            return DTDefaultRenderer.create(options);
        }
        return DTDefaultRenderer.create();
    }
}
dtRendererFactory.$inject = ['DTDefaultRenderer', 'DTNGRenderer', 'DTPromiseRenderer', 'DTAjaxRenderer'];

'use strict';

angular.module('datatables.util', [])
    .factory('DTPropertyUtil', dtPropertyUtil);
function dtPropertyUtil($q) {
    return {
        overrideProperties: overrideProperties,
        deleteProperty: deleteProperty,
        resolveObjectPromises: resolveObjectPromises,
        resolveArrayPromises: resolveArrayPromises
    };
    function overrideProperties(source, target) {
        var result = angular.copy(source);

        if (angular.isUndefined(result) || result === null) {
            result = {};
        }
        if (angular.isUndefined(target) || target === null) {
            return result;
        }
        if (angular.isObject(target)) {
            for (var prop in target) {
                if (target.hasOwnProperty(prop)) {
                    result[prop] = overrideProperties(result[prop], target[prop]);
                }
            }
        } else {
            result = angular.copy(target);
        }
        return result;
    }
    function deleteProperty(obj, propertyName) {
        if (angular.isObject(obj)) {
            delete obj[propertyName];
        }
    }
    function resolveObjectPromises(obj, excludedPropertiesName) {
        var defer = $q.defer(),
            promises = [],
            resolvedObj = {},
            excludedProp = excludedPropertiesName || [];
        if (!angular.isObject(obj) || angular.isArray(obj)) {
            defer.resolve(obj);
        } else {
            resolvedObj = angular.extend(resolvedObj, obj);
            for (var prop in resolvedObj) {
                if (resolvedObj.hasOwnProperty(prop) && $.inArray(prop, excludedProp) === -1) {
                    if (angular.isArray(resolvedObj[prop])) {
                        promises.push(resolveArrayPromises(resolvedObj[prop]));
                    } else {
                        promises.push($q.when(resolvedObj[prop]));
                    }
                }
            }
            $q.all(promises).then(function(result) {
                var index = 0;
                for (var prop in resolvedObj) {
                    if (resolvedObj.hasOwnProperty(prop) && $.inArray(prop, excludedProp) === -1) {
                        resolvedObj[prop] = result[index++];
                    }
                }
                defer.resolve(resolvedObj);
            });
        }
        return defer.promise;
    }
    function resolveArrayPromises(array) {
        var defer = $q.defer(),
            promises = [],
            resolveArray = [];
        if (!angular.isArray(array)) {
            defer.resolve(array);
        } else {
            angular.forEach(array, function(item) {
                if (angular.isObject(item)) {
                    promises.push(resolveObjectPromises(item));
                } else {
                    promises.push($q.when(item));
                }
            });
            $q.all(promises).then(function(result) {
                angular.forEach(result, function(item) {
                    resolveArray.push(item);
                });
                defer.resolve(resolveArray);
            });
        }
        return defer.promise;
    }
}
dtPropertyUtil.$inject = ['$q'];


})(window, document, jQuery, angular);