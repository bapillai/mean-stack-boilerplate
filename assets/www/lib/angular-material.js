/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.1
 */
(function( window, angular, undefined ){
"use strict";

(function(){
"use strict";

angular.module('ngMaterial', ["ng","ngAnimate","ngAria","material.core","material.core.gestures","material.core.layout","material.core.meta","material.core.theming.palette","material.core.theming","material.core.animate","material.components.autocomplete","material.components.backdrop","material.components.bottomSheet","material.components.button","material.components.card","material.components.chips","material.components.checkbox","material.components.colors","material.components.content","material.components.datepicker","material.components.dialog","material.components.divider","material.components.fabActions","material.components.fabShared","material.components.fabSpeedDial","material.components.fabToolbar","material.components.gridList","material.components.icon","material.components.input","material.components.list","material.components.menu","material.components.menuBar","material.components.navBar","material.components.panel","material.components.progressCircular","material.components.progressLinear","material.components.radioButton","material.components.select","material.components.showHide","material.components.sidenav","material.components.slider","material.components.sticky","material.components.subheader","material.components.swipe","material.components.switch","material.components.tabs","material.components.toast","material.components.toolbar","material.components.tooltip","material.components.virtualRepeat","material.components.whiteframe"]);
})();
(function(){
"use strict";
DetectNgTouch.$inject = ["$log", "$injector"];
MdCoreConfigure.$inject = ["$provide", "$mdThemingProvider"];
rAFDecorator.$inject = ["$delegate"];
angular
  .module('material.core', [
    'ngAnimate',
    'material.core.animate',
    'material.core.layout',
    'material.core.gestures',
    'material.core.theming'
  ])
  .config(MdCoreConfigure)
  .run(DetectNgTouch);
function DetectNgTouch($log, $injector) {
  if ( $injector.has('$swipe') ) {
    var msg = "" +
      "You are using the ngTouch module. \n" +
      "Angular Material already has mobile click, tap, and swipe support... \n" +
      "ngTouch is not supported with Angular Material!";
    $log.warn(msg);
  }
}
function MdCoreConfigure($provide, $mdThemingProvider) {

  $provide.decorator('$$rAF', ["$delegate", rAFDecorator]);

  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('pink')
    .warnPalette('deep-orange')
    .backgroundPalette('grey');
}
function rAFDecorator($delegate) {
  $delegate.throttle = function(cb) {
    var queuedArgs, alreadyQueued, queueCb, context;
    return function debounced() {
      queuedArgs = arguments;
      context = this;
      queueCb = cb;
      if (!alreadyQueued) {
        alreadyQueued = true;
        $delegate(function() {
          queueCb.apply(context, Array.prototype.slice.call(queuedArgs));
          alreadyQueued = false;
        });
      }
    };
  };
  return $delegate;
}

})();
(function(){
"use strict";

angular.module('material.core')
  .directive('mdAutofocus', MdAutofocusDirective)
  .directive('mdAutoFocus', MdAutofocusDirective)
  .directive('mdSidenavFocus', MdAutofocusDirective);
function MdAutofocusDirective() {
  return {
    restrict: 'A',

    link: postLink
  }
}

function postLink(scope, element, attrs) {
  var attr = attrs.mdAutoFocus || attrs.mdAutofocus || attrs.mdSidenavFocus;
  scope.$watch(attr, function(canAutofocus) {
    element.toggleClass('md-autofocus', canAutofocus);
  });
}

})();
(function(){
"use strict";
angular
  .module('material.core')
  .factory('$mdColorUtil', ColorUtilFactory);

function ColorUtilFactory() {
  function hexToRgba (color) {
    var hex   = color[ 0 ] === '#' ? color.substr(1) : color,
      dig   = hex.length / 3,
      red   = hex.substr(0, dig),
      green = hex.substr(dig, dig),
      blue  = hex.substr(dig * 2);
    if (dig === 1) {
      red += red;
      green += green;
      blue += blue;
    }
    return 'rgba(' + parseInt(red, 16) + ',' + parseInt(green, 16) + ',' + parseInt(blue, 16) + ',0.1)';
  }
  function rgbaToHex(color) {
    color = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

    var hex = (color && color.length === 4) ? "#" +
    ("0" + parseInt(color[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(color[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(color[3],10).toString(16)).slice(-2) : '';

    return hex.toUpperCase();
  }
  function rgbToRgba (color) {
    return color.replace(')', ', 0.1)').replace('(', 'a(');
  }
  function rgbaToRgb (color) {
    return color
      ? color.replace('rgba', 'rgb').replace(/,[^\),]+\)/, ')')
      : 'rgb(0,0,0)';
  }

  return {
    rgbaToHex: rgbaToHex,
    hexToRgba: hexToRgba,
    rgbToRgba: rgbToRgba,
    rgbaToRgb: rgbaToRgb
  }
}
})();
(function(){
"use strict";


MdConstantFactory.$inject = ["$sniffer", "$window", "$document"];angular.module('material.core')
.factory('$mdConstant', MdConstantFactory);
function MdConstantFactory($sniffer, $window, $document) {

  var vendorPrefix = $sniffer.vendorPrefix;
  var isWebkit = /webkit/i.test(vendorPrefix);
  var SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g;
  var prefixTestEl = document.createElement('div');

  function vendorProperty(name) {
    var prefixedName = vendorPrefix + '-' + name;
    var ucPrefix = camelCase(prefixedName);
    var lcPrefix = ucPrefix.charAt(0).toLowerCase() + ucPrefix.substring(1);

    return hasStyleProperty(name)     ? name     :       // The current browser supports the un-prefixed property
           hasStyleProperty(ucPrefix) ? ucPrefix :       // The current browser only supports the prefixed property.
           hasStyleProperty(lcPrefix) ? lcPrefix : name; // Some browsers are only supporting the prefix in lowercase.
  }

  function hasStyleProperty(property) {
    return angular.isDefined(prefixTestEl.style[property]);
  }

  function camelCase(input) {
    return input.replace(SPECIAL_CHARS_REGEXP, function(matches, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    });
  }

  var self = {
    isInputKey : function(e) { return (e.keyCode >= 31 && e.keyCode <= 90); },
    isNumPadKey : function (e){ return (3 === e.location && e.keyCode >= 97 && e.keyCode <= 105); },
    isNavigationKey : function(e) {
      var kc = self.KEY_CODE, NAVIGATION_KEYS =  [kc.SPACE, kc.ENTER, kc.UP_ARROW, kc.DOWN_ARROW];
      return (NAVIGATION_KEYS.indexOf(e.keyCode) != -1);    
    },

    KEY_CODE: {
      COMMA: 188,
      SEMICOLON : 186,
      ENTER: 13,
      ESCAPE: 27,
      SPACE: 32,
      PAGE_UP: 33,
      PAGE_DOWN: 34,
      END: 35,
      HOME: 36,
      LEFT_ARROW : 37,
      UP_ARROW : 38,
      RIGHT_ARROW : 39,
      DOWN_ARROW : 40,
      TAB : 9,
      BACKSPACE: 8,
      DELETE: 46
    },
    CSS: {
      TRANSITIONEND: 'transitionend' + (isWebkit ? ' webkitTransitionEnd' : ''),
      ANIMATIONEND: 'animationend' + (isWebkit ? ' webkitAnimationEnd' : ''),

      TRANSFORM: vendorProperty('transform'),
      TRANSFORM_ORIGIN: vendorProperty('transformOrigin'),
      TRANSITION: vendorProperty('transition'),
      TRANSITION_DURATION: vendorProperty('transitionDuration'),
      ANIMATION_PLAY_STATE: vendorProperty('animationPlayState'),
      ANIMATION_DURATION: vendorProperty('animationDuration'),
      ANIMATION_NAME: vendorProperty('animationName'),
      ANIMATION_TIMING: vendorProperty('animationTimingFunction'),
      ANIMATION_DIRECTION: vendorProperty('animationDirection')
    },
    MEDIA: {
      'xs'        : '(max-width: 599px)'                         ,
      'gt-xs'     : '(min-width: 600px)'                         ,
      'sm'        : '(min-width: 600px) and (max-width: 959px)'  ,
      'gt-sm'     : '(min-width: 960px)'                         ,
      'md'        : '(min-width: 960px) and (max-width: 1279px)' ,
      'gt-md'     : '(min-width: 1280px)'                        ,
      'lg'        : '(min-width: 1280px) and (max-width: 1919px)',
      'gt-lg'     : '(min-width: 1920px)'                        ,
      'xl'        : '(min-width: 1920px)'                        ,
      'landscape' : '(orientation: landscape)'                   ,
      'portrait'  : '(orientation: portrait)'                    ,
      'print' : 'print'
    },
    MEDIA_PRIORITY: [
      'xl',
      'gt-lg',
      'lg',
      'gt-md',
      'md',
      'gt-sm',
      'sm',
      'gt-xs',
      'xs',
      'landscape',
      'portrait',
      'print'
    ]
  };

  return self;
}

})();
(function(){
"use strict";

  angular
    .module('material.core')
    .config( ["$provide", function($provide){
       $provide.decorator('$mdUtil', ['$delegate', function ($delegate){
           $delegate.iterator = MdIterator;

           return $delegate;
         }
       ]);
     }]);
  function MdIterator(items, reloop) {
    var trueFn = function() { return true; };

    if (items && !angular.isArray(items)) {
      items = Array.prototype.slice.call(items);
    }

    reloop = !!reloop;
    var _items = items || [ ];
    return {
      items: getItems,
      count: count,

      inRange: inRange,
      contains: contains,
      indexOf: indexOf,
      itemAt: itemAt,

      findBy: findBy,

      add: add,
      remove: remove,

      first: first,
      last: last,
      next: angular.bind(null, findSubsequentItem, false),
      previous: angular.bind(null, findSubsequentItem, true),

      hasPrevious: hasPrevious,
      hasNext: hasNext

    };
    function getItems() {
      return [].concat(_items);
    }
    function count() {
      return _items.length;
    }
    function inRange(index) {
      return _items.length && ( index > -1 ) && (index < _items.length );
    }
    function hasNext(item) {
      return item ? inRange(indexOf(item) + 1) : false;
    }
    function hasPrevious(item) {
      return item ? inRange(indexOf(item) - 1) : false;
    }
    function itemAt(index) {
      return inRange(index) ? _items[index] : null;
    }
    function findBy(key, val) {
      return _items.filter(function(item) {
        return item[key] === val;
      });
    }
    function add(item, index) {
      if ( !item ) return -1;

      if (!angular.isNumber(index)) {
        index = _items.length;
      }

      _items.splice(index, 0, item);

      return indexOf(item);
    }
    function remove(item) {
      if ( contains(item) ){
        _items.splice(indexOf(item), 1);
      }
    }
    function indexOf(item) {
      return _items.indexOf(item);
    }
    function contains(item) {
      return item && (indexOf(item) > -1);
    }
    function first() {
      return _items.length ? _items[0] : null;
    }
    function last() {
      return _items.length ? _items[_items.length - 1] : null;
    }
    function findSubsequentItem(backwards, item, validate, limit) {
      validate = validate || trueFn;

      var curIndex = indexOf(item);
      while (true) {
        if (!inRange(curIndex)) return null;

        var nextIndex = curIndex + (backwards ? -1 : 1);
        var foundItem = null;
        if (inRange(nextIndex)) {
          foundItem = _items[nextIndex];
        } else if (reloop) {
          foundItem = backwards ? last() : first();
          nextIndex = indexOf(foundItem);
        }

        if ((foundItem === null) || (nextIndex === limit)) return null;
        if (validate(foundItem)) return foundItem;

        if (angular.isUndefined(limit)) limit = nextIndex;

        curIndex = nextIndex;
      }
    }
  }


})();
(function(){
"use strict";


mdMediaFactory.$inject = ["$mdConstant", "$rootScope", "$window"];angular.module('material.core')
.factory('$mdMedia', mdMediaFactory);
function mdMediaFactory($mdConstant, $rootScope, $window) {
  var queries = {};
  var mqls = {};
  var results = {};
  var normalizeCache = {};

  $mdMedia.getResponsiveAttribute = getResponsiveAttribute;
  $mdMedia.getQuery = getQuery;
  $mdMedia.watchResponsiveAttributes = watchResponsiveAttributes;

  return $mdMedia;

  function $mdMedia(query) {
    var validated = queries[query];
    if (angular.isUndefined(validated)) {
      validated = queries[query] = validate(query);
    }

    var result = results[validated];
    if (angular.isUndefined(result)) {
      result = add(validated);
    }

    return result;
  }

  function validate(query) {
    return $mdConstant.MEDIA[query] ||
           ((query.charAt(0) !== '(') ? ('(' + query + ')') : query);
  }

  function add(query) {
    var result = mqls[query];
    if ( !result ) {
      result = mqls[query] = $window.matchMedia(query);
    }

    result.addListener(onQueryChange);
    return (results[result.media] = !!result.matches);
  }

  function onQueryChange(query) {
    $rootScope.$evalAsync(function() {
      results[query.media] = !!query.matches;
    });
  }

  function getQuery(name) {
    return mqls[name];
  }

  function getResponsiveAttribute(attrs, attrName) {
    for (var i = 0; i < $mdConstant.MEDIA_PRIORITY.length; i++) {
      var mediaName = $mdConstant.MEDIA_PRIORITY[i];
      if (!mqls[queries[mediaName]].matches) {
        continue;
      }

      var normalizedName = getNormalizedName(attrs, attrName + '-' + mediaName);
      if (attrs[normalizedName]) {
        return attrs[normalizedName];
      }
    }
    return attrs[getNormalizedName(attrs, attrName)];
  }

  function watchResponsiveAttributes(attrNames, attrs, watchFn) {
    var unwatchFns = [];
    attrNames.forEach(function(attrName) {
      var normalizedName = getNormalizedName(attrs, attrName);
      if (angular.isDefined(attrs[normalizedName])) {
        unwatchFns.push(
            attrs.$observe(normalizedName, angular.bind(void 0, watchFn, null)));
      }

      for (var mediaName in $mdConstant.MEDIA) {
        normalizedName = getNormalizedName(attrs, attrName + '-' + mediaName);
        if (angular.isDefined(attrs[normalizedName])) {
          unwatchFns.push(
              attrs.$observe(normalizedName, angular.bind(void 0, watchFn, mediaName)));
        }
      }
    });

    return function unwatch() {
      unwatchFns.forEach(function(fn) { fn(); })
    };
  }
  function getNormalizedName(attrs, attrName) {
    return normalizeCache[attrName] ||
        (normalizeCache[attrName] = attrs.$normalize(attrName));
  }
}

})();
(function(){
"use strict";

angular
  .module('material.core')
  .config( ["$provide", function($provide) {
    $provide.decorator('$mdUtil', ['$delegate', function ($delegate) {
      $delegate.prefixer = MdPrefixer;

      return $delegate;
    }]);
  }]);

function MdPrefixer(initialAttributes, buildSelector) {
  var PREFIXES = ['data', 'x'];

  if (initialAttributes) {
    return buildSelector ? _buildSelector(initialAttributes) : _buildList(initialAttributes);
  }

  return {
    buildList: _buildList,
    buildSelector: _buildSelector,
    hasAttribute: _hasAttribute,
    removeAttribute: _removeAttribute
  };

  function _buildList(attributes) {
    attributes = angular.isArray(attributes) ? attributes : [attributes];

    attributes.forEach(function(item) {
      PREFIXES.forEach(function(prefix) {
        attributes.push(prefix + '-' + item);
      });
    });

    return attributes;
  }

  function _buildSelector(attributes) {
    attributes = angular.isArray(attributes) ? attributes : [attributes];

    return _buildList(attributes)
      .map(function(item) {
        return '[' + item + ']'
      })
      .join(',');
  }

  function _hasAttribute(element, attribute) {
    element = _getNativeElement(element);

    if (!element) {
      return false;
    }

    var prefixedAttrs = _buildList(attribute);

    for (var i = 0; i < prefixedAttrs.length; i++) {
      if (element.hasAttribute(prefixedAttrs[i])) {
        return true;
      }
    }

    return false;
  }

  function _removeAttribute(element, attribute) {
    element = _getNativeElement(element);

    if (!element) {
      return;
    }

    _buildList(attribute).forEach(function(prefixedAttribute) {
      element.removeAttribute(prefixedAttribute);
    });
  }
  function _getNativeElement(element) {
    element =  element[0] || element;

    if (element.nodeType) {
      return element;
    }
  }

}
})();
(function(){
"use strict";
UtilFactory.$inject = ["$document", "$timeout", "$compile", "$rootScope", "$$mdAnimate", "$interpolate", "$log", "$rootElement", "$window", "$$rAF"];
var nextUniqueId = 0;
angular
  .module('material.core')
  .factory('$mdUtil', UtilFactory);
function UtilFactory($document, $timeout, $compile, $rootScope, $$mdAnimate, $interpolate, $log, $rootElement, $window, $$rAF) {
  var startSymbol = $interpolate.startSymbol(),
    endSymbol = $interpolate.endSymbol(),
    usesStandardSymbols = ((startSymbol === '{{') && (endSymbol === '}}'));
  var hasComputedStyle = function (target, key, expectedVal) {
    var hasValue = false;

    if ( target && target.length  ) {
      var computedStyles = $window.getComputedStyle(target[0]);
      hasValue = angular.isDefined(computedStyles[key]) && (expectedVal ? computedStyles[key] == expectedVal : true);
    }

    return hasValue;
  };

  function validateCssValue(value) {
    return !value       ? '0'   :
      hasPx(value) || hasPercent(value) ? value : value + 'px';
  }

  function hasPx(value) {
    return String(value).indexOf('px') > -1;
  }

  function hasPercent(value) {
    return String(value).indexOf('%') > -1;

  }

  var $mdUtil = {
    dom: {},
    now: window.performance ?
      angular.bind(window.performance, window.performance.now) : Date.now || function() {
      return new Date().getTime();
    },
    bidi : function(element, property, lValue, rValue) {
      var ltr = !($document[0].dir == 'rtl' || $document[0].body.dir == 'rtl');
      if ( arguments.length == 0 ) return ltr ? 'ltr' : 'rtl';
      var elem = angular.element(element);

      if ( ltr && angular.isDefined(lValue)) {
        elem.css(property, validateCssValue(lValue));
      }
      else if ( !ltr && angular.isDefined(rValue)) {
        elem.css(property, validateCssValue(rValue) );
      }
    },

    bidiProperty: function (element, lProperty, rProperty, value) {
      var ltr = !($document[0].dir == 'rtl' || $document[0].body.dir == 'rtl');

      var elem = angular.element(element);

      if ( ltr && angular.isDefined(lProperty)) {
        elem.css(lProperty, validateCssValue(value));
        elem.css(rProperty, '');
      }
      else if ( !ltr && angular.isDefined(rProperty)) {
        elem.css(rProperty, validateCssValue(value) );
        elem.css(lProperty, '');
      }
    },

    clientRect: function(element, offsetParent, isOffsetRect) {
      var node = getNode(element);
      offsetParent = getNode(offsetParent || node.offsetParent || document.body);
      var nodeRect = node.getBoundingClientRect();
      var offsetRect = isOffsetRect ?
        offsetParent.getBoundingClientRect() :
      {left: 0, top: 0, width: 0, height: 0};
      return {
        left: nodeRect.left - offsetRect.left,
        top: nodeRect.top - offsetRect.top,
        width: nodeRect.width,
        height: nodeRect.height
      };
    },
    offsetRect: function(element, offsetParent) {
      return $mdUtil.clientRect(element, offsetParent, true);
    },
    nodesToArray: function(nodes) {
      nodes = nodes || [];

      var results = [];
      for (var i = 0; i < nodes.length; ++i) {
        results.push(nodes.item(i));
      }
      return results;
    },
    scrollTop: function(element) {
      element = angular.element(element || $document[0].body);

      var body = (element[0] == $document[0].body) ? $document[0].body : undefined;
      var scrollTop = body ? body.scrollTop + body.parentElement.scrollTop : 0;
      return scrollTop || Math.abs(element[0].getBoundingClientRect().top);
    },
    findFocusTarget: function(containerEl, attributeVal) {
      var AUTO_FOCUS = this.prefixer('md-autofocus', true);
      var elToFocus;

      elToFocus = scanForFocusable(containerEl, attributeVal || AUTO_FOCUS);

      if ( !elToFocus && attributeVal != AUTO_FOCUS) {
        elToFocus = scanForFocusable(containerEl, this.prefixer('md-auto-focus', true));

        if ( !elToFocus ) {
          elToFocus = scanForFocusable(containerEl, AUTO_FOCUS);
        }
      }

      return elToFocus;
      function scanForFocusable(target, selector) {
        var elFound, items = target[0].querySelectorAll(selector);
        if ( items && items.length ){
          items.length && angular.forEach(items, function(it) {
            it = angular.element(it);
            var isFocusable = it.hasClass('md-autofocus');
            if (isFocusable) elFound = it;
          });
        }
        return elFound;
      }
    },
    disableScrollAround: function(element, parent, options) {
      $mdUtil.disableScrollAround._count = $mdUtil.disableScrollAround._count || 0;
      ++$mdUtil.disableScrollAround._count;
      if ($mdUtil.disableScrollAround._enableScrolling) return $mdUtil.disableScrollAround._enableScrolling;
      var body = $document[0].body,
        restoreBody = disableBodyScroll(),
        restoreElement = disableElementScroll(parent);

      return $mdUtil.disableScrollAround._enableScrolling = function() {
        if (!--$mdUtil.disableScrollAround._count) {
          restoreBody();
          restoreElement();
          delete $mdUtil.disableScrollAround._enableScrolling;
        }
      };
      function disableElementScroll(element) {
        element = angular.element(element || body);
        var scrollMask;
        if (options && options.disableScrollMask) {
          scrollMask = element;
        } else {
          element = element[0];
          scrollMask = angular.element(
            '<div class="md-scroll-mask">' +
            '  <div class="md-scroll-mask-bar"></div>' +
            '</div>');
          element.appendChild(scrollMask[0]);
        }

        scrollMask.on('wheel', preventDefault);
        scrollMask.on('touchmove', preventDefault);

        return function restoreScroll() {
          scrollMask.off('wheel');
          scrollMask.off('touchmove');
          scrollMask[0].parentNode.removeChild(scrollMask[0]);
          delete $mdUtil.disableScrollAround._enableScrolling;
        };

        function preventDefault(e) {
          e.preventDefault();
        }
      }
      function disableBodyScroll() {
        var htmlNode = body.parentNode;
        var restoreHtmlStyle = htmlNode.style.cssText || '';
        var restoreBodyStyle = body.style.cssText || '';
        var scrollOffset = $mdUtil.scrollTop(body);
        var clientWidth = body.clientWidth;

        if (body.scrollHeight > body.clientHeight + 1) {
          applyStyles(body, {
            position: 'fixed',
            width: '100%',
            top: -scrollOffset + 'px'
          });

          htmlNode.style.overflowY = 'scroll';
        }

        if (body.clientWidth < clientWidth) applyStyles(body, {overflow: 'hidden'});

        return function restoreScroll() {
          body.style.cssText = restoreBodyStyle;
          htmlNode.style.cssText = restoreHtmlStyle;
          body.scrollTop = scrollOffset;
          htmlNode.scrollTop = scrollOffset;
        };
      }

      function applyStyles(el, styles) {
        for (var key in styles) {
          el.style[key] = styles[key];
        }
      }
    },
    enableScrolling: function() {
      var method = this.disableScrollAround._enableScrolling;
      method && method();
    },
    floatingScrollbars: function() {
      if (this.floatingScrollbars.cached === undefined) {
        var tempNode = angular.element('<div><div></div></div>').css({
          width: '100%',
          'z-index': -1,
          position: 'absolute',
          height: '35px',
          'overflow-y': 'scroll'
        });
        tempNode.children().css('height', '60px');

        $document[0].body.appendChild(tempNode[0]);
        this.floatingScrollbars.cached = (tempNode[0].offsetWidth == tempNode[0].childNodes[0].offsetWidth);
        tempNode.remove();
      }
      return this.floatingScrollbars.cached;
    },
    forceFocus: function(element) {
      var node = element[0] || element;

      document.addEventListener('click', function focusOnClick(ev) {
        if (ev.target === node && ev.$focus) {
          node.focus();
          ev.stopImmediatePropagation();
          ev.preventDefault();
          node.removeEventListener('click', focusOnClick);
        }
      }, true);

      var newEvent = document.createEvent('MouseEvents');
      newEvent.initMouseEvent('click', false, true, window, {}, 0, 0, 0, 0,
        false, false, false, false, 0, null);
      newEvent.$material = true;
      newEvent.$focus = true;
      node.dispatchEvent(newEvent);
    },
    createBackdrop: function(scope, addClass) {
      return $compile($mdUtil.supplant('<md-backdrop class="{0}">', [addClass]))(scope);
    },
    supplant: function(template, values, pattern) {
      pattern = pattern || /\{([^\{\}]*)\}/g;
      return template.replace(pattern, function(a, b) {
        var p = b.split('.'),
          r = values;
        try {
          for (var s in p) {
            if (p.hasOwnProperty(s) ) {
              r = r[p[s]];
            }
          }
        } catch (e) {
          r = a;
        }
        return (typeof r === 'string' || typeof r === 'number') ? r : a;
      });
    },

    fakeNgModel: function() {
      return {
        $fake: true,
        $setTouched: angular.noop,
        $setViewValue: function(value) {
          this.$viewValue = value;
          this.$render(value);
          this.$viewChangeListeners.forEach(function(cb) {
            cb();
          });
        },
        $isEmpty: function(value) {
          return ('' + value).length === 0;
        },
        $parsers: [],
        $formatters: [],
        $viewChangeListeners: [],
        $render: angular.noop
      };
    },
    debounce: function(func, wait, scope, invokeApply) {
      var timer;

      return function debounced() {
        var context = scope,
          args = Array.prototype.slice.call(arguments);

        $timeout.cancel(timer);
        timer = $timeout(function() {

          timer = undefined;
          func.apply(context, args);

        }, wait || 10, invokeApply);
      };
    },
    throttle: function throttle(func, delay) {
      var recent;
      return function throttled() {
        var context = this;
        var args = arguments;
        var now = $mdUtil.now();

        if (!recent || (now - recent > delay)) {
          func.apply(context, args);
          recent = now;
        }
      };
    },
    time: function time(cb) {
      var start = $mdUtil.now();
      cb();
      return $mdUtil.now() - start;
    },
    valueOnUse : function (scope, key, getter) {
      var value = null, args = Array.prototype.slice.call(arguments);
      var params = (args.length > 3) ? args.slice(3) : [ ];

      Object.defineProperty(scope, key, {
        get: function () {
          if (value === null) value = getter.apply(scope, params);
          return value;
        }
      });
    },
    nextUid: function() {
      return '' + nextUniqueId++;
    },
    disconnectScope: function disconnectScope(scope) {
      if (!scope) return;
      if (scope.$root === scope) return;
      if (scope.$$destroyed) return;

      var parent = scope.$parent;
      scope.$$disconnected = true;
      if (parent.$$childHead === scope) parent.$$childHead = scope.$$nextSibling;
      if (parent.$$childTail === scope) parent.$$childTail = scope.$$prevSibling;
      if (scope.$$prevSibling) scope.$$prevSibling.$$nextSibling = scope.$$nextSibling;
      if (scope.$$nextSibling) scope.$$nextSibling.$$prevSibling = scope.$$prevSibling;

      scope.$$nextSibling = scope.$$prevSibling = null;

    },
    reconnectScope: function reconnectScope(scope) {
      if (!scope) return;
      if (scope.$root === scope) return;
      if (!scope.$$disconnected) return;

      var child = scope;

      var parent = child.$parent;
      child.$$disconnected = false;
      child.$$prevSibling = parent.$$childTail;
      if (parent.$$childHead) {
        parent.$$childTail.$$nextSibling = child;
        parent.$$childTail = child;
      } else {
        parent.$$childHead = parent.$$childTail = child;
      }
    },
    getClosest: function getClosest(el, validateWith, onlyParent) {
      if ( angular.isString(validateWith) ) {
        var tagName = validateWith.toUpperCase();
        validateWith = function(el) {
          return el.nodeName === tagName;
        };
      }

      if (el instanceof angular.element) el = el[0];
      if (onlyParent) el = el.parentNode;
      if (!el) return null;

      do {
        if (validateWith(el)) {
          return el;
        }
      } while (el = el.parentNode);

      return null;
    },
    elementContains: function(node, child) {
      var hasContains = (window.Node && window.Node.prototype && Node.prototype.contains);
      var findFn = hasContains ? angular.bind(node, node.contains) : angular.bind(node, function(arg) {
        return (node === child) || !!(this.compareDocumentPosition(arg) & 16)
      });

      return findFn(child);
    },
    extractElementByName: function(element, nodeName, scanDeep, warnNotFound) {
      var found = scanTree(element);
      if (!found && !!warnNotFound) {
        $log.warn( $mdUtil.supplant("Unable to find node '{0}' in element '{1}'.",[nodeName, element[0].outerHTML]) );
      }

      return angular.element(found || element);
      function scanTree(element) {
        return scanLevel(element) || (!!scanDeep ? scanChildren(element) : null);
      }
      function scanLevel(element) {
        if ( element ) {
          for (var i = 0, len = element.length; i < len; i++) {
            if (element[i].nodeName.toLowerCase() === nodeName) {
              return element[i];
            }
          }
        }
        return null;
      }
      function scanChildren(element) {
        var found;
        if ( element ) {
          for (var i = 0, len = element.length; i < len; i++) {
            var target = element[i];
            if ( !found ) {
              for (var j = 0, numChild = target.childNodes.length; j < numChild; j++) {
                found = found || scanTree([target.childNodes[j]]);
              }
            }
          }
        }
        return found;
      }

    },
    initOptionalProperties: function(scope, attr, defaults) {
      defaults = defaults || {};
      angular.forEach(scope.$$isolateBindings, function(binding, key) {
        if (binding.optional && angular.isUndefined(scope[key])) {
          var attrIsDefined = angular.isDefined(attr[binding.attrName]);
          scope[key] = angular.isDefined(defaults[key]) ? defaults[key] : attrIsDefined;
        }
      });
    },
    nextTick: function(callback, digest, scope) {
      var nextTick = $mdUtil.nextTick;
      var timeout = nextTick.timeout;
      var queue = nextTick.queue || [];
      queue.push({scope: scope, callback: callback});
      if (digest == null) digest = true;
      nextTick.digest = nextTick.digest || digest;
      nextTick.queue = queue;
      return timeout || (nextTick.timeout = $timeout(processQueue, 0, false));
      function processQueue() {
        var queue = nextTick.queue;
        var digest = nextTick.digest;

        nextTick.queue = [];
        nextTick.timeout = null;
        nextTick.digest = false;

        queue.forEach(function(queueItem) {
          var skip = queueItem.scope && queueItem.scope.$$destroyed;
          if (!skip) {
            queueItem.callback();
          }
        });

        if (digest) $rootScope.$digest();
      }
    },
    processTemplate: function(template) {
      if (usesStandardSymbols) {
        return template;
      } else {
        if (!template || !angular.isString(template)) return template;
        return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
      }
    },
    getParentWithPointerEvents: function (element) {
      var parent = element.parent();
      while (hasComputedStyle(parent, 'pointer-events', 'none')) {
        parent = parent.parent();
      }

      return parent;
    },

    getNearestContentElement: function (element) {
      var current = element.parent()[0];
      while (current && current !== $rootElement[0] && current !== document.body && current.nodeName.toUpperCase() !== 'MD-CONTENT') {
        current = current.parentNode;
      }
      return current;
    },
    checkStickySupport: function() {
      var stickyProp;
      var testEl = angular.element('<div>');
      $document[0].body.appendChild(testEl[0]);

      var stickyProps = ['sticky', '-webkit-sticky'];
      for (var i = 0; i < stickyProps.length; ++i) {
        testEl.css({
          position: stickyProps[i],
          top: 0,
          'z-index': 2
        });

        if (testEl.css('position') == stickyProps[i]) {
          stickyProp = stickyProps[i];
          break;
        }
      }

      testEl.remove();

      return stickyProp;
    },
    parseAttributeBoolean: function(value, negatedCheck) {
      return value === '' || !!value && (negatedCheck === false || value !== 'false' && value !== '0');
    },

    hasComputedStyle: hasComputedStyle,
    isParentFormSubmitted: function(element) {
      var parent = $mdUtil.getClosest(element, 'form');
      var form = parent ? angular.element(parent).controller('form') : null;

      return form ? form.$submitted : false;
    },
    animateScrollTo: function(element, scrollEnd) {
      var scrollStart = element.scrollTop;
      var scrollChange = scrollEnd - scrollStart;
      var scrollingDown = scrollStart < scrollEnd;
      var startTime = $mdUtil.now();

      $$rAF(scrollChunk);

      function scrollChunk() {
        var newPosition = calculateNewPosition();
        
        element.scrollTop = newPosition;
        
        if (scrollingDown ? newPosition < scrollEnd : newPosition > scrollEnd) {
          $$rAF(scrollChunk);
        }
      }
      
      function calculateNewPosition() {
        var duration = 1000;
        var currentTime = $mdUtil.now() - startTime;
        
        return ease(currentTime, scrollStart, scrollChange, duration);
      }

      function ease(currentTime, start, change, duration) {
        if (currentTime > duration) {
          return start + change;
        }
        
        var ts = (currentTime /= duration) * currentTime;
        var tc = ts * currentTime;

        return start + change * (-2 * tc + 3 * ts);
      }
    }
  };

  $mdUtil.dom.animator = $$mdAnimate($mdUtil);

  return $mdUtil;

  function getNode(el) {
    return el[0] || el;
  }

}

angular.element.prototype.focus = angular.element.prototype.focus || function() {
    if (this.length) {
      this[0].focus();
    }
    return this;
  };
angular.element.prototype.blur = angular.element.prototype.blur || function() {
    if (this.length) {
      this[0].blur();
    }
    return this;
  };

})();
(function(){
"use strict";
MdAriaService.$inject = ["$$rAF", "$log", "$window", "$interpolate"];
angular
  .module('material.core')
  .provider('$mdAria', MdAriaProvider);
function MdAriaProvider() {

  var self = this;
  self.showWarnings = true;

  return {
    disableWarnings: disableWarnings,
    $get: ["$$rAF", "$log", "$window", "$interpolate", function($$rAF, $log, $window, $interpolate) {
      return MdAriaService.apply(self, arguments);
    }]
  };
  function disableWarnings() {
    self.showWarnings = false;
  }
}
function MdAriaService($$rAF, $log, $window, $interpolate) {
  var showWarnings = this.showWarnings;

  return {
    expect: expect,
    expectAsync: expectAsync,
    expectWithText: expectWithText,
    expectWithoutText: expectWithoutText
  };
  function expect(element, attrName, defaultValue) {

    var node = angular.element(element)[0] || element;
    if (node &&
       ((!node.hasAttribute(attrName) ||
        node.getAttribute(attrName).length === 0) &&
        !childHasAttribute(node, attrName))) {

      defaultValue = angular.isString(defaultValue) ? defaultValue.trim() : '';
      if (defaultValue.length) {
        element.attr(attrName, defaultValue);
      } else if (showWarnings) {
        $log.warn('ARIA: Attribute "', attrName, '", required for accessibility, is missing on node:', node);
      }

    }
  }

  function expectAsync(element, attrName, defaultValueGetter) {
    $$rAF(function() {
        expect(element, attrName, defaultValueGetter());
    });
  }

  function expectWithText(element, attrName) {
    var content = getText(element) || "";
    var hasBinding = content.indexOf($interpolate.startSymbol()) > -1;

    if ( hasBinding ) {
      expectAsync(element, attrName, function() {
        return getText(element);
      });
    } else {
      expect(element, attrName, content);
    }
  }

  function expectWithoutText(element, attrName) {
    var content = getText(element);
    var hasBinding = content.indexOf($interpolate.startSymbol()) > -1;

    if ( !hasBinding && !content) {
      expect(element, attrName, content);
    }
  }

  function getText(element) {
    element = element[0] || element;
    var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    var text = '';

    var node;
    while (node = walker.nextNode()) {
      if (!isAriaHiddenNode(node)) {
        text += node.textContent;
      }
    }

    return text.trim() || '';

    function isAriaHiddenNode(node) {
      while (node.parentNode && (node = node.parentNode) !== element) {
        if (node.getAttribute && node.getAttribute('aria-hidden') === 'true') {
          return true;
        }
      }
    }
  }

  function childHasAttribute(node, attrName) {
    var hasChildren = node.hasChildNodes(),
        hasAttr = false;

    function isHidden(el) {
      var style = el.currentStyle ? el.currentStyle : $window.getComputedStyle(el);
      return (style.display === 'none');
    }

    if (hasChildren) {
      var children = node.childNodes;
      for (var i=0; i < children.length; i++) {
        var child = children[i];
        if (child.nodeType === 1 && child.hasAttribute(attrName)) {
          if (!isHidden(child)) {
            hasAttr = true;
          }
        }
      }
    }

    return hasAttr;
  }
}

})();
(function(){
"use strict";


mdCompilerService.$inject = ["$q", "$templateRequest", "$injector", "$compile", "$controller"];angular
  .module('material.core')
  .service('$mdCompiler', mdCompilerService);

function mdCompilerService($q, $templateRequest, $injector, $compile, $controller) {
  this.compile = function(options) {
    var templateUrl = options.templateUrl;
    var template = options.template || '';
    var controller = options.controller;
    var controllerAs = options.controllerAs;
    var resolve = angular.extend({}, options.resolve || {});
    var locals = angular.extend({}, options.locals || {});
    var transformTemplate = options.transformTemplate || angular.identity;
    var bindToController = options.bindToController;
    angular.forEach(resolve, function(value, key) {
      if (angular.isString(value)) {
        resolve[key] = $injector.get(value);
      } else {
        resolve[key] = $injector.invoke(value);
      }
    });
    angular.extend(resolve, locals);

    if (templateUrl) {
      resolve.$template = $templateRequest(templateUrl)
        .then(function(response) {
          return response;
        });
    } else {
      resolve.$template = $q.when(template);
    }
    return $q.all(resolve).then(function(locals) {

      var compiledData;
      var template = transformTemplate(locals.$template, options);
      var element = options.element || angular.element('<div>').html(template.trim()).contents();
      var linkFn = $compile(element);
      return compiledData = {
        locals: locals,
        element: element,
        link: function link(scope) {
          locals.$scope = scope;
          if (controller) {
            var invokeCtrl = $controller(controller, locals, true, controllerAs);
            if (bindToController) {
              angular.extend(invokeCtrl.instance, locals);
            }
            var ctrl = invokeCtrl();
            element.data('$ngControllerController', ctrl);
            element.children().data('$ngControllerController', ctrl);
            compiledData.controller = ctrl;
          }
          return linkFn(scope);
        }
      };
    });

  };
}

})();
(function(){
"use strict";


MdGesture.$inject = ["$$MdGestureHandler", "$$rAF", "$timeout"];
attachToDocument.$inject = ["$mdGesture", "$$MdGestureHandler"];var HANDLERS = {};

var pointer, lastPointer, forceSkipClickHijack = false;
var lastLabelClickPos = null;
var isInitialized = false;

angular
  .module('material.core.gestures', [ ])
  .provider('$mdGesture', MdGestureProvider)
  .factory('$$MdGestureHandler', MdGestureHandler)
  .run( attachToDocument );
function MdGestureProvider() { }

MdGestureProvider.prototype = {
  skipClickHijack: function() {
    return forceSkipClickHijack = true;
  },
  $get : ["$$MdGestureHandler", "$$rAF", "$timeout", function($$MdGestureHandler, $$rAF, $timeout) {
       return new MdGesture($$MdGestureHandler, $$rAF, $timeout);
  }]
};
function MdGesture($$MdGestureHandler, $$rAF, $timeout) {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  var isIos = userAgent.match(/ipad|iphone|ipod/i);
  var isAndroid = userAgent.match(/android/i);
  var touchActionProperty = getTouchAction();
  var hasJQuery =  (typeof window.jQuery !== 'undefined') && (angular.element === window.jQuery);

  var self = {
    handler: addHandler,
    register: register,
    isIos: isIos,
    isAndroid: isAndroid,
    isHijackingClicks: (isIos || isAndroid) && !hasJQuery && !forceSkipClickHijack
  };

  if (self.isHijackingClicks) {
    var maxClickDistance = 6;
    self.handler('click', {
      options: {
        maxDistance: maxClickDistance
      },
      onEnd: checkDistanceAndEmit('click')
    });

    self.handler('focus', {
      options: {
        maxDistance: maxClickDistance
      },
      onEnd: function(ev, pointer) {
        if (pointer.distance < this.state.options.maxDistance) {
          if (canFocus(ev.target)) {
            this.dispatchEvent(ev, 'focus', pointer);
            ev.target.focus();
          }
        }

        function canFocus(element) {
          var focusableElements = ['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA', 'VIDEO', 'AUDIO'];

          return (element.getAttribute('tabindex') != '-1') &&
              !element.hasAttribute('DISABLED') &&
              (element.hasAttribute('tabindex') || element.hasAttribute('href') || element.isContentEditable ||
              (focusableElements.indexOf(element.nodeName) != -1));
        }
      }
    });

    self.handler('mouseup', {
      options: {
        maxDistance: maxClickDistance
      },
      onEnd: checkDistanceAndEmit('mouseup')
    });

    self.handler('mousedown', {
      onStart: function(ev) {
        this.dispatchEvent(ev, 'mousedown');
      }
    });
  }

  function checkDistanceAndEmit(eventName) {
    return function(ev, pointer) {
      if (pointer.distance < this.state.options.maxDistance) {
        this.dispatchEvent(ev, eventName, pointer);
      }
    };
  }
  function register(element, handlerName, options) {
    var handler = HANDLERS[handlerName.replace(/^\$md./, '')];
    if (!handler) {
      throw new Error('Failed to register element with handler ' + handlerName + '. ' +
      'Available handlers: ' + Object.keys(HANDLERS).join(', '));
    }
    return handler.registerElement(element, options);
  }
  function addHandler(name, definition) {
    var handler = new $$MdGestureHandler(name);
    angular.extend(handler, definition);
    HANDLERS[name] = handler;

    return self;
  }
  return self
    .handler('press', {
      onStart: function (ev, pointer) {
        this.dispatchEvent(ev, '$md.pressdown');
      },
      onEnd: function (ev, pointer) {
        this.dispatchEvent(ev, '$md.pressup');
      }
    })
    .handler('hold', {
      options: {
        maxDistance: 6,
        delay: 500
      },
      onCancel: function () {
        $timeout.cancel(this.state.timeout);
      },
      onStart: function (ev, pointer) {
        if (!this.state.registeredParent) return this.cancel();

        this.state.pos = {x: pointer.x, y: pointer.y};
        this.state.timeout = $timeout(angular.bind(this, function holdDelayFn() {
          this.dispatchEvent(ev, '$md.hold');
          this.cancel(); //we're done!
        }), this.state.options.delay, false);
      },
      onMove: function (ev, pointer) {
        if (!touchActionProperty && ev.type === 'touchmove') ev.preventDefault();
        var dx = this.state.pos.x - pointer.x;
        var dy = this.state.pos.y - pointer.y;
        if (Math.sqrt(dx * dx + dy * dy) > this.options.maxDistance) {
          this.cancel();
        }
      },
      onEnd: function () {
        this.onCancel();
      }
    })
    .handler('drag', {
      options: {
        minDistance: 6,
        horizontal: true,
        cancelMultiplier: 1.5
      },
      onSetup: function(element, options) {
        if (touchActionProperty) {
          this.oldTouchAction = element[0].style[touchActionProperty];
          element[0].style[touchActionProperty] = options.horizontal === false ? 'pan-y' : 'pan-x';
        }
      },
      onCleanup: function(element) {
        if (this.oldTouchAction) {
          element[0].style[touchActionProperty] = this.oldTouchAction;
        }
      },
      onStart: function (ev) {
        if (!this.state.registeredParent) this.cancel();
      },
      onMove: function (ev, pointer) {
        var shouldStartDrag, shouldCancel;
        if (!touchActionProperty && ev.type === 'touchmove') ev.preventDefault();

        if (!this.state.dragPointer) {
          if (this.state.options.horizontal) {
            shouldStartDrag = Math.abs(pointer.distanceX) > this.state.options.minDistance;
            shouldCancel = Math.abs(pointer.distanceY) > this.state.options.minDistance * this.state.options.cancelMultiplier;
          } else {
            shouldStartDrag = Math.abs(pointer.distanceY) > this.state.options.minDistance;
            shouldCancel = Math.abs(pointer.distanceX) > this.state.options.minDistance * this.state.options.cancelMultiplier;
          }

          if (shouldStartDrag) {
            this.state.dragPointer = makeStartPointer(ev);
            updatePointerState(ev, this.state.dragPointer);
            this.dispatchEvent(ev, '$md.dragstart', this.state.dragPointer);

          } else if (shouldCancel) {
            this.cancel();
          }
        } else {
          this.dispatchDragMove(ev);
        }
      },
      dispatchDragMove: $$rAF.throttle(function (ev) {
        if (this.state.isRunning) {
          updatePointerState(ev, this.state.dragPointer);
          this.dispatchEvent(ev, '$md.drag', this.state.dragPointer);
        }
      }),
      onEnd: function (ev, pointer) {
        if (this.state.dragPointer) {
          updatePointerState(ev, this.state.dragPointer);
          this.dispatchEvent(ev, '$md.dragend', this.state.dragPointer);
        }
      }
    })
    .handler('swipe', {
      options: {
        minVelocity: 0.65,
        minDistance: 10
      },
      onEnd: function (ev, pointer) {
        var eventType;

        if (Math.abs(pointer.velocityX) > this.state.options.minVelocity &&
          Math.abs(pointer.distanceX) > this.state.options.minDistance) {
          eventType = pointer.directionX == 'left' ? '$md.swipeleft' : '$md.swiperight';
          this.dispatchEvent(ev, eventType);
        }
        else if (Math.abs(pointer.velocityY) > this.state.options.minVelocity &&
          Math.abs(pointer.distanceY) > this.state.options.minDistance) {
          eventType = pointer.directionY == 'up' ? '$md.swipeup' : '$md.swipedown';
          this.dispatchEvent(ev, eventType);
        }
      }
    });

  function getTouchAction() {
    var testEl = document.createElement('div');
    var vendorPrefixes = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];

    for (var i = 0; i < vendorPrefixes.length; i++) {
      var prefix = vendorPrefixes[i];
      var property = prefix ? prefix + 'TouchAction' : 'touchAction';
      if (angular.isDefined(testEl.style[property])) {
        return property;
      }
    }
  }

}
function GestureHandler (name) {
  this.name = name;
  this.state = {};
}

function MdGestureHandler() {
  var hasJQuery =  (typeof window.jQuery !== 'undefined') && (angular.element === window.jQuery);

  GestureHandler.prototype = {
    options: {},
    dispatchEvent: hasJQuery ?  jQueryDispatchEvent : nativeDispatchEvent,
    onSetup: angular.noop,
    onCleanup: angular.noop,
    onStart: angular.noop,
    onMove: angular.noop,
    onEnd: angular.noop,
    onCancel: angular.noop,
    start: function (ev, pointer) {
      if (this.state.isRunning) return;
      var parentTarget = this.getNearestParent(ev.target);
      var parentTargetOptions = parentTarget && parentTarget.$mdGesture[this.name] || {};

      this.state = {
        isRunning: true,
        options: angular.extend({}, this.options, parentTargetOptions),
        registeredParent: parentTarget
      };
      this.onStart(ev, pointer);
    },
    move: function (ev, pointer) {
      if (!this.state.isRunning) return;
      this.onMove(ev, pointer);
    },
    end: function (ev, pointer) {
      if (!this.state.isRunning) return;
      this.onEnd(ev, pointer);
      this.state.isRunning = false;
    },
    cancel: function (ev, pointer) {
      this.onCancel(ev, pointer);
      this.state = {};
    },
    getNearestParent: function (node) {
      var current = node;
      while (current) {
        if ((current.$mdGesture || {})[this.name]) {
          return current;
        }
        current = current.parentNode;
      }
      return null;
    },
    registerElement: function (element, options) {
      var self = this;
      element[0].$mdGesture = element[0].$mdGesture || {};
      element[0].$mdGesture[this.name] = options || {};
      element.on('$destroy', onDestroy);

      self.onSetup(element, options || {});

      return onDestroy;

      function onDestroy() {
        delete element[0].$mdGesture[self.name];
        element.off('$destroy', onDestroy);

        self.onCleanup(element, options || {});
      }
    }
  };

  return GestureHandler;
  function jQueryDispatchEvent(srcEvent, eventType, eventPointer) {
    eventPointer = eventPointer || pointer;
    var eventObj = new angular.element.Event(eventType);

    eventObj.$material = true;
    eventObj.pointer = eventPointer;
    eventObj.srcEvent = srcEvent;

    angular.extend(eventObj, {
      clientX: eventPointer.x,
      clientY: eventPointer.y,
      screenX: eventPointer.x,
      screenY: eventPointer.y,
      pageX: eventPointer.x,
      pageY: eventPointer.y,
      ctrlKey: srcEvent.ctrlKey,
      altKey: srcEvent.altKey,
      shiftKey: srcEvent.shiftKey,
      metaKey: srcEvent.metaKey
    });
    angular.element(eventPointer.target).trigger(eventObj);
  }
  function nativeDispatchEvent(srcEvent, eventType, eventPointer) {
    eventPointer = eventPointer || pointer;
    var eventObj;

    if (eventType === 'click' || eventType == 'mouseup' || eventType == 'mousedown' ) {
      eventObj = document.createEvent('MouseEvents');
      eventObj.initMouseEvent(
        eventType, true, true, window, srcEvent.detail,
        eventPointer.x, eventPointer.y, eventPointer.x, eventPointer.y,
        srcEvent.ctrlKey, srcEvent.altKey, srcEvent.shiftKey, srcEvent.metaKey,
        srcEvent.button, srcEvent.relatedTarget || null
      );

    } else {
      eventObj = document.createEvent('CustomEvent');
      eventObj.initCustomEvent(eventType, true, true, {});
    }
    eventObj.$material = true;
    eventObj.pointer = eventPointer;
    eventObj.srcEvent = srcEvent;
    eventPointer.target.dispatchEvent(eventObj);
  }

}
function attachToDocument( $mdGesture, $$MdGestureHandler ) {
  document.contains || (document.contains = function (node) {
    return document.body.contains(node);
  });

  if (!isInitialized && $mdGesture.isHijackingClicks ) {
    document.addEventListener('click'    , clickHijacker     , true);
    document.addEventListener('mouseup'  , mouseInputHijacker, true);
    document.addEventListener('mousedown', mouseInputHijacker, true);
    document.addEventListener('focus'    , mouseInputHijacker, true);

    isInitialized = true;
  }

  function mouseInputHijacker(ev) {
    var isKeyClick = !ev.clientX && !ev.clientY;
    if (!isKeyClick && !ev.$material && !ev.isIonicTap
      && !isInputEventFromLabelClick(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  function clickHijacker(ev) {
    var isKeyClick = ev.clientX === 0 && ev.clientY === 0;
    if (!isKeyClick && !ev.$material && !ev.isIonicTap
      && !isInputEventFromLabelClick(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
      lastLabelClickPos = null;
    } else {
      lastLabelClickPos = null;
      if (ev.target.tagName.toLowerCase() == 'label') {
        lastLabelClickPos = {x: ev.x, y: ev.y};
      }
    }
  }
  var START_EVENTS = 'mousedown touchstart pointerdown';
  var MOVE_EVENTS = 'mousemove touchmove pointermove';
  var END_EVENTS = 'mouseup mouseleave touchend touchcancel pointerup pointercancel';

  angular.element(document)
    .on(START_EVENTS, gestureStart)
    .on(MOVE_EVENTS, gestureMove)
    .on(END_EVENTS, gestureEnd)
    .on('$$mdGestureReset', function gestureClearCache () {
      lastPointer = pointer = null;
    });
  function runHandlers(handlerEvent, event) {
    var handler;
    for (var name in HANDLERS) {
      handler = HANDLERS[name];
      if( handler instanceof $$MdGestureHandler ) {

        if (handlerEvent === 'start') {
          handler.cancel();
        }
        handler[handlerEvent](event, pointer);

      }
    }
  }
  function gestureStart(ev) {
    if (pointer) return;

    var now = +Date.now();
    if (lastPointer && !typesMatch(ev, lastPointer) && (now - lastPointer.endTime < 1500)) {
      return;
    }

    pointer = makeStartPointer(ev);

    runHandlers('start', ev);
  }
  function gestureMove(ev) {
    if (!pointer || !typesMatch(ev, pointer)) return;

    updatePointerState(ev, pointer);
    runHandlers('move', ev);
  }
  function gestureEnd(ev) {
    if (!pointer || !typesMatch(ev, pointer)) return;

    updatePointerState(ev, pointer);
    pointer.endTime = +Date.now();

    runHandlers('end', ev);

    lastPointer = pointer;
    pointer = null;
  }

}
function makeStartPointer(ev) {
  var point = getEventPoint(ev);
  var startPointer = {
    startTime: +Date.now(),
    target: ev.target,
    type: ev.type.charAt(0)
  };
  startPointer.startX = startPointer.x = point.pageX;
  startPointer.startY = startPointer.y = point.pageY;
  return startPointer;
}
function typesMatch(ev, pointer) {
  return ev && pointer && ev.type.charAt(0) === pointer.type;
}
function isInputEventFromLabelClick(event) {
  return lastLabelClickPos
      && lastLabelClickPos.x == event.x
      && lastLabelClickPos.y == event.y;
}
function updatePointerState(ev, pointer) {
  var point = getEventPoint(ev);
  var x = pointer.x = point.pageX;
  var y = pointer.y = point.pageY;

  pointer.distanceX = x - pointer.startX;
  pointer.distanceY = y - pointer.startY;
  pointer.distance = Math.sqrt(
    pointer.distanceX * pointer.distanceX + pointer.distanceY * pointer.distanceY
  );

  pointer.directionX = pointer.distanceX > 0 ? 'right' : pointer.distanceX < 0 ? 'left' : '';
  pointer.directionY = pointer.distanceY > 0 ? 'down' : pointer.distanceY < 0 ? 'up' : '';

  pointer.duration = +Date.now() - pointer.startTime;
  pointer.velocityX = pointer.distanceX / pointer.duration;
  pointer.velocityY = pointer.distanceY / pointer.duration;
}
function getEventPoint(ev) {
  ev = ev.originalEvent || ev; // support jQuery events
  return (ev.touches && ev.touches[0]) ||
    (ev.changedTouches && ev.changedTouches[0]) ||
    ev;
}

})();
(function(){
"use strict";

angular.module('material.core')
  .provider('$$interimElement', InterimElementProvider);

function InterimElementProvider() {
  InterimElementFactory.$inject = ["$document", "$q", "$$q", "$rootScope", "$timeout", "$rootElement", "$animate", "$mdUtil", "$mdCompiler", "$mdTheming", "$injector"];
  createInterimElementProvider.$get = InterimElementFactory;
  return createInterimElementProvider;
  function createInterimElementProvider(interimFactoryName) {
    factory.$inject = ["$$interimElement", "$injector"];
    var EXPOSED_METHODS = ['onHide', 'onShow', 'onRemove'];

    var customMethods = {};
    var providerConfig = {
      presets: {}
    };

    var provider = {
      setDefaults: setDefaults,
      addPreset: addPreset,
      addMethod: addMethod,
      $get: factory
    };
    provider.addPreset('build', {
      methods: ['controller', 'controllerAs', 'resolve',
        'template', 'templateUrl', 'themable', 'transformTemplate', 'parent']
    });

    return provider;
    function setDefaults(definition) {
      providerConfig.optionsFactory = definition.options;
      providerConfig.methods = (definition.methods || []).concat(EXPOSED_METHODS);
      return provider;
    }

    function addMethod(name, fn) {
      customMethods[name] = fn;
      return provider;
    }
    function addPreset(name, definition) {
      definition = definition || {};
      definition.methods = definition.methods || [];
      definition.options = definition.options || function() { return {}; };

      if (/^cancel|hide|show$/.test(name)) {
        throw new Error("Preset '" + name + "' in " + interimFactoryName + " is reserved!");
      }
      if (definition.methods.indexOf('_options') > -1) {
        throw new Error("Method '_options' in " + interimFactoryName + " is reserved!");
      }
      providerConfig.presets[name] = {
        methods: definition.methods.concat(EXPOSED_METHODS),
        optionsFactory: definition.options,
        argOption: definition.argOption
      };
      return provider;
    }

    function addPresetMethod(presetName, methodName, method) {
      providerConfig.presets[presetName][methodName] = method;
    }
    function factory($$interimElement, $injector) {
      var defaultMethods;
      var defaultOptions;
      var interimElementService = $$interimElement();
      var publicService = {
        hide: interimElementService.hide,
        cancel: interimElementService.cancel,
        show: showInterimElement,
        destroy : destroyInterimElement
      };


      defaultMethods = providerConfig.methods || [];
      defaultOptions = invokeFactory(providerConfig.optionsFactory, {});
      angular.forEach(customMethods, function(fn, name) {
        publicService[name] = fn;
      });

      angular.forEach(providerConfig.presets, function(definition, name) {
        var presetDefaults = invokeFactory(definition.optionsFactory, {});
        var presetMethods = (definition.methods || []).concat(defaultMethods);
        angular.extend(presetDefaults, { $type: name });
        function Preset(opts) {
          this._options = angular.extend({}, presetDefaults, opts);
        }
        angular.forEach(presetMethods, function(name) {
          Preset.prototype[name] = function(value) {
            this._options[name] = value;
            return this;
          };
        });
        if (definition.argOption) {
          var methodName = 'show' + name.charAt(0).toUpperCase() + name.slice(1);
          publicService[methodName] = function(arg) {
            var config = publicService[name](arg);
            return publicService.show(config);
          };
        }
        publicService[name] = function(arg) {
          if (arguments.length && definition.argOption &&
              !angular.isObject(arg) && !angular.isArray(arg))  {

            return (new Preset())[definition.argOption](arg);

          } else {
            return new Preset(arg);
          }

        };
      });

      return publicService;
      function showInterimElement(opts) {
        opts = opts || { };
        if (opts._options) opts = opts._options;

        return interimElementService.show(
          angular.extend({}, defaultOptions, opts)
        );
      }
      function destroyInterimElement(opts) {
          return interimElementService.destroy(opts);
      }
      function invokeFactory(factory, defaultVal) {
        var locals = {};
        locals[interimFactoryName] = publicService;
        return $injector.invoke(factory || function() { return defaultVal; }, {}, locals);
      }

    }

  }
  function InterimElementFactory($document, $q, $$q, $rootScope, $timeout, $rootElement, $animate,
                                 $mdUtil, $mdCompiler, $mdTheming, $injector ) {
    return function createInterimElementService() {
      var SHOW_CANCELLED = false;
      var service, stack = [];

      return service = {
        show: show,
        hide: hide,
        cancel: cancel,
        destroy : destroy,
        $injector_: $injector
      };
      function show(options) {
        options = options || {};
        var interimElement = new InterimElement(options || {});
        var hideExisting = !options.skipHide && stack.length ? service.cancel() : $q.when(true);

        hideExisting.finally(function() {

          stack.push(interimElement);
          interimElement
            .show()
            .catch(function( reason ) {
              return reason;
            });

        });

        return interimElement.deferred.promise;
      }
      function hide(reason, options) {
        if ( !stack.length ) return $q.when(reason);
        options = options || {};

        if (options.closeAll) {
          var promise = $q.all(stack.reverse().map(closeElement));
          stack = [];
          return promise;
        } else if (options.closeTo !== undefined) {
          return $q.all(stack.splice(options.closeTo).map(closeElement));
        } else {
          var interim = stack.pop();
          return closeElement(interim);
        }

        function closeElement(interim) {
          interim
            .remove(reason, false, options || { })
            .catch(function( reason ) {
              return reason;
            });
          return interim.deferred.promise;
        }
      }
      function cancel(reason, options) {
        var interim = stack.pop();
        if ( !interim ) return $q.when(reason);

        interim
          .remove(reason, true, options || { })
          .catch(function( reason ) {
            return reason;
          });
        return interim.deferred.promise.catch(angular.noop);
      }
      function destroy(target) {
        var interim = !target ? stack.shift() : null;
        var cntr = angular.element(target).length ? angular.element(target)[0].parentNode : null;

        if (cntr) {
            var filtered = stack.filter(function(entry) {
                  var currNode = entry.options.element[0];
                  return  (currNode === cntr);
                });
            if (filtered.length > 0) {
              interim = filtered[0];
              stack.splice(stack.indexOf(interim), 1);
            }
        }

        return interim ? interim.remove(SHOW_CANCELLED, false, {'$destroy':true}) : $q.when(SHOW_CANCELLED);
      }
      function InterimElement(options) {
        var self, element, showAction = $q.when(true);

        options = configureScopeAndTransitions(options);

        return self = {
          options : options,
          deferred: $q.defer(),
          show    : createAndTransitionIn,
          remove  : transitionOutAndRemove
        };
        function createAndTransitionIn() {
          return $q(function(resolve, reject) {
            options.onCompiling && options.onCompiling(options);

            compileElement(options)
              .then(function( compiledData ) {
                element = linkElement( compiledData, options );

                showAction = showElement(element, options, compiledData.controller)
                  .then(resolve, rejectAll);

              }, rejectAll);

            function rejectAll(fault) {
              self.deferred.reject(fault);
              reject(fault);
            }
          });
        }
        function transitionOutAndRemove(response, isCancelled, opts) {
          if ( !element ) return $q.when(false);

          options = angular.extend(options || {}, opts || {});
          options.cancelAutoHide && options.cancelAutoHide();
          options.element.triggerHandler('$mdInterimElementRemove');

          if ( options.$destroy === true ) {

            return hideElement(options.element, options).then(function(){
              (isCancelled && rejectAll(response)) || resolveAll(response);
            });

          } else {

            $q.when(showAction)
                .finally(function() {
                  hideElement(options.element, options).then(function() {

                    (isCancelled && rejectAll(response)) || resolveAll(response);

                  }, rejectAll);
                });

            return self.deferred.promise;
          }
          function resolveAll(response) {
            self.deferred.resolve(response);
          }
          function rejectAll(fault) {
            self.deferred.reject(fault);
          }
        }
        function configureScopeAndTransitions(options) {
          options = options || { };
          if ( options.template ) {
            options.template = $mdUtil.processTemplate(options.template);
          }

          return angular.extend({
            preserveScope: false,
            cancelAutoHide : angular.noop,
            scope: options.scope || $rootScope.$new(options.isolateScope),
            onShow: function transitionIn(scope, element, options) {
              return $animate.enter(element, options.parent);
            },
            onRemove: function transitionOut(scope, element) {
              return element && $animate.leave(element) || $q.when();
            }
          }, options );

        }
        function compileElement(options) {

          var compiled = !options.skipCompile ? $mdCompiler.compile(options) : null;

          return compiled || $q(function (resolve) {
              resolve({
                locals: {},
                link: function () {
                  return options.element;
                }
              });
            });
        }
        function linkElement(compileData, options){
          angular.extend(compileData.locals, options);

          var element = compileData.link(options.scope);
          options.element = element;
          options.parent = findParent(element, options);
          if (options.themable) $mdTheming(element);

          return element;
        }
        function findParent(element, options) {
          var parent = options.parent;
          if (angular.isFunction(parent)) {
            parent = parent(options.scope, element, options);
          } else if (angular.isString(parent)) {
            parent = angular.element($document[0].querySelector(parent));
          } else {
            parent = angular.element(parent);
          }
          if (!(parent || {}).length) {
            var el;
            if ($rootElement[0] && $rootElement[0].querySelector) {
              el = $rootElement[0].querySelector(':not(svg) > body');
            }
            if (!el) el = $rootElement[0];
            if (el.nodeName == '#comment') {
              el = $document[0].body;
            }
            return angular.element(el);
          }

          return parent;
        }
        function startAutoHide() {
          var autoHideTimer, cancelAutoHide = angular.noop;

          if (options.hideDelay) {
            autoHideTimer = $timeout(service.hide, options.hideDelay) ;
            cancelAutoHide = function() {
              $timeout.cancel(autoHideTimer);
            }
          }
          options.cancelAutoHide = function() {
            cancelAutoHide();
            options.cancelAutoHide = undefined;
          }
        }
        function showElement(element, options, controller) {
          var notifyShowing = options.onShowing || angular.noop;
          var notifyComplete = options.onComplete || angular.noop;

          notifyShowing(options.scope, element, options, controller);

          return $q(function (resolve, reject) {
            try {
              $q.when(options.onShow(options.scope, element, options, controller))
                .then(function () {
                  notifyComplete(options.scope, element, options);
                  startAutoHide();

                  resolve(element);

                }, reject );

            } catch(e) {
              reject(e.message);
            }
          });
        }

        function hideElement(element, options) {
          var announceRemoving = options.onRemoving || angular.noop;

          return $$q(function (resolve, reject) {
            try {
              var action = $$q.when( options.onRemove(options.scope, element, options) || true );
              announceRemoving(element, action);

              if ( options.$destroy == true ) {
                resolve(element);

              } else {
                action.then(function () {

                  if (!options.preserveScope && options.scope ) {
                    options.scope.$destroy();
                  }

                  resolve(element);

                }, reject );
              }

            } catch(e) {
              reject(e);
            }
          });
        }

      }
    };

  }

}

})();
(function(){
"use strict";

(function() {
  'use strict';

  var $mdUtil, $interpolate, $log;

  var SUFFIXES = /(-gt)?-(sm|md|lg|print)/g;
  var WHITESPACE = /\s+/g;

  var FLEX_OPTIONS = ['grow', 'initial', 'auto', 'none', 'noshrink', 'nogrow' ];
  var LAYOUT_OPTIONS = ['row', 'column'];
  var ALIGNMENT_MAIN_AXIS= [ "", "start", "center", "end", "stretch", "space-around", "space-between" ];
  var ALIGNMENT_CROSS_AXIS= [ "", "start", "center", "end", "stretch" ];

  var config = {
    enabled: true,
    breakpoints: []
  };

  registerLayoutAPI( angular.module('material.core.layout', ['ng']) );
  function registerLayoutAPI(module){
    var PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    var BREAKPOINTS     = [ "", "xs", "gt-xs", "sm", "gt-sm", "md", "gt-md", "lg", "gt-lg", "xl", "print" ];
    var API_WITH_VALUES = [ "layout", "flex", "flex-order", "flex-offset", "layout-align" ];
    var API_NO_VALUES   = [ "show", "hide", "layout-padding", "layout-margin" ];
    angular.forEach(BREAKPOINTS, function(mqb) {
      angular.forEach( API_WITH_VALUES, function(name){
        var fullName = mqb ? name + "-" + mqb : name;
        module.directive( directiveNormalize(fullName), attributeWithObserve(fullName));
      });
      angular.forEach( API_NO_VALUES, function(name){
        var fullName = mqb ? name + "-" + mqb : name;
        module.directive( directiveNormalize(fullName), attributeWithoutValue(fullName));
      });

    });
    module

      .provider('$$mdLayout'     , function() {
        return {
          $get : angular.noop,
          validateAttributeValue : validateAttributeValue,
          validateAttributeUsage : validateAttributeUsage,
          disableLayouts  : function(isDisabled) {
            config.enabled =  (isDisabled !== true);
          }
        };
      })

      .directive('mdLayoutCss'        , disableLayoutDirective )
      .directive('ngCloak'            , buildCloakInterceptor('ng-cloak'))

      .directive('layoutWrap'   , attributeWithoutValue('layout-wrap'))
      .directive('layoutNowrap' , attributeWithoutValue('layout-nowrap'))
      .directive('layoutNoWrap' , attributeWithoutValue('layout-no-wrap'))
      .directive('layoutFill'   , attributeWithoutValue('layout-fill'))

      .directive('layoutLtMd'     , warnAttrNotSupported('layout-lt-md', true))
      .directive('layoutLtLg'     , warnAttrNotSupported('layout-lt-lg', true))
      .directive('flexLtMd'       , warnAttrNotSupported('flex-lt-md', true))
      .directive('flexLtLg'       , warnAttrNotSupported('flex-lt-lg', true))

      .directive('layoutAlignLtMd', warnAttrNotSupported('layout-align-lt-md'))
      .directive('layoutAlignLtLg', warnAttrNotSupported('layout-align-lt-lg'))
      .directive('flexOrderLtMd'  , warnAttrNotSupported('flex-order-lt-md'))
      .directive('flexOrderLtLg'  , warnAttrNotSupported('flex-order-lt-lg'))
      .directive('offsetLtMd'     , warnAttrNotSupported('flex-offset-lt-md'))
      .directive('offsetLtLg'     , warnAttrNotSupported('flex-offset-lt-lg'))

      .directive('hideLtMd'       , warnAttrNotSupported('hide-lt-md'))
      .directive('hideLtLg'       , warnAttrNotSupported('hide-lt-lg'))
      .directive('showLtMd'       , warnAttrNotSupported('show-lt-md'))
      .directive('showLtLg'       , warnAttrNotSupported('show-lt-lg'))
      .config( detectDisabledLayouts );
    function directiveNormalize(name) {
      return name
        .replace(PREFIX_REGEXP, '')
        .replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
          return offset ? letter.toUpperCase() : letter;
        });
    }

  }
   function detectDisabledLayouts() {
     var isDisabled = !!document.querySelector('[md-layouts-disabled]');
     config.enabled = !isDisabled;
   }
  function disableLayoutDirective() {
    config.enabled = false;

    return {
      restrict : 'A',
      priority : '900'
    };
  }
  function buildCloakInterceptor(className) {
    return [ '$timeout', function($timeout){
      return {
        restrict : 'A',
        priority : -10,   // run after normal ng-cloak
        compile  : function( element ) {
          if (!config.enabled) return angular.noop;
          element.addClass(className);

          return function( scope, element ) {
            $timeout( function(){
              element.removeClass(className);
            }, 10, false);
          };
        }
      };
    }];
  }
  function attributeWithObserve(className) {

    return ['$mdUtil', '$interpolate', "$log", function(_$mdUtil_, _$interpolate_, _$log_) {
      $mdUtil = _$mdUtil_;
      $interpolate = _$interpolate_;
      $log = _$log_;

      return {
        restrict: 'A',
        compile: function(element, attr) {
          var linkFn;
          if (config.enabled) {

            validateAttributeUsage(className, attr, element, $log);

            validateAttributeValue( className,
              getNormalizedAttrValue(className, attr, ""),
              buildUpdateFn(element, className, attr)
            );

            linkFn = translateWithValueToCssClass;
          }
          return linkFn || angular.noop;
        }
      };
    }];
    function translateWithValueToCssClass(scope, element, attrs) {
      var updateFn = updateClassWithValue(element, className, attrs);
      var unwatch = attrs.$observe(attrs.$normalize(className), updateFn);

      updateFn(getNormalizedAttrValue(className, attrs, ""));
      scope.$on("$destroy", function() { unwatch(); });
    }
  }
  function attributeWithoutValue(className) {
    return ['$mdUtil', '$interpolate', "$log", function(_$mdUtil_, _$interpolate_, _$log_) {
      $mdUtil = _$mdUtil_;
      $interpolate = _$interpolate_;
      $log = _$log_;

      return {
        restrict: 'A',
        compile: function(element, attr) {
          var linkFn;
          if (config.enabled) {

            validateAttributeValue( className,
              getNormalizedAttrValue(className, attr, ""),
              buildUpdateFn(element, className, attr)
            );

            translateToCssClass(null, element);
            linkFn = translateToCssClass;
          }

          return linkFn || angular.noop;
        }
      };
    }];
    function translateToCssClass(scope, element) {
      element.addClass(className);
    }
  }
  function updateClassWithValue(element, className) {
    var lastClass;

    return function updateClassFn(newValue) {
      var value = validateAttributeValue(className, newValue || "");
      if ( angular.isDefined(value) ) {
        if (lastClass) element.removeClass(lastClass);
        lastClass = !value ? className : className + "-" + value.replace(WHITESPACE, "-");
        element.addClass(lastClass);
      }
    };
  }
  function warnAttrNotSupported(className) {
    var parts = className.split("-");
    return ["$log", function($log) {
      $log.warn(className + "has been deprecated. Please use a `" + parts[0] + "-gt-<xxx>` variant.");
      return angular.noop;
    }];
  }
  function validateAttributeUsage(className, attr, element, $log){
    var message, usage, url;
    var nodeName = element[0].nodeName.toLowerCase();

    switch(className.replace(SUFFIXES,"")) {
      case "flex":
        if ((nodeName == "md-button") || (nodeName == "fieldset")){

          usage = "<" + nodeName + " " + className + "></" + nodeName + ">";
          url = "https://github.com/philipwalton/flexbugs#9-some-html-elements-cant-be-flex-containers";
          message = "Markup '{0}' may not work as expected in IE Browsers. Consult '{1}' for details.";

          $log.warn( $mdUtil.supplant(message, [usage, url]) );
        }
    }

  }
  function validateAttributeValue(className, value, updateFn) {
    var origValue = value;

    if (!needsInterpolation(value)) {
      switch (className.replace(SUFFIXES,"")) {
        case 'layout'        :
          if ( !findIn(value, LAYOUT_OPTIONS) ) {
            value = LAYOUT_OPTIONS[0];    // 'row';
          }
          break;

        case 'flex'          :
          if (!findIn(value, FLEX_OPTIONS)) {
            if (isNaN(value)) {
              value = '';
            }
          }
          break;

        case 'flex-offset' :
        case 'flex-order'    :
          if (!value || isNaN(+value)) {
            value = '0';
          }
          break;

        case 'layout-align'  :
          var axis = extractAlignAxis(value);
          value = $mdUtil.supplant("{main}-{cross}",axis);
          break;

        case 'layout-padding' :
        case 'layout-margin'  :
        case 'layout-fill'    :
        case 'layout-wrap'    :
        case 'layout-nowrap'  :
        case 'layout-nowrap' :
          value = '';
          break;
      }

      if (value != origValue) {
        (updateFn || angular.noop)(value);
      }
    }

    return value;
  }
  function buildUpdateFn(element, className, attrs) {
    return function updateAttrValue(fallback) {
      if (!needsInterpolation(fallback)) {
        attrs[attrs.$normalize(className)] = fallback;
      }
    };
  }
  function needsInterpolation(value) {
    return (value || "").indexOf($interpolate.startSymbol()) > -1;
  }

  function getNormalizedAttrValue(className, attrs, defaultVal) {
    var normalizedAttr = attrs.$normalize(className);
    return attrs[normalizedAttr] ? attrs[normalizedAttr].replace(WHITESPACE, "-") : defaultVal || null;
  }

  function findIn(item, list, replaceWith) {
    item = replaceWith && item ? item.replace(WHITESPACE, replaceWith) : item;

    var found = false;
    if (item) {
      list.forEach(function(it) {
        it = replaceWith ? it.replace(WHITESPACE, replaceWith) : it;
        found = found || (it === item);
      });
    }
    return found;
  }

  function extractAlignAxis(attrValue) {
    var axis = {
      main : "start",
      cross: "stretch"
    }, values;

    attrValue = (attrValue || "");

    if ( attrValue.indexOf("-") === 0 || attrValue.indexOf(" ") === 0) {
      attrValue = "none" + attrValue;
    }

    values = attrValue.toLowerCase().trim().replace(WHITESPACE, "-").split("-");
    if ( values.length && (values[0] === "space") ) {
      values = [ values[0]+"-"+values[1],values[2] ];
    }

    if ( values.length > 0 ) axis.main  = values[0] || axis.main;
    if ( values.length > 1 ) axis.cross = values[1] || axis.cross;

    if ( ALIGNMENT_MAIN_AXIS.indexOf(axis.main) < 0 )   axis.main = "start";
    if ( ALIGNMENT_CROSS_AXIS.indexOf(axis.cross) < 0 ) axis.cross = "stretch";

    return axis;
  }


})();

})();
(function(){
"use strict";
angular.module('material.core.meta', [])
  .provider('$$mdMeta', function () {
    var head = angular.element(document.head);
    var metaElements = {};
    function mapExistingElement(name) {
      if (metaElements[name]) {
        return true;
      }

      var element = document.getElementsByName(name)[0];

      if (!element) {
        return false;
      }

      metaElements[name] = angular.element(element);

      return true;
    }
    function setMeta(name, content) {
      mapExistingElement(name);

      if (!metaElements[name]) {
        var newMeta = angular.element('<meta name="' + name + '" content="' + content + '"/>');
        head.append(newMeta);
        metaElements[name] = newMeta;
      }
      else {
        metaElements[name].attr('content', content);
      }

      return function () {
        metaElements[name].attr('content', '');
        metaElements[name].remove();
        delete metaElements[name];
      };
    }
    function getMeta(name) {
      if (!mapExistingElement(name)) {
        throw Error('$$mdMeta: could not find a meta tag with the name \'' + name + '\'');
      }

      return metaElements[name].attr('content');
    }

    var module = {
      setMeta: setMeta,
      getMeta: getMeta
    };

    return angular.extend({}, module, {
      $get: function () {
        return module;
      }
    });
  });
})();
(function(){
"use strict";
  ComponentRegistry.$inject = ["$log", "$q"];
  angular.module('material.core')
    .factory('$mdComponentRegistry', ComponentRegistry);
  function ComponentRegistry($log, $q) {

    var self;
    var instances = [ ];
    var pendings = { };

    return self = {
      notFoundError: function(handle, msgContext) {
        $log.error( (msgContext || "") + 'No instance found for handle', handle);
      },
      getInstances: function() {
        return instances;
      },
      get: function(handle) {
        if ( !isValidID(handle) ) return null;

        var i, j, instance;
        for(i = 0, j = instances.length; i < j; i++) {
          instance = instances[i];
          if(instance.$$mdHandle === handle) {
            return instance;
          }
        }
        return null;
      },
      register: function(instance, handle) {
        if ( !handle ) return angular.noop;

        instance.$$mdHandle = handle;
        instances.push(instance);
        resolveWhen();

        return deregister;
        function deregister() {
          var index = instances.indexOf(instance);
          if (index !== -1) {
            instances.splice(index, 1);
          }
        }
        function resolveWhen() {
          var dfd = pendings[handle];
          if ( dfd ) {
            dfd.forEach(function (promise) {
              promise.resolve(instance);
            });
            delete pendings[handle];
          }
        }
      },
      when : function(handle) {
        if ( isValidID(handle) ) {
          var deferred = $q.defer();
          var instance = self.get(handle);

          if ( instance )  {
            deferred.resolve( instance );
          } else {
            if (pendings[handle] === undefined) {
              pendings[handle] = [];
            }
            pendings[handle].push(deferred);
          }

          return deferred.promise;
        }
        return $q.reject("Invalid `md-component-id` value.");
      }

    };

    function isValidID(handle){
      return handle && (handle !== "");
    }

  }

})();
(function(){
"use strict";

(function() {
  'use strict';

  MdButtonInkRipple.$inject = ["$mdInkRipple"];
  angular.module('material.core')
    .factory('$mdButtonInkRipple', MdButtonInkRipple);

  function MdButtonInkRipple($mdInkRipple) {
    return {
      attach: function attachRipple(scope, element, options) {
        options = angular.extend(optionsForElement(element), options);

        return $mdInkRipple.attach(scope, element, options);
      }
    };

    function optionsForElement(element) {
      if (element.hasClass('md-icon-button')) {
        return {
          isMenuItem: element.hasClass('md-menu-item'),
          fitRipple: true,
          center: true
        };
      } else {
        return {
          isMenuItem: element.hasClass('md-menu-item'),
          dimBackground: true
        }
      }
    };
  };
})();

})();
(function(){
"use strict";

(function() {
  'use strict';

  MdCheckboxInkRipple.$inject = ["$mdInkRipple"];
  angular.module('material.core')
    .factory('$mdCheckboxInkRipple', MdCheckboxInkRipple);

  function MdCheckboxInkRipple($mdInkRipple) {
    return {
      attach: attach
    };

    function attach(scope, element, options) {
      return $mdInkRipple.attach(scope, element, angular.extend({
        center: true,
        dimBackground: false,
        fitRipple: true
      }, options));
    };
  };
})();

})();
(function(){
"use strict";

(function() {
  'use strict';

  MdListInkRipple.$inject = ["$mdInkRipple"];
  angular.module('material.core')
    .factory('$mdListInkRipple', MdListInkRipple);

  function MdListInkRipple($mdInkRipple) {
    return {
      attach: attach
    };

    function attach(scope, element, options) {
      return $mdInkRipple.attach(scope, element, angular.extend({
        center: false,
        dimBackground: true,
        outline: false,
        rippleSize: 'full'
      }, options));
    };
  };
})();

})();
(function(){
"use strict";
InkRippleCtrl.$inject = ["$scope", "$element", "rippleOptions", "$window", "$timeout", "$mdUtil", "$mdColorUtil"];
InkRippleDirective.$inject = ["$mdButtonInkRipple", "$mdCheckboxInkRipple"];
angular.module('material.core')
    .provider('$mdInkRipple', InkRippleProvider)
    .directive('mdInkRipple', InkRippleDirective)
    .directive('mdNoInk', attrNoDirective)
    .directive('mdNoBar', attrNoDirective)
    .directive('mdNoStretch', attrNoDirective);

var DURATION = 450;
function InkRippleDirective ($mdButtonInkRipple, $mdCheckboxInkRipple) {
  return {
    controller: angular.noop,
    link:       function (scope, element, attr) {
      attr.hasOwnProperty('mdInkRippleCheckbox')
          ? $mdCheckboxInkRipple.attach(scope, element)
          : $mdButtonInkRipple.attach(scope, element);
    }
  };
}

function InkRippleProvider () {
  var isDisabledGlobally = false;

  return {
    disableInkRipple: disableInkRipple,
    $get: ["$injector", function($injector) {
      return { attach: attach };
      function attach (scope, element, options) {
        if (isDisabledGlobally || element.controller('mdNoInk')) return angular.noop;
        return $injector.instantiate(InkRippleCtrl, {
          $scope:        scope,
          $element:      element,
          rippleOptions: options
        });
      }
    }]
  };
  function disableInkRipple () {
    isDisabledGlobally = true;
  }
}
function InkRippleCtrl ($scope, $element, rippleOptions, $window, $timeout, $mdUtil, $mdColorUtil) {
  this.$window    = $window;
  this.$timeout   = $timeout;
  this.$mdUtil    = $mdUtil;
  this.$mdColorUtil    = $mdColorUtil;
  this.$scope     = $scope;
  this.$element   = $element;
  this.options    = rippleOptions;
  this.mousedown  = false;
  this.ripples    = [];
  this.timeout    = null; // Stores a reference to the most-recent ripple timeout
  this.lastRipple = null;

  $mdUtil.valueOnUse(this, 'container', this.createContainer);

  this.$element.addClass('md-ink-ripple');
  ($element.controller('mdInkRipple') || {}).createRipple = angular.bind(this, this.createRipple);
  ($element.controller('mdInkRipple') || {}).setColor = angular.bind(this, this.color);

  this.bindEvents();
}
function autoCleanup (self, cleanupFn) {

  if ( self.mousedown || self.lastRipple ) {
    self.mousedown = false;
    self.$mdUtil.nextTick( angular.bind(self, cleanupFn), false);
  }

}
InkRippleCtrl.prototype.color = function (value) {
  var self = this;
  if (angular.isDefined(value)) {
    self._color = self._parseColor(value);
  }
  return self._color || self._parseColor( self.inkRipple() ) || self._parseColor( getElementColor() );
  function getElementColor () {
    var items = self.options && self.options.colorElement ? self.options.colorElement : [];
    var elem =  items.length ? items[ 0 ] : self.$element[ 0 ];

    return elem ? self.$window.getComputedStyle(elem).color : 'rgb(0,0,0)';
  }
};
InkRippleCtrl.prototype.calculateColor = function () {
  return this.color();
};

InkRippleCtrl.prototype._parseColor = function parseColor (color, multiplier) {
  multiplier = multiplier || 1;
  var colorUtil = this.$mdColorUtil;

  if (!color) return;
  if (color.indexOf('rgba') === 0) return color.replace(/\d?\.?\d*\s*\)\s*$/, (0.1 * multiplier).toString() + ')');
  if (color.indexOf('rgb') === 0) return colorUtil.rgbToRgba(color);
  if (color.indexOf('#') === 0) return colorUtil.hexToRgba(color);

};
InkRippleCtrl.prototype.bindEvents = function () {
  this.$element.on('mousedown', angular.bind(this, this.handleMousedown));
  this.$element.on('mouseup touchend', angular.bind(this, this.handleMouseup));
  this.$element.on('mouseleave', angular.bind(this, this.handleMouseup));
  this.$element.on('touchmove', angular.bind(this, this.handleTouchmove));
};
InkRippleCtrl.prototype.handleMousedown = function (event) {
  if ( this.mousedown ) return;
  if (event.hasOwnProperty('originalEvent')) event = event.originalEvent;
  this.mousedown = true;
  if (this.options.center) {
    this.createRipple(this.container.prop('clientWidth') / 2, this.container.prop('clientWidth') / 2);
  } else {
    if (event.srcElement !== this.$element[0]) {
      var layerRect = this.$element[0].getBoundingClientRect();
      var layerX = event.clientX - layerRect.left;
      var layerY = event.clientY - layerRect.top;

      this.createRipple(layerX, layerY);
    } else {
      this.createRipple(event.offsetX, event.offsetY);
    }
  }
};
InkRippleCtrl.prototype.handleMouseup = function () {
  autoCleanup(this, this.clearRipples);
};
InkRippleCtrl.prototype.handleTouchmove = function () {
  autoCleanup(this, this.deleteRipples);
};
InkRippleCtrl.prototype.deleteRipples = function () {
  for (var i = 0; i < this.ripples.length; i++) {
    this.ripples[ i ].remove();
  }
};
InkRippleCtrl.prototype.clearRipples = function () {
  for (var i = 0; i < this.ripples.length; i++) {
    this.fadeInComplete(this.ripples[ i ]);
  }
};
InkRippleCtrl.prototype.createContainer = function () {
  var container = angular.element('<div class="md-ripple-container"></div>');
  this.$element.append(container);
  return container;
};

InkRippleCtrl.prototype.clearTimeout = function () {
  if (this.timeout) {
    this.$timeout.cancel(this.timeout);
    this.timeout = null;
  }
};

InkRippleCtrl.prototype.isRippleAllowed = function () {
  var element = this.$element[0];
  do {
    if (!element.tagName || element.tagName === 'BODY') break;

    if (element && angular.isFunction(element.hasAttribute)) {
      if (element.hasAttribute('disabled')) return false;
      if (this.inkRipple() === 'false' || this.inkRipple() === '0') return false;
    }

  } while (element = element.parentNode);
  return true;
};
InkRippleCtrl.prototype.inkRipple = function () {
  return this.$element.attr('md-ink-ripple');
};
InkRippleCtrl.prototype.createRipple = function (left, top) {
  if (!this.isRippleAllowed()) return;

  var ctrl        = this;
  var colorUtil   = ctrl.$mdColorUtil;
  var ripple      = angular.element('<div class="md-ripple"></div>');
  var width       = this.$element.prop('clientWidth');
  var height      = this.$element.prop('clientHeight');
  var x           = Math.max(Math.abs(width - left), left) * 2;
  var y           = Math.max(Math.abs(height - top), top) * 2;
  var size        = getSize(this.options.fitRipple, x, y);
  var color       = this.calculateColor();

  ripple.css({
    left:            left + 'px',
    top:             top + 'px',
    background:      'black',
    width:           size + 'px',
    height:          size + 'px',
    backgroundColor: colorUtil.rgbaToRgb(color),
    borderColor:     colorUtil.rgbaToRgb(color)
  });
  this.lastRipple = ripple;
  this.clearTimeout();
  this.timeout    = this.$timeout(function () {
    ctrl.clearTimeout();
    if (!ctrl.mousedown) ctrl.fadeInComplete(ripple);
  }, DURATION * 0.35, false);

  if (this.options.dimBackground) this.container.css({ backgroundColor: color });
  this.container.append(ripple);
  this.ripples.push(ripple);
  ripple.addClass('md-ripple-placed');

  this.$mdUtil.nextTick(function () {

    ripple.addClass('md-ripple-scaled md-ripple-active');
    ctrl.$timeout(function () {
      ctrl.clearRipples();
    }, DURATION, false);

  }, false);

  function getSize (fit, x, y) {
    return fit
        ? Math.max(x, y)
        : Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }
};
InkRippleCtrl.prototype.fadeInComplete = function (ripple) {
  if (this.lastRipple === ripple) {
    if (!this.timeout && !this.mousedown) {
      this.removeRipple(ripple);
    }
  } else {
    this.removeRipple(ripple);
  }
};
InkRippleCtrl.prototype.removeRipple = function (ripple) {
  var ctrl  = this;
  var index = this.ripples.indexOf(ripple);
  if (index < 0) return;
  this.ripples.splice(this.ripples.indexOf(ripple), 1);
  ripple.removeClass('md-ripple-active');
  ripple.addClass('md-ripple-remove');
  if (this.ripples.length === 0) this.container.css({ backgroundColor: '' });
  this.$timeout(function () {
    ctrl.fadeOutComplete(ripple);
  }, DURATION, false);
};
InkRippleCtrl.prototype.fadeOutComplete = function (ripple) {
  ripple.remove();
  this.lastRipple = null;
};
function attrNoDirective () {
  return { controller: angular.noop };
}

})();
(function(){
"use strict";

(function() {
  'use strict';

  MdTabInkRipple.$inject = ["$mdInkRipple"];
  angular.module('material.core')
    .factory('$mdTabInkRipple', MdTabInkRipple);

  function MdTabInkRipple($mdInkRipple) {
    return {
      attach: attach
    };

    function attach(scope, element, options) {
      return $mdInkRipple.attach(scope, element, angular.extend({
        center: false,
        dimBackground: true,
        outline: false,
        rippleSize: 'full'
      }, options));
    };
  };
})();

})();
(function(){
"use strict";

angular.module('material.core.theming.palette', [])
.constant('$mdColorPalette', {
  'red': {
    '50': '#ffebee',
    '100': '#ffcdd2',
    '200': '#ef9a9a',
    '300': '#e57373',
    '400': '#ef5350',
    '500': '#f44336',
    '600': '#e53935',
    '700': '#d32f2f',
    '800': '#c62828',
    '900': '#b71c1c',
    'A100': '#ff8a80',
    'A200': '#ff5252',
    'A400': '#ff1744',
    'A700': '#d50000',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 A100',
    'contrastStrongLightColors': '400 500 600 700 A200 A400 A700'
  },
  'pink': {
    '50': '#fce4ec',
    '100': '#f8bbd0',
    '200': '#f48fb1',
    '300': '#f06292',
    '400': '#ec407a',
    '500': '#e91e63',
    '600': '#d81b60',
    '700': '#c2185b',
    '800': '#ad1457',
    '900': '#880e4f',
    'A100': '#ff80ab',
    'A200': '#ff4081',
    'A400': '#f50057',
    'A700': '#c51162',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100',
    'contrastStrongLightColors': '500 600 A200 A400 A700'
  },
  'purple': {
    '50': '#f3e5f5',
    '100': '#e1bee7',
    '200': '#ce93d8',
    '300': '#ba68c8',
    '400': '#ab47bc',
    '500': '#9c27b0',
    '600': '#8e24aa',
    '700': '#7b1fa2',
    '800': '#6a1b9a',
    '900': '#4a148c',
    'A100': '#ea80fc',
    'A200': '#e040fb',
    'A400': '#d500f9',
    'A700': '#aa00ff',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100',
    'contrastStrongLightColors': '300 400 A200 A400 A700'
  },
  'deep-purple': {
    '50': '#ede7f6',
    '100': '#d1c4e9',
    '200': '#b39ddb',
    '300': '#9575cd',
    '400': '#7e57c2',
    '500': '#673ab7',
    '600': '#5e35b1',
    '700': '#512da8',
    '800': '#4527a0',
    '900': '#311b92',
    'A100': '#b388ff',
    'A200': '#7c4dff',
    'A400': '#651fff',
    'A700': '#6200ea',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100',
    'contrastStrongLightColors': '300 400 A200'
  },
  'indigo': {
    '50': '#e8eaf6',
    '100': '#c5cae9',
    '200': '#9fa8da',
    '300': '#7986cb',
    '400': '#5c6bc0',
    '500': '#3f51b5',
    '600': '#3949ab',
    '700': '#303f9f',
    '800': '#283593',
    '900': '#1a237e',
    'A100': '#8c9eff',
    'A200': '#536dfe',
    'A400': '#3d5afe',
    'A700': '#304ffe',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100',
    'contrastStrongLightColors': '300 400 A200 A400'
  },
  'blue': {
    '50': '#e3f2fd',
    '100': '#bbdefb',
    '200': '#90caf9',
    '300': '#64b5f6',
    '400': '#42a5f5',
    '500': '#2196f3',
    '600': '#1e88e5',
    '700': '#1976d2',
    '800': '#1565c0',
    '900': '#0d47a1',
    'A100': '#82b1ff',
    'A200': '#448aff',
    'A400': '#2979ff',
    'A700': '#2962ff',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 400 A100',
    'contrastStrongLightColors': '500 600 700 A200 A400 A700'
  },
  'light-blue': {
    '50': '#e1f5fe',
    '100': '#b3e5fc',
    '200': '#81d4fa',
    '300': '#4fc3f7',
    '400': '#29b6f6',
    '500': '#03a9f4',
    '600': '#039be5',
    '700': '#0288d1',
    '800': '#0277bd',
    '900': '#01579b',
    'A100': '#80d8ff',
    'A200': '#40c4ff',
    'A400': '#00b0ff',
    'A700': '#0091ea',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '600 700 800 900 A700',
    'contrastStrongLightColors': '600 700 800 A700'
  },
  'cyan': {
    '50': '#e0f7fa',
    '100': '#b2ebf2',
    '200': '#80deea',
    '300': '#4dd0e1',
    '400': '#26c6da',
    '500': '#00bcd4',
    '600': '#00acc1',
    '700': '#0097a7',
    '800': '#00838f',
    '900': '#006064',
    'A100': '#84ffff',
    'A200': '#18ffff',
    'A400': '#00e5ff',
    'A700': '#00b8d4',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '700 800 900',
    'contrastStrongLightColors': '700 800 900'
  },
  'teal': {
    '50': '#e0f2f1',
    '100': '#b2dfdb',
    '200': '#80cbc4',
    '300': '#4db6ac',
    '400': '#26a69a',
    '500': '#009688',
    '600': '#00897b',
    '700': '#00796b',
    '800': '#00695c',
    '900': '#004d40',
    'A100': '#a7ffeb',
    'A200': '#64ffda',
    'A400': '#1de9b6',
    'A700': '#00bfa5',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '500 600 700 800 900',
    'contrastStrongLightColors': '500 600 700'
  },
  'green': {
    '50': '#e8f5e9',
    '100': '#c8e6c9',
    '200': '#a5d6a7',
    '300': '#81c784',
    '400': '#66bb6a',
    '500': '#4caf50',
    '600': '#43a047',
    '700': '#388e3c',
    '800': '#2e7d32',
    '900': '#1b5e20',
    'A100': '#b9f6ca',
    'A200': '#69f0ae',
    'A400': '#00e676',
    'A700': '#00c853',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '500 600 700 800 900',
    'contrastStrongLightColors': '500 600 700'
  },
  'light-green': {
    '50': '#f1f8e9',
    '100': '#dcedc8',
    '200': '#c5e1a5',
    '300': '#aed581',
    '400': '#9ccc65',
    '500': '#8bc34a',
    '600': '#7cb342',
    '700': '#689f38',
    '800': '#558b2f',
    '900': '#33691e',
    'A100': '#ccff90',
    'A200': '#b2ff59',
    'A400': '#76ff03',
    'A700': '#64dd17',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '700 800 900',
    'contrastStrongLightColors': '700 800 900'
  },
  'lime': {
    '50': '#f9fbe7',
    '100': '#f0f4c3',
    '200': '#e6ee9c',
    '300': '#dce775',
    '400': '#d4e157',
    '500': '#cddc39',
    '600': '#c0ca33',
    '700': '#afb42b',
    '800': '#9e9d24',
    '900': '#827717',
    'A100': '#f4ff81',
    'A200': '#eeff41',
    'A400': '#c6ff00',
    'A700': '#aeea00',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '900',
    'contrastStrongLightColors': '900'
  },
  'yellow': {
    '50': '#fffde7',
    '100': '#fff9c4',
    '200': '#fff59d',
    '300': '#fff176',
    '400': '#ffee58',
    '500': '#ffeb3b',
    '600': '#fdd835',
    '700': '#fbc02d',
    '800': '#f9a825',
    '900': '#f57f17',
    'A100': '#ffff8d',
    'A200': '#ffff00',
    'A400': '#ffea00',
    'A700': '#ffd600',
    'contrastDefaultColor': 'dark'
  },
  'amber': {
    '50': '#fff8e1',
    '100': '#ffecb3',
    '200': '#ffe082',
    '300': '#ffd54f',
    '400': '#ffca28',
    '500': '#ffc107',
    '600': '#ffb300',
    '700': '#ffa000',
    '800': '#ff8f00',
    '900': '#ff6f00',
    'A100': '#ffe57f',
    'A200': '#ffd740',
    'A400': '#ffc400',
    'A700': '#ffab00',
    'contrastDefaultColor': 'dark'
  },
  'orange': {
    '50': '#fff3e0',
    '100': '#ffe0b2',
    '200': '#ffcc80',
    '300': '#ffb74d',
    '400': '#ffa726',
    '500': '#ff9800',
    '600': '#fb8c00',
    '700': '#f57c00',
    '800': '#ef6c00',
    '900': '#e65100',
    'A100': '#ffd180',
    'A200': '#ffab40',
    'A400': '#ff9100',
    'A700': '#ff6d00',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '800 900',
    'contrastStrongLightColors': '800 900'
  },
  'deep-orange': {
    '50': '#fbe9e7',
    '100': '#ffccbc',
    '200': '#ffab91',
    '300': '#ff8a65',
    '400': '#ff7043',
    '500': '#ff5722',
    '600': '#f4511e',
    '700': '#e64a19',
    '800': '#d84315',
    '900': '#bf360c',
    'A100': '#ff9e80',
    'A200': '#ff6e40',
    'A400': '#ff3d00',
    'A700': '#dd2c00',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 400 A100 A200',
    'contrastStrongLightColors': '500 600 700 800 900 A400 A700'
  },
  'brown': {
    '50': '#efebe9',
    '100': '#d7ccc8',
    '200': '#bcaaa4',
    '300': '#a1887f',
    '400': '#8d6e63',
    '500': '#795548',
    '600': '#6d4c41',
    '700': '#5d4037',
    '800': '#4e342e',
    '900': '#3e2723',
    'A100': '#d7ccc8',
    'A200': '#bcaaa4',
    'A400': '#8d6e63',
    'A700': '#5d4037',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100 A200',
    'contrastStrongLightColors': '300 400'
  },
  'grey': {
    '50': '#fafafa',
    '100': '#f5f5f5',
    '200': '#eeeeee',
    '300': '#e0e0e0',
    '400': '#bdbdbd',
    '500': '#9e9e9e',
    '600': '#757575',
    '700': '#616161',
    '800': '#424242',
    '900': '#212121',
    'A100': '#ffffff',
    'A200': '#000000',
    'A400': '#303030',
    'A700': '#616161',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '600 700 800 900 A200 A400 A700'
  },
  'blue-grey': {
    '50': '#eceff1',
    '100': '#cfd8dc',
    '200': '#b0bec5',
    '300': '#90a4ae',
    '400': '#78909c',
    '500': '#607d8b',
    '600': '#546e7a',
    '700': '#455a64',
    '800': '#37474f',
    '900': '#263238',
    'A100': '#cfd8dc',
    'A200': '#b0bec5',
    'A400': '#78909c',
    'A700': '#455a64',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 A100 A200',
    'contrastStrongLightColors': '400 500 700'
  }
});

})();
(function(){
"use strict";

(function(angular) {
  'use strict';
detectDisabledThemes.$inject = ["$mdThemingProvider"];
ThemingDirective.$inject = ["$mdTheming", "$interpolate", "$log"];
ThemableDirective.$inject = ["$mdTheming"];
ThemingProvider.$inject = ["$mdColorPalette", "$$mdMetaProvider"];
generateAllThemes.$inject = ["$injector", "$mdTheming"];
angular.module('material.core.theming', ['material.core.theming.palette', 'material.core.meta'])
  .directive('mdTheme', ThemingDirective)
  .directive('mdThemable', ThemableDirective)
  .directive('mdThemesDisabled', disableThemesDirective )
  .provider('$mdTheming', ThemingProvider)
  .config( detectDisabledThemes )
  .run(generateAllThemes);
function detectDisabledThemes($mdThemingProvider) {
  var isDisabled = !!document.querySelector('[md-themes-disabled]');
  $mdThemingProvider.disableTheming(isDisabled);
}
var GENERATED = { };
var PALETTES;
var DARK_FOREGROUND = {
  name: 'dark',
  '1': 'rgba(0,0,0,0.87)',
  '2': 'rgba(0,0,0,0.54)',
  '3': 'rgba(0,0,0,0.38)',
  '4': 'rgba(0,0,0,0.12)'
};
var LIGHT_FOREGROUND = {
  name: 'light',
  '1': 'rgba(255,255,255,1.0)',
  '2': 'rgba(255,255,255,0.7)',
  '3': 'rgba(255,255,255,0.5)',
  '4': 'rgba(255,255,255,0.12)'
};

var DARK_SHADOW = '1px 1px 0px rgba(0,0,0,0.4), -1px -1px 0px rgba(0,0,0,0.4)';
var LIGHT_SHADOW = '';

var DARK_CONTRAST_COLOR = colorToRgbaArray('rgba(0,0,0,0.87)');
var LIGHT_CONTRAST_COLOR = colorToRgbaArray('rgba(255,255,255,0.87)');
var STRONG_LIGHT_CONTRAST_COLOR = colorToRgbaArray('rgb(255,255,255)');

var THEME_COLOR_TYPES = ['primary', 'accent', 'warn', 'background'];
var DEFAULT_COLOR_TYPE = 'primary';
var LIGHT_DEFAULT_HUES = {
  'accent': {
    'default': 'A200',
    'hue-1': 'A100',
    'hue-2': 'A400',
    'hue-3': 'A700'
  },
  'background': {
    'default': '50',
    'hue-1': 'A100',
    'hue-2': '100',
    'hue-3': '300'
  }
};

var DARK_DEFAULT_HUES = {
  'background': {
    'default': 'A400',
    'hue-1': '800',
    'hue-2': '900',
    'hue-3': 'A200'
  }
};
THEME_COLOR_TYPES.forEach(function(colorType) {
  var defaultDefaultHues = {
    'default': '500',
    'hue-1': '300',
    'hue-2': '800',
    'hue-3': 'A100'
  };
  if (!LIGHT_DEFAULT_HUES[colorType]) LIGHT_DEFAULT_HUES[colorType] = defaultDefaultHues;
  if (!DARK_DEFAULT_HUES[colorType]) DARK_DEFAULT_HUES[colorType] = defaultDefaultHues;
});

var VALID_HUE_VALUES = [
  '50', '100', '200', '300', '400', '500', '600',
  '700', '800', '900', 'A100', 'A200', 'A400', 'A700'
];

var themeConfig = {
  disableTheming : false,   // Generate our themes at run time; also disable stylesheet DOM injection
  generateOnDemand : false, // Whether or not themes are to be generated on-demand (vs. eagerly).
  registeredStyles : [],    // Custom styles registered to be used in the theming of custom components.
  nonce : null              // Nonce to be added as an attribute to the generated themes style tags.
};
function ThemingProvider($mdColorPalette, $$mdMetaProvider) {
  ThemingService.$inject = ["$rootScope", "$log"];
  PALETTES = { };
  var THEMES = { };

  var themingProvider;

  var alwaysWatchTheme = false;
  var defaultTheme = 'default';
  angular.extend(PALETTES, $mdColorPalette);
  var setBrowserColor = function (color) {
    var removeChrome = $$mdMetaProvider.setMeta('theme-color', color);
    var removeWindows = $$mdMetaProvider.setMeta('msapplication-navbutton-color', color);

    return function () {
      removeChrome();
      removeWindows();
    }
  };
  var enableBrowserColor = function (options) {
    options = angular.isObject(options) ? options : {};

    var theme = options.theme || 'default';
    var hue = options.hue || '800';

    var palette = PALETTES[options.palette] ||
      PALETTES[THEMES[theme].colors[options.palette || 'primary'].name];

    var color = angular.isObject(palette[hue]) ? palette[hue].hex : palette[hue];

    return setBrowserColor(color);
  };

  return themingProvider = {
    definePalette: definePalette,
    extendPalette: extendPalette,
    theme: registerTheme,
    configuration : function() {
      return angular.extend( { }, themeConfig, {
        defaultTheme : defaultTheme,
        alwaysWatchTheme : alwaysWatchTheme,
        registeredStyles : [].concat(themeConfig.registeredStyles)
      });
    },
    disableTheming: function(isDisabled) {
      themeConfig.disableTheming = angular.isUndefined(isDisabled) || !!isDisabled;
    },

    registerStyles: function(styles) {
      themeConfig.registeredStyles.push(styles);
    },

    setNonce: function(nonceValue) {
      themeConfig.nonce = nonceValue;
    },

    generateThemesOnDemand: function(onDemand) {
      themeConfig.generateOnDemand = onDemand;
    },

    setDefaultTheme: function(theme) {
      defaultTheme = theme;
    },

    alwaysWatchTheme: function(alwaysWatch) {
      alwaysWatchTheme = alwaysWatch;
    },

    enableBrowserColor: enableBrowserColor,

    $get: ThemingService,
    _LIGHT_DEFAULT_HUES: LIGHT_DEFAULT_HUES,
    _DARK_DEFAULT_HUES: DARK_DEFAULT_HUES,
    _PALETTES: PALETTES,
    _THEMES: THEMES,
    _parseRules: parseRules,
    _rgba: rgba
  };
  function definePalette(name, map) {
    map = map || {};
    PALETTES[name] = checkPaletteValid(name, map);
    return themingProvider;
  }
  function extendPalette(name, map) {
    return checkPaletteValid(name,  angular.extend({}, PALETTES[name] || {}, map) );
  }
  function checkPaletteValid(name, map) {
    var missingColors = VALID_HUE_VALUES.filter(function(field) {
      return !map[field];
    });
    if (missingColors.length) {
      throw new Error("Missing colors %1 in palette %2!"
                      .replace('%1', missingColors.join(', '))
                      .replace('%2', name));
    }

    return map;
  }
  function registerTheme(name, inheritFrom) {
    if (THEMES[name]) return THEMES[name];

    inheritFrom = inheritFrom || 'default';

    var parentTheme = typeof inheritFrom === 'string' ? THEMES[inheritFrom] : inheritFrom;
    var theme = new Theme(name);

    if (parentTheme) {
      angular.forEach(parentTheme.colors, function(color, colorType) {
        theme.colors[colorType] = {
          name: color.name,
          hues: angular.extend({}, color.hues)
        };
      });
    }
    THEMES[name] = theme;

    return theme;
  }

  function Theme(name) {
    var self = this;
    self.name = name;
    self.colors = {};

    self.dark = setDark;
    setDark(false);

    function setDark(isDark) {
      isDark = arguments.length === 0 ? true : !!isDark;
      if (isDark === self.isDark) return;

      self.isDark = isDark;

      self.foregroundPalette = self.isDark ? LIGHT_FOREGROUND : DARK_FOREGROUND;
      self.foregroundShadow = self.isDark ? DARK_SHADOW : LIGHT_SHADOW;
      var newDefaultHues = self.isDark ? DARK_DEFAULT_HUES : LIGHT_DEFAULT_HUES;
      var oldDefaultHues = self.isDark ? LIGHT_DEFAULT_HUES : DARK_DEFAULT_HUES;
      angular.forEach(newDefaultHues, function(newDefaults, colorType) {
        var color = self.colors[colorType];
        var oldDefaults = oldDefaultHues[colorType];
        if (color) {
          for (var hueName in color.hues) {
            if (color.hues[hueName] === oldDefaults[hueName]) {
              color.hues[hueName] = newDefaults[hueName];
            }
          }
        }
      });

      return self;
    }

    THEME_COLOR_TYPES.forEach(function(colorType) {
      var defaultHues = (self.isDark ? DARK_DEFAULT_HUES : LIGHT_DEFAULT_HUES)[colorType];
      self[colorType + 'Palette'] = function setPaletteType(paletteName, hues) {
        var color = self.colors[colorType] = {
          name: paletteName,
          hues: angular.extend({}, defaultHues, hues)
        };

        Object.keys(color.hues).forEach(function(name) {
          if (!defaultHues[name]) {
            throw new Error("Invalid hue name '%1' in theme %2's %3 color %4. Available hue names: %4"
              .replace('%1', name)
              .replace('%2', self.name)
              .replace('%3', paletteName)
              .replace('%4', Object.keys(defaultHues).join(', '))
            );
          }
        });
        Object.keys(color.hues).map(function(key) {
          return color.hues[key];
        }).forEach(function(hueValue) {
          if (VALID_HUE_VALUES.indexOf(hueValue) == -1) {
            throw new Error("Invalid hue value '%1' in theme %2's %3 color %4. Available hue values: %5"
              .replace('%1', hueValue)
              .replace('%2', self.name)
              .replace('%3', colorType)
              .replace('%4', paletteName)
              .replace('%5', VALID_HUE_VALUES.join(', '))
            );
          }
        });
        return self;
      };

      self[colorType + 'Color'] = function() {
        var args = Array.prototype.slice.call(arguments);
        console.warn('$mdThemingProviderTheme.' + colorType + 'Color() has been deprecated. ' +
                     'Use $mdThemingProviderTheme.' + colorType + 'Palette() instead.');
        return self[colorType + 'Palette'].apply(self, args);
      };
    });
  }
  function ThemingService($rootScope, $log) {
    var applyTheme = function (scope, el) {
          if (el === undefined) { el = scope; scope = undefined; }
          if (scope === undefined) { scope = $rootScope; }
          applyTheme.inherit(el, el);
        };

    applyTheme.THEMES = angular.extend({}, THEMES);
    applyTheme.PALETTES = angular.extend({}, PALETTES);
    applyTheme.inherit = inheritTheme;
    applyTheme.registered = registered;
    applyTheme.defaultTheme = function() { return defaultTheme; };
    applyTheme.generateTheme = function(name) { generateTheme(THEMES[name], name, themeConfig.nonce); };
    applyTheme.setBrowserColor = enableBrowserColor;

    return applyTheme;
    function registered(themeName) {
      if (themeName === undefined || themeName === '') return true;
      return applyTheme.THEMES[themeName] !== undefined;
    }
    function inheritTheme (el, parent) {
      var ctrl = parent.controller('mdTheme');
      var attrThemeValue = el.attr('md-theme-watch');
      var watchTheme = (alwaysWatchTheme || angular.isDefined(attrThemeValue)) && attrThemeValue != 'false';

      updateThemeClass(lookupThemeName());

      if ((alwaysWatchTheme && !registerChangeCallback()) || (!alwaysWatchTheme && watchTheme)) {
        el.on('$destroy', $rootScope.$watch(lookupThemeName, updateThemeClass) );
      }
      function lookupThemeName() {
        ctrl = parent.controller('mdTheme') || el.data('$mdThemeController');
        return ctrl && ctrl.$mdTheme || (defaultTheme == 'default' ? '' : defaultTheme);
      }
      function updateThemeClass(theme) {
        if (!theme) return;
        if (!registered(theme)) {
          $log.warn('Attempted to use unregistered theme \'' + theme + '\'. ' +
                    'Register it with $mdThemingProvider.theme().');
        }

        var oldTheme = el.data('$mdThemeName');
        if (oldTheme) el.removeClass('md-' + oldTheme +'-theme');
        el.addClass('md-' + theme + '-theme');
        el.data('$mdThemeName', theme);
        if (ctrl) {
          el.data('$mdThemeController', ctrl);
        }
      }
      function registerChangeCallback() {
        var parentController = parent.controller('mdTheme');
        if (!parentController) return false;
        el.on('$destroy', parentController.registerChanges( function() {
          updateThemeClass(lookupThemeName());
        }));
        return true;
      }
    }

  }
}

function ThemingDirective($mdTheming, $interpolate, $log) {
  return {
    priority: 100,
    link: {
      pre: function(scope, el, attrs) {
        var registeredCallbacks = [];
        var ctrl = {
          registerChanges: function (cb, context) {
            if (context) {
              cb = angular.bind(context, cb);
            }

            registeredCallbacks.push(cb);

            return function () {
              var index = registeredCallbacks.indexOf(cb);

              if (index > -1) {
                registeredCallbacks.splice(index, 1);
              }
            };
          },
          $setTheme: function (theme) {
            if (!$mdTheming.registered(theme)) {
              $log.warn('attempted to use unregistered theme \'' + theme + '\'');
            }
            ctrl.$mdTheme = theme;

            registeredCallbacks.forEach(function (cb) {
              cb();
            });
          }
        };
        el.data('$mdThemeController', ctrl);
        ctrl.$setTheme($interpolate(attrs.mdTheme)(scope));
        attrs.$observe('mdTheme', ctrl.$setTheme);
      }
    }
  };
}
function disableThemesDirective() {
  themeConfig.disableTheming = true;
  return {
    restrict : 'A',
    priority : '900'
  };
}

function ThemableDirective($mdTheming) {
  return $mdTheming;
}

function parseRules(theme, colorType, rules) {
  checkValidPalette(theme, colorType);

  rules = rules.replace(/THEME_NAME/g, theme.name);
  var generatedRules = [];
  var color = theme.colors[colorType];

  var themeNameRegex = new RegExp('\\.md-' + theme.name + '-theme', 'g');
  var hueRegex = new RegExp('(\'|")?{{\\s*(' + colorType + ')-(color|contrast)-?(\\d\\.?\\d*)?\\s*}}(\"|\')?','g');
  var simpleVariableRegex = /'?"?\{\{\s*([a-zA-Z]+)-(A?\d+|hue\-[0-3]|shadow|default)-?(\d\.?\d*)?(contrast)?\s*\}\}'?"?/g;
  var palette = PALETTES[color.name];
  rules = rules.replace(simpleVariableRegex, function(match, colorType, hue, opacity, contrast) {
    if (colorType === 'foreground') {
      if (hue == 'shadow') {
        return theme.foregroundShadow;
      } else {
        return theme.foregroundPalette[hue] || theme.foregroundPalette['1'];
      }
    }
    if (hue.indexOf('hue') === 0 || hue === 'default') {
      hue = theme.colors[colorType].hues[hue];
    }

    return rgba( (PALETTES[ theme.colors[colorType].name ][hue] || '')[contrast ? 'contrast' : 'value'], opacity );
  });
  angular.forEach(color.hues, function(hueValue, hueName) {
    var newRule = rules
      .replace(hueRegex, function(match, _, colorType, hueType, opacity) {
        return rgba(palette[hueValue][hueType === 'color' ? 'value' : 'contrast'], opacity);
      });
    if (hueName !== 'default') {
      newRule = newRule.replace(themeNameRegex, '.md-' + theme.name + '-theme.md-' + hueName);
    }
    if (theme.name == 'default') {
      var themeRuleRegex = /((?:(?:(?: |>|\.|\w|-|:|\(|\)|\[|\]|"|'|=)+) )?)((?:(?:\w|\.|-)+)?)\.md-default-theme((?: |>|\.|\w|-|:|\(|\)|\[|\]|"|'|=)*)/g;
      newRule = newRule.replace(themeRuleRegex, function(match, prefix, target, suffix) {
        return match + ', ' + prefix + target + suffix;
      });
    }
    generatedRules.push(newRule);
  });

  return generatedRules;
}

var rulesByType = {};
function generateAllThemes($injector, $mdTheming) {
  var head = document.head;
  var firstChild = head ? head.firstElementChild : null;
  var themeCss = !themeConfig.disableTheming && $injector.has('$MD_THEME_CSS') ? $injector.get('$MD_THEME_CSS') : '';
  themeCss += themeConfig.registeredStyles.join('');

  if ( !firstChild ) return;
  if (themeCss.length === 0) return; // no rules, so no point in running this expensive task
  angular.forEach(PALETTES, sanitizePalette);
  var rules = themeCss
                  .split(/\}(?!(\}|'|"|;))/)
                  .filter(function(rule) { return rule && rule.trim().length; })
                  .map(function(rule) { return rule.trim() + '}'; });


  var ruleMatchRegex = new RegExp('md-(' + THEME_COLOR_TYPES.join('|') + ')', 'g');

  THEME_COLOR_TYPES.forEach(function(type) {
    rulesByType[type] = '';
  });
  rules.forEach(function(rule) {
    var match = rule.match(ruleMatchRegex);
    for (var i = 0, type; type = THEME_COLOR_TYPES[i]; i++) {
      if (rule.indexOf('.md-' + type) > -1) {
        return rulesByType[type] += rule;
      }
    }
    for (i = 0; type = THEME_COLOR_TYPES[i]; i++) {
      if (rule.indexOf(type) > -1) {
        return rulesByType[type] += rule;
      }
    }
    return rulesByType[DEFAULT_COLOR_TYPE] += rule;
  });
  if (themeConfig.generateOnDemand) return;

  angular.forEach($mdTheming.THEMES, function(theme) {
    if (!GENERATED[theme.name] && !($mdTheming.defaultTheme() !== 'default' && theme.name === 'default')) {
      generateTheme(theme, theme.name, themeConfig.nonce);
    }
  });
  function sanitizePalette(palette, name) {
    var defaultContrast = palette.contrastDefaultColor;
    var lightColors = palette.contrastLightColors || [];
    var strongLightColors = palette.contrastStrongLightColors || [];
    var darkColors = palette.contrastDarkColors || [];
    if (typeof lightColors === 'string') lightColors = lightColors.split(' ');
    if (typeof strongLightColors === 'string') strongLightColors = strongLightColors.split(' ');
    if (typeof darkColors === 'string') darkColors = darkColors.split(' ');
    delete palette.contrastDefaultColor;
    delete palette.contrastLightColors;
    delete palette.contrastStrongLightColors;
    delete palette.contrastDarkColors;
    angular.forEach(palette, function(hueValue, hueName) {
      if (angular.isObject(hueValue)) return; // Already converted
      var rgbValue = colorToRgbaArray(hueValue);
      if (!rgbValue) {
        throw new Error("Color %1, in palette %2's hue %3, is invalid. Hex or rgb(a) color expected."
                        .replace('%1', hueValue)
                        .replace('%2', palette.name)
                        .replace('%3', hueName));
      }

      palette[hueName] = {
        hex: palette[hueName],
        value: rgbValue,
        contrast: getContrastColor()
      };
      function getContrastColor() {
        if (defaultContrast === 'light') {
          if (darkColors.indexOf(hueName) > -1) {
            return DARK_CONTRAST_COLOR;
          } else {
            return strongLightColors.indexOf(hueName) > -1 ? STRONG_LIGHT_CONTRAST_COLOR
              : LIGHT_CONTRAST_COLOR;
          }
        } else {
          if (lightColors.indexOf(hueName) > -1) {
            return strongLightColors.indexOf(hueName) > -1 ? STRONG_LIGHT_CONTRAST_COLOR
              : LIGHT_CONTRAST_COLOR;
          } else {
            return DARK_CONTRAST_COLOR;
          }
        }
      }
    });
  }
}

function generateTheme(theme, name, nonce) {
  var head = document.head;
  var firstChild = head ? head.firstElementChild : null;

  if (!GENERATED[name]) {
    THEME_COLOR_TYPES.forEach(function(colorType) {
      var styleStrings = parseRules(theme, colorType, rulesByType[colorType]);
      while (styleStrings.length) {
        var styleContent = styleStrings.shift();
        if (styleContent) {
          var style = document.createElement('style');
          style.setAttribute('md-theme-style', '');
          if (nonce) {
            style.setAttribute('nonce', nonce);
          }
          style.appendChild(document.createTextNode(styleContent));
          head.insertBefore(style, firstChild);
        }
      }
    });

    GENERATED[theme.name] = true;
  }

}


function checkValidPalette(theme, colorType) {
  if (!PALETTES[ (theme.colors[colorType] || {}).name ]) {
    throw new Error(
      "You supplied an invalid color palette for theme %1's %2 palette. Available palettes: %3"
                    .replace('%1', theme.name)
                    .replace('%2', colorType)
                    .replace('%3', Object.keys(PALETTES).join(', '))
    );
  }
}

function colorToRgbaArray(clr) {
  if (angular.isArray(clr) && clr.length == 3) return clr;
  if (/^rgb/.test(clr)) {
    return clr.replace(/(^\s*rgba?\(|\)\s*$)/g, '').split(',').map(function(value, i) {
      return i == 3 ? parseFloat(value, 10) : parseInt(value, 10);
    });
  }
  if (clr.charAt(0) == '#') clr = clr.substring(1);
  if (!/^([a-fA-F0-9]{3}){1,2}$/g.test(clr)) return;

  var dig = clr.length / 3;
  var red = clr.substr(0, dig);
  var grn = clr.substr(dig, dig);
  var blu = clr.substr(dig * 2);
  if (dig === 1) {
    red += red;
    grn += grn;
    blu += blu;
  }
  return [parseInt(red, 16), parseInt(grn, 16), parseInt(blu, 16)];
}

function rgba(rgbArray, opacity) {
  if ( !rgbArray ) return "rgb('0,0,0')";

  if (rgbArray.length == 4) {
    rgbArray = angular.copy(rgbArray);
    opacity ? rgbArray.pop() : opacity = rgbArray.pop();
  }
  return opacity && (typeof opacity == 'number' || (typeof opacity == 'string' && opacity.length)) ?
    'rgba(' + rgbArray.join(',') + ',' + opacity + ')' :
    'rgb(' + rgbArray.join(',') + ')';
}


})(window.angular);

})();
(function(){
"use strict";
angular
  .module('material.core')
  .factory('$$mdAnimate', ["$q", "$timeout", "$mdConstant", "$animateCss", function($q, $timeout, $mdConstant, $animateCss){

     return function($mdUtil) {
       return AnimateDomUtils( $mdUtil, $q, $timeout, $mdConstant, $animateCss);
     };
   }]);
function AnimateDomUtils($mdUtil, $q, $timeout, $mdConstant, $animateCss) {
  var self;
  return self = {
    translate3d : function( target, from, to, options ) {
      return $animateCss(target,{
        from:from,
        to:to,
        addClass:options.transitionInClass,
        removeClass:options.transitionOutClass
      })
      .start()
      .then(function(){
          return reverseTranslate;
      });
      function reverseTranslate (newFrom) {
        return $animateCss(target, {
           to: newFrom || from,
           addClass: options.transitionOutClass,
           removeClass: options.transitionInClass
        }).start();

      }
    },
    waitTransitionEnd: function (element, opts) {
      var TIMEOUT = 3000; // fallback is 3 secs

      return $q(function(resolve, reject){
        opts = opts || { };
        if (noTransitionFound(opts.cachedTransitionStyles)) {
          TIMEOUT = 0;
        }

        var timer = $timeout(finished, opts.timeout || TIMEOUT);
        element.on($mdConstant.CSS.TRANSITIONEND, finished);
        function finished(ev) {
          if ( ev && ev.target !== element[0]) return;

          if ( ev  ) $timeout.cancel(timer);
          element.off($mdConstant.CSS.TRANSITIONEND, finished);
          resolve();

        }
        function noTransitionFound(styles) {
          styles = styles || window.getComputedStyle(element[0]);

          return styles.transitionDuration == '0s' || (!styles.transition && !styles.transitionProperty);
        }

      });
    },

    calculateTransformValues: function (element, originator) {
      var origin = originator.element;
      var bounds = originator.bounds;

      if (origin || bounds) {
        var originBnds = origin ? self.clientRect(origin) || currentBounds() : self.copyRect(bounds);
        var dialogRect = self.copyRect(element[0].getBoundingClientRect());
        var dialogCenterPt = self.centerPointFor(dialogRect);
        var originCenterPt = self.centerPointFor(originBnds);

        return {
          centerX: originCenterPt.x - dialogCenterPt.x,
          centerY: originCenterPt.y - dialogCenterPt.y,
          scaleX: Math.round(100 * Math.min(0.5, originBnds.width / dialogRect.width)) / 100,
          scaleY: Math.round(100 * Math.min(0.5, originBnds.height / dialogRect.height)) / 100
        };
      }
      return {centerX: 0, centerY: 0, scaleX: 0.5, scaleY: 0.5};
      function currentBounds() {
        var cntr = element ? element.parent() : null;
        var parent = cntr ? cntr.parent() : null;

        return parent ? self.clientRect(parent) : null;
      }
    },
    calculateZoomToOrigin: function (element, originator) {
      var zoomTemplate = "translate3d( {centerX}px, {centerY}px, 0 ) scale( {scaleX}, {scaleY} )";
      var buildZoom = angular.bind(null, $mdUtil.supplant, zoomTemplate);

      return buildZoom(self.calculateTransformValues(element, originator));
    },
    calculateSlideToOrigin: function (element, originator) {
      var slideTemplate = "translate3d( {centerX}px, {centerY}px, 0 )";
      var buildSlide = angular.bind(null, $mdUtil.supplant, slideTemplate);

      return buildSlide(self.calculateTransformValues(element, originator));
    },
    toCss : function( raw ) {
      var css = { };
      var lookups = 'left top right bottom width height x y min-width min-height max-width max-height';

      angular.forEach(raw, function(value,key) {
        if ( angular.isUndefined(value) ) return;

        if ( lookups.indexOf(key) >= 0 ) {
          css[key] = value + 'px';
        } else {
          switch (key) {
            case 'transition':
              convertToVendor(key, $mdConstant.CSS.TRANSITION, value);
              break;
            case 'transform':
              convertToVendor(key, $mdConstant.CSS.TRANSFORM, value);
              break;
            case 'transformOrigin':
              convertToVendor(key, $mdConstant.CSS.TRANSFORM_ORIGIN, value);
              break;
            case 'font-size':
              css['font-size'] = value; // font sizes aren't always in px
              break;
          }
        }
      });

      return css;

      function convertToVendor(key, vendor, value) {
        angular.forEach(vendor.split(' '), function (key) {
          css[key] = value;
        });
      }
    },
    toTransformCss: function (transform, addTransition, transition) {
      var css = {};
      angular.forEach($mdConstant.CSS.TRANSFORM.split(' '), function (key) {
        css[key] = transform;
      });

      if (addTransition) {
        transition = transition || "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important";
        css.transition = transition;
      }

      return css;
    },
    copyRect: function (source, destination) {
      if (!source) return null;

      destination = destination || {};

      angular.forEach('left top right bottom width height'.split(' '), function (key) {
        destination[key] = Math.round(source[key]);
      });

      destination.width = destination.width || (destination.right - destination.left);
      destination.height = destination.height || (destination.bottom - destination.top);

      return destination;
    },
    clientRect: function (element) {
      var bounds = angular.element(element)[0].getBoundingClientRect();
      var isPositiveSizeClientRect = function (rect) {
        return rect && (rect.width > 0) && (rect.height > 0);
      };
      return isPositiveSizeClientRect(bounds) ? self.copyRect(bounds) : null;
    },
    centerPointFor: function (targetRect) {
      return targetRect ? {
        x: Math.round(targetRect.left + (targetRect.width / 2)),
        y: Math.round(targetRect.top + (targetRect.height / 2))
      } : { x : 0, y : 0 };
    }

  };
}


})();
(function(){
"use strict";

"use strict";

if (angular.version.minor >= 4) {
  angular.module('material.core.animate', []);
} else {
(function() {

  var forEach = angular.forEach;

  var WEBKIT = angular.isDefined(document.documentElement.style.WebkitAppearance);
  var TRANSITION_PROP = WEBKIT ? 'WebkitTransition' : 'transition';
  var ANIMATION_PROP = WEBKIT ? 'WebkitAnimation' : 'animation';
  var PREFIX = WEBKIT ? '-webkit-' : '';

  var TRANSITION_EVENTS = (WEBKIT ? 'webkitTransitionEnd ' : '') + 'transitionend';
  var ANIMATION_EVENTS = (WEBKIT ? 'webkitAnimationEnd ' : '') + 'animationend';

  var $$ForceReflowFactory = ['$document', function($document) {
    return function() {
      return $document[0].body.clientWidth + 1;
    }
  }];

  var $$rAFMutexFactory = ['$$rAF', function($$rAF) {
    return function() {
      var passed = false;
      $$rAF(function() {
        passed = true;
      });
      return function(fn) {
        passed ? fn() : $$rAF(fn);
      };
    };
  }];

  var $$AnimateRunnerFactory = ['$q', '$$rAFMutex', function($q, $$rAFMutex) {
    var INITIAL_STATE = 0;
    var DONE_PENDING_STATE = 1;
    var DONE_COMPLETE_STATE = 2;

    function AnimateRunner(host) {
      this.setHost(host);

      this._doneCallbacks = [];
      this._runInAnimationFrame = $$rAFMutex();
      this._state = 0;
    }

    AnimateRunner.prototype = {
      setHost: function(host) {
        this.host = host || {};
      },

      done: function(fn) {
        if (this._state === DONE_COMPLETE_STATE) {
          fn();
        } else {
          this._doneCallbacks.push(fn);
        }
      },

      progress: angular.noop,

      getPromise: function() {
        if (!this.promise) {
          var self = this;
          this.promise = $q(function(resolve, reject) {
            self.done(function(status) {
              status === false ? reject() : resolve();
            });
          });
        }
        return this.promise;
      },

      then: function(resolveHandler, rejectHandler) {
        return this.getPromise().then(resolveHandler, rejectHandler);
      },

      'catch': function(handler) {
        return this.getPromise()['catch'](handler);
      },

      'finally': function(handler) {
        return this.getPromise()['finally'](handler);
      },

      pause: function() {
        if (this.host.pause) {
          this.host.pause();
        }
      },

      resume: function() {
        if (this.host.resume) {
          this.host.resume();
        }
      },

      end: function() {
        if (this.host.end) {
          this.host.end();
        }
        this._resolve(true);
      },

      cancel: function() {
        if (this.host.cancel) {
          this.host.cancel();
        }
        this._resolve(false);
      },

      complete: function(response) {
        var self = this;
        if (self._state === INITIAL_STATE) {
          self._state = DONE_PENDING_STATE;
          self._runInAnimationFrame(function() {
            self._resolve(response);
          });
        }
      },

      _resolve: function(response) {
        if (this._state !== DONE_COMPLETE_STATE) {
          forEach(this._doneCallbacks, function(fn) {
            fn(response);
          });
          this._doneCallbacks.length = 0;
          this._state = DONE_COMPLETE_STATE;
        }
      }
    };
    AnimateRunner.all = function(runners, callback) {
      var count = 0;
      var status = true;
      forEach(runners, function(runner) {
        runner.done(onProgress);
      });

      function onProgress(response) {
        status = status && response;
        if (++count === runners.length) {
          callback(status);
        }
      }
    };

    return AnimateRunner;
  }];

  angular
    .module('material.core.animate', [])
    .factory('$$forceReflow', $$ForceReflowFactory)
    .factory('$$AnimateRunner', $$AnimateRunnerFactory)
    .factory('$$rAFMutex', $$rAFMutexFactory)
    .factory('$animateCss', ['$window', '$$rAF', '$$AnimateRunner', '$$forceReflow', '$$jqLite', '$timeout', '$animate',
                     function($window,   $$rAF,   $$AnimateRunner,   $$forceReflow,   $$jqLite,   $timeout, $animate) {

      function init(element, options) {

        var temporaryStyles = [];
        var node = getDomNode(element);
        var areAnimationsAllowed = node && $animate.enabled();

        var hasCompleteStyles = false;
        var hasCompleteClasses = false;

        if (areAnimationsAllowed) {
          if (options.transitionStyle) {
            temporaryStyles.push([PREFIX + 'transition', options.transitionStyle]);
          }

          if (options.keyframeStyle) {
            temporaryStyles.push([PREFIX + 'animation', options.keyframeStyle]);
          }

          if (options.delay) {
            temporaryStyles.push([PREFIX + 'transition-delay', options.delay + 's']);
          }

          if (options.duration) {
            temporaryStyles.push([PREFIX + 'transition-duration', options.duration + 's']);
          }

          hasCompleteStyles = options.keyframeStyle ||
              (options.to && (options.duration > 0 || options.transitionStyle));
          hasCompleteClasses = !!options.addClass || !!options.removeClass;

          blockTransition(element, true);
        }

        var hasCompleteAnimation = areAnimationsAllowed && (hasCompleteStyles || hasCompleteClasses);

        applyAnimationFromStyles(element, options);

        var animationClosed = false;
        var events, eventFn;

        return {
          close: $window.close,
          start: function() {
            var runner = new $$AnimateRunner();
            waitUntilQuiet(function() {
              blockTransition(element, false);
              if (!hasCompleteAnimation) {
                return close();
              }

              forEach(temporaryStyles, function(entry) {
                var key = entry[0];
                var value = entry[1];
                node.style[camelCase(key)] = value;
              });

              applyClasses(element, options);

              var timings = computeTimings(element);
              if (timings.duration === 0) {
                return close();
              }

              var moreStyles = [];

              if (options.easing) {
                if (timings.transitionDuration) {
                  moreStyles.push([PREFIX + 'transition-timing-function', options.easing]);
                }
                if (timings.animationDuration) {
                  moreStyles.push([PREFIX + 'animation-timing-function', options.easing]);
                }
              }

              if (options.delay && timings.animationDelay) {
                moreStyles.push([PREFIX + 'animation-delay', options.delay + 's']);
              }

              if (options.duration && timings.animationDuration) {
                moreStyles.push([PREFIX + 'animation-duration', options.duration + 's']);
              }

              forEach(moreStyles, function(entry) {
                var key = entry[0];
                var value = entry[1];
                node.style[camelCase(key)] = value;
                temporaryStyles.push(entry);
              });

              var maxDelay = timings.delay;
              var maxDelayTime = maxDelay * 1000;
              var maxDuration = timings.duration;
              var maxDurationTime = maxDuration * 1000;
              var startTime = Date.now();

              events = [];
              if (timings.transitionDuration) {
                events.push(TRANSITION_EVENTS);
              }
              if (timings.animationDuration) {
                events.push(ANIMATION_EVENTS);
              }
              events = events.join(' ');
              eventFn = function(event) {
                event.stopPropagation();
                var ev = event.originalEvent || event;
                var timeStamp = ev.timeStamp || Date.now();
                var elapsedTime = parseFloat(ev.elapsedTime.toFixed(3));
                if (Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration) {
                  close();
                }
              };
              element.on(events, eventFn);

              applyAnimationToStyles(element, options);

              $timeout(close, maxDelayTime + maxDurationTime * 1.5, false);
            });

            return runner;

            function close() {
              if (animationClosed) return;
              animationClosed = true;

              if (events && eventFn) {
                element.off(events, eventFn);
              }
              applyClasses(element, options);
              applyAnimationStyles(element, options);
              forEach(temporaryStyles, function(entry) {
                node.style[camelCase(entry[0])] = '';
              });
              runner.complete(true);
              return runner;
            }
          }
        }
      }

      function applyClasses(element, options) {
        if (options.addClass) {
          $$jqLite.addClass(element, options.addClass);
          options.addClass = null;
        }
        if (options.removeClass) {
          $$jqLite.removeClass(element, options.removeClass);
          options.removeClass = null;
        }
      }

      function computeTimings(element) {
        var node = getDomNode(element);
        var cs = $window.getComputedStyle(node)
        var tdr = parseMaxTime(cs[prop('transitionDuration')]);
        var adr = parseMaxTime(cs[prop('animationDuration')]);
        var tdy = parseMaxTime(cs[prop('transitionDelay')]);
        var ady = parseMaxTime(cs[prop('animationDelay')]);

        adr *= (parseInt(cs[prop('animationIterationCount')], 10) || 1);
        var duration = Math.max(adr, tdr);
        var delay = Math.max(ady, tdy);

        return {
          duration: duration,
          delay: delay,
          animationDuration: adr,
          transitionDuration: tdr,
          animationDelay: ady,
          transitionDelay: tdy
        };

        function prop(key) {
          return WEBKIT ? 'Webkit' + key.charAt(0).toUpperCase() + key.substr(1)
                        : key;
        }
      }

      function parseMaxTime(str) {
        var maxValue = 0;
        var values = (str || "").split(/\s*,\s*/);
        forEach(values, function(value) {
          if (value.charAt(value.length - 1) == 's') {
            value = value.substring(0, value.length - 1);
          }
          value = parseFloat(value) || 0;
          maxValue = maxValue ? Math.max(value, maxValue) : value;
        });
        return maxValue;
      }

      var cancelLastRAFRequest;
      var rafWaitQueue = [];
      function waitUntilQuiet(callback) {
        if (cancelLastRAFRequest) {
          cancelLastRAFRequest(); //cancels the request
        }
        rafWaitQueue.push(callback);
        cancelLastRAFRequest = $$rAF(function() {
          cancelLastRAFRequest = null;
          var pageWidth = $$forceReflow();
          for (var i = 0; i < rafWaitQueue.length; i++) {
            rafWaitQueue[i](pageWidth);
          }
          rafWaitQueue.length = 0;
        });
      }

      function applyAnimationStyles(element, options) {
        applyAnimationFromStyles(element, options);
        applyAnimationToStyles(element, options);
      }

      function applyAnimationFromStyles(element, options) {
        if (options.from) {
          element.css(options.from);
          options.from = null;
        }
      }

      function applyAnimationToStyles(element, options) {
        if (options.to) {
          element.css(options.to);
          options.to = null;
        }
      }

      function getDomNode(element) {
        for (var i = 0; i < element.length; i++) {
          if (element[i].nodeType === 1) return element[i];
        }
      }

      function blockTransition(element, bool) {
        var node = getDomNode(element);
        var key = camelCase(PREFIX + 'transition-delay');
        node.style[key] = bool ? '-9999s' : '';
      }

      return init;
    }]);
  function camelCase(str) {
    return str.replace(/-[a-z]/g, function(str) {
      return str.charAt(1).toUpperCase();
    });
  }

})();

}

})();
(function(){
"use strict";
angular.module('material.components.autocomplete', [
  'material.core',
  'material.components.icon',
  'material.components.virtualRepeat'
]);

})();
(function(){
"use strict";

angular
  .module('material.components.backdrop', ['material.core'])
  .directive('mdBackdrop', ["$mdTheming", "$mdUtil", "$animate", "$rootElement", "$window", "$log", "$$rAF", "$document", function BackdropDirective($mdTheming, $mdUtil, $animate, $rootElement, $window, $log, $$rAF, $document) {
    var ERROR_CSS_POSITION = '<md-backdrop> may not work properly in a scrolled, static-positioned parent container.';

    return {
      restrict: 'E',
      link: postLink
    };

    function postLink(scope, element, attrs) {
      if ($animate.pin) $animate.pin(element, $rootElement);

      var bodyStyles;

      $$rAF(function() {
        bodyStyles = $window.getComputedStyle($document[0].body);

        if (bodyStyles.position === 'fixed') {
          var resizeHandler = $mdUtil.debounce(function(){
            bodyStyles = $window.getComputedStyle($document[0].body);
            resize();
          }, 60, null, false);

          resize();
          angular.element($window).on('resize', resizeHandler);

          scope.$on('$destroy', function() {
            angular.element($window).off('resize', resizeHandler);
          });
        }
        var parent = element.parent();

        if (parent.length) {
          if (parent[0].nodeName === 'BODY') {
            element.css('position', 'fixed');
          }

          var styles = $window.getComputedStyle(parent[0]);

          if (styles.position === 'static') {
            $log.warn(ERROR_CSS_POSITION);
          }
          $mdTheming.inherit(element, parent);
        }
      });

      function resize() {
        var viewportHeight = parseInt(bodyStyles.height, 10) + Math.abs(parseInt(bodyStyles.top, 10));
        element.css('height', viewportHeight + 'px');
      }
    }

  }]);

})();
(function(){
"use strict";
MdBottomSheetDirective.$inject = ["$mdBottomSheet"];
MdBottomSheetProvider.$inject = ["$$interimElementProvider"];
angular
  .module('material.components.bottomSheet', [
    'material.core',
    'material.components.backdrop'
  ])
  .directive('mdBottomSheet', MdBottomSheetDirective)
  .provider('$mdBottomSheet', MdBottomSheetProvider);
function MdBottomSheetDirective($mdBottomSheet) {
  return {
    restrict: 'E',
    link : function postLink(scope, element) {
      element.addClass('_md');     // private md component indicator for styling
      scope.$on('$destroy', function() {
        $mdBottomSheet.destroy();
      });
    }
  };
}

function MdBottomSheetProvider($$interimElementProvider) {
  bottomSheetDefaults.$inject = ["$animate", "$mdConstant", "$mdUtil", "$mdTheming", "$mdBottomSheet", "$rootElement", "$mdGesture", "$log"];
  var CLOSING_VELOCITY = 0.5;
  var PADDING = 80; // same as css

  return $$interimElementProvider('$mdBottomSheet')
    .setDefaults({
      methods: ['disableParentScroll', 'escapeToClose', 'clickOutsideToClose'],
      options: bottomSheetDefaults
    });
  function bottomSheetDefaults($animate, $mdConstant, $mdUtil, $mdTheming, $mdBottomSheet, $rootElement,
                               $mdGesture, $log) {
    var backdrop;

    return {
      themable: true,
      onShow: onShow,
      onRemove: onRemove,
      disableBackdrop: false,
      escapeToClose: true,
      clickOutsideToClose: true,
      disableParentScroll: true
    };


    function onShow(scope, element, options, controller) {

      element = $mdUtil.extractElementByName(element, 'md-bottom-sheet');
      element.attr('tabindex',"-1");
      if (element.hasClass('ng-cloak')) {
        var message = '$mdBottomSheet: using `<md-bottom-sheet ng-cloak >` will affect the bottom-sheet opening animations.';
        $log.warn( message, element[0] );
      }

      if (!options.disableBackdrop) {
        backdrop = $mdUtil.createBackdrop(scope, "md-bottom-sheet-backdrop md-opaque");
        
        backdrop[0].tabIndex = -1;

        if (options.clickOutsideToClose) {
          backdrop.on('click', function() {
            $mdUtil.nextTick($mdBottomSheet.cancel,true);
          });
        }

        $mdTheming.inherit(backdrop, options.parent);

        $animate.enter(backdrop, options.parent, null);
      }

      var bottomSheet = new BottomSheet(element, options.parent);
      options.bottomSheet = bottomSheet;

      $mdTheming.inherit(bottomSheet.element, options.parent);

      if (options.disableParentScroll) {
        options.restoreScroll = $mdUtil.disableScrollAround(bottomSheet.element, options.parent);
      }

      return $animate.enter(bottomSheet.element, options.parent, backdrop)
        .then(function() {
          var focusable = $mdUtil.findFocusTarget(element) || angular.element(
            element[0].querySelector('button') ||
            element[0].querySelector('a') ||
            element[0].querySelector($mdUtil.prefixer('ng-click', true))
          ) || backdrop;

          if (options.escapeToClose) {
            options.rootElementKeyupCallback = function(e) {
              if (e.keyCode === $mdConstant.KEY_CODE.ESCAPE) {
                $mdUtil.nextTick($mdBottomSheet.cancel,true);
              }
            };

            $rootElement.on('keyup', options.rootElementKeyupCallback);
            focusable && focusable.focus();
          }
        });

    }

    function onRemove(scope, element, options) {

      var bottomSheet = options.bottomSheet;

      if (!options.disableBackdrop) $animate.leave(backdrop);
      return $animate.leave(bottomSheet.element).then(function() {
        if (options.disableParentScroll) {
          options.restoreScroll();
          delete options.restoreScroll;
        }

        bottomSheet.cleanup();
      });
    }
    function BottomSheet(element, parent) {
      var deregister = $mdGesture.register(parent, 'drag', { horizontal: false });
      parent.on('$md.dragstart', onDragStart)
        .on('$md.drag', onDrag)
        .on('$md.dragend', onDragEnd);

      return {
        element: element,
        cleanup: function cleanup() {
          deregister();
          parent.off('$md.dragstart', onDragStart);
          parent.off('$md.drag', onDrag);
          parent.off('$md.dragend', onDragEnd);
        }
      };

      function onDragStart(ev) {
        element.css($mdConstant.CSS.TRANSITION_DURATION, '0ms');
      }

      function onDrag(ev) {
        var transform = ev.pointer.distanceY;
        if (transform < 5) {
          transform = Math.max(-PADDING, transform / 2);
        }
        element.css($mdConstant.CSS.TRANSFORM, 'translate3d(0,' + (PADDING + transform) + 'px,0)');
      }

      function onDragEnd(ev) {
        if (ev.pointer.distanceY > 0 &&
            (ev.pointer.distanceY > 20 || Math.abs(ev.pointer.velocityY) > CLOSING_VELOCITY)) {
          var distanceRemaining = element.prop('offsetHeight') - ev.pointer.distanceY;
          var transitionDuration = Math.min(distanceRemaining / ev.pointer.velocityY * 0.75, 500);
          element.css($mdConstant.CSS.TRANSITION_DURATION, transitionDuration + 'ms');
          $mdUtil.nextTick($mdBottomSheet.cancel,true);
        } else {
          element.css($mdConstant.CSS.TRANSITION_DURATION, '');
          element.css($mdConstant.CSS.TRANSFORM, '');
        }
      }
    }

  }

}

})();
(function(){
"use strict";
MdButtonDirective.$inject = ["$mdButtonInkRipple", "$mdTheming", "$mdAria", "$timeout"];
MdAnchorDirective.$inject = ["$mdTheming"];
angular
    .module('material.components.button', [ 'material.core' ])
    .directive('mdButton', MdButtonDirective)
    .directive('a', MdAnchorDirective);
function MdAnchorDirective($mdTheming) {
  return {
    restrict : 'E',
    link : function postLink(scope, element) {
      $mdTheming(element);
    }
  };
}
function MdButtonDirective($mdButtonInkRipple, $mdTheming, $mdAria, $timeout) {

  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: getTemplate,
    link: postLink
  };

  function isAnchor(attr) {
    return angular.isDefined(attr.href) || angular.isDefined(attr.ngHref) || angular.isDefined(attr.ngLink) || angular.isDefined(attr.uiSref);
  }

  function getTemplate(element, attr) {
    if (isAnchor(attr)) {
      return '<a class="md-button" ng-transclude></a>';
    } else {
      var btnType = (typeof attr.type === 'undefined') ? 'button' : attr.type;
      return '<button class="md-button" type="' + btnType + '" ng-transclude></button>';
    }
  }

  function postLink(scope, element, attr) {
    $mdTheming(element);
    $mdButtonInkRipple.attach(scope, element);
    $mdAria.expectWithoutText(element, 'aria-label');
    if (isAnchor(attr) && angular.isDefined(attr.ngDisabled) ) {
      scope.$watch(attr.ngDisabled, function(isDisabled) {
        element.attr('tabindex', isDisabled ? -1 : 0);
      });
    }
    element.on('click', function(e){
      if (attr.disabled === true) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });

    if (!element.hasClass('md-no-focus')) {
      scope.mouseActive = false;
      element.on('mousedown', function() {
        scope.mouseActive = true;
        $timeout(function(){
          scope.mouseActive = false;
        }, 100);
      })
      .on('focus', function() {
        if (scope.mouseActive === false) {
          element.addClass('md-focused');
        }
      })
      .on('blur', function(ev) {
        element.removeClass('md-focused');
      });
    }

  }

}

})();
(function(){
"use strict";
mdCardDirective.$inject = ["$mdTheming"];
angular.module('material.components.card', [
    'material.core'
  ])
  .directive('mdCard', mdCardDirective);
function mdCardDirective($mdTheming) {
  return {
    restrict: 'E',
    link: function ($scope, $element, attr) {
      $element.addClass('_md');     // private md component indicator for styling
      $mdTheming($element);
    }
  };
}

})();
(function(){
"use strict";
angular.module('material.components.chips', [
  'material.core',
  'material.components.autocomplete'
]);

})();
(function(){
"use strict";
MdCheckboxDirective.$inject = ["inputDirective", "$mdAria", "$mdConstant", "$mdTheming", "$mdUtil", "$timeout"];
angular
  .module('material.components.checkbox', ['material.core'])
  .directive('mdCheckbox', MdCheckboxDirective);
function MdCheckboxDirective(inputDirective, $mdAria, $mdConstant, $mdTheming, $mdUtil, $timeout) {
  inputDirective = inputDirective[0];

  return {
    restrict: 'E',
    transclude: true,
    require: '?ngModel',
    priority: 210, // Run before ngAria
    template:
      '<div class="md-container" md-ink-ripple md-ink-ripple-checkbox>' +
        '<div class="md-icon"></div>' +
      '</div>' +
      '<div ng-transclude class="md-label"></div>',
    compile: compile
  };

  function compile (tElement, tAttrs) {
    tAttrs.$set('tabindex', tAttrs.tabindex || '0');
    tAttrs.$set('type', 'checkbox');
    tAttrs.$set('role', tAttrs.type);

    return  {
      pre: function(scope, element) {
        element.on('click', function(e) {
          if (this.hasAttribute('disabled')) {
            e.stopImmediatePropagation();
          }
        });
      },
      post: postLink
    };

    function postLink(scope, element, attr, ngModelCtrl) {
      var isIndeterminate;
      ngModelCtrl = ngModelCtrl || $mdUtil.fakeNgModel();
      $mdTheming(element);
      element.children().on('focus', function() {
        element.focus();
      });

      if ($mdUtil.parseAttributeBoolean(attr.mdIndeterminate)) {
        setIndeterminateState();
        scope.$watch(attr.mdIndeterminate, setIndeterminateState);
      }

      if (attr.ngChecked) {
        scope.$watch(scope.$eval.bind(scope, attr.ngChecked), function(value) {
          ngModelCtrl.$setViewValue(value);
          ngModelCtrl.$render();
        });
      }

      $$watchExpr('ngDisabled', 'tabindex', {
        true: '-1',
        false: attr.tabindex
      });

      $mdAria.expectWithText(element, 'aria-label');
      inputDirective.link.pre(scope, {
        on: angular.noop,
        0: {}
      }, attr, [ngModelCtrl]);

      scope.mouseActive = false;
      element.on('click', listener)
        .on('keypress', keypressHandler)
        .on('mousedown', function() {
          scope.mouseActive = true;
          $timeout(function() {
            scope.mouseActive = false;
          }, 100);
        })
        .on('focus', function() {
          if (scope.mouseActive === false) {
            element.addClass('md-focused');
          }
        })
        .on('blur', function() {
          element.removeClass('md-focused');
        });

      ngModelCtrl.$render = render;

      function $$watchExpr(expr, htmlAttr, valueOpts) {
        if (attr[expr]) {
          scope.$watch(attr[expr], function(val) {
            if (valueOpts[val]) {
              element.attr(htmlAttr, valueOpts[val]);
            }
          });
        }
      }

      function keypressHandler(ev) {
        var keyCode = ev.which || ev.keyCode;
        if (keyCode === $mdConstant.KEY_CODE.SPACE || keyCode === $mdConstant.KEY_CODE.ENTER) {
          ev.preventDefault();
          element.addClass('md-focused');
          listener(ev);
        }
      }

      function listener(ev) {
        if (element[0].hasAttribute('disabled') || scope.skipToggle) {
          return;
        }

        scope.$apply(function() {
          var viewValue = attr.ngChecked ? attr.checked : !ngModelCtrl.$viewValue;

          ngModelCtrl.$setViewValue(viewValue, ev && ev.type);
          ngModelCtrl.$render();
        });
      }

      function render() {
        element.toggleClass('md-checked', !!ngModelCtrl.$viewValue && !isIndeterminate);
      }

      function setIndeterminateState(newValue) {
        isIndeterminate = newValue !== false;
        if (isIndeterminate) {
          element.attr('aria-checked', 'mixed');
        }
        element.toggleClass('md-indeterminate', isIndeterminate);
      }
    }
  }
}

})();
(function(){
"use strict";

(function () {
  "use strict";
  MdColorsDirective.$inject = ["$mdColors", "$mdUtil", "$log", "$parse"];
  MdColorsService.$inject = ["$mdTheming", "$mdUtil", "$log"];
  var STATIC_COLOR_EXPRESSION = /^{((\s|,)*?["'a-zA-Z-]+?\s*?:\s*?('|")[a-zA-Z0-9-.]*('|"))+\s*}$/;
  var colorPalettes = null;
  angular
    .module('material.components.colors', ['material.core'])
    .directive('mdColors', MdColorsDirective)
    .service('$mdColors', MdColorsService);
  function MdColorsService($mdTheming, $mdUtil, $log) {
    colorPalettes = colorPalettes || Object.keys($mdTheming.PALETTES);
    return {
      applyThemeColors: applyThemeColors,
      getThemeColor: getThemeColor,
      hasTheme: hasTheme
    };
    function applyThemeColors(element, colorExpression) {
      try {
        if (colorExpression) {
          element.css(interpolateColors(colorExpression));
        }
      } catch (e) {
        $log.error(e.message);
      }

    }
    function getThemeColor(expression) {
      var color = extractColorOptions(expression);

      return parseColor(color);
    }
    function parseColor(color, contrast) {
      contrast = contrast || false;
      var rgbValues = $mdTheming.PALETTES[color.palette][color.hue];

      rgbValues = contrast ? rgbValues.contrast : rgbValues.value;

      return $mdUtil.supplant('rgba({0}, {1}, {2}, {3})',
        [rgbValues[0], rgbValues[1], rgbValues[2], rgbValues[3] || color.opacity]
      );
    }
    function interpolateColors(themeColors) {
      var rgbColors = {};

      var hasColorProperty = themeColors.hasOwnProperty('color');

      angular.forEach(themeColors, function (value, key) {
        var color = extractColorOptions(value);
        var hasBackground = key.indexOf('background') > -1;

        rgbColors[key] = parseColor(color);
        if (hasBackground && !hasColorProperty) {
          rgbColors.color = parseColor(color, true);
        }
      });

      return rgbColors;
    }
    function hasTheme(expression) {
      return angular.isDefined($mdTheming.THEMES[expression.split('-')[0]]);
    }
    function extractColorOptions(expression) {
      var parts = expression.split('-');
      var hasTheme = angular.isDefined($mdTheming.THEMES[parts[0]]);
      var theme = hasTheme ? parts.splice(0, 1)[0] : $mdTheming.defaultTheme();

      return {
        theme: theme,
        palette: extractPalette(parts, theme),
        hue: extractHue(parts, theme),
        opacity: parts[2] || 1
      };
    }
    function extractPalette(parts, theme) {

      var isTwoWord = parts.length > 1 && colorPalettes.indexOf(parts[1]) !== -1;
      var palette = parts[0].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

      if (isTwoWord)  palette = parts[0] + '-' + parts.splice(1, 1);

      if (colorPalettes.indexOf(palette) === -1) {
        var scheme = $mdTheming.THEMES[theme].colors[palette];
        if (!scheme) {
          throw new Error($mdUtil.supplant('mdColors: couldn\'t find \'{palette}\' in the palettes.', {palette: palette}));
        }
        palette = scheme.name;
      }

      return palette;
    }

    function extractHue(parts, theme) {
      var themeColors = $mdTheming.THEMES[theme].colors;

      if (parts[1] === 'hue') {
        var hueNumber = parseInt(parts.splice(2, 1)[0], 10);

        if (hueNumber < 1 || hueNumber > 3) {
          throw new Error($mdUtil.supplant('mdColors: \'hue-{hueNumber}\' is not a valid hue, can be only \'hue-1\', \'hue-2\' and \'hue-3\'', {hueNumber: hueNumber}));
        }
        parts[1] = 'hue-' + hueNumber;

        if (!(parts[0] in themeColors)) {
          throw new Error($mdUtil.supplant('mdColors: \'hue-x\' can only be used with [{availableThemes}], but was used with \'{usedTheme}\'', {
            availableThemes: Object.keys(themeColors).join(', '),
            usedTheme: parts[0]
          }));
        }

        return themeColors[parts[0]].hues[parts[1]];
      }

      return parts[1] || themeColors[parts[0] in themeColors ? parts[0] : 'primary'].hues['default'];
    }
  }
  function MdColorsDirective($mdColors, $mdUtil, $log, $parse) {
    return {
      restrict: 'A',
      require: ['^?mdTheme'],
      compile: function (tElem, tAttrs) {
        var shouldWatch = shouldColorsWatch();

        return function (scope, element, attrs, ctrl) {
          var mdThemeController = ctrl[0];

          var lastColors = {};

          var parseColors = function (theme) {
            if (typeof theme !== 'string') {
              theme = '';
            }

            if (!attrs.mdColors) {
              attrs.mdColors = '{}';
            }
            var colors = $parse(attrs.mdColors)(scope);
            if (mdThemeController) {
              Object.keys(colors).forEach(function (prop) {
                var color = colors[prop];
                if (!$mdColors.hasTheme(color)) {
                  colors[prop] = (theme || mdThemeController.$mdTheme) + '-' + color;
                }
              });
            }

            cleanElement(colors);

            return colors;
          };

          var cleanElement = function (colors) {
            if (!angular.equals(colors, lastColors)) {
              var keys = Object.keys(lastColors);

              if (lastColors.background && !keys.color) {
                keys.push('color');
              }

              keys.forEach(function (key) {
                element.css(key, '');
              });
            }

            lastColors = colors;
          };
          var unregisterChanges = angular.noop;

          if (mdThemeController) {
            unregisterChanges = mdThemeController.registerChanges(function (theme) {
              $mdColors.applyThemeColors(element, parseColors(theme));
            });
          }

          scope.$on('$destroy', function () {
            unregisterChanges();
          });

          try {
            if (shouldWatch) {
              scope.$watch(parseColors, angular.bind(this,
                $mdColors.applyThemeColors, element
              ), true);
            }
            else {
              $mdColors.applyThemeColors(element, parseColors());
            }

          }
          catch (e) {
            $log.error(e.message);
          }

        };

        function shouldColorsWatch() {
          var rawColorExpression = tAttrs.mdColors;
          var bindOnce = rawColorExpression.indexOf('::') > -1;
          var isStatic = bindOnce ? true : STATIC_COLOR_EXPRESSION.test(tAttrs.mdColors);
          tAttrs.mdColors = rawColorExpression.replace('::', '');

          var hasWatchAttr = angular.isDefined(tAttrs.mdColorsWatch);

          return (bindOnce || isStatic) ? false :
            hasWatchAttr ? $mdUtil.parseAttributeBoolean(tAttrs.mdColorsWatch) : true;
        }
      }
    };

  }


})();

})();
(function(){
"use strict";
mdContentDirective.$inject = ["$mdTheming"];
angular.module('material.components.content', [
  'material.core'
])
  .directive('mdContent', mdContentDirective);

function mdContentDirective($mdTheming) {
  return {
    restrict: 'E',
    controller: ['$scope', '$element', ContentController],
    link: function(scope, element) {
      element.addClass('_md');     // private md component indicator for styling

      $mdTheming(element);
      scope.$broadcast('$mdContentLoaded', element);

      iosScrollFix(element[0]);
    }
  };

  function ContentController($scope, $element) {
    this.$scope = $scope;
    this.$element = $element;
  }
}

function iosScrollFix(node) {
  angular.element(node).on('$md.pressdown', function(ev) {
    if (ev.pointer.type !== 't') return;
    if (ev.$materialScrollFixed) return;
    ev.$materialScrollFixed = true;

    if (node.scrollTop === 0) {
      node.scrollTop = 1;
    } else if (node.scrollHeight === node.scrollTop + node.offsetHeight) {
      node.scrollTop -= 1;
    }
  });
}

})();
(function(){
"use strict";

angular.module('material.components.datepicker', [
  'material.core',
  'material.components.icon',
  'material.components.virtualRepeat'
]);

})();
(function(){
"use strict";
MdDialogDirective.$inject = ["$$rAF", "$mdTheming", "$mdDialog"];
MdDialogProvider.$inject = ["$$interimElementProvider"];
angular
  .module('material.components.dialog', [
    'material.core',
    'material.components.backdrop'
  ])
  .directive('mdDialog', MdDialogDirective)
  .provider('$mdDialog', MdDialogProvider);
function MdDialogDirective($$rAF, $mdTheming, $mdDialog) {
  return {
    restrict: 'E',
    link: function(scope, element) {
      element.addClass('_md');     // private md component indicator for styling

      $mdTheming(element);
      $$rAF(function() {
        var images;
        var content = element[0].querySelector('md-dialog-content');

        if (content) {
          images = content.getElementsByTagName('img');
          addOverflowClass();
          angular.element(images).on('load', addOverflowClass);
        }

        scope.$on('$destroy', function() {
          $mdDialog.destroy(element);
        });
        function addOverflowClass() {
          element.toggleClass('md-content-overflow', content.scrollHeight > content.clientHeight);
        }


      });
    }
  };
}

function MdDialogProvider($$interimElementProvider) {
  advancedDialogOptions.$inject = ["$mdDialog", "$mdConstant"];
  dialogDefaultOptions.$inject = ["$mdDialog", "$mdAria", "$mdUtil", "$mdConstant", "$animate", "$document", "$window", "$rootElement", "$log", "$injector", "$mdTheming"];
  var topFocusTrap, bottomFocusTrap;

  return $$interimElementProvider('$mdDialog')
    .setDefaults({
      methods: ['disableParentScroll', 'hasBackdrop', 'clickOutsideToClose', 'escapeToClose',
          'targetEvent', 'closeTo', 'openFrom', 'parent', 'fullscreen', 'contentElement'],
      options: dialogDefaultOptions
    })
    .addPreset('alert', {
      methods: ['title', 'htmlContent', 'textContent', 'content', 'ariaLabel', 'ok', 'theme',
          'css'],
      options: advancedDialogOptions
    })
    .addPreset('confirm', {
      methods: ['title', 'htmlContent', 'textContent', 'content', 'ariaLabel', 'ok', 'cancel',
          'theme', 'css'],
      options: advancedDialogOptions
    })
    .addPreset('prompt', {
      methods: ['title', 'htmlContent', 'textContent', 'initialValue', 'content', 'placeholder', 'ariaLabel',
          'ok', 'cancel', 'theme', 'css'],
      options: advancedDialogOptions
    });
  function advancedDialogOptions($mdDialog, $mdConstant) {
    return {
      template: [
        '<md-dialog md-theme="{{ dialog.theme }}" aria-label="{{ dialog.ariaLabel }}" ng-class="dialog.css">',
        '  <md-dialog-content class="md-dialog-content" role="document" tabIndex="-1">',
        '    <h2 class="md-title">{{ dialog.title }}</h2>',
        '    <div ng-if="::dialog.mdHtmlContent" class="md-dialog-content-body" ',
        '        ng-bind-html="::dialog.mdHtmlContent"></div>',
        '    <div ng-if="::!dialog.mdHtmlContent" class="md-dialog-content-body">',
        '      <p>{{::dialog.mdTextContent}}</p>',
        '    </div>',
        '    <md-input-container md-no-float ng-if="::dialog.$type == \'prompt\'" class="md-prompt-input-container">',
        '      <input ng-keypress="dialog.keypress($event)" md-autofocus ng-model="dialog.result" ' +
        '             placeholder="{{::dialog.placeholder}}">',
        '    </md-input-container>',
        '  </md-dialog-content>',
        '  <md-dialog-actions>',
        '    <md-button ng-if="dialog.$type === \'confirm\' || dialog.$type === \'prompt\'"' +
        '               ng-click="dialog.abort()" class="md-primary md-cancel-button">',
        '      {{ dialog.cancel }}',
        '    </md-button>',
        '    <md-button ng-click="dialog.hide()" class="md-primary md-confirm-button" md-autofocus="dialog.$type===\'alert\'">',
        '      {{ dialog.ok }}',
        '    </md-button>',
        '  </md-dialog-actions>',
        '</md-dialog>'
      ].join('').replace(/\s\s+/g, ''),
      controller: function mdDialogCtrl() {
        var isPrompt = this.$type == 'prompt';

        if (isPrompt && this.initialValue) {
          this.result = this.initialValue;
        }

        this.hide = function() {
          $mdDialog.hide(isPrompt ? this.result : true);
        };
        this.abort = function() {
          $mdDialog.cancel();
        };
        this.keypress = function($event) {
          if ($event.keyCode === $mdConstant.KEY_CODE.ENTER) {
            $mdDialog.hide(this.result);
          }
        };
      },
      controllerAs: 'dialog',
      bindToController: true,
    };
  }
  function dialogDefaultOptions($mdDialog, $mdAria, $mdUtil, $mdConstant, $animate, $document, $window, $rootElement,
                                $log, $injector, $mdTheming) {

    return {
      hasBackdrop: true,
      isolateScope: true,
      onCompiling: beforeCompile,
      onShow: onShow,
      onShowing: beforeShow,
      onRemove: onRemove,
      clickOutsideToClose: false,
      escapeToClose: true,
      targetEvent: null,
      contentElement: null,
      closeTo: null,
      openFrom: null,
      focusOnOpen: true,
      disableParentScroll: true,
      autoWrap: true,
      fullscreen: false,
      transformTemplate: function(template, options) {
        return '<div class="md-dialog-container" tabindex="-1">' + validatedTemplate(template) + '</div>';
        function validatedTemplate(template) {
          if (options.autoWrap && !/<\/md-dialog>/g.test(template)) {
            return '<md-dialog>' + (template || '') + '</md-dialog>';
          } else {
            return template || '';
          }
        }
      }
    };

    function beforeCompile(options) {
      detectTheming(options);

      if (options.contentElement) {
        options.restoreContentElement = installContentElement(options);
      }
    }

    function beforeShow(scope, element, options, controller) {

      if (controller) {
        controller.mdHtmlContent = controller.htmlContent || options.htmlContent || '';
        controller.mdTextContent = controller.textContent || options.textContent ||
            controller.content || options.content || '';

        if (controller.mdHtmlContent && !$injector.has('$sanitize')) {
          throw Error('The ngSanitize module must be loaded in order to use htmlContent.');
        }

        if (controller.mdHtmlContent && controller.mdTextContent) {
          throw Error('md-dialog cannot have both `htmlContent` and `textContent`');
        }
      }
    }
    function onShow(scope, element, options, controller) {
      angular.element($document[0].body).addClass('md-dialog-is-showing');

      var dialogElement = element.find('md-dialog');
      if (dialogElement.hasClass('ng-cloak')) {
        var message = '$mdDialog: using `<md-dialog ng-cloak >` will affect the dialog opening animations.';
        $log.warn( message, element[0] );
      }

      captureParentAndFromToElements(options);
      configureAria(dialogElement, options);
      showBackdrop(scope, element, options);
      activateListeners(element, options);

      return dialogPopIn(element, options)
        .then(function() {
          lockScreenReader(element, options);
          warnDeprecatedActions();
          focusOnOpen();
        });
      function warnDeprecatedActions() {
        if (element[0].querySelector('.md-actions')) {
          $log.warn('Using a class of md-actions is deprecated, please use <md-dialog-actions>.');
        }
      }
      function focusOnOpen() {
        if (options.focusOnOpen) {
          var target = $mdUtil.findFocusTarget(element) || findCloseButton() || dialogElement;
          target.focus();
        }
        function findCloseButton() {
          var closeButton = element[0].querySelector('.dialog-close');

          if (!closeButton) {
            var actionButtons = element[0].querySelectorAll('.md-actions button, md-dialog-actions button');
            closeButton = actionButtons[actionButtons.length - 1];
          }

          return closeButton;
        }
      }
    }
    function onRemove(scope, element, options) {
      options.deactivateListeners();
      options.unlockScreenReader();
      options.hideBackdrop(options.$destroy);
      if (topFocusTrap && topFocusTrap.parentNode) {
        topFocusTrap.parentNode.removeChild(topFocusTrap);
      }

      if (bottomFocusTrap && bottomFocusTrap.parentNode) {
        bottomFocusTrap.parentNode.removeChild(bottomFocusTrap);
      }
      return !!options.$destroy ? detachAndClean() : animateRemoval().then( detachAndClean );
      function animateRemoval() {
        return dialogPopOut(element, options);
      }
      function detachAndClean() {
        angular.element($document[0].body).removeClass('md-dialog-is-showing');
        if (!options.contentElement) {
          element.remove();
        } else {
          options.reverseContainerStretch();
          options.restoreContentElement();
        }

        if (!options.$destroy) options.origin.focus();
      }
    }

    function detectTheming(options) {
      if (options.theme) return;

      options.theme = $mdTheming.defaultTheme();

      if (options.targetEvent && options.targetEvent.target) {
        var targetEl = angular.element(options.targetEvent.target);
        options.theme = (targetEl.controller('mdTheme') || {}).$mdTheme || options.theme;
      }

    }
    function installContentElement(options) {
      var contentEl = options.contentElement;
      var restoreFn = null;

      if (angular.isString(contentEl)) {
        contentEl = document.querySelector(contentEl);
        restoreFn = createRestoreFn(contentEl);
      } else {
        contentEl = contentEl[0] || contentEl;
        if (document.contains(contentEl)) {
          restoreFn = createRestoreFn(contentEl);
        } else {
          restoreFn = function() {
            contentEl.parentNode.removeChild(contentEl);
          }
        }
      }
      options.element = angular.element(contentEl);
      options.skipCompile = true;

      return restoreFn;

      function createRestoreFn(element) {
        var parent = element.parentNode;
        var nextSibling = element.nextElementSibling;

        return function() {
          if (!nextSibling) {
            parent.appendChild(element);
          } else {
            parent.insertBefore(element, nextSibling);
          }
        }
      }
    }
    function captureParentAndFromToElements(options) {
          options.origin = angular.extend({
            element: null,
            bounds: null,
            focus: angular.noop
          }, options.origin || {});

          options.parent   = getDomElement(options.parent, $rootElement);
          options.closeTo  = getBoundingClientRect(getDomElement(options.closeTo));
          options.openFrom = getBoundingClientRect(getDomElement(options.openFrom));

          if ( options.targetEvent ) {
            options.origin   = getBoundingClientRect(options.targetEvent.target, options.origin);
          }
          function getBoundingClientRect (element, orig) {
            var source = angular.element((element || {}));
            if (source && source.length) {
              var bounds = {top:0,left:0,height:0,width:0};
              var hasFn = angular.isFunction(source[0].getBoundingClientRect);

              return angular.extend(orig || {}, {
                  element : hasFn ? source : undefined,
                  bounds  : hasFn ? source[0].getBoundingClientRect() : angular.extend({}, bounds, source[0]),
                  focus   : angular.bind(source, source.focus),
              });
            }
          }
          function getDomElement(element, defaultElement) {
            if (angular.isString(element)) {
              element = $document[0].querySelector(element);
            }
            return angular.element(element || defaultElement);
          }

        }
    function activateListeners(element, options) {
      var window = angular.element($window);
      var onWindowResize = $mdUtil.debounce(function() {
        stretchDialogContainerToViewport(element, options);
      }, 60);

      var removeListeners = [];
      var smartClose = function() {
        var closeFn = ( options.$type == 'alert' ) ? $mdDialog.hide : $mdDialog.cancel;
        $mdUtil.nextTick(closeFn, true);
      };

      if (options.escapeToClose) {
        var parentTarget = options.parent;
        var keyHandlerFn = function(ev) {
          if (ev.keyCode === $mdConstant.KEY_CODE.ESCAPE) {
            ev.stopPropagation();
            ev.preventDefault();

            smartClose();
          }
        };
        element.on('keydown', keyHandlerFn);
        parentTarget.on('keydown', keyHandlerFn);
        removeListeners.push(function() {

          element.off('keydown', keyHandlerFn);
          parentTarget.off('keydown', keyHandlerFn);

        });
      }
      window.on('resize', onWindowResize);

      removeListeners.push(function() {
        window.off('resize', onWindowResize);
      });

      if (options.clickOutsideToClose) {
        var target = element;
        var sourceElem;
        var mousedownHandler = function(ev) {
          sourceElem = ev.target;
        };
        var mouseupHandler = function(ev) {
          if (sourceElem === target[0] && ev.target === target[0]) {
            ev.stopPropagation();
            ev.preventDefault();

            smartClose();
          }
        };
        target.on('mousedown', mousedownHandler);
        target.on('mouseup', mouseupHandler);
        removeListeners.push(function() {
          target.off('mousedown', mousedownHandler);
          target.off('mouseup', mouseupHandler);
        });
      }
      options.deactivateListeners = function() {
        removeListeners.forEach(function(removeFn) {
          removeFn();
        });
        options.deactivateListeners = null;
      };
    }
    function showBackdrop(scope, element, options) {

      if (options.disableParentScroll) {
        options.restoreScroll = $mdUtil.disableScrollAround(element, options.parent);
      }

      if (options.hasBackdrop) {
        options.backdrop = $mdUtil.createBackdrop(scope, "md-dialog-backdrop md-opaque");
        $animate.enter(options.backdrop, options.parent);
      }
      options.hideBackdrop = function hideBackdrop($destroy) {
        if (options.backdrop) {
          if ( !!$destroy ) options.backdrop.remove();
          else              $animate.leave(options.backdrop);
        }


        if (options.disableParentScroll) {
          options.restoreScroll();
          delete options.restoreScroll;
        }

        options.hideBackdrop = null;
      };
    }
    function configureAria(element, options) {

      var role = (options.$type === 'alert') ? 'alertdialog' : 'dialog';
      var dialogContent = element.find('md-dialog-content');
      var existingDialogId = element.attr('id');
      var dialogContentId = 'dialogContent_' + (existingDialogId || $mdUtil.nextUid());

      element.attr({
        'role': role,
        'tabIndex': '-1'
      });

      if (dialogContent.length === 0) {
        dialogContent = element;
        if (existingDialogId) {
          dialogContentId = existingDialogId;
        }
      }

      dialogContent.attr('id', dialogContentId);
      element.attr('aria-describedby', dialogContentId);

      if (options.ariaLabel) {
        $mdAria.expect(element, 'aria-label', options.ariaLabel);
      }
      else {
        $mdAria.expectAsync(element, 'aria-label', function() {
          var words = dialogContent.text().split(/\s+/);
          if (words.length > 3) words = words.slice(0, 3).concat('...');
          return words.join(' ');
        });
      }
      topFocusTrap = document.createElement('div');
      topFocusTrap.classList.add('md-dialog-focus-trap');
      topFocusTrap.tabIndex = 0;

      bottomFocusTrap = topFocusTrap.cloneNode(false);
      var focusHandler = function() {
        element.focus();
      };
      topFocusTrap.addEventListener('focus', focusHandler);
      bottomFocusTrap.addEventListener('focus', focusHandler);
      element[0].parentNode.insertBefore(topFocusTrap, element[0]);
      element.after(bottomFocusTrap);
    }
    function lockScreenReader(element, options) {
      var isHidden = true;
      walkDOM(element[0]);

      options.unlockScreenReader = function() {
        isHidden = false;
        walkDOM(element[0]);

        options.unlockScreenReader = null;
      };
      function walkDOM(element) {
        while (element.parentNode) {
          if (element === document.body) {
            return;
          }
          var children = element.parentNode.children;
          for (var i = 0; i < children.length; i++) {
            if (element !== children[i] && !isNodeOneOf(children[i], ['SCRIPT', 'STYLE'])) {
              children[i].setAttribute('aria-hidden', isHidden);
            }
          }

          walkDOM(element = element.parentNode);
        }
      }
    }
    function stretchDialogContainerToViewport(container, options) {
      var isFixed = $window.getComputedStyle($document[0].body).position == 'fixed';
      var backdrop = options.backdrop ? $window.getComputedStyle(options.backdrop[0]) : null;
      var height = backdrop ? Math.min($document[0].body.clientHeight, Math.ceil(Math.abs(parseInt(backdrop.height, 10)))) : 0;

      var previousStyles = {
        top: container.css('top'),
        height: container.css('height')
      };

      container.css({
        top: (isFixed ? $mdUtil.scrollTop(options.parent) : 0) + 'px',
        height: height ? height + 'px' : '100%'
      });

      return function() {
        container.css(previousStyles);
      };
    }
    function dialogPopIn(container, options) {
      options.parent.append(container);
      options.reverseContainerStretch = stretchDialogContainerToViewport(container, options);

      var dialogEl = container.find('md-dialog');
      var animator = $mdUtil.dom.animator;
      var buildTranslateToOrigin = animator.calculateZoomToOrigin;
      var translateOptions = {transitionInClass: 'md-transition-in', transitionOutClass: 'md-transition-out'};
      var from = animator.toTransformCss(buildTranslateToOrigin(dialogEl, options.openFrom || options.origin));
      var to = animator.toTransformCss("");  // defaults to center display (or parent or $rootElement)

      dialogEl.toggleClass('md-dialog-fullscreen', !!options.fullscreen);

      return animator
        .translate3d(dialogEl, from, to, translateOptions)
        .then(function(animateReversal) {
          options.reverseAnimate = function() {
            delete options.reverseAnimate;

            if (options.closeTo) {
              translateOptions = {transitionInClass: 'md-transition-out', transitionOutClass: 'md-transition-in'};
              from = to;
              to = animator.toTransformCss(buildTranslateToOrigin(dialogEl, options.closeTo));

              return animator
                .translate3d(dialogEl, from, to,translateOptions);
            }

            return animateReversal(
              to = animator.toTransformCss(
                buildTranslateToOrigin(dialogEl, options.origin)
              )
            );

          };
          options.clearAnimate = function() {
            delete options.clearAnimate;
            dialogEl.removeClass([
              translateOptions.transitionOutClass,
              translateOptions.transitionInClass
            ].join(' '));
            return animator.translate3d(dialogEl, to, animator.toTransformCss(''), {});
          };

          return true;
        });
    }
    function dialogPopOut(container, options) {
      return options.reverseAnimate().then(function() {
        if (options.contentElement) {
          options.clearAnimate();
        }
      });
    }
    function isNodeOneOf(elem, nodeTypeArray) {
      if (nodeTypeArray.indexOf(elem.nodeName) !== -1) {
        return true;
      }
    }

  }
}

})();
(function(){
"use strict";
MdDividerDirective.$inject = ["$mdTheming"];
angular.module('material.components.divider', [
  'material.core'
])
  .directive('mdDivider', MdDividerDirective);
function MdDividerDirective($mdTheming) {
  return {
    restrict: 'E',
    link: $mdTheming
  };
}

})();
(function(){
"use strict";

(function() {
  'use strict';
  MdFabActionsDirective.$inject = ["$mdUtil"];
  angular
    .module('material.components.fabActions', ['material.core'])
    .directive('mdFabActions', MdFabActionsDirective);
  function MdFabActionsDirective($mdUtil) {
    return {
      restrict: 'E',

      require: ['^?mdFabSpeedDial', '^?mdFabToolbar'],

      compile: function(element, attributes) {
        var children = element.children();

        var hasNgRepeat = $mdUtil.prefixer().hasAttribute(children, 'ng-repeat');
        if (hasNgRepeat) {
          children.addClass('md-fab-action-item');
        } else {
          children.wrap('<div class="md-fab-action-item">');
        }
      }
    }
  }

})();

})();
(function(){
"use strict";

(function() {
  'use strict';

  MdFabController.$inject = ["$scope", "$element", "$animate", "$mdUtil", "$mdConstant", "$timeout"];
  angular.module('material.components.fabShared', ['material.core'])
    .controller('MdFabController', MdFabController);

  function MdFabController($scope, $element, $animate, $mdUtil, $mdConstant, $timeout) {
    var vm = this;

    vm.open = function() {
      $scope.$evalAsync("vm.isOpen = true");
    };

    vm.close = function() {
      $scope.$evalAsync("vm.isOpen = false");
      $element.find('md-fab-trigger')[0].focus();
    };
    vm.toggle = function() {
      $scope.$evalAsync("vm.isOpen = !vm.isOpen");
    };

    setupDefaults();
    setupListeners();
    setupWatchers();

    var initialAnimationAttempts = 0;
    fireInitialAnimations();

    function setupDefaults() {
      vm.direction = vm.direction || 'down';
      vm.isOpen = vm.isOpen || false;
      resetActionIndex();
      $element.addClass('md-animations-waiting');
    }

    function setupListeners() {
      var eventTypes = [
        'click', 'focusin', 'focusout'
      ];
      angular.forEach(eventTypes, function(eventType) {
        $element.on(eventType, parseEvents);
      });
      $scope.$on('$destroy', function() {
        angular.forEach(eventTypes, function(eventType) {
          $element.off(eventType, parseEvents);
        });
        disableKeyboard();
      });
    }

    var closeTimeout;
    function parseEvents(event) {
      if (event.type == 'click') {
        handleItemClick(event);
      }
      if (event.type == 'focusout' && !closeTimeout) {
        closeTimeout = $timeout(function() {
          vm.close();
        }, 100, false);
      }
      if (event.type == 'focusin' && closeTimeout) {
        $timeout.cancel(closeTimeout);
        closeTimeout = null;
      }
    }

    function resetActionIndex() {
      vm.currentActionIndex = -1;
    }

    function setupWatchers() {
      $scope.$watch('vm.direction', function(newDir, oldDir) {
        $animate.removeClass($element, 'md-' + oldDir);
        $animate.addClass($element, 'md-' + newDir);
        resetActionIndex();
      });

      var trigger, actions;
      $scope.$watch('vm.isOpen', function(isOpen) {
        resetActionIndex();
        if (!trigger || !actions) {
          trigger = getTriggerElement();
          actions = getActionsElement();
        }

        if (isOpen) {
          enableKeyboard();
        } else {
          disableKeyboard();
        }

        var toAdd = isOpen ? 'md-is-open' : '';
        var toRemove = isOpen ? '' : 'md-is-open';
        trigger.attr('aria-haspopup', true);
        trigger.attr('aria-expanded', isOpen);
        actions.attr('aria-hidden', !isOpen);
        $animate.setClass($element, toAdd, toRemove);
      });
    }

    function fireInitialAnimations() {
      if ($element[0].scrollHeight > 0) {
        $animate.addClass($element, '_md-animations-ready').then(function() {
          $element.removeClass('md-animations-waiting');
        });
      }
      else if (initialAnimationAttempts < 10) {
        $timeout(fireInitialAnimations, 100);
        initialAnimationAttempts = initialAnimationAttempts + 1;
      }
    }

    function enableKeyboard() {
      $element.on('keydown', keyPressed);
      $mdUtil.nextTick(function() {
        angular.element(document).on('click touchend', checkForOutsideClick);
      });
    }

    function disableKeyboard() {
      $element.off('keydown', keyPressed);
      angular.element(document).off('click touchend', checkForOutsideClick);
    }

    function checkForOutsideClick(event) {
      if (event.target) {
        var closestTrigger = $mdUtil.getClosest(event.target, 'md-fab-trigger');
        var closestActions = $mdUtil.getClosest(event.target, 'md-fab-actions');

        if (!closestTrigger && !closestActions) {
          vm.close();
        }
      }
    }

    function keyPressed(event) {
      switch (event.which) {
        case $mdConstant.KEY_CODE.ESCAPE: vm.close(); event.preventDefault(); return false;
        case $mdConstant.KEY_CODE.LEFT_ARROW: doKeyLeft(event); return false;
        case $mdConstant.KEY_CODE.UP_ARROW: doKeyUp(event); return false;
        case $mdConstant.KEY_CODE.RIGHT_ARROW: doKeyRight(event); return false;
        case $mdConstant.KEY_CODE.DOWN_ARROW: doKeyDown(event); return false;
      }
    }

    function doActionPrev(event) {
      focusAction(event, -1);
    }

    function doActionNext(event) {
      focusAction(event, 1);
    }

    function focusAction(event, direction) {
      var actions = resetActionTabIndexes();
      vm.currentActionIndex = vm.currentActionIndex + direction;
      vm.currentActionIndex = Math.min(actions.length - 1, vm.currentActionIndex);
      vm.currentActionIndex = Math.max(0, vm.currentActionIndex);
      var focusElement =  angular.element(actions[vm.currentActionIndex]).children()[0];
      angular.element(focusElement).attr('tabindex', 0);
      focusElement.focus();
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    function resetActionTabIndexes() {
      var actions = getActionsElement()[0].querySelectorAll('.md-fab-action-item');
      angular.forEach(actions, function(action) {
        angular.element(angular.element(action).children()[0]).attr('tabindex', -1);
      });

      return actions;
    }

    function doKeyLeft(event) {
      if (vm.direction === 'left') {
        doActionNext(event);
      } else {
        doActionPrev(event);
      }
    }

    function doKeyUp(event) {
      if (vm.direction === 'down') {
        doActionPrev(event);
      } else {
        doActionNext(event);
      }
    }

    function doKeyRight(event) {
      if (vm.direction === 'left') {
        doActionPrev(event);
      } else {
        doActionNext(event);
      }
    }

    function doKeyDown(event) {
      if (vm.direction === 'up') {
        doActionPrev(event);
      } else {
        doActionNext(event);
      }
    }

    function isTrigger(element) {
      return $mdUtil.getClosest(element, 'md-fab-trigger');
    }

    function isAction(element) {
      return $mdUtil.getClosest(element, 'md-fab-actions');
    }

    function handleItemClick(event) {
      if (isTrigger(event.target)) {
        vm.toggle();
      }

      if (isAction(event.target)) {
        vm.close();
      }
    }

    function getTriggerElement() {
      return $element.find('md-fab-trigger');
    }

    function getActionsElement() {
      return $element.find('md-fab-actions');
    }
  }
})();

})();
(function(){
"use strict";

(function() {
  'use strict';
  MdFabSpeedDialFlingAnimation.$inject = ["$timeout"];
  MdFabSpeedDialScaleAnimation.$inject = ["$timeout"];
  var cssAnimationDuration = 300;
  angular
    .module('material.components.fabSpeedDial', [
      'material.core',
      'material.components.fabShared',
      'material.components.fabActions'
    ])
    .directive('mdFabSpeedDial', MdFabSpeedDialDirective)
    .animation('.md-fling', MdFabSpeedDialFlingAnimation)
    .animation('.md-scale', MdFabSpeedDialScaleAnimation)
    .service('mdFabSpeedDialFlingAnimation', MdFabSpeedDialFlingAnimation)
    .service('mdFabSpeedDialScaleAnimation', MdFabSpeedDialScaleAnimation);
  function MdFabSpeedDialDirective() {
    return {
      restrict: 'E',

      scope: {
        direction: '@?mdDirection',
        isOpen: '=?mdOpen'
      },

      bindToController: true,
      controller: 'MdFabController',
      controllerAs: 'vm',

      link: FabSpeedDialLink
    };

    function FabSpeedDialLink(scope, element) {
      element.prepend('<div class="_md-css-variables"></div>');
    }
  }

  function MdFabSpeedDialFlingAnimation($timeout) {
    function delayDone(done) { $timeout(done, cssAnimationDuration, false); }

    function runAnimation(element) {
      if (element.hasClass('md-animations-waiting') && !element.hasClass('_md-animations-ready')) {
        return;
      }

      var el = element[0];
      var ctrl = element.controller('mdFabSpeedDial');
      var items = el.querySelectorAll('.md-fab-action-item');
      var triggerElement = el.querySelector('md-fab-trigger');
      var variablesElement = el.querySelector('._md-css-variables');
      var startZIndex = parseInt(window.getComputedStyle(variablesElement).zIndex);
      angular.forEach(items, function(item, index) {
        var styles = item.style;

        styles.transform = styles.webkitTransform = '';
        styles.transitionDelay = '';
        styles.opacity = 1;
        styles.zIndex = (items.length - index) + startZIndex;
      });
      triggerElement.style.zIndex = startZIndex + items.length + 1;
      if (!ctrl.isOpen) {
        angular.forEach(items, function(item, index) {
          var newPosition, axis;
          var styles = item.style;
          var triggerItemHeightOffset = (triggerElement.clientHeight - item.clientHeight) / 2;
          var triggerItemWidthOffset = (triggerElement.clientWidth - item.clientWidth) / 2;

          switch (ctrl.direction) {
            case 'up':
              newPosition = (item.scrollHeight * (index + 1) + triggerItemHeightOffset);
              axis = 'Y';
              break;
            case 'down':
              newPosition = -(item.scrollHeight * (index + 1) + triggerItemHeightOffset);
              axis = 'Y';
              break;
            case 'left':
              newPosition = (item.scrollWidth * (index + 1) + triggerItemWidthOffset);
              axis = 'X';
              break;
            case 'right':
              newPosition = -(item.scrollWidth * (index + 1) + triggerItemWidthOffset);
              axis = 'X';
              break;
          }

          var newTranslate = 'translate' + axis + '(' + newPosition + 'px)';

          styles.transform = styles.webkitTransform = newTranslate;
        });
      }
    }

    return {
      addClass: function(element, className, done) {
        if (element.hasClass('md-fling')) {
          runAnimation(element);
          delayDone(done);
        } else {
          done();
        }
      },
      removeClass: function(element, className, done) {
        runAnimation(element);
        delayDone(done);
      }
    }
  }

  function MdFabSpeedDialScaleAnimation($timeout) {
    function delayDone(done) { $timeout(done, cssAnimationDuration, false); }

    var delay = 65;

    function runAnimation(element) {
      var el = element[0];
      var ctrl = element.controller('mdFabSpeedDial');
      var items = el.querySelectorAll('.md-fab-action-item');
      var variablesElement = el.querySelector('._md-css-variables');
      var startZIndex = parseInt(window.getComputedStyle(variablesElement).zIndex);
      angular.forEach(items, function(item, index) {
        var styles = item.style,
          offsetDelay = index * delay;

        styles.opacity = ctrl.isOpen ? 1 : 0;
        styles.transform = styles.webkitTransform = ctrl.isOpen ? 'scale(1)' : 'scale(0)';
        styles.transitionDelay = (ctrl.isOpen ? offsetDelay : (items.length - offsetDelay)) + 'ms';
        styles.zIndex = (items.length - index) + startZIndex;
      });
    }

    return {
      addClass: function(element, className, done) {
        runAnimation(element);
        delayDone(done);
      },

      removeClass: function(element, className, done) {
        runAnimation(element);
        delayDone(done);
      }
    }
  }
})();

})();
(function(){
"use strict";

(function() {
  'use strict';
  angular
    .module('material.components.fabToolbar', [
      'material.core',
      'material.components.fabShared',
      'material.components.fabActions'
    ])
    .directive('mdFabToolbar', MdFabToolbarDirective)
    .animation('.md-fab-toolbar', MdFabToolbarAnimation)
    .service('mdFabToolbarAnimation', MdFabToolbarAnimation);
  function MdFabToolbarDirective() {
    return {
      restrict: 'E',
      transclude: true,
      template: '<div class="md-fab-toolbar-wrapper">' +
      '  <div class="md-fab-toolbar-content" ng-transclude></div>' +
      '</div>',

      scope: {
        direction: '@?mdDirection',
        isOpen: '=?mdOpen'
      },

      bindToController: true,
      controller: 'MdFabController',
      controllerAs: 'vm',

      link: link
    };

    function link(scope, element, attributes) {
      element.addClass('md-fab-toolbar');
      element.find('md-fab-trigger').find('button')
        .prepend('<div class="md-fab-toolbar-background"></div>');
    }
  }

  function MdFabToolbarAnimation() {

    function runAnimation(element, className, done) {
      if (!className) {
        return;
      }

      var el = element[0];
      var ctrl = element.controller('mdFabToolbar');
      var backgroundElement = el.querySelector('.md-fab-toolbar-background');
      var triggerElement = el.querySelector('md-fab-trigger button');
      var toolbarElement = el.querySelector('md-toolbar');
      var iconElement = el.querySelector('md-fab-trigger button md-icon');
      var actions = element.find('md-fab-actions').children();
      if (triggerElement && backgroundElement) {
        var color = window.getComputedStyle(triggerElement).getPropertyValue('background-color');
        var width = el.offsetWidth;
        var height = el.offsetHeight;
        var scale = 2 * (width / triggerElement.offsetWidth);
        backgroundElement.style.backgroundColor = color;
        backgroundElement.style.borderRadius = width + 'px';
        if (ctrl.isOpen) {
          toolbarElement.style.pointerEvents = 'inherit';

          backgroundElement.style.width = triggerElement.offsetWidth + 'px';
          backgroundElement.style.height = triggerElement.offsetHeight + 'px';
          backgroundElement.style.transform = 'scale(' + scale + ')';
          backgroundElement.style.transitionDelay = '0ms';
          iconElement && (iconElement.style.transitionDelay = '.3s');
          angular.forEach(actions, function(action, index) {
            action.style.transitionDelay = (actions.length - index) * 25 + 'ms';
          });
        } else {
          toolbarElement.style.pointerEvents = 'none';
          backgroundElement.style.transform = 'scale(1)';
          backgroundElement.style.top = '0';

          if (element.hasClass('md-right')) {
            backgroundElement.style.left = '0';
            backgroundElement.style.right = null;
          }

          if (element.hasClass('md-left')) {
            backgroundElement.style.right = '0';
            backgroundElement.style.left = null;
          }
          backgroundElement.style.transitionDelay = '200ms';
          iconElement && (iconElement.style.transitionDelay = '0ms');
          angular.forEach(actions, function(action, index) {
            action.style.transitionDelay = 200 + (index * 25) + 'ms';
          });
        }
      }
    }

    return {
      addClass: function(element, className, done) {
        runAnimation(element, className, done);
        done();
      },

      removeClass: function(element, className, done) {
        runAnimation(element, className, done);
        done();
      }
    }
  }
})();

})();
(function(){
"use strict";
GridListController.$inject = ["$mdUtil"];
GridLayoutFactory.$inject = ["$mdUtil"];
GridListDirective.$inject = ["$interpolate", "$mdConstant", "$mdGridLayout", "$mdMedia"];
GridTileDirective.$inject = ["$mdMedia"];
angular.module('material.components.gridList', ['material.core'])
       .directive('mdGridList', GridListDirective)
       .directive('mdGridTile', GridTileDirective)
       .directive('mdGridTileFooter', GridTileCaptionDirective)
       .directive('mdGridTileHeader', GridTileCaptionDirective)
       .factory('$mdGridLayout', GridLayoutFactory);
function GridListDirective($interpolate, $mdConstant, $mdGridLayout, $mdMedia) {
  return {
    restrict: 'E',
    controller: GridListController,
    scope: {
      mdOnLayout: '&'
    },
    link: postLink
  };

  function postLink(scope, element, attrs, ctrl) {
    element.addClass('_md');     // private md component indicator for styling
    element.attr('role', 'list');
    ctrl.layoutDelegate = layoutDelegate;

    var invalidateLayout = angular.bind(ctrl, ctrl.invalidateLayout),
        unwatchAttrs = watchMedia();
      scope.$on('$destroy', unwatchMedia);
    function watchMedia() {
      for (var mediaName in $mdConstant.MEDIA) {
        $mdMedia(mediaName); // initialize
        $mdMedia.getQuery($mdConstant.MEDIA[mediaName])
            .addListener(invalidateLayout);
      }
      return $mdMedia.watchResponsiveAttributes(
          ['md-cols', 'md-row-height', 'md-gutter'], attrs, layoutIfMediaMatch);
    }

    function unwatchMedia() {
      ctrl.layoutDelegate = angular.noop;

      unwatchAttrs();
      for (var mediaName in $mdConstant.MEDIA) {
        $mdMedia.getQuery($mdConstant.MEDIA[mediaName])
            .removeListener(invalidateLayout);
      }
    }
    function layoutIfMediaMatch(mediaName) {
      if (mediaName == null) {
        ctrl.invalidateLayout();
      } else if ($mdMedia(mediaName)) {
        ctrl.invalidateLayout();
      }
    }

    var lastLayoutProps;
    function layoutDelegate(tilesInvalidated) {
      var tiles = getTileElements();
      var props = {
        tileSpans: getTileSpans(tiles),
        colCount: getColumnCount(),
        rowMode: getRowMode(),
        rowHeight: getRowHeight(),
        gutter: getGutter()
      };

      if (!tilesInvalidated && angular.equals(props, lastLayoutProps)) {
        return;
      }

      var performance =
        $mdGridLayout(props.colCount, props.tileSpans, tiles)
          .map(function(tilePositions, rowCount) {
            return {
              grid: {
                element: element,
                style: getGridStyle(props.colCount, rowCount,
                    props.gutter, props.rowMode, props.rowHeight)
              },
              tiles: tilePositions.map(function(ps, i) {
                return {
                  element: angular.element(tiles[i]),
                  style: getTileStyle(ps.position, ps.spans,
                      props.colCount, rowCount,
                      props.gutter, props.rowMode, props.rowHeight)
                }
              })
            }
          })
          .reflow()
          .performance();
      scope.mdOnLayout({
        $event: {
          performance: performance
        }
      });

      lastLayoutProps = props;
    }

    var startSymbol = $interpolate.startSymbol();
    var endSymbol = $interpolate.endSymbol();
    function expr(exprStr) {
      return startSymbol + exprStr + endSymbol;
    }
    var UNIT = $interpolate(expr('share') + '% - (' + expr('gutter') + ' * ' + expr('gutterShare') + ')');
    var POSITION  = $interpolate('calc((' + expr('unit') + ' + ' + expr('gutter') + ') * ' + expr('offset') + ')');
    var DIMENSION = $interpolate('calc((' + expr('unit') + ') * ' + expr('span') + ' + (' + expr('span') + ' - 1) * ' + expr('gutter') + ')');
    function getTileStyle(position, spans, colCount, rowCount, gutter, rowMode, rowHeight) {
      var hShare = (1 / colCount) * 100;
      var hGutterShare = (colCount - 1) / colCount;
      var hUnit = UNIT({share: hShare, gutterShare: hGutterShare, gutter: gutter});
      var style = {
        left: POSITION({ unit: hUnit, offset: position.col, gutter: gutter }),
        width: DIMENSION({ unit: hUnit, span: spans.col, gutter: gutter }),
        paddingTop: '',
        marginTop: '',
        top: '',
        height: ''
      };

      switch (rowMode) {
        case 'fixed':
          style.top = POSITION({ unit: rowHeight, offset: position.row, gutter: gutter });
          style.height = DIMENSION({ unit: rowHeight, span: spans.row, gutter: gutter });
          break;

        case 'ratio':
          var vShare = hShare / rowHeight;
          var vUnit = UNIT({ share: vShare, gutterShare: hGutterShare, gutter: gutter });
          style.paddingTop = DIMENSION({ unit: vUnit, span: spans.row, gutter: gutter});
          style.marginTop = POSITION({ unit: vUnit, offset: position.row, gutter: gutter });
          break;

        case 'fit':
          var vGutterShare = (rowCount - 1) / rowCount;
          var vShare = (1 / rowCount) * 100;
          var vUnit = UNIT({share: vShare, gutterShare: vGutterShare, gutter: gutter});

          style.top = POSITION({unit: vUnit, offset: position.row, gutter: gutter});
          style.height = DIMENSION({unit: vUnit, span: spans.row, gutter: gutter});
          break;
      }

      return style;
    }

    function getGridStyle(colCount, rowCount, gutter, rowMode, rowHeight) {
      var style = {};

      switch(rowMode) {
        case 'fixed':
          style.height = DIMENSION({ unit: rowHeight, span: rowCount, gutter: gutter });
          style.paddingBottom = '';
          break;

        case 'ratio':
          var hGutterShare = colCount === 1 ? 0 : (colCount - 1) / colCount,
              hShare = (1 / colCount) * 100,
              vShare = hShare * (1 / rowHeight),
              vUnit = UNIT({ share: vShare, gutterShare: hGutterShare, gutter: gutter });

          style.height = '';
          style.paddingBottom = DIMENSION({ unit: vUnit, span: rowCount, gutter: gutter});
          break;

        case 'fit':
          break;
      }

      return style;
    }

    function getTileElements() {
      return [].filter.call(element.children(), function(ele) {
        return ele.tagName == 'MD-GRID-TILE' && !ele.$$mdDestroyed;
      });
    }
    function getTileSpans(tileElements) {
      return [].map.call(tileElements, function(ele) {
        var ctrl = angular.element(ele).controller('mdGridTile');
        return {
          row: parseInt(
              $mdMedia.getResponsiveAttribute(ctrl.$attrs, 'md-rowspan'), 10) || 1,
          col: parseInt(
              $mdMedia.getResponsiveAttribute(ctrl.$attrs, 'md-colspan'), 10) || 1
        };
      });
    }

    function getColumnCount() {
      var colCount = parseInt($mdMedia.getResponsiveAttribute(attrs, 'md-cols'), 10);
      if (isNaN(colCount)) {
        throw 'md-grid-list: md-cols attribute was not found, or contained a non-numeric value';
      }
      return colCount;
    }

    function getGutter() {
      return applyDefaultUnit($mdMedia.getResponsiveAttribute(attrs, 'md-gutter') || 1);
    }

    function getRowHeight() {
      var rowHeight = $mdMedia.getResponsiveAttribute(attrs, 'md-row-height');
      if (!rowHeight) {
        throw 'md-grid-list: md-row-height attribute was not found';
      }

      switch (getRowMode()) {
        case 'fixed':
          return applyDefaultUnit(rowHeight);
        case 'ratio':
          var whRatio = rowHeight.split(':');
          return parseFloat(whRatio[0]) / parseFloat(whRatio[1]);
        case 'fit':
          return 0; // N/A
      }
    }

    function getRowMode() {
      var rowHeight = $mdMedia.getResponsiveAttribute(attrs, 'md-row-height');
      if (!rowHeight) {
        throw 'md-grid-list: md-row-height attribute was not found';
      }

      if (rowHeight == 'fit') {
        return 'fit';
      } else if (rowHeight.indexOf(':') !== -1) {
        return 'ratio';
      } else {
        return 'fixed';
      }
    }

    function applyDefaultUnit(val) {
      return /\D$/.test(val) ? val : val + 'px';
    }
  }
}
function GridListController($mdUtil) {
  this.layoutInvalidated = false;
  this.tilesInvalidated = false;
  this.$timeout_ = $mdUtil.nextTick;
  this.layoutDelegate = angular.noop;
}

GridListController.prototype = {
  invalidateTiles: function() {
    this.tilesInvalidated = true;
    this.invalidateLayout();
  },

  invalidateLayout: function() {
    if (this.layoutInvalidated) {
      return;
    }
    this.layoutInvalidated = true;
    this.$timeout_(angular.bind(this, this.layout));
  },

  layout: function() {
    try {
      this.layoutDelegate(this.tilesInvalidated);
    } finally {
      this.layoutInvalidated = false;
      this.tilesInvalidated = false;
    }
  }
};
function GridLayoutFactory($mdUtil) {
  var defaultAnimator = GridTileAnimator;
  GridLayout.animateWith = function(customAnimator) {
    defaultAnimator = !angular.isFunction(customAnimator) ? GridTileAnimator : customAnimator;
  };

  return GridLayout;
  function GridLayout(colCount, tileSpans) {
      var self, layoutInfo, gridStyles, layoutTime, mapTime, reflowTime;

      layoutTime = $mdUtil.time(function() {
        layoutInfo = calculateGridFor(colCount, tileSpans);
      });

      return self = {
        layoutInfo: function() {
          return layoutInfo;
        },
        map: function(updateFn) {
          mapTime = $mdUtil.time(function() {
            var info = self.layoutInfo();
            gridStyles = updateFn(info.positioning, info.rowCount);
          });
          return self;
        },
        reflow: function(animatorFn) {
          reflowTime = $mdUtil.time(function() {
            var animator = animatorFn || defaultAnimator;
            animator(gridStyles.grid, gridStyles.tiles);
          });
          return self;
        },
        performance: function() {
          return {
            tileCount: tileSpans.length,
            layoutTime: layoutTime,
            mapTime: mapTime,
            reflowTime: reflowTime,
            totalTime: layoutTime + mapTime + reflowTime
          };
        }
      };
    }
  function GridTileAnimator(grid, tiles) {
    grid.element.css(grid.style);
    tiles.forEach(function(t) {
      t.element.css(t.style);
    })
  }
  function calculateGridFor(colCount, tileSpans) {
    var curCol = 0,
        curRow = 0,
        spaceTracker = newSpaceTracker();

    return {
      positioning: tileSpans.map(function(spans, i) {
        return {
          spans: spans,
          position: reserveSpace(spans, i)
        };
      }),
      rowCount: curRow + Math.max.apply(Math, spaceTracker)
    };

    function reserveSpace(spans, i) {
      if (spans.col > colCount) {
        throw 'md-grid-list: Tile at position ' + i + ' has a colspan ' +
            '(' + spans.col + ') that exceeds the column count ' +
            '(' + colCount + ')';
      }

      var start = 0,
          end = 0;
      while (end - start < spans.col) {
        if (curCol >= colCount) {
          nextRow();
          continue;
        }

        start = spaceTracker.indexOf(0, curCol);
        if (start === -1 || (end = findEnd(start + 1)) === -1) {
          start = end = 0;
          nextRow();
          continue;
        }

        curCol = end + 1;
      }

      adjustRow(start, spans.col, spans.row);
      curCol = start + spans.col;

      return {
        col: start,
        row: curRow
      };
    }

    function nextRow() {
      curCol = 0;
      curRow++;
      adjustRow(0, colCount, -1); // Decrement row spans by one
    }

    function adjustRow(from, cols, by) {
      for (var i = from; i < from + cols; i++) {
        spaceTracker[i] = Math.max(spaceTracker[i] + by, 0);
      }
    }

    function findEnd(start) {
      var i;
      for (i = start; i < spaceTracker.length; i++) {
        if (spaceTracker[i] !== 0) {
          return i;
        }
      }

      if (i === spaceTracker.length) {
        return i;
      }
    }

    function newSpaceTracker() {
      var tracker = [];
      for (var i = 0; i < colCount; i++) {
        tracker.push(0);
      }
      return tracker;
    }
  }
}
function GridTileDirective($mdMedia) {
  return {
    restrict: 'E',
    require: '^mdGridList',
    template: '<figure ng-transclude></figure>',
    transclude: true,
    scope: {},
    controller: ["$attrs", function($attrs) {
      this.$attrs = $attrs;
    }],
    link: postLink
  };

  function postLink(scope, element, attrs, gridCtrl) {
    element.attr('role', 'listitem');
    var unwatchAttrs = $mdMedia.watchResponsiveAttributes(['md-colspan', 'md-rowspan'],
        attrs, angular.bind(gridCtrl, gridCtrl.invalidateLayout));
    gridCtrl.invalidateTiles();
    scope.$on('$destroy', function() {
      element[0].$$mdDestroyed = true;
      unwatchAttrs();
      gridCtrl.invalidateLayout();
    });

    if (angular.isDefined(scope.$parent.$index)) {
      scope.$watch(function() { return scope.$parent.$index; },
        function indexChanged(newIdx, oldIdx) {
          if (newIdx === oldIdx) {
            return;
          }
          gridCtrl.invalidateTiles();
        });
    }
  }
}


function GridTileCaptionDirective() {
  return {
    template: '<figcaption ng-transclude></figcaption>',
    transclude: true
  };
}

})();
(function(){
"use strict";
angular.module('material.components.icon', ['material.core']);

})();
(function(){
"use strict";
mdInputContainerDirective.$inject = ["$mdTheming", "$parse"];
inputTextareaDirective.$inject = ["$mdUtil", "$window", "$mdAria", "$timeout", "$mdGesture"];
mdMaxlengthDirective.$inject = ["$animate", "$mdUtil"];
placeholderDirective.$inject = ["$compile"];
ngMessageDirective.$inject = ["$mdUtil"];
mdSelectOnFocusDirective.$inject = ["$timeout"];
mdInputInvalidMessagesAnimation.$inject = ["$$AnimateRunner", "$animateCss", "$mdUtil"];
ngMessagesAnimation.$inject = ["$$AnimateRunner", "$animateCss", "$mdUtil"];
ngMessageAnimation.$inject = ["$$AnimateRunner", "$animateCss", "$mdUtil"];
angular.module('material.components.input', [
    'material.core'
  ])
  .directive('mdInputContainer', mdInputContainerDirective)
  .directive('label', labelDirective)
  .directive('input', inputTextareaDirective)
  .directive('textarea', inputTextareaDirective)
  .directive('mdMaxlength', mdMaxlengthDirective)
  .directive('placeholder', placeholderDirective)
  .directive('ngMessages', ngMessagesDirective)
  .directive('ngMessage', ngMessageDirective)
  .directive('ngMessageExp', ngMessageDirective)
  .directive('mdSelectOnFocus', mdSelectOnFocusDirective)

  .animation('.md-input-invalid', mdInputInvalidMessagesAnimation)
  .animation('.md-input-messages-animation', ngMessagesAnimation)
  .animation('.md-input-message-animation', ngMessageAnimation)
  .service('mdInputInvalidAnimation', mdInputInvalidMessagesAnimation)
  .service('mdInputMessagesAnimation', ngMessagesAnimation)
  .service('mdInputMessageAnimation', ngMessageAnimation);
function mdInputContainerDirective($mdTheming, $parse) {

  ContainerCtrl.$inject = ["$scope", "$element", "$attrs", "$animate"];
  var INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT', 'MD-SELECT'];

  var LEFT_SELECTORS = INPUT_TAGS.reduce(function(selectors, isel) {
    return selectors.concat(['md-icon ~ ' + isel, '.md-icon ~ ' + isel]);
  }, []).join(",");

  var RIGHT_SELECTORS = INPUT_TAGS.reduce(function(selectors, isel) {
    return selectors.concat([isel + ' ~ md-icon', isel + ' ~ .md-icon']);
  }, []).join(",");

  return {
    restrict: 'E',
    compile: compile,
    controller: ContainerCtrl
  };

  function compile(tElement) {
    var leftIcon = tElement[0].querySelector(LEFT_SELECTORS);
    var rightIcon = tElement[0].querySelector(RIGHT_SELECTORS);

    if (leftIcon) { tElement.addClass('md-icon-left'); }
    if (rightIcon) { tElement.addClass('md-icon-right'); }

    return function postLink(scope, element) {
      $mdTheming(element);
    };
  }

  function ContainerCtrl($scope, $element, $attrs, $animate) {
    var self = this;

    self.isErrorGetter = $attrs.mdIsError && $parse($attrs.mdIsError);

    self.delegateClick = function() {
      self.input.focus();
    };
    self.element = $element;
    self.setFocused = function(isFocused) {
      $element.toggleClass('md-input-focused', !!isFocused);
    };
    self.setHasValue = function(hasValue) {
      $element.toggleClass('md-input-has-value', !!hasValue);
    };
    self.setHasPlaceholder = function(hasPlaceholder) {
      $element.toggleClass('md-input-has-placeholder', !!hasPlaceholder);
    };
    self.setInvalid = function(isInvalid) {
      if (isInvalid) {
        $animate.addClass($element, 'md-input-invalid');
      } else {
        $animate.removeClass($element, 'md-input-invalid');
      }
    };
    $scope.$watch(function() {
      return self.label && self.input;
    }, function(hasLabelAndInput) {
      if (hasLabelAndInput && !self.label.attr('for')) {
        self.label.attr('for', self.input.attr('id'));
      }
    });
  }
}

function labelDirective() {
  return {
    restrict: 'E',
    require: '^?mdInputContainer',
    link: function(scope, element, attr, containerCtrl) {
      if (!containerCtrl || attr.mdNoFloat || element.hasClass('md-container-ignore')) return;

      containerCtrl.label = element;
      scope.$on('$destroy', function() {
        containerCtrl.label = null;
      });
    }
  };
}

function inputTextareaDirective($mdUtil, $window, $mdAria, $timeout, $mdGesture) {
  return {
    restrict: 'E',
    require: ['^?mdInputContainer', '?ngModel', '?^form'],
    link: postLink
  };

  function postLink(scope, element, attr, ctrls) {

    var containerCtrl = ctrls[0];
    var hasNgModel = !!ctrls[1];
    var ngModelCtrl = ctrls[1] || $mdUtil.fakeNgModel();
    var parentForm = ctrls[2];
    var isReadonly = angular.isDefined(attr.readonly);
    var mdNoAsterisk = $mdUtil.parseAttributeBoolean(attr.mdNoAsterisk);
    var tagName = element[0].tagName.toLowerCase();


    if (!containerCtrl) return;
    if (attr.type === 'hidden') {
      element.attr('aria-hidden', 'true');
      return;
    } else if (containerCtrl.input) {
      if (containerCtrl.input[0].contains(element[0])) {
        return;
      } else {
        throw new Error("<md-input-container> can only have *one* <input>, <textarea> or <md-select> child element!");
      }
    }
    containerCtrl.input = element;

    setupAttributeWatchers();
    var errorsSpacer = angular.element('<div class="md-errors-spacer">');
    element.after(errorsSpacer);

    if (!containerCtrl.label) {
      $mdAria.expect(element, 'aria-label', attr.placeholder);
    }

    element.addClass('md-input');
    if (!element.attr('id')) {
      element.attr('id', 'input_' + $mdUtil.nextUid());
    }
    if (tagName === 'input' && attr.type === 'number' && attr.min && attr.max && !attr.step) {
      element.attr('step', 'any');
    } else if (tagName === 'textarea') {
      setupTextarea();
    }
    if (!hasNgModel) {
      inputCheckValue();
    }

    var isErrorGetter = containerCtrl.isErrorGetter || function() {
      return ngModelCtrl.$invalid && (ngModelCtrl.$touched || (parentForm && parentForm.$submitted));
    };

    scope.$watch(isErrorGetter, containerCtrl.setInvalid);
    if (attr.ngValue) {
      attr.$observe('value', inputCheckValue);
    }

    ngModelCtrl.$parsers.push(ngModelPipelineCheckValue);
    ngModelCtrl.$formatters.push(ngModelPipelineCheckValue);

    element.on('input', inputCheckValue);

    if (!isReadonly) {
      element
        .on('focus', function(ev) {
          $mdUtil.nextTick(function() {
            containerCtrl.setFocused(true);
          });
        })
        .on('blur', function(ev) {
          $mdUtil.nextTick(function() {
            containerCtrl.setFocused(false);
            inputCheckValue();
          });
        });
    }

    scope.$on('$destroy', function() {
      containerCtrl.setFocused(false);
      containerCtrl.setHasValue(false);
      containerCtrl.input = null;
    });
    function ngModelPipelineCheckValue(arg) {
      containerCtrl.setHasValue(!ngModelCtrl.$isEmpty(arg));
      return arg;
    }

    function setupAttributeWatchers() {
      if (containerCtrl.label) {
        attr.$observe('required', function (value) {
          containerCtrl.label.toggleClass('md-required', value && !mdNoAsterisk);
        });
      }
    }

    function inputCheckValue() {
      containerCtrl.setHasValue(element.val().length > 0 || (element[0].validity || {}).badInput);
    }

    function setupTextarea() {
      var isAutogrowing = !attr.hasOwnProperty('mdNoAutogrow');

      attachResizeHandle();

      if (!isAutogrowing) return;
      var minRows = attr.hasOwnProperty('rows') ? parseInt(attr.rows) : NaN;
      var maxRows = attr.hasOwnProperty('maxRows') ? parseInt(attr.maxRows) : NaN;
      var scopeResizeListener = scope.$on('md-resize-textarea', growTextarea);
      var lineHeight = null;
      var node = element[0];
      $timeout(function() {
        $mdUtil.nextTick(growTextarea);
      }, 10, false);
      element.on('input', growTextarea);
      if (hasNgModel) {
        ngModelCtrl.$formatters.push(formattersListener);
      }

      if (!minRows) {
        element.attr('rows', 1);
      }

      angular.element($window).on('resize', growTextarea);
      scope.$on('$destroy', disableAutogrow);

      function growTextarea() {
        element
          .attr('rows', 1)
          .css('height', 'auto')
          .addClass('md-no-flex');

        var height = getHeight();

        if (!lineHeight) {
          var originalPadding = element[0].style.padding || '';
          lineHeight = element.css('padding', 0).prop('offsetHeight');
          element[0].style.padding = originalPadding;
        }

        if (minRows && lineHeight) {
          height = Math.max(height, lineHeight * minRows);
        }

        if (maxRows && lineHeight) {
          var maxHeight = lineHeight * maxRows;

          if (maxHeight < height) {
            element.attr('md-no-autogrow', '');
            height = maxHeight;
          } else {
            element.removeAttr('md-no-autogrow');
          }
        }

        if (lineHeight) {
          element.attr('rows', Math.round(height / lineHeight));
        }

        element
          .css('height', height + 'px')
          .removeClass('md-no-flex');
      }

      function getHeight() {
        var offsetHeight = node.offsetHeight;
        var line = node.scrollHeight - offsetHeight;
        return offsetHeight + Math.max(line, 0);
      }

      function formattersListener(value) {
        $mdUtil.nextTick(growTextarea);
        return value;
      }

      function disableAutogrow() {
        if (!isAutogrowing) return;

        isAutogrowing = false;
        angular.element($window).off('resize', growTextarea);
        scopeResizeListener && scopeResizeListener();
        element
          .attr('md-no-autogrow', '')
          .off('input', growTextarea);

        if (hasNgModel) {
          var listenerIndex = ngModelCtrl.$formatters.indexOf(formattersListener);

          if (listenerIndex > -1) {
            ngModelCtrl.$formatters.splice(listenerIndex, 1);
          }
        }
      }

      function attachResizeHandle() {
        if (attr.hasOwnProperty('mdNoResize')) return;

        var handle = angular.element('<div class="md-resize-handle"></div>');
        var isDragging = false;
        var dragStart = null;
        var startHeight = 0;
        var container = containerCtrl.element;
        var dragGestureHandler = $mdGesture.register(handle, 'drag', { horizontal: false });


        element.wrap('<div class="md-resize-wrapper">').after(handle);
        handle.on('mousedown', onMouseDown);

        container
          .on('$md.dragstart', onDragStart)
          .on('$md.drag', onDrag)
          .on('$md.dragend', onDragEnd);

        scope.$on('$destroy', function() {
          handle
            .off('mousedown', onMouseDown)
            .remove();

          container
            .off('$md.dragstart', onDragStart)
            .off('$md.drag', onDrag)
            .off('$md.dragend', onDragEnd);

          dragGestureHandler();
          handle = null;
          container = null;
          dragGestureHandler = null;
        });

        function onMouseDown(ev) {
          ev.preventDefault();
          isDragging = true;
          dragStart = ev.clientY;
          startHeight = parseFloat(element.css('height')) || element.prop('offsetHeight');
        }

        function onDragStart(ev) {
          if (!isDragging) return;
          ev.preventDefault();
          disableAutogrow();
          container.addClass('md-input-resized');
        }

        function onDrag(ev) {
          if (!isDragging) return;
          element.css('height', startHeight + (ev.pointer.y - dragStart) - $mdUtil.scrollTop() + 'px');
        }

        function onDragEnd(ev) {
          if (!isDragging) return;
          isDragging = false;
          container.removeClass('md-input-resized');
        }
      }
      if (attr.hasOwnProperty('mdDetectHidden')) {

        var handleHiddenChange = function() {
          var wasHidden = false;

          return function() {
            var isHidden = node.offsetHeight === 0;

            if (isHidden === false && wasHidden === true) {
              growTextarea();
            }

            wasHidden = isHidden;
          };
        }();
        scope.$watch(function() {
          $mdUtil.nextTick(handleHiddenChange, false);
          return true;
        });
      }
    }
  }
}

function mdMaxlengthDirective($animate, $mdUtil) {
  return {
    restrict: 'A',
    require: ['ngModel', '^mdInputContainer'],
    link: postLink
  };

  function postLink(scope, element, attr, ctrls) {
    var maxlength;
    var ngModelCtrl = ctrls[0];
    var containerCtrl = ctrls[1];
    var charCountEl, errorsSpacer;
    $mdUtil.nextTick(function() {
      errorsSpacer = angular.element(containerCtrl.element[0].querySelector('.md-errors-spacer'));
      charCountEl = angular.element('<div class="md-char-counter">');
      errorsSpacer.append(charCountEl);
      attr.$set('ngTrim', 'false');

      ngModelCtrl.$formatters.push(renderCharCount);
      ngModelCtrl.$viewChangeListeners.push(renderCharCount);
      element.on('input keydown keyup', function() {
        renderCharCount(); //make sure it's called with no args
      });

      scope.$watch(attr.mdMaxlength, function(value) {
        maxlength = value;
        if (angular.isNumber(value) && value > 0) {
          if (!charCountEl.parent().length) {
            $animate.enter(charCountEl, errorsSpacer);
          }
          renderCharCount();
        } else {
          $animate.leave(charCountEl);
        }
      });

      ngModelCtrl.$validators['md-maxlength'] = function(modelValue, viewValue) {
        if (!angular.isNumber(maxlength) || maxlength < 0) {
          return true;
        }
        return ( modelValue || element.val() || viewValue || '' ).length <= maxlength;
      };
    });

    function renderCharCount(value) {
      if (!charCountEl.parent) {
        return value;
      }
      charCountEl.text(String(element.val() || value || '').length + ' / ' + maxlength);
      return value;
    }
  }
}

function placeholderDirective($compile) {
  return {
    restrict: 'A',
    require: '^^?mdInputContainer',
    priority: 200,
    link: {
      pre: preLink
    }
  };

  function preLink(scope, element, attr, inputContainer) {
    if (!inputContainer) return;

    var label = inputContainer.element.find('label');
    var noFloat = inputContainer.element.attr('md-no-float');
    if ((label && label.length) || noFloat === '' || scope.$eval(noFloat)) {
      inputContainer.setHasPlaceholder(true);
      return;
    }
    if (element[0].nodeName != 'MD-SELECT') {
      var newLabel = angular.element('<label ng-click="delegateClick()" tabindex="-1">' + attr.placeholder + '</label>');
      attr.$set('placeholder', null);
      inputContainer.element
        .addClass('md-icon-float')
        .prepend(newLabel);

      $compile(newLabel)(scope);
    }
  }
}
function mdSelectOnFocusDirective($timeout) {

  return {
    restrict: 'A',
    link: postLink
  };

  function postLink(scope, element, attr) {
    if (element[0].nodeName !== 'INPUT' && element[0].nodeName !== "TEXTAREA") return;

    var preventMouseUp = false;

    element
      .on('focus', onFocus)
      .on('mouseup', onMouseUp);

    scope.$on('$destroy', function() {
      element
        .off('focus', onFocus)
        .off('mouseup', onMouseUp);
    });

    function onFocus() {
      preventMouseUp = true;

      $timeout(function() {
        element[0].select();
        preventMouseUp = false;
      }, 1, false);
    }
    function onMouseUp(event) {
      if (preventMouseUp) {
        event.preventDefault();
      }
    }
  }
}

var visibilityDirectives = ['ngIf', 'ngShow', 'ngHide', 'ngSwitchWhen', 'ngSwitchDefault'];
function ngMessagesDirective() {
  return {
    restrict: 'EA',
    link: postLink,
    require: '^^?mdInputContainer'
  };

  function postLink(scope, element, attrs, inputContainer) {
    if (!inputContainer) return;
    element.toggleClass('md-input-messages-animation', true);
    element.toggleClass('md-auto-hide', true);
    if (attrs.mdAutoHide == 'false' || hasVisibiltyDirective(attrs)) {
      element.toggleClass('md-auto-hide', false);
    }
  }

  function hasVisibiltyDirective(attrs) {
    return visibilityDirectives.some(function(attr) {
      return attrs[attr];
    });
  }
}

function ngMessageDirective($mdUtil) {
  return {
    restrict: 'EA',
    compile: compile,
    priority: 100
  };

  function compile(tElement) {
    if (!isInsideInputContainer(tElement)) {
      if (isInsideFragment()) {
        return function (scope, element) {
          if (isInsideInputContainer(element)) {
            initMessageElement(tElement);
          }
        };
      }
    } else {
      initMessageElement(tElement);
    }

    function isInsideFragment() {
      var nextNode = tElement[0];
      while (nextNode = nextNode.parentNode) {
        if (nextNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          return true;
        }
      }
      return false;
    }

    function isInsideInputContainer(element) {
      return !!$mdUtil.getClosest(element, "md-input-container");
    }

    function initMessageElement(element) {
      element.toggleClass('md-input-message-animation', true);
    }
  }
}

var $$AnimateRunner, $animateCss, $mdUtil;

function mdInputInvalidMessagesAnimation($$AnimateRunner, $animateCss, $mdUtil) {
  saveSharedServices($$AnimateRunner, $animateCss, $mdUtil);

  return {
    addClass: function(element, className, done) {
      showInputMessages(element, done);
    }
  };
}

function ngMessagesAnimation($$AnimateRunner, $animateCss, $mdUtil) {
  saveSharedServices($$AnimateRunner, $animateCss, $mdUtil);

  return {
    enter: function(element, done) {
      showInputMessages(element, done);
    },

    leave: function(element, done) {
      hideInputMessages(element, done);
    },

    addClass: function(element, className, done) {
      if (className == "ng-hide") {
        hideInputMessages(element, done);
      } else {
        done();
      }
    },

    removeClass: function(element, className, done) {
      if (className == "ng-hide") {
        showInputMessages(element, done);
      } else {
        done();
      }
    }
  }
}

function ngMessageAnimation($$AnimateRunner, $animateCss, $mdUtil) {
  saveSharedServices($$AnimateRunner, $animateCss, $mdUtil);

  return {
    enter: function(element, done) {
      var animator = showMessage(element);

      animator.start().done(done);
    },

    leave: function(element, done) {
      var animator = hideMessage(element);

      animator.start().done(done);
    }
  }
}

function showInputMessages(element, done) {
  var animators = [], animator;
  var messages = getMessagesElement(element);

  angular.forEach(messages.children(), function(child) {
    animator = showMessage(angular.element(child));

    animators.push(animator.start());
  });

  $$AnimateRunner.all(animators, done);
}

function hideInputMessages(element, done) {
  var animators = [], animator;
  var messages = getMessagesElement(element);

  angular.forEach(messages.children(), function(child) {
    animator = hideMessage(angular.element(child));

    animators.push(animator.start());
  });

  $$AnimateRunner.all(animators, done);
}

function showMessage(element) {
  var height = parseInt(window.getComputedStyle(element[0]).height);
  var topMargin = parseInt(window.getComputedStyle(element[0]).marginTop);

  var messages = getMessagesElement(element);
  var container = getInputElement(element);
  var alreadyVisible = (topMargin > -height);
  if (alreadyVisible || (messages.hasClass('md-auto-hide') && !container.hasClass('md-input-invalid'))) {
    return $animateCss(element, {});
  }

  return $animateCss(element, {
    event: 'enter',
    structural: true,
    from: {"opacity": 0, "margin-top": -height + "px"},
    to: {"opacity": 1, "margin-top": "0"},
    duration: 0.3
  });
}

function hideMessage(element) {
  var height = element[0].offsetHeight;
  var styles = window.getComputedStyle(element[0]);
  if (styles.opacity == 0) {
    return $animateCss(element, {});
  }
  return $animateCss(element, {
    event: 'leave',
    structural: true,
    from: {"opacity": 1, "margin-top": 0},
    to: {"opacity": 0, "margin-top": -height + "px"},
    duration: 0.3
  });
}

function getInputElement(element) {
  var inputContainer = element.controller('mdInputContainer');

  return inputContainer.element;
}

function getMessagesElement(element) {
  if (element.hasClass('md-input-message-animation')) {
    return angular.element($mdUtil.getClosest(element, function(node) {
      return node.classList.contains('md-input-messages-animation');
    }));
  }
  return angular.element(element[0].querySelector('.md-input-messages-animation'));
}

function saveSharedServices(_$$AnimateRunner_, _$animateCss_, _$mdUtil_) {
  $$AnimateRunner = _$$AnimateRunner_;
  $animateCss = _$animateCss_;
  $mdUtil = _$mdUtil_;
}

})();
(function(){
"use strict";
MdListController.$inject = ["$scope", "$element", "$mdListInkRipple"];
mdListDirective.$inject = ["$mdTheming"];
mdListItemDirective.$inject = ["$mdAria", "$mdConstant", "$mdUtil", "$timeout"];
angular.module('material.components.list', [
  'material.core'
])
  .controller('MdListController', MdListController)
  .directive('mdList', mdListDirective)
  .directive('mdListItem', mdListItemDirective);

function mdListDirective($mdTheming) {
  return {
    restrict: 'E',
    compile: function(tEl) {
      tEl[0].setAttribute('role', 'list');
      return $mdTheming;
    }
  };
}
function mdListItemDirective($mdAria, $mdConstant, $mdUtil, $timeout) {
  var proxiedTypes = ['md-checkbox', 'md-switch', 'md-menu'];
  return {
    restrict: 'E',
    controller: 'MdListController',
    compile: function(tEl, tAttrs) {
      var secondaryItems = tEl[0].querySelectorAll('.md-secondary');
      var hasProxiedElement;
      var proxyElement;
      var itemContainer = tEl;

      tEl[0].setAttribute('role', 'listitem');

      if (tAttrs.ngClick || tAttrs.ngDblclick ||  tAttrs.ngHref || tAttrs.href || tAttrs.uiSref || tAttrs.ngAttrUiSref) {
        wrapIn('button');
      } else {
        for (var i = 0, type; type = proxiedTypes[i]; ++i) {
          if (proxyElement = tEl[0].querySelector(type)) {
            hasProxiedElement = true;
            break;
          }
        }
        if (hasProxiedElement) {
          wrapIn('div');
        } else if (!tEl[0].querySelector('md-button:not(.md-secondary):not(.md-exclude)')) {
          tEl.addClass('md-no-proxy');
        }
      }

      wrapSecondaryItems();
      setupToggleAria();

      if (hasProxiedElement && proxyElement.nodeName === "MD-MENU") {
        setupProxiedMenu();
      }

      function setupToggleAria() {
        var toggleTypes = ['md-switch', 'md-checkbox'];
        var toggle;

        for (var i = 0, toggleType; toggleType = toggleTypes[i]; ++i) {
          if (toggle = tEl.find(toggleType)[0]) {
            if (!toggle.hasAttribute('aria-label')) {
              var p = tEl.find('p')[0];
              if (!p) return;
              toggle.setAttribute('aria-label', 'Toggle ' + p.textContent);
            }
          }
        }
      }

      function setupProxiedMenu() {
        var menuEl = angular.element(proxyElement);

        var isEndAligned = menuEl.parent().hasClass('md-secondary-container') ||
                           proxyElement.parentNode.firstElementChild !== proxyElement;

        var xAxisPosition = 'left';

        if (isEndAligned) {
          xAxisPosition = 'right';
        }
        if (!menuEl.attr('md-position-mode')) {
          menuEl.attr('md-position-mode', xAxisPosition + ' target');
        }
        var menuOpenButton = menuEl.children().eq(0);
        if (!hasClickEvent(menuOpenButton[0])) {
          menuOpenButton.attr('ng-click', '$mdOpenMenu($event)');
        }

        if (!menuOpenButton.attr('aria-label')) {
          menuOpenButton.attr('aria-label', 'Open List Menu');
        }
      }

      function wrapIn(type) {
        if (type == 'div') {
          itemContainer = angular.element('<div class="md-no-style md-list-item-inner">');
          itemContainer.append(tEl.contents());
          tEl.addClass('md-proxy-focus');
        } else {
          itemContainer = angular.element(
            '<div class="md-button md-no-style">'+
            '   <div class="md-list-item-inner"></div>'+
            '</div>'
          );
          var buttonWrap = angular.element(
            '<md-button class="md-no-style"></md-button>'
          );

          buttonWrap[0].setAttribute('aria-label', tEl[0].textContent);

          copyAttributes(tEl[0], buttonWrap[0]);
          if (tEl.hasClass('md-no-focus')) {
            buttonWrap.addClass('md-no-focus');
          }
          itemContainer.prepend(buttonWrap);
          itemContainer.children().eq(1).append(tEl.contents());

          tEl.addClass('_md-button-wrap');
        }

        tEl[0].setAttribute('tabindex', '-1');
        tEl.append(itemContainer);
      }

      function wrapSecondaryItems() {
        var secondaryItemsWrapper = angular.element('<div class="md-secondary-container">');

        angular.forEach(secondaryItems, function(secondaryItem) {
          wrapSecondaryItem(secondaryItem, secondaryItemsWrapper);
        });

        itemContainer.append(secondaryItemsWrapper);
      }

      function wrapSecondaryItem(secondaryItem, container) {
        if (secondaryItem && !isButton(secondaryItem) && secondaryItem.hasAttribute('ng-click')) {

          $mdAria.expect(secondaryItem, 'aria-label');
          var buttonWrapper = angular.element('<md-button class="md-secondary md-icon-button">');
          copyAttributes(secondaryItem, buttonWrapper[0], ['ng-if', 'ng-hide', 'ng-show']);

          secondaryItem.setAttribute('tabindex', '-1');
          buttonWrapper.append(secondaryItem);

          secondaryItem = buttonWrapper[0];
        }

        if (secondaryItem && (!hasClickEvent(secondaryItem) || (!tAttrs.ngClick && isProxiedElement(secondaryItem)))) {
          angular.element(secondaryItem).removeClass('md-secondary');
        }

        tEl.addClass('md-with-secondary');
        container.append(secondaryItem);
      }
      function copyAttributes(source, destination, extraAttrs) {
        var copiedAttrs = $mdUtil.prefixer([
          'ng-if', 'ng-click', 'ng-dblclick', 'aria-label', 'ng-disabled', 'ui-sref',
          'href', 'ng-href', 'target', 'ng-attr-ui-sref', 'ui-sref-opts'
        ]);

        if (extraAttrs) {
          copiedAttrs = copiedAttrs.concat($mdUtil.prefixer(extraAttrs));
        }

        angular.forEach(copiedAttrs, function(attr) {
          if (source.hasAttribute(attr)) {
            destination.setAttribute(attr, source.getAttribute(attr));
            source.removeAttribute(attr);
          }
        });
      }

      function isProxiedElement(el) {
        return proxiedTypes.indexOf(el.nodeName.toLowerCase()) != -1;
      }

      function isButton(el) {
        var nodeName = el.nodeName.toUpperCase();

        return nodeName == "MD-BUTTON" || nodeName == "BUTTON";
      }

      function hasClickEvent (element) {
        var attr = element.attributes;
        for (var i = 0; i < attr.length; i++) {
          if (tAttrs.$normalize(attr[i].name) === 'ngClick') return true;
        }
        return false;
      }

      return postLink;

      function postLink($scope, $element, $attr, ctrl) {
        $element.addClass('_md');     // private md component indicator for styling

        var proxies       = [],
            firstElement  = $element[0].firstElementChild,
            isButtonWrap  = $element.hasClass('_md-button-wrap'),
            clickChild    = isButtonWrap ? firstElement.firstElementChild : firstElement,
            hasClick      = clickChild && hasClickEvent(clickChild);

        computeProxies();
        computeClickable();

        if ($element.hasClass('md-proxy-focus') && proxies.length) {
          angular.forEach(proxies, function(proxy) {
            proxy = angular.element(proxy);

            $scope.mouseActive = false;
            proxy.on('mousedown', function() {
              $scope.mouseActive = true;
              $timeout(function(){
                $scope.mouseActive = false;
              }, 100);
            })
            .on('focus', function() {
              if ($scope.mouseActive === false) { $element.addClass('md-focused'); }
              proxy.on('blur', function proxyOnBlur() {
                $element.removeClass('md-focused');
                proxy.off('blur', proxyOnBlur);
              });
            });
          });
        }


        function computeProxies() {
          if (firstElement && firstElement.children && !hasClick) {

            angular.forEach(proxiedTypes, function(type) {
              angular.forEach(firstElement.querySelectorAll(type + ':not(.md-secondary)'), function(child) {
                proxies.push(child);
              });
            });

          }
        }

        function computeClickable() {
          if (proxies.length == 1 || hasClick) {
            $element.addClass('md-clickable');

            if (!hasClick) {
              ctrl.attachRipple($scope, angular.element($element[0].querySelector('.md-no-style')));
            }
          }
        }

        function isEventFromControl(event) {
          var forbiddenControls = ['md-slider'];
          if (!event.path) {
            return forbiddenControls.indexOf(event.target.tagName.toLowerCase()) !== -1;
          }
          var maxPath = event.path.indexOf($element.children()[0]);

          for (var i = 0; i < maxPath; i++) {
            if (forbiddenControls.indexOf(event.path[i].tagName.toLowerCase()) !== -1) {
              return true;
            }
          }
        }

        var clickChildKeypressListener = function(e) {
          if (e.target.nodeName != 'INPUT' && e.target.nodeName != 'TEXTAREA' && !e.target.isContentEditable) {
            var keyCode = e.which || e.keyCode;
            if (keyCode == $mdConstant.KEY_CODE.SPACE) {
              if (clickChild) {
                clickChild.click();
                e.preventDefault();
                e.stopPropagation();
              }
            }
          }
        };

        if (!hasClick && !proxies.length) {
          clickChild && clickChild.addEventListener('keypress', clickChildKeypressListener);
        }

        $element.off('click');
        $element.off('keypress');

        if (proxies.length == 1 && clickChild) {
          $element.children().eq(0).on('click', function(e) {
            if (isEventFromControl(e)) return;

            var parentButton = $mdUtil.getClosest(e.target, 'BUTTON');
            if (!parentButton && clickChild.contains(e.target)) {
              angular.forEach(proxies, function(proxy) {
                if (e.target !== proxy && !proxy.contains(e.target)) {
                  if (proxy.nodeName === 'MD-MENU') {
                    proxy = proxy.children[0];
                  }
                  angular.element(proxy).triggerHandler('click');
                }
              });
            }
          });
        }

        $scope.$on('$destroy', function () {
          clickChild && clickChild.removeEventListener('keypress', clickChildKeypressListener);
        });
      }
    }
  };
}
function MdListController($scope, $element, $mdListInkRipple) {
  var ctrl = this;
  ctrl.attachRipple = attachRipple;

  function attachRipple (scope, element) {
    var options = {};
    $mdListInkRipple.attach(scope, element, options);
  }
}

})();
(function(){
"use strict";

angular.module('material.components.menu', [
  'material.core',
  'material.components.backdrop'
]);

})();
(function(){
"use strict";

angular.module('material.components.menuBar', [
  'material.core',
  'material.components.icon',
  'material.components.menu'
]);

})();
(function(){
"use strict";


MdNavBarController.$inject = ["$element", "$scope", "$timeout", "$mdConstant"];
MdNavItem.$inject = ["$$rAF"];
MdNavItemController.$inject = ["$element"];
MdNavBar.$inject = ["$mdAria", "$mdTheming"];
angular.module('material.components.navBar', ['material.core'])
    .controller('MdNavBarController', MdNavBarController)
    .directive('mdNavBar', MdNavBar)
    .controller('MdNavItemController', MdNavItemController)
    .directive('mdNavItem', MdNavItem);

function MdNavBar($mdAria, $mdTheming) {
  return {
    restrict: 'E',
    transclude: true,
    controller: MdNavBarController,
    controllerAs: 'ctrl',
    bindToController: true,
    scope: {
      'mdSelectedNavItem': '=?',
      'navBarAriaLabel': '@?',
    },
    template:
      '<div class="md-nav-bar">' +
        '<nav role="navigation">' +
          '<ul class="_md-nav-bar-list" ng-transclude role="listbox"' +
            'tabindex="0"' +
            'ng-focus="ctrl.onFocus()"' +
            'ng-blur="ctrl.onBlur()"' +
            'ng-keydown="ctrl.onKeydown($event)"' +
            'aria-label="{{ctrl.navBarAriaLabel}}">' +
          '</ul>' +
        '</nav>' +
        '<md-nav-ink-bar></md-nav-ink-bar>' +
      '</div>',
    link: function(scope, element, attrs, ctrl) {
      $mdTheming(element);
      if (!ctrl.navBarAriaLabel) {
        $mdAria.expectAsync(element, 'aria-label', angular.noop);
      }
    },
  };
}
function MdNavBarController($element, $scope, $timeout, $mdConstant) {
  this._$timeout = $timeout;
  this._$scope = $scope;
  this._$mdConstant = $mdConstant;
  this.mdSelectedNavItem;
  this.navBarAriaLabel;
  this._navBarEl = $element[0];
  this._inkbar;

  var self = this;
  var deregisterTabWatch = this._$scope.$watch(function() {
    return self._navBarEl.querySelectorAll('._md-nav-button').length;
  },
  function(newLength) {
    if (newLength > 0) {
      self._initTabs();
      deregisterTabWatch();
    }
  });
}
MdNavBarController.prototype._initTabs = function() {
  this._inkbar = angular.element(this._navBarEl.getElementsByTagName('md-nav-ink-bar')[0]);

  var self = this;
  this._$timeout(function() {
    self._updateTabs(self.mdSelectedNavItem, undefined);
  });

  this._$scope.$watch('ctrl.mdSelectedNavItem', function(newValue, oldValue) {
    self._$timeout(function() {
      self._updateTabs(newValue, oldValue);
    });
  });
};
MdNavBarController.prototype._updateTabs = function(newValue, oldValue) {
  var self = this;
  var tabs = this._getTabs();
  var oldIndex = -1;
  var newIndex = -1;
  var newTab = this._getTabByName(newValue);
  var oldTab = this._getTabByName(oldValue);

  if (oldTab) {
    oldTab.setSelected(false);
    oldIndex = tabs.indexOf(oldTab);
  }

  if (newTab) {
    newTab.setSelected(true);
    newIndex = tabs.indexOf(newTab);
  }

  this._$timeout(function() {
    self._updateInkBarStyles(newTab, newIndex, oldIndex);
  });
};
MdNavBarController.prototype._updateInkBarStyles = function(tab, newIndex, oldIndex) {
  this._inkbar.toggleClass('_md-left', newIndex < oldIndex)
      .toggleClass('_md-right', newIndex > oldIndex);

  this._inkbar.css({display: newIndex < 0 ? 'none' : ''});

  if(tab){
    var tabEl = tab.getButtonEl();
    var left = tabEl.offsetLeft;

    this._inkbar.css({left: left + 'px', width: tabEl.offsetWidth + 'px'});
  }
};
MdNavBarController.prototype._getTabs = function() {
  var linkArray = Array.prototype.slice.call(
      this._navBarEl.querySelectorAll('.md-nav-item'));
  return linkArray.map(function(el) {
    return angular.element(el).controller('mdNavItem')
  });
};
MdNavBarController.prototype._getTabByName = function(name) {
  return this._findTab(function(tab) {
    return tab.getName() == name;
  });
};
MdNavBarController.prototype._getSelectedTab = function() {
  return this._findTab(function(tab) {
    return tab.isSelected()
  });
};
MdNavBarController.prototype.getFocusedTab = function() {
  return this._findTab(function(tab) {
    return tab.hasFocus()
  });
};
MdNavBarController.prototype._findTab = function(fn) {
  var tabs = this._getTabs();
  for (var i = 0; i < tabs.length; i++) {
    if (fn(tabs[i])) {
      return tabs[i];
    }
  }

  return null;
};
MdNavBarController.prototype.onFocus = function() {
  var tab = this._getSelectedTab();
  if (tab) {
    tab.setFocused(true);
  }
};
MdNavBarController.prototype.onBlur = function() {
  var tab = this.getFocusedTab();
  if (tab) {
    tab.setFocused(false);
  }
};
MdNavBarController.prototype._moveFocus = function(oldTab, newTab) {
  oldTab.setFocused(false);
  newTab.setFocused(true);
};
MdNavBarController.prototype.onKeydown = function(e) {
  var keyCodes = this._$mdConstant.KEY_CODE;
  var tabs = this._getTabs();
  var focusedTab = this.getFocusedTab();
  if (!focusedTab) return;

  var focusedTabIndex = tabs.indexOf(focusedTab);
  switch (e.keyCode) {
    case keyCodes.UP_ARROW:
    case keyCodes.LEFT_ARROW:
      if (focusedTabIndex > 0) {
        this._moveFocus(focusedTab, tabs[focusedTabIndex - 1]);
      }
      break;
    case keyCodes.DOWN_ARROW:
    case keyCodes.RIGHT_ARROW:
      if (focusedTabIndex < tabs.length - 1) {
        this._moveFocus(focusedTab, tabs[focusedTabIndex + 1]);
      }
      break;
    case keyCodes.SPACE:
    case keyCodes.ENTER:
      this._$timeout(function() {
        focusedTab.getButtonEl().click();
      });
      break;
  }
};
function MdNavItem($$rAF) {
  return {
    restrict: 'E',
    require: ['mdNavItem', '^mdNavBar'],
    controller: MdNavItemController,
    bindToController: true,
    controllerAs: 'ctrl',
    replace: true,
    transclude: true,
    template:
      '<li class="md-nav-item" role="option" aria-selected="{{ctrl.isSelected()}}">' +
        '<md-button ng-if="ctrl.mdNavSref" class="_md-nav-button md-accent"' +
          'ng-class="ctrl.getNgClassMap()"' +
          'tabindex="-1"' +
          'ui-sref="{{ctrl.mdNavSref}}">' +
          '<span ng-transclude class="_md-nav-button-text"></span>' +
        '</md-button>' +
        '<md-button ng-if="ctrl.mdNavHref" class="_md-nav-button md-accent"' +
          'ng-class="ctrl.getNgClassMap()"' +
          'tabindex="-1"' +
          'ng-href="{{ctrl.mdNavHref}}">' +
          '<span ng-transclude class="_md-nav-button-text"></span>' +
        '</md-button>' +
        '<md-button ng-if="ctrl.mdNavClick" class="_md-nav-button md-accent"' +
          'ng-class="ctrl.getNgClassMap()"' +
          'tabindex="-1"' +
          'ng-click="ctrl.mdNavClick()">' +
          '<span ng-transclude class="_md-nav-button-text"></span>' +
        '</md-button>' +
      '</li>',
    scope: {
      'mdNavClick': '&?',
      'mdNavHref': '@?',
      'mdNavSref': '@?',
      'name': '@',
    },
    link: function(scope, element, attrs, controllers) {
      var mdNavItem = controllers[0];
      var mdNavBar = controllers[1];
      $$rAF(function() {
        if (!mdNavItem.name) {
          mdNavItem.name = angular.element(element[0].querySelector('._md-nav-button-text'))
            .text().trim();
        }

        var navButton = angular.element(element[0].querySelector('._md-nav-button'));
        navButton.on('click', function() {
          mdNavBar.mdSelectedNavItem = mdNavItem.name;
          scope.$apply();
        });
      });
    }
  };
}
function MdNavItemController($element) {
  this._$element = $element;
  this.mdNavClick;
  this.mdNavHref;
  this.name;
  this._selected = false;
  this._focused = false;

  var hasNavClick = !!($element.attr('md-nav-click'));
  var hasNavHref = !!($element.attr('md-nav-href'));
  var hasNavSref = !!($element.attr('md-nav-sref'));
  if ((hasNavClick ? 1:0) + (hasNavHref ? 1:0) + (hasNavSref ? 1:0) > 1) {
    throw Error(
        'Must specify exactly one of md-nav-click, md-nav-href, ' +
        'md-nav-sref for nav-item directive');
  }
}
MdNavItemController.prototype.getNgClassMap = function() {
  return {
    'md-active': this._selected,
    'md-primary': this._selected,
    'md-unselected': !this._selected,
    'md-focused': this._focused,
  };
};
MdNavItemController.prototype.getName = function() {
  return this.name;
};
MdNavItemController.prototype.getButtonEl = function() {
  return this._$element[0].querySelector('._md-nav-button');
};
MdNavItemController.prototype.setSelected = function(isSelected) {
  this._selected = isSelected;
};
MdNavItemController.prototype.isSelected = function() {
  return this._selected;
};
MdNavItemController.prototype.setFocused = function(isFocused) {
  this._focused = isFocused;
};
MdNavItemController.prototype.hasFocus = function() {
  return this._focused;
};

})();
(function(){
"use strict";
MdPanelService.$inject = ["$rootElement", "$rootScope", "$injector", "$window"];
angular
    .module('material.components.panel', [
      'material.core',
      'material.components.backdrop'
    ])
    .service('$mdPanel', MdPanelService);
var defaultZIndex = 80;
var MD_PANEL_HIDDEN = '_md-panel-hidden';

var FOCUS_TRAP_TEMPLATE = angular.element(
    '<div class="_md-panel-focus-trap" tabindex="0"></div>');
function MdPanelService($rootElement, $rootScope, $injector, $window) {
  this._defaultConfigOptions = {
    bindToController: true,
    clickOutsideToClose: false,
    disableParentScroll: false,
    escapeToClose: false,
    focusOnOpen: true,
    fullscreen: false,
    hasBackdrop: false,
    propagateContainerEvents: false,
    transformTemplate: angular.bind(this, this._wrapTemplate),
    trapFocus: false,
    zIndex: defaultZIndex
  };
  this._config = {};
  this._$rootElement = $rootElement;
  this._$rootScope = $rootScope;
  this._$injector = $injector;
  this._$window = $window;
  this._trackedPanels = {};
  this.animation = MdPanelAnimation.animation;
  this.xPosition = MdPanelPosition.xPosition;
  this.yPosition = MdPanelPosition.yPosition;
}
MdPanelService.prototype.create = function(config) {
  config = config || {};
  if (angular.isDefined(config.id) && this._trackedPanels[config.id]) {
    return this._trackedPanels[config.id];
  }
  this._config = {
    id: config.id || 'panel_' + this._$injector.get('$mdUtil').nextUid(),
    scope: this._$rootScope.$new(true),
    attachTo: this._$rootElement
  };
  angular.extend(this._config, this._defaultConfigOptions, config);

  var panelRef = new MdPanelRef(this._config, this._$injector);
  this._trackedPanels[config.id] = panelRef;

  return panelRef;
};
MdPanelService.prototype.open = function(config) {
  var panelRef = this.create(config);
  return panelRef.open().then(function() {
    return panelRef;
  });
};
MdPanelService.prototype.newPanelPosition = function() {
  return new MdPanelPosition(this._$injector);
};
MdPanelService.prototype.newPanelAnimation = function() {
  return new MdPanelAnimation(this._$injector);
};
MdPanelService.prototype._wrapTemplate = function(origTemplate) {
  var template = origTemplate || '';
  return '' +
      '<div class="md-panel-outer-wrapper">' +
      '  <div class="md-panel" style="left: -9999px;">' + template + '</div>' +
      '</div>';
};
function MdPanelRef(config, $injector) {
  this._$q = $injector.get('$q');
  this._$mdCompiler = $injector.get('$mdCompiler');
  this._$mdConstant = $injector.get('$mdConstant');
  this._$mdUtil = $injector.get('$mdUtil');
  this._$rootScope = $injector.get('$rootScope');
  this._$animate = $injector.get('$animate');
  this._$mdPanel = $injector.get('$mdPanel');
  this._$log = $injector.get('$log');
  this._$window = $injector.get('$window');
  this._$$rAF = $injector.get('$$rAF');
  this.id = config.id;
  this.config = config;
  this.panelContainer;
  this.panelEl;
  this.isAttached = false;
  this._removeListeners = [];
  this._topFocusTrap;
  this._bottomFocusTrap;
  this._backdropRef;
  this._restoreScroll = null;
}
MdPanelRef.prototype.open = function() {
  var self = this;
  return this._$q(function(resolve, reject) {
    var done = self._done(resolve, self);
    var show = self._simpleBind(self.show, self);

    self.attach()
        .then(show)
        .then(done)
        .catch(reject);
  });
};
MdPanelRef.prototype.close = function() {
  var self = this;

  return this._$q(function(resolve, reject) {
    var done = self._done(resolve, self);
    var detach = self._simpleBind(self.detach, self);

    self.hide()
        .then(detach)
        .then(done)
        .catch(reject);
  });
};
MdPanelRef.prototype.attach = function() {
  if (this.isAttached && this.panelEl) {
    return this._$q.when(this);
  }

  var self = this;
  return this._$q(function(resolve, reject) {
    var done = self._done(resolve, self);
    var onDomAdded = self.config['onDomAdded'] || angular.noop;
    var addListeners = function(response) {
        self.isAttached = true;
        self._addEventListeners();
        return response;
    };

    self._$q.all([
        self._createBackdrop(),
        self._createPanel()
            .then(addListeners)
            .catch(reject)
    ]).then(onDomAdded)
      .then(done)
      .catch(reject);
  });
};
MdPanelRef.prototype.detach = function() {
  if (!this.isAttached) {
    return this._$q.when(this);
  }

  var self = this;
  var onDomRemoved = self.config['onDomRemoved'] || angular.noop;

  var detachFn = function() {
    self._removeEventListeners();
    if (self._topFocusTrap && self._topFocusTrap.parentNode) {
      self._topFocusTrap.parentNode.removeChild(self._topFocusTrap);
    }

    if (self._bottomFocusTrap && self._bottomFocusTrap.parentNode) {
      self._bottomFocusTrap.parentNode.removeChild(self._bottomFocusTrap);
    }

    self.panelContainer.remove();
    self.isAttached = false;
    return self._$q.when(self);
  };

  if (this._restoreScroll) {
    this._restoreScroll();
    this._restoreScroll = null;
  }

  return this._$q(function(resolve, reject) {
    var done = self._done(resolve, self);

    self._$q.all([
      detachFn(),
      self._backdropRef ? self._backdropRef.detach() : true
    ]).then(onDomRemoved)
      .then(done)
      .catch(reject);
  });
};
MdPanelRef.prototype.destroy = function() {
  this.config.scope.$destroy();
  this.config.locals = null;
};
MdPanelRef.prototype.show = function() {
  if (!this.panelContainer) {
    return this._$q(function(resolve, reject) {
      reject('Panel does not exist yet. Call open() or attach().');
    });
  }

  if (!this.panelContainer.hasClass(MD_PANEL_HIDDEN)) {
    return this._$q.when(this);
  }

  var self = this;
  var animatePromise = function() {
    self.panelContainer.removeClass(MD_PANEL_HIDDEN);
    return self._animateOpen();
  };

  return this._$q(function(resolve, reject) {
    var done = self._done(resolve, self);
    var onOpenComplete = self.config['onOpenComplete'] || angular.noop;

    self._$q.all([
      self._backdropRef ? self._backdropRef.show() : self,
      animatePromise().then(function() { self._focusOnOpen(); }, reject)
    ]).then(onOpenComplete)
      .then(done)
      .catch(reject);
  });
};
MdPanelRef.prototype.hide = function() {
  if (!this.panelContainer) {
    return this._$q(function(resolve, reject) {
      reject('Panel does not exist yet. Call open() or attach().');
    });
  }

  if (this.panelContainer.hasClass(MD_PANEL_HIDDEN)) {
    return this._$q.when(this);
  }

  var self = this;

  return this._$q(function(resolve, reject) {
    var done = self._done(resolve, self);
    var onRemoving = self.config['onRemoving'] || angular.noop;

    var focusOnOrigin = function() {
      var origin = self.config['origin'];
      if (origin) {
        getElement(origin).focus();
      }
    };

    var hidePanel = function() {
      self.panelContainer.addClass(MD_PANEL_HIDDEN);
    };

    self._$q.all([
      self._backdropRef ? self._backdropRef.hide() : self,
      self._animateClose()
          .then(onRemoving)
          .then(hidePanel)
          .then(focusOnOrigin)
          .catch(reject)
    ]).then(done, reject);
  });
};
MdPanelRef.prototype.addClass = function(newClass, toElement) {
  this._$log.warn(
      'The addClass method is in the process of being deprecated. ' +
      'Full deprecation is scheduled for the Angular Material 1.2 release. ' +
      'To achieve the same results, use the panelContainer or panelEl ' +
      'JQLite elements that are referenced in MdPanelRef.');

  if (!this.panelContainer) {
    throw new Error('Panel does not exist yet. Call open() or attach().');
  }

  if (!toElement && !this.panelContainer.hasClass(newClass)) {
    this.panelContainer.addClass(newClass);
  } else if (toElement && !this.panelEl.hasClass(newClass)) {
    this.panelEl.addClass(newClass);
  }
};
MdPanelRef.prototype.removeClass = function(oldClass, fromElement) {
  this._$log.warn(
      'The removeClass method is in the process of being deprecated. ' +
      'Full deprecation is scheduled for the Angular Material 1.2 release. ' +
      'To achieve the same results, use the panelContainer or panelEl ' +
      'JQLite elements that are referenced in MdPanelRef.');

  if (!this.panelContainer) {
    throw new Error('Panel does not exist yet. Call open() or attach().');
  }

  if (!fromElement && this.panelContainer.hasClass(oldClass)) {
    this.panelContainer.removeClass(oldClass);
  } else if (fromElement && this.panelEl.hasClass(oldClass)) {
    this.panelEl.removeClass(oldClass);
  }
};
MdPanelRef.prototype.toggleClass = function(toggleClass, onElement) {
  this._$log.warn(
      'The toggleClass method is in the process of being deprecated. ' +
      'Full deprecation is scheduled for the Angular Material 1.2 release. ' +
      'To achieve the same results, use the panelContainer or panelEl ' +
      'JQLite elements that are referenced in MdPanelRef.');

  if (!this.panelContainer) {
    throw new Error('Panel does not exist yet. Call open() or attach().');
  }

  if (!onElement) {
    this.panelContainer.toggleClass(toggleClass);
  } else {
    this.panelEl.toggleClass(toggleClass);
  }
};
MdPanelRef.prototype._createPanel = function() {
  var self = this;

  return this._$q(function(resolve, reject) {
    if (!self.config.locals) {
      self.config.locals = {};
    }

    self.config.locals.mdPanelRef = self;
    self._$mdCompiler.compile(self.config)
        .then(function(compileData) {
          self.panelContainer = compileData.link(self.config['scope']);
          getElement(self.config['attachTo']).append(self.panelContainer);

          if (self.config['disableParentScroll']) {
            self._restoreScroll = self._$mdUtil.disableScrollAround(
              null,
              self.panelContainer,
              { disableScrollMask: true }
            );
          }

          self.panelEl = angular.element(
              self.panelContainer[0].querySelector('.md-panel'));
          if (self.config['panelClass']) {
            self.panelEl.addClass(self.config['panelClass']);
          }
          if (self.config['propagateContainerEvents']) {
            self.panelContainer.css('pointer-events', 'none');
          }
          if (self._$animate.pin) {
            self._$animate.pin(self.panelContainer,
                getElement(self.config['attachTo']));
          }

          self._configureTrapFocus();
          self._addStyles().then(function() {
            resolve(self);
          }, reject);
        }, reject);
  });
};
MdPanelRef.prototype._addStyles = function() {
  var self = this;
  return this._$q(function(resolve) {
    self.panelContainer.css('z-index', self.config['zIndex']);
    self.panelEl.css('z-index', self.config['zIndex'] + 1);

    var hideAndResolve = function() {
      self.panelEl.css('left', '');
      self.panelContainer.addClass(MD_PANEL_HIDDEN);
      resolve(self);
    };

    if (self.config['fullscreen']) {
      self.panelEl.addClass('_md-panel-fullscreen');
      hideAndResolve();
      return; // Don't setup positioning.
    }

    var positionConfig = self.config['position'];
    if (!positionConfig) {
      hideAndResolve();
      return; // Don't setup positioning.
    }
    self._$rootScope['$$postDigest'](function() {
      self._updatePosition(true);
      resolve(self);
    });
  });
};
MdPanelRef.prototype.updatePosition = function(position) {
  if (!this.panelContainer) {
    throw new Error('Panel does not exist yet. Call open() or attach().');
  }

  this.config['position'] = position;
  this._updatePosition();
};
MdPanelRef.prototype._updatePosition = function(init) {
  var positionConfig = this.config['position'];

  if (positionConfig) {
    positionConfig._setPanelPosition(this.panelEl);
    if (init) {
      this.panelContainer.addClass(MD_PANEL_HIDDEN);
    }

    this.panelEl.css(
      MdPanelPosition.absPosition.TOP,
      positionConfig.getTop()
    );
    this.panelEl.css(
      MdPanelPosition.absPosition.BOTTOM,
      positionConfig.getBottom()
    );
    this.panelEl.css(
      MdPanelPosition.absPosition.LEFT,
      positionConfig.getLeft()
    );
    this.panelEl.css(
      MdPanelPosition.absPosition.RIGHT,
      positionConfig.getRight()
    );
    var prefixedTransform = this._$mdConstant.CSS.TRANSFORM;
    this.panelEl.css(prefixedTransform, positionConfig.getTransform());
  }
};
MdPanelRef.prototype._focusOnOpen = function() {
  if (this.config['focusOnOpen']) {
    var self = this;
    this._$rootScope['$$postDigest'](function() {
      var target = self._$mdUtil.findFocusTarget(self.panelEl) ||
          self.panelEl;
      target.focus();
    });
  }
};
MdPanelRef.prototype._createBackdrop = function() {
  if (this.config.hasBackdrop) {
    if (!this._backdropRef) {
      var backdropAnimation = this._$mdPanel.newPanelAnimation()
          .openFrom(this.config.attachTo)
          .withAnimation({
            open: '_md-opaque-enter',
            close: '_md-opaque-leave'
          });
      var backdropConfig = {
        animation: backdropAnimation,
        attachTo: this.config.attachTo,
        focusOnOpen: false,
        panelClass: '_md-panel-backdrop',
        zIndex: this.config.zIndex - 1
      };
      this._backdropRef = this._$mdPanel.create(backdropConfig);
    }
    if (!this._backdropRef.isAttached) {
      return this._backdropRef.attach();
    }
  }
};
MdPanelRef.prototype._addEventListeners = function() {
  this._configureEscapeToClose();
  this._configureClickOutsideToClose();
  this._configureScrollListener();
};
MdPanelRef.prototype._removeEventListeners = function() {
  this._removeListeners && this._removeListeners.forEach(function(removeFn) {
    removeFn();
  });
  this._removeListeners = [];
};
MdPanelRef.prototype._configureEscapeToClose = function() {
  if (this.config['escapeToClose']) {
    var parentTarget = getElement(this.config['attachTo']);
    var self = this;

    var keyHandlerFn = function(ev) {
      if (ev.keyCode === self._$mdConstant.KEY_CODE.ESCAPE) {
        ev.stopPropagation();
        ev.preventDefault();

        self.close();
      }
    };
    this.panelContainer.on('keydown', keyHandlerFn);
    parentTarget.on('keydown', keyHandlerFn);
    this._removeListeners.push(function() {
      self.panelContainer.off('keydown', keyHandlerFn);
      parentTarget.off('keydown', keyHandlerFn);
    });
  }
};
MdPanelRef.prototype._configureClickOutsideToClose = function() {
  if (this.config['clickOutsideToClose']) {
    var target = this.panelContainer;
    var sourceElem;
    var mousedownHandler = function(ev) {
      sourceElem = ev.target;
    };
    var self = this;
    var mouseupHandler = function(ev) {
      if (sourceElem === target[0] && ev.target === target[0]) {
        ev.stopPropagation();
        ev.preventDefault();

        self.close();
      }
    };
    target.on('mousedown', mousedownHandler);
    target.on('mouseup', mouseupHandler);
    this._removeListeners.push(function() {
      target.off('mousedown', mousedownHandler);
      target.off('mouseup', mouseupHandler);
    });
  }
};
MdPanelRef.prototype._configureScrollListener = function() {
  var updatePosition = angular.bind(this, this._updatePosition);
  var debouncedUpdatePosition = this._$$rAF.throttle(updatePosition);
  var self = this;

  var onScroll = function() {
    if (!self.config['disableParentScroll']) {
      debouncedUpdatePosition();
    }
  };
  this._$window.addEventListener('scroll', onScroll, true);
  this._removeListeners.push(function() {
    self._$window.removeEventListener('scroll', onScroll, true);
  });
};
MdPanelRef.prototype._configureTrapFocus = function() {
  this.panelEl.attr('tabIndex', '-1');
  if (this.config['trapFocus']) {
    var element = this.panelEl;
    this._topFocusTrap = FOCUS_TRAP_TEMPLATE.clone()[0];
    this._bottomFocusTrap = FOCUS_TRAP_TEMPLATE.clone()[0];
    var focusHandler = function() {
      element.focus();
    };
    this._topFocusTrap.addEventListener('focus', focusHandler);
    this._bottomFocusTrap.addEventListener('focus', focusHandler);
    this._removeListeners.push(this._simpleBind(function() {
      this._topFocusTrap.removeEventListener('focus', focusHandler);
      this._bottomFocusTrap.removeEventListener('focus', focusHandler);
    }, this));
    element[0].parentNode.insertBefore(this._topFocusTrap, element[0]);
    element.after(this._bottomFocusTrap);
  }
};
MdPanelRef.prototype._animateOpen = function() {
  this.panelContainer.addClass('md-panel-is-showing');
  var animationConfig = this.config['animation'];
  if (!animationConfig) {
    this.panelContainer.addClass('_md-panel-shown');
    return this._$q.when(this);
  }

  var self = this;
  return this._$q(function(resolve) {
    var done = self._done(resolve, self);
    var warnAndOpen = function() {
      self._$log.warn(
          'MdPanel Animations failed. Showing panel without animating.');
      done();
    };

    animationConfig.animateOpen(self.panelEl)
        .then(done, warnAndOpen);
  });
};
MdPanelRef.prototype._animateClose = function() {
  var animationConfig = this.config['animation'];
  if (!animationConfig) {
    this.panelContainer.removeClass('md-panel-is-showing');
    this.panelContainer.removeClass('_md-panel-shown');
    return this._$q.when(this);
  }

  var self = this;
  return this._$q(function(resolve) {
    var done = function() {
      self.panelContainer.removeClass('md-panel-is-showing');
      resolve(self);
    };
    var warnAndClose = function() {
      self._$log.warn(
          'MdPanel Animations failed. Hiding panel without animating.');
      done();
    };

    animationConfig.animateClose(self.panelEl)
        .then(done, warnAndClose);
  });
};
MdPanelRef.prototype._simpleBind = function(callback, self) {
  return function(value) {
    return callback.apply(self, value);
  };
};
MdPanelRef.prototype._done = function(callback, self) {
  return function() {
    callback(self);
  };
};
function MdPanelPosition($injector) {
  this._$window = $injector.get('$window');
  this._isRTL = $injector.get('$mdUtil').bidi() === 'rtl';
  this._absolute = false;
  this._relativeToEl;
  this._top = '';
  this._bottom = '';
  this._left = '';
  this._right = '';
  this._translateX = [];
  this._translateY = [];
  this._positions = [];
  this._actualPosition;
}
MdPanelPosition.xPosition = {
  CENTER: 'center',
  ALIGN_START: 'align-start',
  ALIGN_END: 'align-end',
  OFFSET_START: 'offset-start',
  OFFSET_END: 'offset-end'
};
MdPanelPosition.yPosition = {
  CENTER: 'center',
  ALIGN_TOPS: 'align-tops',
  ALIGN_BOTTOMS: 'align-bottoms',
  ABOVE: 'above',
  BELOW: 'below'
};
MdPanelPosition.absPosition = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left'
};
MdPanelPosition.prototype.absolute = function() {
  this._absolute = true;
  return this;
};
MdPanelPosition.prototype._setPosition = function(position, value) {
  if (position === MdPanelPosition.absPosition.RIGHT ||
      position === MdPanelPosition.absPosition.LEFT) {
    this._left = this._right = '';
  } else if (
      position === MdPanelPosition.absPosition.BOTTOM ||
      position === MdPanelPosition.absPosition.TOP) {
    this._top = this._bottom = '';
  } else {
    var positions = Object.keys(MdPanelPosition.absPosition).join()
        .toLowerCase();

    throw new Error('Position must be one of ' + positions + '.');
  }

  this['_' +  position] = angular.isString(value) ? value : '0';

  return this;
};
MdPanelPosition.prototype.top = function(top) {
  return this._setPosition(MdPanelPosition.absPosition.TOP, top);
};
MdPanelPosition.prototype.bottom = function(bottom) {
  return this._setPosition(MdPanelPosition.absPosition.BOTTOM, bottom);
};
MdPanelPosition.prototype.start = function(start) {
  var position = this._isRTL ? MdPanelPosition.absPosition.RIGHT : MdPanelPosition.absPosition.LEFT;
  return this._setPosition(position, start);
};
MdPanelPosition.prototype.end = function(end) {
  var position = this._isRTL ? MdPanelPosition.absPosition.LEFT : MdPanelPosition.absPosition.RIGHT;
  return this._setPosition(position, end);
};
MdPanelPosition.prototype.left = function(left) {
  return this._setPosition(MdPanelPosition.absPosition.LEFT, left);
};
MdPanelPosition.prototype.right = function(right) {
  return this._setPosition(MdPanelPosition.absPosition.RIGHT, right);
};
MdPanelPosition.prototype.centerHorizontally = function() {
  this._left = '50%';
  this._right = '';
  this._translateX = ['-50%'];
  return this;
};
MdPanelPosition.prototype.centerVertically = function() {
  this._top = '50%';
  this._bottom = '';
  this._translateY = ['-50%'];
  return this;
};
MdPanelPosition.prototype.center = function() {
  return this.centerHorizontally().centerVertically();
};
MdPanelPosition.prototype.relativeTo = function(element) {
  this._absolute = false;
  this._relativeToEl = getElement(element);
  return this;
};
MdPanelPosition.prototype.addPanelPosition = function(xPosition, yPosition) {
  if (!this._relativeToEl) {
    throw new Error('addPanelPosition can only be used with relative ' +
        'positioning. Set relativeTo first.');
  }

  this._validateXPosition(xPosition);
  this._validateYPosition(yPosition);

  this._positions.push({
      x: xPosition,
      y: yPosition,
  });
  return this;
};
MdPanelPosition.prototype._validateYPosition = function(yPosition) {
  if (yPosition == null) {
      return;
  }

  var positionKeys = Object.keys(MdPanelPosition.yPosition);
  var positionValues = [];
  for (var key, i = 0; key = positionKeys[i]; i++) {
    var position = MdPanelPosition.yPosition[key];
    positionValues.push(position);

    if (position === yPosition) {
      return;
    }
  }

  throw new Error('Panel y position only accepts the following values:\n' +
    positionValues.join(' | '));
};
MdPanelPosition.prototype._validateXPosition = function(xPosition) {
  if (xPosition == null) {
      return;
  }

  var positionKeys = Object.keys(MdPanelPosition.xPosition);
  var positionValues = [];
  for (var key, i = 0; key = positionKeys[i]; i++) {
    var position = MdPanelPosition.xPosition[key];
    positionValues.push(position);
    if (position === xPosition) {
      return;
    }
  }

  throw new Error('Panel x Position only accepts the following values:\n' +
      positionValues.join(' | '));
};
MdPanelPosition.prototype.withOffsetX = function(offsetX) {
  this._translateX.push(offsetX);
  return this;
};
MdPanelPosition.prototype.withOffsetY = function(offsetY) {
  this._translateY.push(offsetY);
  return this;
};
MdPanelPosition.prototype.getTop = function() {
  return this._top;
};
MdPanelPosition.prototype.getBottom = function() {
  return this._bottom;
};
MdPanelPosition.prototype.getLeft = function() {
  return this._left;
};
MdPanelPosition.prototype.getRight = function() {
  return this._right;
};
MdPanelPosition.prototype.getTransform = function() {
  var translateX = this._reduceTranslateValues('translateX', this._translateX);
  var translateY = this._reduceTranslateValues('translateY', this._translateY);
  return (translateX + ' ' + translateY).trim();
};
MdPanelPosition.prototype._isOnscreen = function(panelEl) {

  var left = parseInt(this.getLeft());
  var top = parseInt(this.getTop());
  var right = left + panelEl[0].offsetWidth;
  var bottom = top + panelEl[0].offsetHeight;

  return (left >= 0) &&
    (top >= 0) &&
    (bottom <= this._$window.innerHeight) &&
    (right <= this._$window.innerWidth);
};
MdPanelPosition.prototype.getActualPosition = function() {
  return this._actualPosition;
};
MdPanelPosition.prototype._reduceTranslateValues =
    function(translateFn, values) {
      return values.map(function(translation) {
        return translateFn + '(' + translation + ')';
      }).join(' ');
    };
MdPanelPosition.prototype._setPanelPosition = function(panelEl) {
  if (this._absolute) {
    return;
  }

  if (this._actualPosition) {
    this._calculatePanelPosition(panelEl, this._actualPosition);
    return;
  }

  for (var i = 0; i < this._positions.length; i++) {
    this._actualPosition = this._positions[i];
    this._calculatePanelPosition(panelEl, this._actualPosition);
    if (this._isOnscreen(panelEl)) {
      break;
    }
  }
};
MdPanelPosition.prototype._reverseXPosition = function(position) {
  if (position === MdPanelPosition.xPosition.CENTER) {
    return;
  }

  var start = 'start';
  var end = 'end';

  return position.indexOf(start) > -1 ? position.replace(start, end) : position.replace(end, start);
};
MdPanelPosition.prototype._bidi = function(position) {
  return this._isRTL ? this._reverseXPosition(position) : position;
};
MdPanelPosition.prototype._calculatePanelPosition = function(panelEl, position) {

  var panelBounds = panelEl[0].getBoundingClientRect();
  var panelWidth = panelBounds.width;
  var panelHeight = panelBounds.height;

  var targetBounds = this._relativeToEl[0].getBoundingClientRect();

  var targetLeft = targetBounds.left;
  var targetRight = targetBounds.right;
  var targetWidth = targetBounds.width;

  switch (this._bidi(position.x)) {
    case MdPanelPosition.xPosition.OFFSET_START:
      this._left = targetLeft - panelWidth + 'px';
      break;
    case MdPanelPosition.xPosition.ALIGN_END:
      this._left = targetRight - panelWidth + 'px';
      break;
    case MdPanelPosition.xPosition.CENTER:
      var left = targetLeft + (0.5 * targetWidth) - (0.5 * panelWidth);
      this._left = left + 'px';
      break;
    case MdPanelPosition.xPosition.ALIGN_START:
      this._left = targetLeft + 'px';
      break;
    case MdPanelPosition.xPosition.OFFSET_END:
      this._left = targetRight + 'px';
      break;
  }

  var targetTop = targetBounds.top;
  var targetBottom = targetBounds.bottom;
  var targetHeight = targetBounds.height;

  switch (position.y) {
    case MdPanelPosition.yPosition.ABOVE:
      this._top = targetTop - panelHeight + 'px';
      break;
    case MdPanelPosition.yPosition.ALIGN_BOTTOMS:
      this._top = targetBottom - panelHeight + 'px';
      break;
    case MdPanelPosition.yPosition.CENTER:
      var top = targetTop + (0.5 * targetHeight) - (0.5 * panelHeight);
      this._top = top + 'px';
      break;
    case MdPanelPosition.yPosition.ALIGN_TOPS:
      this._top = targetTop + 'px';
      break;
    case MdPanelPosition.yPosition.BELOW:
      this._top = targetBottom + 'px';
      break;
  }
};
function MdPanelAnimation($injector) {
  this._$mdUtil = $injector.get('$mdUtil');
  this._openFrom;
  this._closeTo;
  this._animationClass = '';
}
MdPanelAnimation.animation = {
  SLIDE: 'md-panel-animate-slide',
  SCALE: 'md-panel-animate-scale',
  FADE: 'md-panel-animate-fade'
};
MdPanelAnimation.prototype.openFrom = function(openFrom) {
  openFrom = openFrom.target ? openFrom.target : openFrom;

  this._openFrom = this._getPanelAnimationTarget(openFrom);

  if (!this._closeTo) {
    this._closeTo = this._openFrom;
  }
  return this;
};
MdPanelAnimation.prototype.closeTo = function(closeTo) {
  this._closeTo = this._getPanelAnimationTarget(closeTo);
  return this;
};
MdPanelAnimation.prototype._getPanelAnimationTarget = function(location) {
  if (angular.isDefined(location.top) || angular.isDefined(location.left)) {
    return {
      element: undefined,
      bounds: {
        top: location.top || 0,
        left: location.left || 0
      }
    };
  } else {
    return this._getBoundingClientRect(getElement(location));
  }
};
MdPanelAnimation.prototype.withAnimation = function(cssClass) {
  this._animationClass = cssClass;
  return this;
};
MdPanelAnimation.prototype.animateOpen = function(panelEl) {
  var animator = this._$mdUtil.dom.animator;

  this._fixBounds(panelEl);
  var animationOptions = {};
  var panelTransform = panelEl[0].style.transform || '';

  var openFrom = animator.toTransformCss(panelTransform);
  var openTo = animator.toTransformCss(panelTransform);

  switch (this._animationClass) {
    case MdPanelAnimation.animation.SLIDE:
      panelEl.css('opacity', '1');

      animationOptions = {
        transitionInClass: '_md-panel-animate-enter'
      };

      var openSlide = animator.calculateSlideToOrigin(
              panelEl, this._openFrom) || '';
      openFrom = animator.toTransformCss(openSlide + ' ' + panelTransform);
      break;

    case MdPanelAnimation.animation.SCALE:
      animationOptions = {
        transitionInClass: '_md-panel-animate-enter'
      };

      var openScale = animator.calculateZoomToOrigin(
              panelEl, this._openFrom) || '';
      openFrom = animator.toTransformCss(openScale + ' ' + panelTransform);
      break;

    case MdPanelAnimation.animation.FADE:
      animationOptions = {
        transitionInClass: '_md-panel-animate-enter'
      };
      break;

    default:
      if (angular.isString(this._animationClass)) {
        animationOptions = {
          transitionInClass: this._animationClass
        };
      } else {
        animationOptions = {
          transitionInClass: this._animationClass['open'],
          transitionOutClass: this._animationClass['close'],
        };
      }
  }

  return animator
      .translate3d(panelEl, openFrom, openTo, animationOptions);
};
MdPanelAnimation.prototype.animateClose = function(panelEl) {
  var animator = this._$mdUtil.dom.animator;
  var reverseAnimationOptions = {};
  var panelTransform = panelEl[0].style.transform || '';

  var closeFrom = animator.toTransformCss(panelTransform);
  var closeTo = animator.toTransformCss(panelTransform);

  switch (this._animationClass) {
    case MdPanelAnimation.animation.SLIDE:
      panelEl.css('opacity', '1');
      reverseAnimationOptions = {
        transitionInClass: '_md-panel-animate-leave'
      };

      var closeSlide = animator.calculateSlideToOrigin(
              panelEl, this._closeTo) || '';
      closeTo = animator.toTransformCss(closeSlide + ' ' + panelTransform);
      break;

    case MdPanelAnimation.animation.SCALE:
      reverseAnimationOptions = {
        transitionInClass: '_md-panel-animate-scale-out _md-panel-animate-leave'
      };

      var closeScale = animator.calculateZoomToOrigin(
              panelEl, this._closeTo) || '';
      closeTo = animator.toTransformCss(closeScale + ' ' + panelTransform);
      break;

    case MdPanelAnimation.animation.FADE:
      reverseAnimationOptions = {
        transitionInClass: '_md-panel-animate-fade-out _md-panel-animate-leave'
      };
      break;

    default:
      if (angular.isString(this._animationClass)) {
        reverseAnimationOptions = {
          transitionOutClass: this._animationClass
        };
      } else {
        reverseAnimationOptions = {
          transitionInClass: this._animationClass['close'],
          transitionOutClass: this._animationClass['open']
        };
      }
  }

  return animator
      .translate3d(panelEl, closeFrom, closeTo, reverseAnimationOptions);
};
MdPanelAnimation.prototype._fixBounds = function(panelEl) {
  var panelWidth = panelEl[0].offsetWidth;
  var panelHeight = panelEl[0].offsetHeight;

  if (this._openFrom && this._openFrom.bounds.height == null) {
    this._openFrom.bounds.height = panelHeight;
  }
  if (this._openFrom && this._openFrom.bounds.width == null) {
    this._openFrom.bounds.width = panelWidth;
  }
  if (this._closeTo && this._closeTo.bounds.height == null) {
    this._closeTo.bounds.height = panelHeight;
  }
  if (this._closeTo && this._closeTo.bounds.width == null) {
    this._closeTo.bounds.width = panelWidth;
  }
};
MdPanelAnimation.prototype._getBoundingClientRect = function(element) {
  if (element instanceof angular.element) {
    return {
      element: element,
      bounds: element[0].getBoundingClientRect()
    };
  }
};
function getElement(el) {
  var queryResult = angular.isString(el) ?
      document.querySelector(el) : el;
  return angular.element(queryResult);
}

})();
(function(){
"use strict";

angular.module('material.components.progressCircular', ['material.core']);

})();
(function(){
"use strict";
MdProgressLinearDirective.$inject = ["$mdTheming", "$mdUtil", "$log"];
angular.module('material.components.progressLinear', [
  'material.core'
])
  .directive('mdProgressLinear', MdProgressLinearDirective);
function MdProgressLinearDirective($mdTheming, $mdUtil, $log) {
  var MODE_DETERMINATE = "determinate";
  var MODE_INDETERMINATE = "indeterminate";
  var MODE_BUFFER = "buffer";
  var MODE_QUERY = "query";
  var DISABLED_CLASS = "_md-progress-linear-disabled";

  return {
    restrict: 'E',
    template: '<div class="md-container">' +
      '<div class="md-dashed"></div>' +
      '<div class="md-bar md-bar1"></div>' +
      '<div class="md-bar md-bar2"></div>' +
      '</div>',
    compile: compile
  };

  function compile(tElement, tAttrs, transclude) {
    tElement.attr('aria-valuemin', 0);
    tElement.attr('aria-valuemax', 100);
    tElement.attr('role', 'progressbar');

    return postLink;
  }
  function postLink(scope, element, attr) {
    $mdTheming(element);

    var lastMode;
    var isDisabled = attr.hasOwnProperty('disabled');
    var toVendorCSS = $mdUtil.dom.animator.toCss;
    var bar1 = angular.element(element[0].querySelector('.md-bar1'));
    var bar2 = angular.element(element[0].querySelector('.md-bar2'));
    var container = angular.element(element[0].querySelector('.md-container'));

    element
      .attr('md-mode', mode())
      .toggleClass(DISABLED_CLASS, isDisabled);

    validateMode();
    watchAttributes();
    function watchAttributes() {
      attr.$observe('value', function(value) {
        var percentValue = clamp(value);
        element.attr('aria-valuenow', percentValue);

        if (mode() != MODE_QUERY) animateIndicator(bar2, percentValue);
      });

      attr.$observe('mdBufferValue', function(value) {
        animateIndicator(bar1, clamp(value));
      });

      attr.$observe('disabled', function(value) {
        if (value === true || value === false) {
          isDisabled = !!value;
        } else {
          isDisabled = angular.isDefined(value);
        }

        element.toggleClass(DISABLED_CLASS, isDisabled);
        container.toggleClass(lastMode, !isDisabled);
      });

      attr.$observe('mdMode', function(mode) {
        if (lastMode) container.removeClass( lastMode );

        switch( mode ) {
          case MODE_QUERY:
          case MODE_BUFFER:
          case MODE_DETERMINATE:
          case MODE_INDETERMINATE:
            container.addClass( lastMode = "md-mode-" + mode );
            break;
          default:
            container.addClass( lastMode = "md-mode-" + MODE_INDETERMINATE );
            break;
        }
      });
    }
    function validateMode() {
      if ( angular.isUndefined(attr.mdMode) ) {
        var hasValue = angular.isDefined(attr.value);
        var mode = hasValue ? MODE_DETERMINATE : MODE_INDETERMINATE;
        var info = "Auto-adding the missing md-mode='{0}' to the ProgressLinear element";

        element.attr("md-mode", mode);
        attr.mdMode = mode;
      }
    }
    function mode() {
      var value = (attr.mdMode || "").trim();
      if ( value ) {
        switch(value) {
          case MODE_DETERMINATE:
          case MODE_INDETERMINATE:
          case MODE_BUFFER:
          case MODE_QUERY:
            break;
          default:
            value = MODE_INDETERMINATE;
            break;
        }
      }
      return value;
    }
    function animateIndicator(target, value) {
      if ( isDisabled || !mode() ) return;

      var to = $mdUtil.supplant("translateX({0}%) scale({1},1)", [ (value-100)/2, value/100 ]);
      var styles = toVendorCSS({ transform : to });
      angular.element(target).css( styles );
    }
  }
  function clamp(value) {
    return Math.max(0, Math.min(value || 0, 100));
  }
}


})();
(function(){
"use strict";
mdRadioGroupDirective.$inject = ["$mdUtil", "$mdConstant", "$mdTheming", "$timeout"];
mdRadioButtonDirective.$inject = ["$mdAria", "$mdUtil", "$mdTheming"];
angular.module('material.components.radioButton', [
  'material.core'
])
  .directive('mdRadioGroup', mdRadioGroupDirective)
  .directive('mdRadioButton', mdRadioButtonDirective);
function mdRadioGroupDirective($mdUtil, $mdConstant, $mdTheming, $timeout) {
  RadioGroupController.prototype = createRadioGroupControllerProto();

  return {
    restrict: 'E',
    controller: ['$element', RadioGroupController],
    require: ['mdRadioGroup', '?ngModel'],
    link: { pre: linkRadioGroup }
  };

  function linkRadioGroup(scope, element, attr, ctrls) {
    element.addClass('_md');     // private md component indicator for styling
    $mdTheming(element);
    
    var rgCtrl = ctrls[0];
    var ngModelCtrl = ctrls[1] || $mdUtil.fakeNgModel();

    rgCtrl.init(ngModelCtrl);

    scope.mouseActive = false;

    element
      .attr({
        'role': 'radiogroup',
        'tabIndex': element.attr('tabindex') || '0'
      })
      .on('keydown', keydownListener)
      .on('mousedown', function(event) {
        scope.mouseActive = true;
        $timeout(function() {
          scope.mouseActive = false;
        }, 100);
      })
      .on('focus', function() {
        if(scope.mouseActive === false) {
          rgCtrl.$element.addClass('md-focused');
        }
      })
      .on('blur', function() {
        rgCtrl.$element.removeClass('md-focused');
      });
    function setFocus() {
      if (!element.hasClass('md-focused')) { element.addClass('md-focused'); }
    }
    function keydownListener(ev) {
      var keyCode = ev.which || ev.keyCode;

      if (keyCode != $mdConstant.KEY_CODE.ENTER &&
          ev.currentTarget != ev.target) {
        return;
      }

      switch (keyCode) {
        case $mdConstant.KEY_CODE.LEFT_ARROW:
        case $mdConstant.KEY_CODE.UP_ARROW:
          ev.preventDefault();
          rgCtrl.selectPrevious();
          setFocus();
          break;

        case $mdConstant.KEY_CODE.RIGHT_ARROW:
        case $mdConstant.KEY_CODE.DOWN_ARROW:
          ev.preventDefault();
          rgCtrl.selectNext();
          setFocus();
          break;

        case $mdConstant.KEY_CODE.ENTER:
          var form = angular.element($mdUtil.getClosest(element[0], 'form'));
          if (form.length > 0) {
            form.triggerHandler('submit');
          }
          break;
      }

    }
  }

  function RadioGroupController($element) {
    this._radioButtonRenderFns = [];
    this.$element = $element;
  }

  function createRadioGroupControllerProto() {
    return {
      init: function(ngModelCtrl) {
        this._ngModelCtrl = ngModelCtrl;
        this._ngModelCtrl.$render = angular.bind(this, this.render);
      },
      add: function(rbRender) {
        this._radioButtonRenderFns.push(rbRender);
      },
      remove: function(rbRender) {
        var index = this._radioButtonRenderFns.indexOf(rbRender);
        if (index !== -1) {
          this._radioButtonRenderFns.splice(index, 1);
        }
      },
      render: function() {
        this._radioButtonRenderFns.forEach(function(rbRender) {
          rbRender();
        });
      },
      setViewValue: function(value, eventType) {
        this._ngModelCtrl.$setViewValue(value, eventType);
        this.render();
      },
      getViewValue: function() {
        return this._ngModelCtrl.$viewValue;
      },
      selectNext: function() {
        return changeSelectedButton(this.$element, 1);
      },
      selectPrevious: function() {
        return changeSelectedButton(this.$element, -1);
      },
      setActiveDescendant: function (radioId) {
        this.$element.attr('aria-activedescendant', radioId);
      },
      isDisabled: function() {
        return this.$element[0].hasAttribute('disabled');
      }
    };
  }
  function changeSelectedButton(parent, increment) {
    var buttons = $mdUtil.iterator(parent[0].querySelectorAll('md-radio-button'), true);

    if (buttons.count()) {
      var validate = function (button) {
        return !angular.element(button).attr("disabled");
      };

      var selected = parent[0].querySelector('md-radio-button.md-checked');
      var target = buttons[increment < 0 ? 'previous' : 'next'](selected, validate) || buttons.first();
      angular.element(target).triggerHandler('click');


    }
  }

}
function mdRadioButtonDirective($mdAria, $mdUtil, $mdTheming) {

  var CHECKED_CSS = 'md-checked';

  return {
    restrict: 'E',
    require: '^mdRadioGroup',
    transclude: true,
    template: '<div class="md-container" md-ink-ripple md-ink-ripple-checkbox>' +
                '<div class="md-off"></div>' +
                '<div class="md-on"></div>' +
              '</div>' +
              '<div ng-transclude class="md-label"></div>',
    link: link
  };

  function link(scope, element, attr, rgCtrl) {
    var lastChecked;

    $mdTheming(element);
    configureAria(element, scope);

    initialize();
    function initialize() {
      if (!rgCtrl) {
        throw 'RadioButton: No RadioGroupController could be found.';
      }

      rgCtrl.add(render);
      attr.$observe('value', render);

      element
        .on('click', listener)
        .on('$destroy', function() {
          rgCtrl.remove(render);
        });
    }
    function listener(ev) {
      if (element[0].hasAttribute('disabled') || rgCtrl.isDisabled()) return;

      scope.$apply(function() {
        rgCtrl.setViewValue(attr.value, ev && ev.type);
      });
    }
    function render() {
      var checked = (rgCtrl.getViewValue() == attr.value);
      if (checked === lastChecked) {
        return;
      }

      lastChecked = checked;
      element.attr('aria-checked', checked);

      if (checked) {
        markParentAsChecked(true);
        element.addClass(CHECKED_CSS);

        rgCtrl.setActiveDescendant(element.attr('id'));

      } else {
        markParentAsChecked(false);
        element.removeClass(CHECKED_CSS);
      }
      function markParentAsChecked(addClass ) {
        if ( element.parent()[0].nodeName != "MD-RADIO-GROUP") {
          element.parent()[ !!addClass ? 'addClass' : 'removeClass'](CHECKED_CSS);
        }

      }
    }
    function configureAria( element, scope ){
      scope.ariaId = buildAriaID();

      element.attr({
        'id' :  scope.ariaId,
        'role' : 'radio',
        'aria-checked' : 'false'
      });

      $mdAria.expectWithText(element, 'aria-label');
      function buildAriaID() {
        return attr.id || ( 'radio' + "_" + $mdUtil.nextUid() );
      }
    }
  }
}

})();
(function(){
"use strict";

SelectDirective.$inject = ["$mdSelect", "$mdUtil", "$mdConstant", "$mdTheming", "$mdAria", "$compile", "$parse"];
SelectMenuDirective.$inject = ["$parse", "$mdUtil", "$mdConstant", "$mdTheming"];
OptionDirective.$inject = ["$mdButtonInkRipple", "$mdUtil"];
SelectProvider.$inject = ["$$interimElementProvider"];
var SELECT_EDGE_MARGIN = 8;
var selectNextId = 0;
var CHECKBOX_SELECTION_INDICATOR =
  angular.element('<div class="md-container"><div class="md-icon"></div></div>');

angular.module('material.components.select', [
    'material.core',
    'material.components.backdrop'
  ])
  .directive('mdSelect', SelectDirective)
  .directive('mdSelectMenu', SelectMenuDirective)
  .directive('mdOption', OptionDirective)
  .directive('mdOptgroup', OptgroupDirective)
  .directive('mdSelectHeader', SelectHeaderDirective)
  .provider('$mdSelect', SelectProvider);
function SelectDirective($mdSelect, $mdUtil, $mdConstant, $mdTheming, $mdAria, $compile, $parse) {
  var keyCodes = $mdConstant.KEY_CODE;
  var NAVIGATION_KEYS = [keyCodes.SPACE, keyCodes.ENTER, keyCodes.UP_ARROW, keyCodes.DOWN_ARROW];

  return {
    restrict: 'E',
    require: ['^?mdInputContainer', 'mdSelect', 'ngModel', '?^form'],
    compile: compile,
    controller: function() {
    } // empty placeholder controller to be initialized in link
  };

  function compile(element, attr) {
    var valueEl = angular.element('<md-select-value><span></span></md-select-value>');
    valueEl.append('<span class="md-select-icon" aria-hidden="true"></span>');
    valueEl.addClass('md-select-value');
    if (!valueEl[0].hasAttribute('id')) {
      valueEl.attr('id', 'select_value_label_' + $mdUtil.nextUid());
    }
    if (!element.find('md-content').length) {
      element.append(angular.element('<md-content>').append(element.contents()));
    }
    if (attr.mdOnOpen) {
      element
        .find('md-content')
        .prepend(angular.element(
          '<div>' +
          ' <md-progress-circular md-mode="indeterminate" ng-if="$$loadingAsyncDone === false" md-diameter="25px"></md-progress-circular>' +
          '</div>'
        ));
      element
        .find('md-option')
        .attr('ng-show', '$$loadingAsyncDone');
    }

    if (attr.name) {
      var autofillClone = angular.element('<select class="md-visually-hidden">');
      autofillClone.attr({
        'name': attr.name,
        'aria-hidden': 'true',
        'tabindex': '-1'
      });
      var opts = element.find('md-option');
      angular.forEach(opts, function(el) {
        var newEl = angular.element('<option>' + el.innerHTML + '</option>');
        if (el.hasAttribute('ng-value')) newEl.attr('ng-value', el.getAttribute('ng-value'));
        else if (el.hasAttribute('value')) newEl.attr('value', el.getAttribute('value'));
        autofillClone.append(newEl);
      });
      autofillClone.append(
        '<option ng-value="' + attr.ngModel + '" selected></option>'
      );

      element.parent().append(autofillClone);
    }

    var isMultiple = $mdUtil.parseAttributeBoolean(attr.multiple);
    var multipleContent = isMultiple ? 'multiple' : '';
    var selectTemplate = '' +
      '<div class="md-select-menu-container" aria-hidden="true">' +
      '<md-select-menu {0}>{1}</md-select-menu>' +
      '</div>';

    selectTemplate = $mdUtil.supplant(selectTemplate, [multipleContent, element.html()]);
    element.empty().append(valueEl);
    element.append(selectTemplate);

    if(!attr.tabindex){
      attr.$set('tabindex', 0);
    }

    return function postLink(scope, element, attr, ctrls) {
      var untouched = true;
      var isDisabled, ariaLabelBase;

      var containerCtrl = ctrls[0];
      var mdSelectCtrl = ctrls[1];
      var ngModelCtrl = ctrls[2];
      var formCtrl = ctrls[3];
      var valueEl = element.find('md-select-value');
      var isReadonly = angular.isDefined(attr.readonly);
      var disableAsterisk = $mdUtil.parseAttributeBoolean(attr.mdNoAsterisk);

      if (disableAsterisk) {
        element.addClass('md-no-asterisk');
      }

      if (containerCtrl) {
        var isErrorGetter = containerCtrl.isErrorGetter || function() {
          return ngModelCtrl.$invalid && (ngModelCtrl.$touched || (formCtrl && formCtrl.$submitted));
        };

        if (containerCtrl.input) {
          if (element.find('md-select-header').find('input')[0] !== containerCtrl.input[0]) {
            throw new Error("<md-input-container> can only have *one* child <input>, <textarea> or <select> element!");
          }
        }

        containerCtrl.input = element;
        if (!containerCtrl.label) {
          $mdAria.expect(element, 'aria-label', element.attr('placeholder'));
        }

        scope.$watch(isErrorGetter, containerCtrl.setInvalid);
      }

      var selectContainer, selectScope, selectMenuCtrl;

      findSelectContainer();
      $mdTheming(element);

      if (formCtrl && angular.isDefined(attr.multiple)) {
        $mdUtil.nextTick(function() {
          var hasModelValue = ngModelCtrl.$modelValue || ngModelCtrl.$viewValue;
          if (hasModelValue) {
            formCtrl.$setPristine();
          }
        });
      }

      var originalRender = ngModelCtrl.$render;
      ngModelCtrl.$render = function() {
        originalRender();
        syncLabelText();
        syncAriaLabel();
        inputCheckValue();
      };

      attr.$observe('placeholder', ngModelCtrl.$render);

      if (containerCtrl && containerCtrl.label) {
        attr.$observe('required', function (value) {
          containerCtrl.label.toggleClass('md-required', value && !disableAsterisk);
        });
      }

      mdSelectCtrl.setLabelText = function(text) {
        mdSelectCtrl.setIsPlaceholder(!text);

        if (attr.mdSelectedText) {
          text = $parse(attr.mdSelectedText)(scope);
        } else {
          var tmpPlaceholder = attr.placeholder ||
              (containerCtrl && containerCtrl.label ? containerCtrl.label.text() : '');
          text = text || tmpPlaceholder || '';
        }

        var target = valueEl.children().eq(0);
        target.html(text);
      };

      mdSelectCtrl.setIsPlaceholder = function(isPlaceholder) {
        if (isPlaceholder) {
          valueEl.addClass('md-select-placeholder');
          if (containerCtrl && containerCtrl.label) {
            containerCtrl.label.addClass('md-placeholder');
          }
        } else {
          valueEl.removeClass('md-select-placeholder');
          if (containerCtrl && containerCtrl.label) {
            containerCtrl.label.removeClass('md-placeholder');
          }
        }
      };

      if (!isReadonly) {
        element
          .on('focus', function(ev) {
            containerCtrl && containerCtrl.setFocused(true);
          });
        element.on('blur', function(event) {
          if (untouched) {
            untouched = false;
            if (selectScope._mdSelectIsOpen) {
              event.stopImmediatePropagation();
            }
          }

          if (selectScope._mdSelectIsOpen) return;
          containerCtrl && containerCtrl.setFocused(false);
          inputCheckValue();
        });
      }

      mdSelectCtrl.triggerClose = function() {
        $parse(attr.mdOnClose)(scope);
      };

      scope.$$postDigest(function() {
        initAriaLabel();
        syncLabelText();
        syncAriaLabel();
      });

      function initAriaLabel() {
        var labelText = element.attr('aria-label') || element.attr('placeholder');
        if (!labelText && containerCtrl && containerCtrl.label) {
          labelText = containerCtrl.label.text();
        }
        ariaLabelBase = labelText;
        $mdAria.expect(element, 'aria-label', labelText);
      }

      scope.$watch(function() {
          return selectMenuCtrl.selectedLabels();
      }, syncLabelText);

      function syncLabelText() {
        if (selectContainer) {
          selectMenuCtrl = selectMenuCtrl || selectContainer.find('md-select-menu').controller('mdSelectMenu');
          mdSelectCtrl.setLabelText(selectMenuCtrl.selectedLabels());
        }
      }

      function syncAriaLabel() {
        if (!ariaLabelBase) return;
        var ariaLabels = selectMenuCtrl.selectedLabels({mode: 'aria'});
        element.attr('aria-label', ariaLabels.length ? ariaLabelBase + ': ' + ariaLabels : ariaLabelBase);
      }

      var deregisterWatcher;
      attr.$observe('ngMultiple', function(val) {
        if (deregisterWatcher) deregisterWatcher();
        var parser = $parse(val);
        deregisterWatcher = scope.$watch(function() {
          return parser(scope);
        }, function(multiple, prevVal) {
          if (multiple === undefined && prevVal === undefined) return; // assume compiler did a good job
          if (multiple) {
            element.attr('multiple', 'multiple');
          } else {
            element.removeAttr('multiple');
          }
          element.attr('aria-multiselectable', multiple ? 'true' : 'false');
          if (selectContainer) {
            selectMenuCtrl.setMultiple(multiple);
            originalRender = ngModelCtrl.$render;
            ngModelCtrl.$render = function() {
              originalRender();
              syncLabelText();
              syncAriaLabel();
              inputCheckValue();
            };
            ngModelCtrl.$render();
          }
        });
      });

      attr.$observe('disabled', function(disabled) {
        if (angular.isString(disabled)) {
          disabled = true;
        }
        if (isDisabled !== undefined && isDisabled === disabled) {
          return;
        }
        isDisabled = disabled;
        if (disabled) {
          element
            .attr({'aria-disabled': 'true'})
            .removeAttr('tabindex')
            .off('click', openSelect)
            .off('keydown', handleKeypress);
        } else {
          element
            .attr({'tabindex': attr.tabindex, 'aria-disabled': 'false'})
            .on('click', openSelect)
            .on('keydown', handleKeypress);
        }
      });

      if (!attr.hasOwnProperty('disabled') && !attr.hasOwnProperty('ngDisabled')) {
        element.attr({'aria-disabled': 'false'});
        element.on('click', openSelect);
        element.on('keydown', handleKeypress);
      }

      var ariaAttrs = {
        role: 'listbox',
        'aria-expanded': 'false',
        'aria-multiselectable': isMultiple && !attr.ngMultiple ? 'true' : 'false'
      };

      if (!element[0].hasAttribute('id')) {
        ariaAttrs.id = 'select_' + $mdUtil.nextUid();
      }

      var containerId = 'select_container_' + $mdUtil.nextUid();
      selectContainer.attr('id', containerId);
      ariaAttrs['aria-owns'] = containerId;
      element.attr(ariaAttrs);

      scope.$on('$destroy', function() {
        $mdSelect
          .destroy()
          .finally(function() {
            if (containerCtrl) {
              containerCtrl.setFocused(false);
              containerCtrl.setHasValue(false);
              containerCtrl.input = null;
            }
            ngModelCtrl.$setTouched();
          });
      });



      function inputCheckValue() {
        containerCtrl && containerCtrl.setHasValue(selectMenuCtrl.selectedLabels().length > 0 || (element[0].validity || {}).badInput);
      }

      function findSelectContainer() {
        selectContainer = angular.element(
          element[0].querySelector('.md-select-menu-container')
        );
        selectScope = scope;
        if (attr.mdContainerClass) {
          var value = selectContainer[0].getAttribute('class') + ' ' + attr.mdContainerClass;
          selectContainer[0].setAttribute('class', value);
        }
        selectMenuCtrl = selectContainer.find('md-select-menu').controller('mdSelectMenu');
        selectMenuCtrl.init(ngModelCtrl, attr.ngModel);
        element.on('$destroy', function() {
          selectContainer.remove();
        });
      }

      function handleKeypress(e) {
        if ($mdConstant.isNavigationKey(e)) {
          e.preventDefault();
          openSelect(e);
        } else {
          if ($mdConstant.isInputKey(e) || $mdConstant.isNumPadKey(e)) {
            e.preventDefault();

            var node = selectMenuCtrl.optNodeForKeyboardSearch(e);
            if (!node || node.hasAttribute('disabled')) return;
            var optionCtrl = angular.element(node).controller('mdOption');
            if (!selectMenuCtrl.isMultiple) {
              selectMenuCtrl.deselect(Object.keys(selectMenuCtrl.selected)[0]);
            }
            selectMenuCtrl.select(optionCtrl.hashKey, optionCtrl.value);
            selectMenuCtrl.refreshViewValue();
          }
        }
      }

      function openSelect() {
        selectScope._mdSelectIsOpen = true;
        element.attr('aria-expanded', 'true');

        $mdSelect.show({
          scope: selectScope,
          preserveScope: true,
          skipCompile: true,
          element: selectContainer,
          target: element[0],
          selectCtrl: mdSelectCtrl,
          preserveElement: true,
          hasBackdrop: true,
          loadingAsync: attr.mdOnOpen ? scope.$eval(attr.mdOnOpen) || true : false
        }).finally(function() {
          selectScope._mdSelectIsOpen = false;
          element.focus();
          element.attr('aria-expanded', 'false');
          ngModelCtrl.$setTouched();
        });
      }

    };
  }
}

function SelectMenuDirective($parse, $mdUtil, $mdConstant, $mdTheming) {
  SelectMenuController.$inject = ["$scope", "$attrs", "$element"];
  return {
    restrict: 'E',
    require: ['mdSelectMenu'],
    scope: false,
    controller: SelectMenuController,
    link: {pre: preLink}
  };
  function preLink(scope, element, attr, ctrls) {
    var selectCtrl = ctrls[0];

    element.addClass('_md');     // private md component indicator for styling

    $mdTheming(element);
    element.on('click', clickListener);
    element.on('keypress', keyListener);

    function keyListener(e) {
      if (e.keyCode == 13 || e.keyCode == 32) {
        clickListener(e);
      }
    }

    function clickListener(ev) {
      var option = $mdUtil.getClosest(ev.target, 'md-option');
      var optionCtrl = option && angular.element(option).data('$mdOptionController');
      if (!option || !optionCtrl) return;
      if (option.hasAttribute('disabled')) {
        ev.stopImmediatePropagation();
        return false;
      }

      var optionHashKey = selectCtrl.hashGetter(optionCtrl.value);
      var isSelected = angular.isDefined(selectCtrl.selected[optionHashKey]);

      scope.$apply(function() {
        if (selectCtrl.isMultiple) {
          if (isSelected) {
            selectCtrl.deselect(optionHashKey);
          } else {
            selectCtrl.select(optionHashKey, optionCtrl.value);
          }
        } else {
          if (!isSelected) {
            selectCtrl.deselect(Object.keys(selectCtrl.selected)[0]);
            selectCtrl.select(optionHashKey, optionCtrl.value);
          }
        }
        selectCtrl.refreshViewValue();
      });
    }
  }

  function SelectMenuController($scope, $attrs, $element) {
    var self = this;
    self.isMultiple = angular.isDefined($attrs.multiple);
    self.selected = {};
    self.options = {};

    $scope.$watchCollection(function() {
      return self.options;
    }, function() {
      self.ngModel.$render();
    });

    var deregisterCollectionWatch;
    var defaultIsEmpty;
    self.setMultiple = function(isMultiple) {
      var ngModel = self.ngModel;
      defaultIsEmpty = defaultIsEmpty || ngModel.$isEmpty;

      self.isMultiple = isMultiple;
      if (deregisterCollectionWatch) deregisterCollectionWatch();

      if (self.isMultiple) {
        ngModel.$validators['md-multiple'] = validateArray;
        ngModel.$render = renderMultiple;
        $scope.$watchCollection(self.modelBinding, function(value) {
          if (validateArray(value)) renderMultiple(value);
          self.ngModel.$setPristine();
        });

        ngModel.$isEmpty = function(value) {
          return !value || value.length === 0;
        };
      } else {
        delete ngModel.$validators['md-multiple'];
        ngModel.$render = renderSingular;
      }

      function validateArray(modelValue, viewValue) {
        return angular.isArray(modelValue || viewValue || []);
      }
    };

    var searchStr = '';
    var clearSearchTimeout, optNodes, optText;
    var CLEAR_SEARCH_AFTER = 300;

    self.optNodeForKeyboardSearch = function(e) {
      clearSearchTimeout && clearTimeout(clearSearchTimeout);
      clearSearchTimeout = setTimeout(function() {
        clearSearchTimeout = undefined;
        searchStr = '';
        optText = undefined;
        optNodes = undefined;
      }, CLEAR_SEARCH_AFTER);
      var keyCode = e.keyCode - ($mdConstant.isNumPadKey(e) ? 48 : 0);

      searchStr += String.fromCharCode(keyCode);
      var search = new RegExp('^' + searchStr, 'i');
      if (!optNodes) {
        optNodes = $element.find('md-option');
        optText = new Array(optNodes.length);
        angular.forEach(optNodes, function(el, i) {
          optText[i] = el.textContent.trim();
        });
      }
      for (var i = 0; i < optText.length; ++i) {
        if (search.test(optText[i])) {
          return optNodes[i];
        }
      }
    };

    self.init = function(ngModel, binding) {
      self.ngModel = ngModel;
      self.modelBinding = binding;
      self.ngModel.$isEmpty = function($viewValue) {
        return !self.options[self.hashGetter($viewValue)];
      };
      if (ngModel.$options && ngModel.$options.trackBy) {
        var trackByLocals = {};
        var trackByParsed = $parse(ngModel.$options.trackBy);
        self.hashGetter = function(value, valueScope) {
          trackByLocals.$value = value;
          return trackByParsed(valueScope || $scope, trackByLocals);
        };
      } else {
        self.hashGetter = function getHashValue(value) {
          if (angular.isObject(value)) {
            return 'object_' + (value.$$mdSelectId || (value.$$mdSelectId = ++selectNextId));
          }
          return value;
        };
      }
      self.setMultiple(self.isMultiple);
    };

    self.selectedLabels = function(opts) {
      opts = opts || {};
      var mode = opts.mode || 'html';
      var selectedOptionEls = $mdUtil.nodesToArray($element[0].querySelectorAll('md-option[selected]'));
      if (selectedOptionEls.length) {
        var mapFn;

        if (mode == 'html') {
          mapFn = function(el) {
            if (el.hasAttribute('md-option-empty')) {
              return '';
            }

            var html = el.innerHTML;
            var rippleContainer = el.querySelector('.md-ripple-container');
            if (rippleContainer) {
              html = html.replace(rippleContainer.outerHTML, '');
            }
            var checkboxContainer = el.querySelector('.md-container');
            if (checkboxContainer) {
              html = html.replace(checkboxContainer.outerHTML, '');
            }

            return html;
          };
        } else if (mode == 'aria') {
          mapFn = function(el) { return el.hasAttribute('aria-label') ? el.getAttribute('aria-label') : el.textContent; };
        }
        return selectedOptionEls.map(mapFn).join(', ');
      } else {
        return '';
      }
    };

    self.select = function(hashKey, hashedValue) {
      var option = self.options[hashKey];
      option && option.setSelected(true);
      self.selected[hashKey] = hashedValue;
    };
    self.deselect = function(hashKey) {
      var option = self.options[hashKey];
      option && option.setSelected(false);
      delete self.selected[hashKey];
    };

    self.addOption = function(hashKey, optionCtrl) {
      if (angular.isDefined(self.options[hashKey])) {
        throw new Error('Duplicate md-option values are not allowed in a select. ' +
          'Duplicate value "' + optionCtrl.value + '" found.');
      }

      self.options[hashKey] = optionCtrl;
      if (angular.isDefined(self.selected[hashKey])) {
        self.select(hashKey, optionCtrl.value);
        if (angular.isDefined(self.ngModel.$modelValue) && self.hashGetter(self.ngModel.$modelValue) === hashKey) {
          self.ngModel.$validate();
        }

        self.refreshViewValue();
      }
    };
    self.removeOption = function(hashKey) {
      delete self.options[hashKey];
    };

    self.refreshViewValue = function() {
      var values = [];
      var option;
      for (var hashKey in self.selected) {
        if ((option = self.options[hashKey])) {
          values.push(option.value);
        } else {
          values.push(self.selected[hashKey]);
        }
      }
      var usingTrackBy = self.ngModel.$options && self.ngModel.$options.trackBy;

      var newVal = self.isMultiple ? values : values[0];
      var prevVal = self.ngModel.$modelValue;

      if (usingTrackBy ? !angular.equals(prevVal, newVal) : prevVal != newVal) {
        self.ngModel.$setViewValue(newVal);
        self.ngModel.$render();
      }
    };

    function renderMultiple() {
      var newSelectedValues = self.ngModel.$modelValue || self.ngModel.$viewValue || [];
      if (!angular.isArray(newSelectedValues)) return;

      var oldSelected = Object.keys(self.selected);

      var newSelectedHashes = newSelectedValues.map(self.hashGetter);
      var deselected = oldSelected.filter(function(hash) {
        return newSelectedHashes.indexOf(hash) === -1;
      });

      deselected.forEach(self.deselect);
      newSelectedHashes.forEach(function(hashKey, i) {
        self.select(hashKey, newSelectedValues[i]);
      });
    }

    function renderSingular() {
      var value = self.ngModel.$viewValue || self.ngModel.$modelValue;
      Object.keys(self.selected).forEach(self.deselect);
      self.select(self.hashGetter(value), value);
    }
  }

}

function OptionDirective($mdButtonInkRipple, $mdUtil) {

  OptionController.$inject = ["$element"];
  return {
    restrict: 'E',
    require: ['mdOption', '^^mdSelectMenu'],
    controller: OptionController,
    compile: compile
  };

  function compile(element, attr) {
    element.append(angular.element('<div class="md-text">').append(element.contents()));

    element.attr('tabindex', attr.tabindex || '0');

    if (!hasDefinedValue(attr)) {
      element.attr('md-option-empty', '');
    }

    return postLink;
  }

  function hasDefinedValue(attr) {
    var value = attr.value;
    var ngValue = attr.ngValue;

    return value || ngValue;
  }

  function postLink(scope, element, attr, ctrls) {
    var optionCtrl = ctrls[0];
    var selectCtrl = ctrls[1];

    if (selectCtrl.isMultiple) {
      element.addClass('md-checkbox-enabled');
      element.prepend(CHECKBOX_SELECTION_INDICATOR.clone());
    }

    if (angular.isDefined(attr.ngValue)) {
      scope.$watch(attr.ngValue, setOptionValue);
    } else if (angular.isDefined(attr.value)) {
      setOptionValue(attr.value);
    } else {
      scope.$watch(function() {
        return element.text().trim();
      }, setOptionValue);
    }

    attr.$observe('disabled', function(disabled) {
      if (disabled) {
        element.attr('tabindex', '-1');
      } else {
        element.attr('tabindex', '0');
      }
    });

    scope.$$postDigest(function() {
      attr.$observe('selected', function(selected) {
        if (!angular.isDefined(selected)) return;
        if (typeof selected == 'string') selected = true;
        if (selected) {
          if (!selectCtrl.isMultiple) {
            selectCtrl.deselect(Object.keys(selectCtrl.selected)[0]);
          }
          selectCtrl.select(optionCtrl.hashKey, optionCtrl.value);
        } else {
          selectCtrl.deselect(optionCtrl.hashKey);
        }
        selectCtrl.refreshViewValue();
      });
    });

    $mdButtonInkRipple.attach(scope, element);
    configureAria();

    function setOptionValue(newValue, oldValue, prevAttempt) {
      if (!selectCtrl.hashGetter) {
        if (!prevAttempt) {
          scope.$$postDigest(function() {
            setOptionValue(newValue, oldValue, true);
          });
        }
        return;
      }
      var oldHashKey = selectCtrl.hashGetter(oldValue, scope);
      var newHashKey = selectCtrl.hashGetter(newValue, scope);

      optionCtrl.hashKey = newHashKey;
      optionCtrl.value = newValue;

      selectCtrl.removeOption(oldHashKey, optionCtrl);
      selectCtrl.addOption(newHashKey, optionCtrl);
    }

    scope.$on('$destroy', function() {
      selectCtrl.removeOption(optionCtrl.hashKey, optionCtrl);
    });

    function configureAria() {
      var ariaAttrs = {
        'role': 'option',
        'aria-selected': 'false'
      };

      if (!element[0].hasAttribute('id')) {
        ariaAttrs.id = 'select_option_' + $mdUtil.nextUid();
      }
      element.attr(ariaAttrs);
    }
  }

  function OptionController($element) {
    this.selected = false;
    this.setSelected = function(isSelected) {
      if (isSelected && !this.selected) {
        $element.attr({
          'selected': 'selected',
          'aria-selected': 'true'
        });
      } else if (!isSelected && this.selected) {
        $element.removeAttr('selected');
        $element.attr('aria-selected', 'false');
      }
      this.selected = isSelected;
    };
  }

}

function OptgroupDirective() {
  return {
    restrict: 'E',
    compile: compile
  };
  function compile(el, attrs) {
    if (!hasSelectHeader()) {
      setupLabelElement();
    }

    function hasSelectHeader() {
      return el.parent().find('md-select-header').length;
    }

    function setupLabelElement() {
      var labelElement = el.find('label');
      if (!labelElement.length) {
        labelElement = angular.element('<label>');
        el.prepend(labelElement);
      }
      labelElement.addClass('md-container-ignore');
      if (attrs.label) labelElement.text(attrs.label);
    }
  }
}

function SelectHeaderDirective() {
  return {
    restrict: 'E',
  };
}

function SelectProvider($$interimElementProvider) {
  selectDefaultOptions.$inject = ["$mdSelect", "$mdConstant", "$mdUtil", "$window", "$q", "$$rAF", "$animateCss", "$animate", "$document"];
  return $$interimElementProvider('$mdSelect')
    .setDefaults({
      methods: ['target'],
      options: selectDefaultOptions
    });
  function selectDefaultOptions($mdSelect, $mdConstant, $mdUtil, $window, $q, $$rAF, $animateCss, $animate, $document) {
    var ERROR_TARGET_EXPECTED = "$mdSelect.show() expected a target element in options.target but got '{0}'!";
    var animator = $mdUtil.dom.animator;
    var keyCodes = $mdConstant.KEY_CODE;

    return {
      parent: 'body',
      themable: true,
      onShow: onShow,
      onRemove: onRemove,
      hasBackdrop: true,
      disableParentScroll: true
    };
    function onRemove(scope, element, opts) {
      opts = opts || { };
      opts.cleanupInteraction();
      opts.cleanupResizing();
      opts.hideBackdrop();

      return  (opts.$destroy === true) ? cleanElement() : animateRemoval().then( cleanElement );
      function animateRemoval() {
        return $animateCss(element, {addClass: 'md-leave'}).start();
      }
      function cleanElement() {

        element.removeClass('md-active');
        element.attr('aria-hidden', 'true');
        element[0].style.display = 'none';

        announceClosed(opts);

        if (!opts.$destroy && opts.restoreFocus) {
          opts.target.focus();
        }
      }

    }
    function onShow(scope, element, opts) {

      watchAsyncLoad();
      sanitizeAndConfigure(scope, opts);

      opts.hideBackdrop = showBackdrop(scope, element, opts);

      return showDropDown(scope, element, opts)
        .then(function(response) {
          element.attr('aria-hidden', 'false');
          opts.alreadyOpen = true;
          opts.cleanupInteraction = activateInteraction();
          opts.cleanupResizing = activateResizing();

          return response;
        }, opts.hideBackdrop);
      function showDropDown(scope, element, opts) {
        opts.parent.append(element);

        return $q(function(resolve, reject) {

          try {

            $animateCss(element, {removeClass: 'md-leave', duration: 0})
              .start()
              .then(positionAndFocusMenu)
              .then(resolve);

          } catch (e) {
            reject(e);
          }

        });
      }
      function positionAndFocusMenu() {
        return $q(function(resolve) {
          if (opts.isRemoved) return $q.reject(false);

          var info = calculateMenuPositions(scope, element, opts);

          info.container.element.css(animator.toCss(info.container.styles));
          info.dropDown.element.css(animator.toCss(info.dropDown.styles));

          $$rAF(function() {
            element.addClass('md-active');
            info.dropDown.element.css(animator.toCss({transform: ''}));

            autoFocus(opts.focusedNode);
            resolve();
          });

        });
      }
      function showBackdrop(scope, element, options) {
        if (options.disableParentScroll && !$mdUtil.getClosest(options.target, 'MD-DIALOG')) {
          options.restoreScroll = $mdUtil.disableScrollAround(options.element, options.parent);
        } else {
          options.disableParentScroll = false;
        }

        if (options.hasBackdrop) {
          options.backdrop = $mdUtil.createBackdrop(scope, "md-select-backdrop md-click-catcher");
          $animate.enter(options.backdrop, $document[0].body, null, {duration: 0});
        }
        return function hideBackdrop() {
          if (options.backdrop) options.backdrop.remove();
          if (options.disableParentScroll) options.restoreScroll();

          delete options.restoreScroll;
        };
      }
      function autoFocus(focusedNode) {
        if (focusedNode && !focusedNode.hasAttribute('disabled')) {
          focusedNode.focus();
        }
      }
      function sanitizeAndConfigure(scope, options) {
        var selectEl = element.find('md-select-menu');

        if (!options.target) {
          throw new Error($mdUtil.supplant(ERROR_TARGET_EXPECTED, [options.target]));
        }

        angular.extend(options, {
          isRemoved: false,
          target: angular.element(options.target), //make sure it's not a naked dom node
          parent: angular.element(options.parent),
          selectEl: selectEl,
          contentEl: element.find('md-content'),
          optionNodes: selectEl[0].getElementsByTagName('md-option')
        });
      }
      function activateResizing() {
        var debouncedOnResize = (function(scope, target, options) {

          return function() {
            if (options.isRemoved) return;

            var updates = calculateMenuPositions(scope, target, options);
            var container = updates.container;
            var dropDown = updates.dropDown;

            container.element.css(animator.toCss(container.styles));
            dropDown.element.css(animator.toCss(dropDown.styles));
          };

        })(scope, element, opts);

        var window = angular.element($window);
        window.on('resize', debouncedOnResize);
        window.on('orientationchange', debouncedOnResize);
        return function deactivateResizing() {
          window.off('resize', debouncedOnResize);
          window.off('orientationchange', debouncedOnResize);
        };
      }
      function watchAsyncLoad() {
        if (opts.loadingAsync && !opts.isRemoved) {
          scope.$$loadingAsyncDone = false;

          $q.when(opts.loadingAsync)
            .then(function() {
              scope.$$loadingAsyncDone = true;
              delete opts.loadingAsync;
            }).then(function() {
              $$rAF(positionAndFocusMenu);
            });
        }
      }
      function activateInteraction() {
        if (opts.isRemoved) return;

        var dropDown = opts.selectEl;
        var selectCtrl = dropDown.controller('mdSelectMenu') || {};

        element.addClass('md-clickable');
        opts.backdrop && opts.backdrop.on('click', onBackdropClick);
        dropDown.on('keydown', onMenuKeyDown);
        dropDown.on('click', checkCloseMenu);

        return function cleanupInteraction() {
          opts.backdrop && opts.backdrop.off('click', onBackdropClick);
          dropDown.off('keydown', onMenuKeyDown);
          dropDown.off('click', checkCloseMenu);

          element.removeClass('md-clickable');
          opts.isRemoved = true;
        };

        function onBackdropClick(e) {
          e.preventDefault();
          e.stopPropagation();
          opts.restoreFocus = false;
          $mdUtil.nextTick($mdSelect.hide, true);
        }

        function onMenuKeyDown(ev) {
          ev.preventDefault();
          ev.stopPropagation();

          switch (ev.keyCode) {
            case keyCodes.UP_ARROW:
              return focusPrevOption();
            case keyCodes.DOWN_ARROW:
              return focusNextOption();
            case keyCodes.SPACE:
            case keyCodes.ENTER:
              var option = $mdUtil.getClosest(ev.target, 'md-option');
              if (option) {
                dropDown.triggerHandler({
                  type: 'click',
                  target: option
                });
                ev.preventDefault();
              }
              checkCloseMenu(ev);
              break;
            case keyCodes.TAB:
            case keyCodes.ESCAPE:
              ev.stopPropagation();
              ev.preventDefault();
              opts.restoreFocus = true;
              $mdUtil.nextTick($mdSelect.hide, true);
              break;
            default:
              if ($mdConstant.isInputKey(ev) || $mdConstant.isNumPadKey(ev)) {
                var optNode = dropDown.controller('mdSelectMenu').optNodeForKeyboardSearch(ev);
                opts.focusedNode = optNode || opts.focusedNode;
                optNode && optNode.focus();
              }
          }
        }

        function focusOption(direction) {
          var optionsArray = $mdUtil.nodesToArray(opts.optionNodes);
          var index = optionsArray.indexOf(opts.focusedNode);

          var newOption;

          do {
            if (index === -1) {
              index = 0;
            } else if (direction === 'next' && index < optionsArray.length - 1) {
              index++;
            } else if (direction === 'prev' && index > 0) {
              index--;
            }
            newOption = optionsArray[index];
            if (newOption.hasAttribute('disabled')) newOption = undefined;
          } while (!newOption && index < optionsArray.length - 1 && index > 0);

          newOption && newOption.focus();
          opts.focusedNode = newOption;
        }

        function focusNextOption() {
          focusOption('next');
        }

        function focusPrevOption() {
          focusOption('prev');
        }

        function checkCloseMenu(ev) {
          if (ev && ( ev.type == 'click') && (ev.currentTarget != dropDown[0])) return;
          if ( mouseOnScrollbar() ) return;

          var option = $mdUtil.getClosest(ev.target, 'md-option');
          if (option && option.hasAttribute && !option.hasAttribute('disabled')) {
            ev.preventDefault();
            ev.stopPropagation();
            if (!selectCtrl.isMultiple) {
              opts.restoreFocus = true;

              $mdUtil.nextTick(function () {
                $mdSelect.hide(selectCtrl.ngModel.$viewValue);
              }, true);
            }
          }
          function mouseOnScrollbar() {
            var clickOnScrollbar = false;
            if (ev && (ev.currentTarget.children.length > 0)) {
              var child = ev.currentTarget.children[0];
              var hasScrollbar = child.scrollHeight > child.clientHeight;
              if (hasScrollbar && child.children.length > 0) {
                var relPosX = ev.pageX - ev.currentTarget.getBoundingClientRect().left;
                if (relPosX > child.querySelector('md-option').offsetWidth)
                  clickOnScrollbar = true;
              }
            }
            return clickOnScrollbar;
          }
        }
      }

    }
    function announceClosed(opts) {
      var mdSelect = opts.selectCtrl;
      if (mdSelect) {
        var menuController = opts.selectEl.controller('mdSelectMenu');
        mdSelect.setLabelText(menuController ? menuController.selectedLabels() : '');
        mdSelect.triggerClose();
      }
    }
    function calculateMenuPositions(scope, element, opts) {
      var
        containerNode = element[0],
        targetNode = opts.target[0].children[0], // target the label
        parentNode = $document[0].body,
        selectNode = opts.selectEl[0],
        contentNode = opts.contentEl[0],
        parentRect = parentNode.getBoundingClientRect(),
        targetRect = targetNode.getBoundingClientRect(),
        shouldOpenAroundTarget = false,
        bounds = {
          left: parentRect.left + SELECT_EDGE_MARGIN,
          top: SELECT_EDGE_MARGIN,
          bottom: parentRect.height - SELECT_EDGE_MARGIN,
          right: parentRect.width - SELECT_EDGE_MARGIN - ($mdUtil.floatingScrollbars() ? 16 : 0)
        },
        spaceAvailable = {
          top: targetRect.top - bounds.top,
          left: targetRect.left - bounds.left,
          right: bounds.right - (targetRect.left + targetRect.width),
          bottom: bounds.bottom - (targetRect.top + targetRect.height)
        },
        maxWidth = parentRect.width - SELECT_EDGE_MARGIN * 2,
        selectedNode = selectNode.querySelector('md-option[selected]'),
        optionNodes = selectNode.getElementsByTagName('md-option'),
        optgroupNodes = selectNode.getElementsByTagName('md-optgroup'),
        isScrollable = calculateScrollable(element, contentNode),
        centeredNode;

      var loading = isPromiseLike(opts.loadingAsync);
      if (!loading) {
        if (selectedNode) {
          centeredNode = selectedNode;
        } else if (optgroupNodes.length) {
          centeredNode = optgroupNodes[0];
        } else if (optionNodes.length) {
          centeredNode = optionNodes[0];
        } else {
          centeredNode = contentNode.firstElementChild || contentNode;
        }
      } else {
        centeredNode = contentNode.firstElementChild || contentNode;
      }

      if (contentNode.offsetWidth > maxWidth) {
        contentNode.style['max-width'] = maxWidth + 'px';
      } else {
        contentNode.style.maxWidth = null;
      }
      if (shouldOpenAroundTarget) {
        contentNode.style['min-width'] = targetRect.width + 'px';
      }
      if (isScrollable) {
        selectNode.classList.add('md-overflow');
      }

      var focusedNode = centeredNode;
      if ((focusedNode.tagName || '').toUpperCase() === 'MD-OPTGROUP') {
        focusedNode = optionNodes[0] || contentNode.firstElementChild || contentNode;
        centeredNode = focusedNode;
      }
      opts.focusedNode = focusedNode;
      containerNode.style.display = 'block';
      var selectMenuRect = selectNode.getBoundingClientRect();
      var centeredRect = getOffsetRect(centeredNode);

      if (centeredNode) {
        var centeredStyle = $window.getComputedStyle(centeredNode);
        centeredRect.paddingLeft = parseInt(centeredStyle.paddingLeft, 10) || 0;
        centeredRect.paddingRight = parseInt(centeredStyle.paddingRight, 10) || 0;
      }

      if (isScrollable) {
        var scrollBuffer = contentNode.offsetHeight / 2;
        contentNode.scrollTop = centeredRect.top + centeredRect.height / 2 - scrollBuffer;

        if (spaceAvailable.top < scrollBuffer) {
          contentNode.scrollTop = Math.min(
            centeredRect.top,
            contentNode.scrollTop + scrollBuffer - spaceAvailable.top
          );
        } else if (spaceAvailable.bottom < scrollBuffer) {
          contentNode.scrollTop = Math.max(
            centeredRect.top + centeredRect.height - selectMenuRect.height,
            contentNode.scrollTop - scrollBuffer + spaceAvailable.bottom
          );
        }
      }

      var left, top, transformOrigin, minWidth, fontSize;
      if (shouldOpenAroundTarget) {
        left = targetRect.left;
        top = targetRect.top + targetRect.height;
        transformOrigin = '50% 0';
        if (top + selectMenuRect.height > bounds.bottom) {
          top = targetRect.top - selectMenuRect.height;
          transformOrigin = '50% 100%';
        }
      } else {
        left = (targetRect.left + centeredRect.left - centeredRect.paddingLeft) + 2;
        top = Math.floor(targetRect.top + targetRect.height / 2 - centeredRect.height / 2 -
            centeredRect.top + contentNode.scrollTop) + 2;

        transformOrigin = (centeredRect.left + targetRect.width / 2) + 'px ' +
          (centeredRect.top + centeredRect.height / 2 - contentNode.scrollTop) + 'px 0px';

        minWidth = Math.min(targetRect.width + centeredRect.paddingLeft + centeredRect.paddingRight, maxWidth);

        fontSize = window.getComputedStyle(targetNode)['font-size'];
      }
      var containerRect = containerNode.getBoundingClientRect();
      var scaleX = Math.round(100 * Math.min(targetRect.width / selectMenuRect.width, 1.0)) / 100;
      var scaleY = Math.round(100 * Math.min(targetRect.height / selectMenuRect.height, 1.0)) / 100;

      return {
        container: {
          element: angular.element(containerNode),
          styles: {
            left: Math.floor(clamp(bounds.left, left, bounds.right - containerRect.width)),
            top: Math.floor(clamp(bounds.top, top, bounds.bottom - containerRect.height)),
            'min-width': minWidth,
            'font-size': fontSize
          }
        },
        dropDown: {
          element: angular.element(selectNode),
          styles: {
            transformOrigin: transformOrigin,
            transform: !opts.alreadyOpen ? $mdUtil.supplant('scale({0},{1})', [scaleX, scaleY]) : ""
          }
        }
      };

    }

  }

  function isPromiseLike(obj) {
    return obj && angular.isFunction(obj.then);
  }

  function clamp(min, n, max) {
    return Math.max(min, Math.min(n, max));
  }

  function getOffsetRect(node) {
    return node ? {
      left: node.offsetLeft,
      top: node.offsetTop,
      width: node.offsetWidth,
      height: node.offsetHeight
    } : {left: 0, top: 0, width: 0, height: 0};
  }

  function calculateScrollable(element, contentNode) {
    var isScrollable = false;

    try {
      var oldDisplay = element[0].style.display;
      element[0].style.display = 'block';

      isScrollable = contentNode.scrollHeight > contentNode.offsetHeight;
      element[0].style.display = oldDisplay;
    } finally {
    }
    return isScrollable;
  }
}

})();
(function(){
"use strict";
angular.module('material.components.showHide', [
  'material.core'
])
  .directive('ngShow', createDirective('ngShow', true))
  .directive('ngHide', createDirective('ngHide', false));


function createDirective(name, targetValue) {
  return ['$mdUtil', '$window', function($mdUtil, $window) {
    return {
      restrict: 'A',
      multiElement: true,
      link: function($scope, $element, $attr) {
        var unregister = $scope.$on('$md-resize-enable', function() {
          unregister();

          var node = $element[0];
          var cachedTransitionStyles = node.nodeType === $window.Node.ELEMENT_NODE ?
            $window.getComputedStyle(node) : {};

          $scope.$watch($attr[name], function(value) {
            if (!!value === targetValue) {
              $mdUtil.nextTick(function() {
                $scope.$broadcast('$md-resize');
              });

              var opts = {
                cachedTransitionStyles: cachedTransitionStyles
              };

              $mdUtil.dom.animator.waitTransitionEnd($element, opts).then(function() {
                $scope.$broadcast('$md-resize');
              });
            }
          });
        });
      }
    };
  }];
}

})();
(function(){
"use strict";
SidenavService.$inject = ["$mdComponentRegistry", "$mdUtil", "$q", "$log"];
SidenavDirective.$inject = ["$mdMedia", "$mdUtil", "$mdConstant", "$mdTheming", "$animate", "$compile", "$parse", "$log", "$q", "$document"];
SidenavController.$inject = ["$scope", "$element", "$attrs", "$mdComponentRegistry", "$q"];
angular
  .module('material.components.sidenav', [
    'material.core',
    'material.components.backdrop'
  ])
  .factory('$mdSidenav', SidenavService )
  .directive('mdSidenav', SidenavDirective)
  .directive('mdSidenavFocus', SidenavFocusDirective)
  .controller('$mdSidenavController', SidenavController);
function SidenavService($mdComponentRegistry, $mdUtil, $q, $log) {
  var errorMsg = "SideNav '{0}' is not available! Did you use md-component-id='{0}'?";
  var service = {
        find    : findInstance,     //  sync  - returns proxy API
        waitFor : waitForInstance   //  async - returns promise
      };
  return function(handle, enableWait) {
    if ( angular.isUndefined(handle) ) return service;

    var shouldWait = enableWait === true;
    var instance = service.find(handle, shouldWait);
    return  !instance && shouldWait ? service.waitFor(handle) :
            !instance && angular.isUndefined(enableWait) ? addLegacyAPI(service, handle) : instance;
  };
  function addLegacyAPI(service, handle) {
      var falseFn  = function() { return false; };
      var rejectFn = function() {
            return $q.when($mdUtil.supplant(errorMsg, [handle || ""]));
          };

      return angular.extend({
        isLockedOpen : falseFn,
        isOpen       : falseFn,
        toggle       : rejectFn,
        open         : rejectFn,
        close        : rejectFn,
        onClose      : angular.noop,
        then : function(callback) {
          return waitForInstance(handle)
            .then(callback || angular.noop);
        }
       }, service);
    }
    function findInstance(handle, shouldWait) {
      var instance = $mdComponentRegistry.get(handle);

      if (!instance && !shouldWait) {
        $log.error( $mdUtil.supplant(errorMsg, [handle || ""]) );
        return undefined;
      }
      return instance;
    }
    function waitForInstance(handle) {
      return $mdComponentRegistry.when(handle).catch($log.error);
    }
}
function SidenavFocusDirective() {
  return {
    restrict: 'A',
    require: '^mdSidenav',
    link: function(scope, element, attr, sidenavCtrl) {
    }
  };
}
function SidenavDirective($mdMedia, $mdUtil, $mdConstant, $mdTheming, $animate, $compile, $parse, $log, $q, $document) {
  return {
    restrict: 'E',
    scope: {
      isOpen: '=?mdIsOpen'
    },
    controller: '$mdSidenavController',
    compile: function(element) {
      element.addClass('md-closed');
      element.attr('tabIndex', '-1');
      return postLink;
    }
  };
  function postLink(scope, element, attr, sidenavCtrl) {
    var lastParentOverFlow;
    var backdrop;
    var disableScrollTarget = null;
    var triggeringElement = null;
    var previousContainerStyles;
    var promise = $q.when(true);
    var isLockedOpenParsed = $parse(attr.mdIsLockedOpen);
    var isLocked = function() {
      return isLockedOpenParsed(scope.$parent, {
        $media: function(arg) {
          $log.warn("$media is deprecated for is-locked-open. Use $mdMedia instead.");
          return $mdMedia(arg);
        },
        $mdMedia: $mdMedia
      });
    };

    if (attr.mdDisableScrollTarget) {
      disableScrollTarget = $document[0].querySelector(attr.mdDisableScrollTarget);

      if (disableScrollTarget) {
        disableScrollTarget = angular.element(disableScrollTarget);
      } else {
        $log.warn($mdUtil.supplant('mdSidenav: couldn\'t find element matching ' +
          'selector "{selector}". Falling back to parent.', { selector: attr.mdDisableScrollTarget }));
      }
    }

    if (!disableScrollTarget) {
      disableScrollTarget = element.parent();
    }
    if (!attr.hasOwnProperty('mdDisableBackdrop')) {
      backdrop = $mdUtil.createBackdrop(scope, "md-sidenav-backdrop md-opaque ng-enter");
    }

    element.addClass('_md');     // private md component indicator for styling
    $mdTheming(element);
    if ( backdrop ) $mdTheming.inherit(backdrop, element);

    element.on('$destroy', function() {
      backdrop && backdrop.remove();
      sidenavCtrl.destroy();
    });

    scope.$on('$destroy', function(){
      backdrop && backdrop.remove();
    });

    scope.$watch(isLocked, updateIsLocked);
    scope.$watch('isOpen', updateIsOpen);
    sidenavCtrl.$toggleOpen = toggleOpen;
    function updateIsLocked(isLocked, oldValue) {
      scope.isLockedOpen = isLocked;
      if (isLocked === oldValue) {
        element.toggleClass('md-locked-open', !!isLocked);
      } else {
        $animate[isLocked ? 'addClass' : 'removeClass'](element, 'md-locked-open');
      }
      if (backdrop) {
        backdrop.toggleClass('md-locked-open', !!isLocked);
      }
    }
    function updateIsOpen(isOpen) {
      var focusEl = $mdUtil.findFocusTarget(element) || $mdUtil.findFocusTarget(element,'[md-sidenav-focus]') || element;
      var parent = element.parent();

      parent[isOpen ? 'on' : 'off']('keydown', onKeyDown);
      if (backdrop) backdrop[isOpen ? 'on' : 'off']('click', close);

      var restorePositioning = updateContainerPositions(parent, isOpen);

      if ( isOpen ) {
        triggeringElement = $document[0].activeElement;
      }

      disableParentScroll(isOpen);

      return promise = $q.all([
        isOpen && backdrop ? $animate.enter(backdrop, parent) : backdrop ?
                             $animate.leave(backdrop) : $q.when(true),
        $animate[isOpen ? 'removeClass' : 'addClass'](element, 'md-closed')
      ]).then(function() {
        if (scope.isOpen) {
          focusEl && focusEl.focus();
        }
        restorePositioning && restorePositioning();
      });
    }

    function updateContainerPositions(parent, willOpen) {
      var drawerEl = element[0];
      var scrollTop = parent[0].scrollTop;

      if (willOpen && scrollTop) {
        previousContainerStyles = {
          top: drawerEl.style.top,
          bottom: drawerEl.style.bottom,
          height: drawerEl.style.height
        };
        var positionStyle = {
          top: scrollTop + 'px',
          bottom: 'auto',
          height: parent[0].clientHeight + 'px'
        };
        element.css(positionStyle);
        backdrop.css(positionStyle);
      }
      if (!willOpen && previousContainerStyles) {
        return function() {
          drawerEl.style.top = previousContainerStyles.top;
          drawerEl.style.bottom = previousContainerStyles.bottom;
          drawerEl.style.height = previousContainerStyles.height;

          backdrop[0].style.top = null;
          backdrop[0].style.bottom = null;
          backdrop[0].style.height = null;

          previousContainerStyles = null;
        };
      }
    }
    function disableParentScroll(disabled) {
      if ( disabled && !lastParentOverFlow ) {
        lastParentOverFlow = disableScrollTarget.css('overflow');
        disableScrollTarget.css('overflow', 'hidden');
      } else if (angular.isDefined(lastParentOverFlow)) {
        disableScrollTarget.css('overflow', lastParentOverFlow);
        lastParentOverFlow = undefined;
      }
    }
    function toggleOpen( isOpen ) {
      if (scope.isOpen == isOpen ) {

        return $q.when(true);

      } else {
        if (scope.isOpen && sidenavCtrl.onCloseCb) sidenavCtrl.onCloseCb();

        return $q(function(resolve){
          scope.isOpen = isOpen;

          $mdUtil.nextTick(function() {
            promise.then(function(result) {

              if ( !scope.isOpen ) {
                triggeringElement && triggeringElement.focus();
                triggeringElement = null;
              }

              resolve(result);
            });
          });

        });

      }
    }
    function onKeyDown(ev) {
      var isEscape = (ev.keyCode === $mdConstant.KEY_CODE.ESCAPE);
      return isEscape ? close(ev) : $q.when(true);
    }
    function close(ev) {
      ev.preventDefault();

      return sidenavCtrl.close();
    }

  }
}
function SidenavController($scope, $element, $attrs, $mdComponentRegistry, $q) {

  var self = this;
  self.isOpen = function() { return !!$scope.isOpen; };
  self.isLockedOpen = function() { return !!$scope.isLockedOpen; };
  self.onClose = function (callback) {
    self.onCloseCb = callback;
    return self;
  };
  self.open   = function() { return self.$toggleOpen( true );  };
  self.close  = function() { return self.$toggleOpen( false ); };
  self.toggle = function() { return self.$toggleOpen( !$scope.isOpen );  };
  self.$toggleOpen = function(value) { return $q.when($scope.isOpen = value); };

  self.destroy = $mdComponentRegistry.register(self, $attrs.mdComponentId);
}

})();
(function(){
"use strict";
SliderDirective.$inject = ["$$rAF", "$window", "$mdAria", "$mdUtil", "$mdConstant", "$mdTheming", "$mdGesture", "$parse", "$log", "$timeout"];
  angular.module('material.components.slider', [
    'material.core'
  ])
  .directive('mdSlider', SliderDirective)
  .directive('mdSliderContainer', SliderContainerDirective);
function SliderContainerDirective() {
  return {
    controller: function () {},
    compile: function (elem) {
      var slider = elem.find('md-slider');

      if (!slider) {
        return;
      }

      var vertical = slider.attr('md-vertical');

      if (vertical !== undefined) {
        elem.attr('md-vertical', '');
      }

      if(!slider.attr('flex')) {
        slider.attr('flex', '');
      }

      return function postLink(scope, element, attr, ctrl) {
        element.addClass('_md');     // private md component indicator for styling
        function setDisable(value) {
          element.children().attr('disabled', value);
          element.find('input').attr('disabled', value);
        }

        var stopDisabledWatch = angular.noop;

        if (attr.disabled) {
          setDisable(true);
        }
        else if (attr.ngDisabled) {
          stopDisabledWatch = scope.$watch(attr.ngDisabled, function (value) {
            setDisable(value);
          });
        }

        scope.$on('$destroy', function () {
          stopDisabledWatch();
        });

        var initialMaxWidth;

        ctrl.fitInputWidthToTextLength = function (length) {
          var input = element[0].querySelector('md-input-container');

          if (input) {
            var computedStyle = getComputedStyle(input);
            var minWidth = parseInt(computedStyle.minWidth);
            var padding = parseInt(computedStyle.padding) * 2;

            initialMaxWidth = initialMaxWidth || parseInt(computedStyle.maxWidth);
            var newMaxWidth = Math.max(initialMaxWidth, minWidth + padding + (minWidth / 2 * length));

            input.style.maxWidth = newMaxWidth + 'px';
          }
        };
      };
    }
  };
}
function SliderDirective($$rAF, $window, $mdAria, $mdUtil, $mdConstant, $mdTheming, $mdGesture, $parse, $log, $timeout) {
  return {
    scope: {},
    require: ['?ngModel', '?^mdSliderContainer'],
    template:
      '<div class="md-slider-wrapper">' +
        '<div class="md-slider-content">' +
          '<div class="md-track-container">' +
            '<div class="md-track"></div>' +
            '<div class="md-track md-track-fill"></div>' +
            '<div class="md-track-ticks"></div>' +
          '</div>' +
          '<div class="md-thumb-container">' +
            '<div class="md-thumb"></div>' +
            '<div class="md-focus-thumb"></div>' +
            '<div class="md-focus-ring"></div>' +
            '<div class="md-sign">' +
              '<span class="md-thumb-text"></span>' +
            '</div>' +
            '<div class="md-disabled-thumb"></div>' +
          '</div>' +
        '</div>' +
      '</div>',
    compile: compile
  };

  function compile (tElement, tAttrs) {
    var wrapper = angular.element(tElement[0].getElementsByClassName('md-slider-wrapper'));

    var tabIndex = tAttrs.tabindex || 0;
    wrapper.attr('tabindex', tabIndex);

    if (tAttrs.disabled || tAttrs.ngDisabled) wrapper.attr('tabindex', -1);

    wrapper.attr('role', 'slider');

    $mdAria.expect(tElement, 'aria-label');

    return postLink;
  }

  function postLink(scope, element, attr, ctrls) {
    $mdTheming(element);
    var ngModelCtrl = ctrls[0] || {
      $setViewValue: function(val) {
        this.$viewValue = val;
        this.$viewChangeListeners.forEach(function(cb) { cb(); });
      },
      $parsers: [],
      $formatters: [],
      $viewChangeListeners: []
    };

    var containerCtrl = ctrls[1];
    var container = angular.element($mdUtil.getClosest(element, '_md-slider-container', true));
    var isDisabled = attr.ngDisabled ? angular.bind(null, $parse(attr.ngDisabled), scope.$parent) : function () {
          return element[0].hasAttribute('disabled');
        };

    var thumb = angular.element(element[0].querySelector('.md-thumb'));
    var thumbText = angular.element(element[0].querySelector('.md-thumb-text'));
    var thumbContainer = thumb.parent();
    var trackContainer = angular.element(element[0].querySelector('.md-track-container'));
    var activeTrack = angular.element(element[0].querySelector('.md-track-fill'));
    var tickContainer = angular.element(element[0].querySelector('.md-track-ticks'));
    var wrapper = angular.element(element[0].getElementsByClassName('md-slider-wrapper'));
    var content = angular.element(element[0].getElementsByClassName('md-slider-content'));
    var throttledRefreshDimensions = $mdUtil.throttle(refreshSliderDimensions, 5000);
    var DEFAULT_ROUND = 3;
    var vertical = angular.isDefined(attr.mdVertical);
    var discrete = angular.isDefined(attr.mdDiscrete);
    var invert = angular.isDefined(attr.mdInvert);
    angular.isDefined(attr.min) ? attr.$observe('min', updateMin) : updateMin(0);
    angular.isDefined(attr.max) ? attr.$observe('max', updateMax) : updateMax(100);
    angular.isDefined(attr.step)? attr.$observe('step', updateStep) : updateStep(1);
    angular.isDefined(attr.round)? attr.$observe('round', updateRound) : updateRound(DEFAULT_ROUND);
    var stopDisabledWatch = angular.noop;
    if (attr.ngDisabled) {
      stopDisabledWatch = scope.$parent.$watch(attr.ngDisabled, updateAriaDisabled);
    }

    $mdGesture.register(wrapper, 'drag', { horizontal: !vertical });

    scope.mouseActive = false;

    wrapper
      .on('keydown', keydownListener)
      .on('mousedown', mouseDownListener)
      .on('focus', focusListener)
      .on('blur', blurListener)
      .on('$md.pressdown', onPressDown)
      .on('$md.pressup', onPressUp)
      .on('$md.dragstart', onDragStart)
      .on('$md.drag', onDrag)
      .on('$md.dragend', onDragEnd);
    function updateAll() {
      refreshSliderDimensions();
      ngModelRender();
    }
    setTimeout(updateAll, 0);

    var debouncedUpdateAll = $$rAF.throttle(updateAll);
    angular.element($window).on('resize', debouncedUpdateAll);

    scope.$on('$destroy', function() {
      angular.element($window).off('resize', debouncedUpdateAll);
    });

    ngModelCtrl.$render = ngModelRender;
    ngModelCtrl.$viewChangeListeners.push(ngModelRender);
    ngModelCtrl.$formatters.push(minMaxValidator);
    ngModelCtrl.$formatters.push(stepValidator);
    var min;
    var max;
    var step;
    var round;
    function updateMin(value) {
      min = parseFloat(value);
      element.attr('aria-valuemin', value);
      updateAll();
    }
    function updateMax(value) {
      max = parseFloat(value);
      element.attr('aria-valuemax', value);
      updateAll();
    }
    function updateStep(value) {
      step = parseFloat(value);
    }
    function updateRound(value) {
      round = minMaxValidator(parseInt(value), 0, 6);
    }
    function updateAriaDisabled() {
      element.attr('aria-disabled', !!isDisabled());
    }
    var tickCanvas, tickCtx;
    function redrawTicks() {
      if (!discrete || isDisabled()) return;
      if ( angular.isUndefined(step) )         return;

      if ( step <= 0 ) {
        var msg = 'Slider step value must be greater than zero when in discrete mode';
        $log.error(msg);
        throw new Error(msg);
      }

      var numSteps = Math.floor( (max - min) / step );
      if (!tickCanvas) {
        tickCanvas = angular.element('<canvas>').css('position', 'absolute');
        tickContainer.append(tickCanvas);

        tickCtx = tickCanvas[0].getContext('2d');
      }

      var dimensions = getSliderDimensions();
      if (dimensions && !dimensions.height && !dimensions.width) {
        refreshSliderDimensions();
        dimensions = sliderDimensions;
      }

      tickCanvas[0].width = dimensions.width;
      tickCanvas[0].height = dimensions.height;

      var distance;
      for (var i = 0; i <= numSteps; i++) {
        var trackTicksStyle = $window.getComputedStyle(tickContainer[0]);
        tickCtx.fillStyle = trackTicksStyle.color || 'black';

        distance = Math.floor((vertical ? dimensions.height : dimensions.width) * (i / numSteps));

        tickCtx.fillRect(vertical ? 0 : distance - 1,
          vertical ? distance - 1 : 0,
          vertical ? dimensions.width : 2,
          vertical ? 2 : dimensions.height);
      }
    }

    function clearTicks() {
      if(tickCanvas && tickCtx) {
        var dimensions = getSliderDimensions();
        tickCtx.clearRect(0, 0, dimensions.width, dimensions.height);
      }
    }
    var sliderDimensions = {};
    refreshSliderDimensions();
    function refreshSliderDimensions() {
      sliderDimensions = trackContainer[0].getBoundingClientRect();
    }
    function getSliderDimensions() {
      throttledRefreshDimensions();
      return sliderDimensions;
    }
    function keydownListener(ev) {
      if (isDisabled()) return;

      var changeAmount;
      if (vertical ? ev.keyCode === $mdConstant.KEY_CODE.DOWN_ARROW : ev.keyCode === $mdConstant.KEY_CODE.LEFT_ARROW) {
        changeAmount = -step;
      } else if (vertical ? ev.keyCode === $mdConstant.KEY_CODE.UP_ARROW : ev.keyCode === $mdConstant.KEY_CODE.RIGHT_ARROW) {
        changeAmount = step;
      }
      changeAmount = invert ? -changeAmount : changeAmount;
      if (changeAmount) {
        if (ev.metaKey || ev.ctrlKey || ev.altKey) {
          changeAmount *= 4;
        }
        ev.preventDefault();
        ev.stopPropagation();
        scope.$evalAsync(function() {
          setModelValue(ngModelCtrl.$viewValue + changeAmount);
        });
      }
    }

    function mouseDownListener() {
      redrawTicks();

      scope.mouseActive = true;
      wrapper.removeClass('md-focused');

      $timeout(function() {
        scope.mouseActive = false;
      }, 100);
    }

    function focusListener() {
      if (scope.mouseActive === false) {
        wrapper.addClass('md-focused');
      }
    }

    function blurListener() {
      wrapper.removeClass('md-focused');
      element.removeClass('md-active');
      clearTicks();
    }
    function setModelValue(value) {
      ngModelCtrl.$setViewValue( minMaxValidator(stepValidator(value)) );
    }
    function ngModelRender() {
      if (isNaN(ngModelCtrl.$viewValue)) {
        ngModelCtrl.$viewValue = ngModelCtrl.$modelValue;
      }

      ngModelCtrl.$viewValue = minMaxValidator(ngModelCtrl.$viewValue);

      var percent = valueToPercent(ngModelCtrl.$viewValue);
      scope.modelValue = ngModelCtrl.$viewValue;
      element.attr('aria-valuenow', ngModelCtrl.$viewValue);
      setSliderPercent(percent);
      thumbText.text( ngModelCtrl.$viewValue );
    }

    function minMaxValidator(value, minValue, maxValue) {
      if (angular.isNumber(value)) {
        minValue = angular.isNumber(minValue) ? minValue : min;
        maxValue = angular.isNumber(maxValue) ? maxValue : max;

        return Math.max(minValue, Math.min(maxValue, value));
      }
    }

    function stepValidator(value) {
      if (angular.isNumber(value)) {
        var formattedValue = (Math.round((value - min) / step) * step + min);
        formattedValue = (Math.round(formattedValue * Math.pow(10, round)) / Math.pow(10, round));

        if (containerCtrl && containerCtrl.fitInputWidthToTextLength){
          $mdUtil.debounce(function () {
            containerCtrl.fitInputWidthToTextLength(formattedValue.toString().length);
          }, 100)();
        }

        return formattedValue;
      }
    }
    function setSliderPercent(percent) {

      percent = clamp(percent);

      var thumbPosition = (percent * 100) + '%';
      var activeTrackPercent = invert ? (1 - percent) * 100 + '%' : thumbPosition;

      if (vertical) {
        thumbContainer.css('bottom', thumbPosition);
      }
      else {
        $mdUtil.bidiProperty(thumbContainer, 'left', 'right', thumbPosition);
      }

      
      activeTrack.css(vertical ? 'height' : 'width', activeTrackPercent);

      element.toggleClass((invert ? 'md-max' : 'md-min'), percent === 0);
      element.toggleClass((invert ? 'md-min' : 'md-max'), percent === 1);
    }
    var isDragging = false;

    function onPressDown(ev) {
      if (isDisabled()) return;

      element.addClass('md-active');
      element[0].focus();
      refreshSliderDimensions();

      var exactVal = percentToValue( positionToPercent( vertical ? ev.pointer.y : ev.pointer.x ));
      var closestVal = minMaxValidator( stepValidator(exactVal) );
      scope.$apply(function() {
        setModelValue( closestVal );
        setSliderPercent( valueToPercent(closestVal));
      });
    }
    function onPressUp(ev) {
      if (isDisabled()) return;

      element.removeClass('md-dragging');

      var exactVal = percentToValue( positionToPercent( vertical ? ev.pointer.y : ev.pointer.x ));
      var closestVal = minMaxValidator( stepValidator(exactVal) );
      scope.$apply(function() {
        setModelValue(closestVal);
        ngModelRender();
      });
    }
    function onDragStart(ev) {
      if (isDisabled()) return;
      isDragging = true;

      ev.stopPropagation();

      element.addClass('md-dragging');
      setSliderFromEvent(ev);
    }
    function onDrag(ev) {
      if (!isDragging) return;
      ev.stopPropagation();
      setSliderFromEvent(ev);
    }
    function onDragEnd(ev) {
      if (!isDragging) return;
      ev.stopPropagation();
      isDragging = false;
    }

    function setSliderFromEvent(ev) {
      if ( discrete ) adjustThumbPosition( vertical ? ev.pointer.y : ev.pointer.x );
      else            doSlide( vertical ? ev.pointer.y : ev.pointer.x );
    }
    function doSlide( x ) {
      scope.$evalAsync( function() {
        setModelValue( percentToValue( positionToPercent(x) ));
      });
    }
    function adjustThumbPosition( x ) {
      var exactVal = percentToValue( positionToPercent( x ));
      var closestVal = minMaxValidator( stepValidator(exactVal) );
      setSliderPercent( positionToPercent(x) );
      thumbText.text( closestVal );
    }
    function clamp(value) {
      return Math.max(0, Math.min(value || 0, 1));
    }
    function positionToPercent( position ) {
      var offset = vertical ? sliderDimensions.top : sliderDimensions.left;
      var size = vertical ? sliderDimensions.height : sliderDimensions.width;
      var calc = (position - offset) / size;

      if (!vertical && $mdUtil.bidi() === 'rtl') {
        calc = 1 - calc;
      }

      return Math.max(0, Math.min(1, vertical ? 1 - calc : calc));
    }
    function percentToValue( percent ) {
      var adjustedPercent = invert ? (1 - percent) : percent;
      return (min + adjustedPercent * (max - min));
    }

    function valueToPercent( val ) {
      var percent = (val - min) / (max - min);
      return invert ? (1 - percent) : percent;
    }
  }
}

})();
(function(){
"use strict";
MdSticky.$inject = ["$mdConstant", "$$rAF", "$mdUtil", "$compile"];
angular
  .module('material.components.sticky', [
    'material.core',
    'material.components.content'
  ])
  .factory('$mdSticky', MdSticky);
function MdSticky($mdConstant, $$rAF, $mdUtil, $compile) {

  var browserStickySupport = $mdUtil.checkStickySupport();
  return function registerStickyElement(scope, element, stickyClone) {
    var contentCtrl = element.controller('mdContent');
    if (!contentCtrl) return;

    if (browserStickySupport) {
      element.css({
        position: browserStickySupport,
        top: 0,
        'z-index': 2
      });
    } else {
      var $$sticky = contentCtrl.$element.data('$$sticky');
      if (!$$sticky) {
        $$sticky = setupSticky(contentCtrl);
        contentCtrl.$element.data('$$sticky', $$sticky);
      }
      var cloneElement = stickyClone || $compile(element.clone())(scope);

      var deregister = $$sticky.add(element, cloneElement);
      scope.$on('$destroy', deregister);
    }
  };

  function setupSticky(contentCtrl) {
    var contentEl = contentCtrl.$element;
    var debouncedRefreshElements = $$rAF.throttle(refreshElements);
    setupAugmentedScrollEvents(contentEl);
    contentEl.on('$scrollstart', debouncedRefreshElements);
    contentEl.on('$scroll', onScroll);

    var self;
    return self = {
      prev: null,
      current: null, //the currently stickied item
      next: null,
      items: [],
      add: add,
      refreshElements: refreshElements
    };
    function add(element, stickyClone) {
      stickyClone.addClass('md-sticky-clone');

      var item = {
        element: element,
        clone: stickyClone
      };
      self.items.push(item);

      $mdUtil.nextTick(function() {
        contentEl.prepend(item.clone);
      });

      debouncedRefreshElements();

      return function remove() {
        self.items.forEach(function(item, index) {
          if (item.element[0] === element[0]) {
            self.items.splice(index, 1);
            item.clone.remove();
          }
        });
        debouncedRefreshElements();
      };
    }

    function refreshElements() {
      self.items.forEach(refreshPosition);
      self.items = self.items.sort(function(a, b) {
        return a.top < b.top ? -1 : 1;
      });
      var item;
      var currentScrollTop = contentEl.prop('scrollTop');
      for (var i = self.items.length - 1; i >= 0; i--) {
        if (currentScrollTop > self.items[i].top) {
          item = self.items[i];
          break;
        }
      }
      setCurrentItem(item);
    }
    function refreshPosition(item) {
      var current = item.element[0];
      item.top = 0;
      item.left = 0;
      item.right = 0;
      while (current && current !== contentEl[0]) {
        item.top += current.offsetTop;
        item.left += current.offsetLeft;
        if ( current.offsetParent ){
          item.right += current.offsetParent.offsetWidth - current.offsetWidth - current.offsetLeft; //Compute offsetRight
        }
        current = current.offsetParent;
      }
      item.height = item.element.prop('offsetHeight');

      var defaultVal = $mdUtil.floatingScrollbars() ? '0' : undefined;
      $mdUtil.bidi(item.clone, 'margin-left', item.left, defaultVal);
      $mdUtil.bidi(item.clone, 'margin-right', defaultVal, item.right);
    }
    function onScroll() {
      var scrollTop = contentEl.prop('scrollTop');
      var isScrollingDown = scrollTop > (onScroll.prevScrollTop || 0);
      onScroll.prevScrollTop = scrollTop;
      if (scrollTop === 0) {
        setCurrentItem(null);
        return;
      }
      if (isScrollingDown) {
        if (self.next && self.next.top <= scrollTop) {
          setCurrentItem(self.next);
          return;
        }
        if (self.current && self.next && self.next.top - scrollTop <= self.next.height) {
          translate(self.current, scrollTop + (self.next.top - self.next.height - scrollTop));
          return;
        }
      }
      if (!isScrollingDown) {
        if (self.current && self.prev && scrollTop < self.current.top) {
          setCurrentItem(self.prev);
          return;
        }
        if (self.next && self.current && (scrollTop >= (self.next.top - self.current.height))) {
          translate(self.current, scrollTop + (self.next.top - scrollTop - self.current.height));
          return;
        }
      }
      if (self.current) {
        translate(self.current, scrollTop);
      }
    }

    function setCurrentItem(item) {
      if (self.current === item) return;
      if (self.current) {
        translate(self.current, null);
        setStickyState(self.current, null);
      }
      if (item) {
        setStickyState(item, 'active');
      }

      self.current = item;
      var index = self.items.indexOf(item);
      self.next = self.items[index + 1];
      self.prev = self.items[index - 1];
      setStickyState(self.next, 'next');
      setStickyState(self.prev, 'prev');
    }

    function setStickyState(item, state) {
      if (!item || item.state === state) return;
      if (item.state) {
        item.clone.attr('sticky-prev-state', item.state);
        item.element.attr('sticky-prev-state', item.state);
      }
      item.clone.attr('sticky-state', state);
      item.element.attr('sticky-state', state);
      item.state = state;
    }

    function translate(item, amount) {
      if (!item) return;
      if (amount === null || amount === undefined) {
        if (item.translateY) {
          item.translateY = null;
          item.clone.css($mdConstant.CSS.TRANSFORM, '');
        }
      } else {
        item.translateY = amount;

        $mdUtil.bidi( item.clone, $mdConstant.CSS.TRANSFORM,
          'translate3d(' + item.left + 'px,' + amount + 'px,0)',
          'translateY(' + amount + 'px)'
        );
      }
    }
  }
  function setupAugmentedScrollEvents(element) {
    var SCROLL_END_DELAY = 200;
    var isScrolling;
    var lastScrollTime;
    element.on('scroll touchmove', function() {
      if (!isScrolling) {
        isScrolling = true;
        $$rAF.throttle(loopScrollEvent);
        element.triggerHandler('$scrollstart');
      }
      element.triggerHandler('$scroll');
      lastScrollTime = +$mdUtil.now();
    });

    function loopScrollEvent() {
      if (+$mdUtil.now() - lastScrollTime > SCROLL_END_DELAY) {
        isScrolling = false;
        element.triggerHandler('$scrollend');
      } else {
        element.triggerHandler('$scroll');
        $$rAF.throttle(loopScrollEvent);
      }
    }
  }

}

})();
(function(){
"use strict";
MdSubheaderDirective.$inject = ["$mdSticky", "$compile", "$mdTheming", "$mdUtil"];
angular
  .module('material.components.subheader', [
    'material.core',
    'material.components.sticky'
  ])
  .directive('mdSubheader', MdSubheaderDirective);

function MdSubheaderDirective($mdSticky, $compile, $mdTheming, $mdUtil) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: (
    '<div class="md-subheader _md">' +
    '  <div class="md-subheader-inner">' +
    '    <div class="md-subheader-content"></div>' +
    '  </div>' +
    '</div>'
    ),
    link: function postLink(scope, element, attr, controllers, transclude) {
      $mdTheming(element);
      element.addClass('_md');
      $mdUtil.prefixer().removeAttribute(element, 'ng-repeat');

      var outerHTML = element[0].outerHTML;

      function getContent(el) {
        return angular.element(el[0].querySelector('.md-subheader-content'));
      }
      transclude(scope, function(clone) {
        getContent(element).append(clone);
      });
      if (!element.hasClass('md-no-sticky')) {
        transclude(scope, function(clone) {
          var wrapper = $compile('<div class="md-subheader-wrapper">' + outerHTML + '</div>')(scope);
          $mdUtil.nextTick(function() {
            getContent(wrapper).append(clone);
          });
          $mdSticky(scope, element, wrapper);
        });
      }
    }
  };
}

})();
(function(){
"use strict";

angular.module('material.components.swipe', ['material.core'])
    .directive('mdSwipeLeft', getDirective('SwipeLeft'))
    .directive('mdSwipeRight', getDirective('SwipeRight'))
    .directive('mdSwipeUp', getDirective('SwipeUp'))
    .directive('mdSwipeDown', getDirective('SwipeDown'));

function getDirective(name) {
    DirectiveFactory.$inject = ["$parse"];
  var directiveName = 'md' + name;
  var eventName = '$md.' + name.toLowerCase();

  return DirectiveFactory;
  function DirectiveFactory($parse) {
      return { restrict: 'A', link: postLink };
      function postLink(scope, element, attr) {
        var fn = $parse(attr[directiveName]);
        element.on(eventName, function(ev) {
          scope.$applyAsync(function() { fn(scope, { $event: ev }); });
        });
      }
    }
}



})();
(function(){
"use strict";

MdSwitch.$inject = ["mdCheckboxDirective", "$mdUtil", "$mdConstant", "$parse", "$$rAF", "$mdGesture", "$timeout"];
angular.module('material.components.switch', [
  'material.core',
  'material.components.checkbox'
])
  .directive('mdSwitch', MdSwitch);
function MdSwitch(mdCheckboxDirective, $mdUtil, $mdConstant, $parse, $$rAF, $mdGesture, $timeout) {
  var checkboxDirective = mdCheckboxDirective[0];

  return {
    restrict: 'E',
    priority: 210, // Run before ngAria
    transclude: true,
    template:
      '<div class="md-container">' +
        '<div class="md-bar"></div>' +
        '<div class="md-thumb-container">' +
          '<div class="md-thumb" md-ink-ripple md-ink-ripple-checkbox></div>' +
        '</div>'+
      '</div>' +
      '<div ng-transclude class="md-label"></div>',
    require: '?ngModel',
    compile: mdSwitchCompile
  };

  function mdSwitchCompile(element, attr) {
    var checkboxLink = checkboxDirective.compile(element, attr).post;
    element.addClass('md-dragging');

    return function (scope, element, attr, ngModel) {
      ngModel = ngModel || $mdUtil.fakeNgModel();

      var disabledGetter = null;
      if (attr.disabled != null) {
        disabledGetter = function() { return true; };
      } else if (attr.ngDisabled) {
        disabledGetter = $parse(attr.ngDisabled);
      }

      var thumbContainer = angular.element(element[0].querySelector('.md-thumb-container'));
      var switchContainer = angular.element(element[0].querySelector('.md-container'));
      $$rAF(function() {
        element.removeClass('md-dragging');
      });

      checkboxLink(scope, element, attr, ngModel);

      if (disabledGetter) {
        scope.$watch(disabledGetter, function(isDisabled) {
          element.attr('tabindex', isDisabled ? -1 : 0);
        });
      }
      $mdGesture.register(switchContainer, 'drag');
      switchContainer
        .on('$md.dragstart', onDragStart)
        .on('$md.drag', onDrag)
        .on('$md.dragend', onDragEnd);

      var drag;
      function onDragStart(ev) {
        if (disabledGetter && disabledGetter(scope)) return;
        ev.stopPropagation();

        element.addClass('md-dragging');
        drag = {width: thumbContainer.prop('offsetWidth')};
      }

      function onDrag(ev) {
        if (!drag) return;
        ev.stopPropagation();
        ev.srcEvent && ev.srcEvent.preventDefault();

        var percent = ev.pointer.distanceX / drag.width;
        var translate = ngModel.$viewValue ?  1 + percent : percent;
        translate = Math.max(0, Math.min(1, translate));

        thumbContainer.css($mdConstant.CSS.TRANSFORM, 'translate3d(' + (100*translate) + '%,0,0)');
        drag.translate = translate;
      }

      function onDragEnd(ev) {
        if (!drag) return;
        ev.stopPropagation();

        element.removeClass('md-dragging');
        thumbContainer.css($mdConstant.CSS.TRANSFORM, '');
        var isChanged = ngModel.$viewValue ? drag.translate < 0.5 : drag.translate > 0.5;
        if (isChanged) {
          applyModelValue(!ngModel.$viewValue);
        }
        drag = null;
        scope.skipToggle = true;
        $timeout(function() {
          scope.skipToggle = false;
        }, 1);
      }

      function applyModelValue(newValue) {
        scope.$apply(function() {
          ngModel.$setViewValue(newValue);
          ngModel.$render();
        });
      }

    };
  }


}

})();
(function(){
"use strict";
angular.module('material.components.tabs', [
  'material.core',
  'material.components.icon'
]);

})();
(function(){
"use strict";
MdToastDirective.$inject = ["$mdToast"];
MdToastProvider.$inject = ["$$interimElementProvider"];
angular.module('material.components.toast', [
  'material.core',
  'material.components.button'
])
  .directive('mdToast', MdToastDirective)
  .provider('$mdToast', MdToastProvider);
function MdToastDirective($mdToast) {
  return {
    restrict: 'E',
    link: function postLink(scope, element) {
      element.addClass('_md');     // private md component indicator for styling
      scope.$on('$destroy', function() {
        $mdToast.destroy();
      });
    }
  };
}

function MdToastProvider($$interimElementProvider) {
  toastDefaultOptions.$inject = ["$animate", "$mdToast", "$mdUtil", "$mdMedia"];
  var ACTION_RESOLVE = 'ok';

  var activeToastContent;
  var $mdToast = $$interimElementProvider('$mdToast')
    .setDefaults({
      methods: ['position', 'hideDelay', 'capsule', 'parent', 'position', 'toastClass'],
      options: toastDefaultOptions
    })
    .addPreset('simple', {
      argOption: 'textContent',
      methods: ['textContent', 'content', 'action', 'highlightAction', 'highlightClass', 'theme', 'parent' ],
      options: /* @ngInject */ ["$mdToast", "$mdTheming", function($mdToast, $mdTheming) {
        return {
          template:
            '<md-toast md-theme="{{ toast.theme }}" ng-class="{\'md-capsule\': toast.capsule}">' +
            '  <div class="md-toast-content">' +
            '    <span class="md-toast-text" role="alert" aria-relevant="all" aria-atomic="true">' +
            '      {{ toast.content }}' +
            '    </span>' +
            '    <md-button class="md-action" ng-if="toast.action" ng-click="toast.resolve()" ' +
            '        ng-class="highlightClasses">' +
            '      {{ toast.action }}' +
            '    </md-button>' +
            '  </div>' +
            '</md-toast>',
          controller: /* @ngInject */ ["$scope", function mdToastCtrl($scope) {
            var self = this;

            if (self.highlightAction) {
              $scope.highlightClasses = [
                'md-highlight',
                self.highlightClass
              ]
            }

            $scope.$watch(function() { return activeToastContent; }, function() {
              self.content = activeToastContent;
            });

            this.resolve = function() {
              $mdToast.hide( ACTION_RESOLVE );
            };
          }],
          theme: $mdTheming.defaultTheme(),
          controllerAs: 'toast',
          bindToController: true
        };
      }]
    })
    .addMethod('updateTextContent', updateTextContent)
    .addMethod('updateContent', updateTextContent);

    function updateTextContent(newContent) {
      activeToastContent = newContent;
    }

    return $mdToast;
  function toastDefaultOptions($animate, $mdToast, $mdUtil, $mdMedia) {
    var SWIPE_EVENTS = '$md.swipeleft $md.swiperight $md.swipeup $md.swipedown';
    return {
      onShow: onShow,
      onRemove: onRemove,
      toastClass: '',
      position: 'bottom left',
      themable: true,
      hideDelay: 3000,
      autoWrap: true,
      transformTemplate: function(template, options) {
        var shouldAddWrapper = options.autoWrap && template && !/md-toast-content/g.test(template);

        if (shouldAddWrapper) {
          var templateRoot = document.createElement('md-template');
          templateRoot.innerHTML = template;
          for (var i = 0; i < templateRoot.children.length; i++) {
            if (templateRoot.children[i].nodeName === 'MD-TOAST') {
              var wrapper = angular.element('<div class="md-toast-content">');
              wrapper.append(angular.element(templateRoot.children[i].childNodes));
              templateRoot.children[i].appendChild(wrapper[0]);
            }
          }
          return templateRoot.innerHTML;
        }

        return template || '';
      }
    };

    function onShow(scope, element, options) {
      activeToastContent = options.textContent || options.content; // support deprecated #content method

      var isSmScreen = !$mdMedia('gt-sm');

      element = $mdUtil.extractElementByName(element, 'md-toast', true);
      options.element = element;

      options.onSwipe = function(ev, gesture) {
        var swipe = ev.type.replace('$md.','');
        var direction = swipe.replace('swipe', '');
        if ((direction === 'down' && options.position.indexOf('top') != -1 && !isSmScreen) ||
            (direction === 'up' && (options.position.indexOf('bottom') != -1 || isSmScreen))) {
          return;
        }

        if ((direction === 'left' || direction === 'right') && isSmScreen) {
          return;
        }

        element.addClass('md-' + swipe);
        $mdUtil.nextTick($mdToast.cancel);
      };
      options.openClass = toastOpenClass(options.position);

      element.addClass(options.toastClass);
      options.parent.addClass(options.openClass);
      if ($mdUtil.hasComputedStyle(options.parent, 'position', 'static')) {
        options.parent.css('position', 'relative');
      }

      element.on(SWIPE_EVENTS, options.onSwipe);
      element.addClass(isSmScreen ? 'md-bottom' : options.position.split(' ').map(function(pos) {
        return 'md-' + pos;
      }).join(' '));

      if (options.parent) options.parent.addClass('md-toast-animating');
      return $animate.enter(element, options.parent).then(function() {
        if (options.parent) options.parent.removeClass('md-toast-animating');
      });
    }

    function onRemove(scope, element, options) {
      element.off(SWIPE_EVENTS, options.onSwipe);
      if (options.parent) options.parent.addClass('md-toast-animating');
      if (options.openClass) options.parent.removeClass(options.openClass);

      return ((options.$destroy == true) ? element.remove() : $animate.leave(element))
        .then(function () {
          if (options.parent) options.parent.removeClass('md-toast-animating');
          if ($mdUtil.hasComputedStyle(options.parent, 'position', 'static')) {
            options.parent.css('position', '');
          }
        });
    }

    function toastOpenClass(position) {
      if (!$mdMedia('gt-xs')) {
        return 'md-toast-open-bottom';
      }

      return 'md-toast-open-' +
        (position.indexOf('top') > -1 ? 'top' : 'bottom');
    }
  }

}

})();
(function(){
"use strict";
mdToolbarDirective.$inject = ["$$rAF", "$mdConstant", "$mdUtil", "$mdTheming", "$animate"];
angular.module('material.components.toolbar', [
  'material.core',
  'material.components.content'
])
  .directive('mdToolbar', mdToolbarDirective);

function mdToolbarDirective($$rAF, $mdConstant, $mdUtil, $mdTheming, $animate) {
  var translateY = angular.bind(null, $mdUtil.supplant, 'translate3d(0,{0}px,0)');

  return {
    template: '',
    restrict: 'E',

    link: function(scope, element, attr) {

      element.addClass('_md');     // private md component indicator for styling
      $mdTheming(element);

      $mdUtil.nextTick(function () {
        element.addClass('_md-toolbar-transitions');     // adding toolbar transitions after digest
      }, false);

      if (angular.isDefined(attr.mdScrollShrink)) {
        setupScrollShrink();
      }

      function setupScrollShrink() {

        var toolbarHeight;
        var contentElement;
        var disableScrollShrink = angular.noop;
        var y = 0;
        var prevScrollTop = 0;
        var shrinkSpeedFactor = attr.mdShrinkSpeedFactor || 0.5;

        var debouncedContentScroll = $$rAF.throttle(onContentScroll);
        var debouncedUpdateHeight = $mdUtil.debounce(updateToolbarHeight, 5 * 1000);

        scope.$on('$mdContentLoaded', onMdContentLoad);

        attr.$observe('mdScrollShrink', onChangeScrollShrink);

        if (attr.ngShow) { scope.$watch(attr.ngShow, updateToolbarHeight); }
        if (attr.ngHide) { scope.$watch(attr.ngHide, updateToolbarHeight); }

        scope.$on('$destroy', disableScrollShrink);
        function onChangeScrollShrink(shrinkWithScroll) {
          var closestContent = element.parent().find('md-content');

          if (!contentElement && closestContent.length) {
            onMdContentLoad(null, closestContent);
          }
          shrinkWithScroll = scope.$eval(shrinkWithScroll);
          if (shrinkWithScroll === false) {
            disableScrollShrink();
          } else {
            disableScrollShrink = enableScrollShrink();
          }
        }
        function onMdContentLoad($event, newContentEl) {
          if (newContentEl && element.parent()[0] === newContentEl.parent()[0]) {
            if (contentElement) {
              contentElement.off('scroll', debouncedContentScroll);
            }

            contentElement = newContentEl;
            disableScrollShrink = enableScrollShrink();
          }
        }
        function onContentScroll(e) {
          var scrollTop = e ? e.target.scrollTop : prevScrollTop;

          debouncedUpdateHeight();

          y = Math.min(
            toolbarHeight / shrinkSpeedFactor,
            Math.max(0, y + scrollTop - prevScrollTop)
          );

          element.css($mdConstant.CSS.TRANSFORM, translateY([-y * shrinkSpeedFactor]));
          contentElement.css($mdConstant.CSS.TRANSFORM, translateY([(toolbarHeight - y) * shrinkSpeedFactor]));

          prevScrollTop = scrollTop;

          $mdUtil.nextTick(function() {
            var hasWhiteFrame = element.hasClass('md-whiteframe-z1');

            if (hasWhiteFrame && !y) {
              $animate.removeClass(element, 'md-whiteframe-z1');
            } else if (!hasWhiteFrame && y) {
              $animate.addClass(element, 'md-whiteframe-z1');
            }
          });

        }
        function enableScrollShrink() {
          if (!contentElement)     return angular.noop;           // no md-content

          contentElement.on('scroll', debouncedContentScroll);
          contentElement.attr('scroll-shrink', 'true');

          $mdUtil.nextTick(updateToolbarHeight, false);

          return function disableScrollShrink() {
            contentElement.off('scroll', debouncedContentScroll);
            contentElement.attr('scroll-shrink', 'false');

            updateToolbarHeight();
          };
        }
        function updateToolbarHeight() {
          toolbarHeight = element.prop('offsetHeight');
          var margin = (-toolbarHeight * shrinkSpeedFactor) + 'px';

          contentElement.css({
            "margin-top": margin,
            "margin-bottom": margin
          });

          onContentScroll();
        }

      }

    }
  };

}

})();
(function(){
"use strict";
MdTooltipDirective.$inject = ["$timeout", "$window", "$$rAF", "$document", "$mdUtil", "$mdTheming", "$rootElement", "$animate", "$q", "$interpolate"];
angular
    .module('material.components.tooltip', [ 'material.core' ])
    .directive('mdTooltip', MdTooltipDirective);
function MdTooltipDirective($timeout, $window, $$rAF, $document, $mdUtil, $mdTheming, $rootElement,
                            $animate, $q, $interpolate) {

  var ENTER_EVENTS = 'focus touchstart mouseenter';
  var LEAVE_EVENTS = 'blur touchcancel mouseleave';
  var SHOW_CLASS = 'md-show';
  var TOOLTIP_SHOW_DELAY = 0;
  var TOOLTIP_WINDOW_EDGE_SPACE = 8;

  return {
    restrict: 'E',
    transclude: true,
    priority: 210, // Before ngAria
    template: '<div class="md-content _md" ng-transclude></div>',
    scope: {
      delay: '=?mdDelay',
      visible: '=?mdVisible',
      autohide: '=?mdAutohide',
      direction: '@?mdDirection'    // only expect raw or interpolated string value; not expression
    },
    compile: function(tElement, tAttr) {
      if (!tAttr.mdDirection) {
        tAttr.$set('mdDirection', 'bottom');
      }

      return postLink;
    }
  };

  function postLink(scope, element, attr) {

    $mdTheming(element);

    var parent        = $mdUtil.getParentWithPointerEvents(element),
        content       = angular.element(element[0].getElementsByClassName('md-content')[0]),
        tooltipParent = angular.element(document.body),
        showTimeout   = null,
        debouncedOnResize = $$rAF.throttle(function () { updatePosition(); });

    if ($animate.pin) $animate.pin(element, parent);

    setDefaults();
    manipulateElement();
    bindEvents();
    updateContentOrigin();

    configureWatchers();
    addAriaLabel();


    function setDefaults () {
      scope.delay = scope.delay || TOOLTIP_SHOW_DELAY;
    }

    function updateContentOrigin() {
      var origin = 'center top';
      switch (scope.direction) {
        case 'left'  : origin =  'right center';  break;
        case 'right' : origin =  'left center';   break;
        case 'top'   : origin =  'center bottom'; break;
        case 'bottom': origin =  'center top';    break;
      }
      content.css('transform-origin', origin);
    }

    function onVisibleChanged (isVisible) {
      if (isVisible) showTooltip();
      else hideTooltip();
    }

    function configureWatchers () {
      if (element[0] && 'MutationObserver' in $window) {
        var attributeObserver = new MutationObserver(function(mutations) {
          mutations
            .forEach(function (mutation) {
              if (mutation.attributeName === 'md-visible') {
                if (!scope.visibleWatcher)
                  scope.visibleWatcher = scope.$watch('visible', onVisibleChanged );
              }
              if (mutation.attributeName === 'md-direction') {
                updatePosition(scope.direction);
              }
            });
        });

        attributeObserver.observe(element[0], { attributes: true });
        if (attr.hasOwnProperty('mdVisible')) {
          scope.visibleWatcher = scope.$watch('visible', onVisibleChanged );
        }
      } else { // MutationObserver not supported
        scope.visibleWatcher = scope.$watch('visible', onVisibleChanged );
        scope.$watch('direction', updatePosition );
      }

      var onElementDestroy = function() {
        scope.$destroy();
      };
      element.one('$destroy', onElementDestroy);
      parent.one('$destroy', onElementDestroy);
      scope.$on('$destroy', function() {
        setVisible(false);
        element.remove();
        attributeObserver && attributeObserver.disconnect();
      });
      if (element.text().indexOf($interpolate.startSymbol()) > -1) {
        scope.$watch(function() {
          return element.text().trim();
        }, addAriaLabel);
      }
    }

    function addAriaLabel (override) {
      if ((override || !parent.attr('aria-label')) && !parent.text().trim()) {
        var rawText = override || element.text().trim();
        var interpolatedText = $interpolate(rawText)(parent.scope());
        parent.attr('aria-label', interpolatedText);
      }
    }

    function manipulateElement () {
      element.detach();
      element.attr('role', 'tooltip');
    }

    function bindEvents () {
      var mouseActive = false;
      if (parent[0] && 'MutationObserver' in $window) {
        var attributeObserver = new MutationObserver(function(mutations) {
          if (mutations.some(function (mutation) {
              return (mutation.attributeName === 'disabled' && parent[0].disabled);
            })) {
              $mdUtil.nextTick(function() {
                setVisible(false);
              });
          }
        });

        attributeObserver.observe(parent[0], { attributes: true});
      }
      var windowBlurHandler = function() {
        elementFocusedOnWindowBlur = document.activeElement === parent[0];
      };
      var elementFocusedOnWindowBlur = false;

      function windowScrollHandler() {
        setVisible(false);
      }

      angular.element($window)
        .on('blur', windowBlurHandler)
        .on('resize', debouncedOnResize);

      document.addEventListener('scroll', windowScrollHandler, true);
      scope.$on('$destroy', function() {
        angular.element($window)
          .off('blur', windowBlurHandler)
          .off('resize', debouncedOnResize);

        parent
          .off(ENTER_EVENTS, enterHandler)
          .off(LEAVE_EVENTS, leaveHandler)
          .off('mousedown', mousedownHandler);
        leaveHandler();
        document.removeEventListener('scroll', windowScrollHandler, true);
        attributeObserver && attributeObserver.disconnect();
      });

      var enterHandler = function(e) {
        if (e.type === 'focus' && elementFocusedOnWindowBlur) {
          elementFocusedOnWindowBlur = false;
        } else if (!scope.visible) {
          parent.on(LEAVE_EVENTS, leaveHandler);
          setVisible(true);
          if (e.type === 'touchstart') {
            parent.one('touchend', function() {
              $mdUtil.nextTick(function() {
                $document.one('touchend', leaveHandler);
              }, false);
            });
          }
        }
      };
      var leaveHandler = function () {
        var autohide = scope.hasOwnProperty('autohide') ? scope.autohide : attr.hasOwnProperty('mdAutohide');

        if (autohide || mouseActive || $document[0].activeElement !== parent[0]) {
          if (showTimeout) {
            $timeout.cancel(showTimeout);
            setVisible.queued = false;
            showTimeout = null;
          }

          parent.off(LEAVE_EVENTS, leaveHandler);
          parent.triggerHandler('blur');
          setVisible(false);
        }
        mouseActive = false;
      };
      var mousedownHandler = function() {
        mouseActive = true;
      };
      parent.on('mousedown', mousedownHandler);
      parent.on(ENTER_EVENTS, enterHandler);
    }

    function setVisible (value) {
      if (setVisible.queued && setVisible.value === !!value || !setVisible.queued && scope.visible === !!value) return;
      setVisible.value = !!value;

      if (!setVisible.queued) {
        if (value) {
          setVisible.queued = true;
          showTimeout = $timeout(function() {
            scope.visible = setVisible.value;
            setVisible.queued = false;
            showTimeout = null;

            if (!scope.visibleWatcher) {
              onVisibleChanged(scope.visible);
            }
          }, scope.delay);
        } else {
          $mdUtil.nextTick(function() {
            scope.visible = false;
            if (!scope.visibleWatcher)
              onVisibleChanged(false);
          });
        }
      }
    }

    function showTooltip() {
      if (!element[0].textContent.trim()) return;
      element.css({top: 0, left: 0});
      tooltipParent.append(element);
      if ( $mdUtil.hasComputedStyle(element, 'display', 'none')) {
        scope.visible = false;
        element.detach();
        return;
      }

      updatePosition();

      $animate.addClass(content, SHOW_CLASS).then(function() {
        element.addClass(SHOW_CLASS);
      });
    }

    function hideTooltip() {
      $animate.removeClass(content, SHOW_CLASS).then(function(){
        element.removeClass(SHOW_CLASS);
        if (!scope.visible) element.detach();
      });
    }

    function updatePosition() {
      if ( !scope.visible ) return;

      updateContentOrigin();
      positionTooltip();
    }

    function positionTooltip() {
      var tipRect = $mdUtil.offsetRect(element, tooltipParent);
      var parentRect = $mdUtil.offsetRect(parent, tooltipParent);
      var newPosition = getPosition(scope.direction);
      var offsetParent = element.prop('offsetParent');
      if (scope.direction) {
        newPosition = fitInParent(newPosition);
      } else if (offsetParent && newPosition.top > offsetParent.scrollHeight - tipRect.height - TOOLTIP_WINDOW_EDGE_SPACE) {
        newPosition = fitInParent(getPosition('top'));
      }

      element.css({
        left: newPosition.left + 'px',
        top: newPosition.top + 'px'
      });

      function fitInParent (pos) {
        var newPosition = { left: pos.left, top: pos.top };
        newPosition.left = Math.min( newPosition.left, tooltipParent.prop('scrollWidth') - tipRect.width - TOOLTIP_WINDOW_EDGE_SPACE );
        newPosition.left = Math.max( newPosition.left, TOOLTIP_WINDOW_EDGE_SPACE );
        newPosition.top  = Math.min( newPosition.top,  tooltipParent.prop('scrollHeight') - tipRect.height - TOOLTIP_WINDOW_EDGE_SPACE );
        newPosition.top  = Math.max( newPosition.top,  TOOLTIP_WINDOW_EDGE_SPACE );
        return newPosition;
      }

      function getPosition (dir) {
        return dir === 'left'
          ? { left: parentRect.left - tipRect.width - TOOLTIP_WINDOW_EDGE_SPACE,
              top: parentRect.top + parentRect.height / 2 - tipRect.height / 2 }
          : dir === 'right'
          ? { left: parentRect.left + parentRect.width + TOOLTIP_WINDOW_EDGE_SPACE,
              top: parentRect.top + parentRect.height / 2 - tipRect.height / 2 }
          : dir === 'top'
          ? { left: parentRect.left + parentRect.width / 2 - tipRect.width / 2,
              top: parentRect.top - tipRect.height - TOOLTIP_WINDOW_EDGE_SPACE }
          : { left: parentRect.left + parentRect.width / 2 - tipRect.width / 2,
              top: parentRect.top + parentRect.height + TOOLTIP_WINDOW_EDGE_SPACE };
      }
    }

  }

}

})();
(function(){
"use strict";
VirtualRepeatContainerController.$inject = ["$$rAF", "$mdUtil", "$parse", "$rootScope", "$window", "$scope", "$element", "$attrs"];
VirtualRepeatController.$inject = ["$scope", "$element", "$attrs", "$browser", "$document", "$rootScope", "$$rAF", "$mdUtil"];
VirtualRepeatDirective.$inject = ["$parse"];
angular.module('material.components.virtualRepeat', [
  'material.core',
  'material.components.showHide'
])
.directive('mdVirtualRepeatContainer', VirtualRepeatContainerDirective)
.directive('mdVirtualRepeat', VirtualRepeatDirective);
function VirtualRepeatContainerDirective() {
  return {
    controller: VirtualRepeatContainerController,
    template: virtualRepeatContainerTemplate,
    compile: function virtualRepeatContainerCompile($element, $attrs) {
      $element
          .addClass('md-virtual-repeat-container')
          .addClass($attrs.hasOwnProperty('mdOrientHorizontal')
              ? 'md-orient-horizontal'
              : 'md-orient-vertical');
    }
  };
}


function virtualRepeatContainerTemplate($element) {
  return '<div class="md-virtual-repeat-scroller">' +
    '<div class="md-virtual-repeat-sizer"></div>' +
    '<div class="md-virtual-repeat-offsetter">' +
      $element[0].innerHTML +
    '</div></div>';
}
var MAX_ELEMENT_SIZE = 1533917;
var NUM_EXTRA = 3;
function VirtualRepeatContainerController(
    $$rAF, $mdUtil, $parse, $rootScope, $window, $scope, $element, $attrs) {
  this.$rootScope = $rootScope;
  this.$scope = $scope;
  this.$element = $element;
  this.$attrs = $attrs;
  this.size = 0;
  this.scrollSize = 0;
  this.scrollOffset = 0;
  this.horizontal = this.$attrs.hasOwnProperty('mdOrientHorizontal');
  this.repeater = null;
  this.autoShrink = this.$attrs.hasOwnProperty('mdAutoShrink');
  this.autoShrinkMin = parseInt(this.$attrs.mdAutoShrinkMin, 10) || 0;
  this.originalSize = null;
  this.offsetSize = parseInt(this.$attrs.mdOffsetSize, 10) || 0;
  this.oldElementSize = null;

  if (this.$attrs.mdTopIndex) {
    this.bindTopIndex = $parse(this.$attrs.mdTopIndex);
    this.topIndex = this.bindTopIndex(this.$scope);

    if (!angular.isDefined(this.topIndex)) {
      this.topIndex = 0;
      this.bindTopIndex.assign(this.$scope, 0);
    }

    this.$scope.$watch(this.bindTopIndex, angular.bind(this, function(newIndex) {
      if (newIndex !== this.topIndex) {
        this.scrollToIndex(newIndex);
      }
    }));
  } else {
    this.topIndex = 0;
  }

  this.scroller = $element[0].querySelector('.md-virtual-repeat-scroller');
  this.sizer = this.scroller.querySelector('.md-virtual-repeat-sizer');
  this.offsetter = this.scroller.querySelector('.md-virtual-repeat-offsetter');
  var boundUpdateSize = angular.bind(this, this.updateSize);

  $$rAF(angular.bind(this, function() {
    boundUpdateSize();

    var debouncedUpdateSize = $mdUtil.debounce(boundUpdateSize, 10, null, false);
    var jWindow = angular.element($window);
    if (!this.size) {
      debouncedUpdateSize();
    }

    jWindow.on('resize', debouncedUpdateSize);
    $scope.$on('$destroy', function() {
      jWindow.off('resize', debouncedUpdateSize);
    });

    $scope.$emit('$md-resize-enable');
    $scope.$on('$md-resize', boundUpdateSize);
  }));
}
VirtualRepeatContainerController.prototype.register = function(repeaterCtrl) {
  this.repeater = repeaterCtrl;

  angular.element(this.scroller)
      .on('scroll wheel touchmove touchend', angular.bind(this, this.handleScroll_));
};
VirtualRepeatContainerController.prototype.isHorizontal = function() {
  return this.horizontal;
};
VirtualRepeatContainerController.prototype.getSize = function() {
  return this.size;
};
VirtualRepeatContainerController.prototype.setSize_ = function(size) {
  var dimension = this.getDimensionName_();

  this.size = size;
  this.$element[0].style[dimension] = size + 'px';
};


VirtualRepeatContainerController.prototype.unsetSize_ = function() {
  this.$element[0].style[this.getDimensionName_()] = this.oldElementSize;
  this.oldElementSize = null;
};
VirtualRepeatContainerController.prototype.updateSize = function() {
  if (this.originalSize) return;

  this.size = this.isHorizontal()
      ? this.$element[0].clientWidth
      : this.$element[0].clientHeight;
  this.handleScroll_();

  this.repeater && this.repeater.containerUpdated();
};
VirtualRepeatContainerController.prototype.getScrollSize = function() {
  return this.scrollSize;
};


VirtualRepeatContainerController.prototype.getDimensionName_ = function() {
  return this.isHorizontal() ? 'width' : 'height';
};
VirtualRepeatContainerController.prototype.sizeScroller_ = function(size) {
  var dimension =  this.getDimensionName_();
  var crossDimension = this.isHorizontal() ? 'height' : 'width';
  this.sizer.innerHTML = '';
  if (size < MAX_ELEMENT_SIZE) {
    this.sizer.style[dimension] = size + 'px';
  } else {
    this.sizer.style[dimension] = 'auto';
    this.sizer.style[crossDimension] = 'auto';
    var numChildren = Math.floor(size / MAX_ELEMENT_SIZE);
    var sizerChild = document.createElement('div');
    sizerChild.style[dimension] = MAX_ELEMENT_SIZE + 'px';
    sizerChild.style[crossDimension] = '1px';

    for (var i = 0; i < numChildren; i++) {
      this.sizer.appendChild(sizerChild.cloneNode(false));
    }
    sizerChild.style[dimension] = (size - (numChildren * MAX_ELEMENT_SIZE)) + 'px';
    this.sizer.appendChild(sizerChild);
  }
};
VirtualRepeatContainerController.prototype.autoShrink_ = function(size) {
  var shrinkSize = Math.max(size, this.autoShrinkMin * this.repeater.getItemSize());

  if (this.autoShrink && shrinkSize !== this.size) {
    if (this.oldElementSize === null) {
      this.oldElementSize = this.$element[0].style[this.getDimensionName_()];
    }

    var currentSize = this.originalSize || this.size;

    if (!currentSize || shrinkSize < currentSize) {
      if (!this.originalSize) {
        this.originalSize = this.size;
      }
      this.setSize_(shrinkSize);
    } else if (this.originalSize !== null) {
      this.unsetSize_();

      var _originalSize = this.originalSize;
      this.originalSize = null;
      if (!_originalSize) this.updateSize();
      this.setSize_(_originalSize || this.size);
    }

    this.repeater.containerUpdated();
  }
};
VirtualRepeatContainerController.prototype.setScrollSize = function(itemsSize) {
  var size = itemsSize + this.offsetSize;
  if (this.scrollSize === size) return;

  this.sizeScroller_(size);
  this.autoShrink_(size);
  this.scrollSize = size;
};
VirtualRepeatContainerController.prototype.getScrollOffset = function() {
  return this.scrollOffset;
};
VirtualRepeatContainerController.prototype.scrollTo = function(position) {
  this.scroller[this.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = position;
  this.handleScroll_();
};
VirtualRepeatContainerController.prototype.scrollToIndex = function(index) {
  var itemSize = this.repeater.getItemSize();
  var itemsLength = this.repeater.itemsLength;
  if(index > itemsLength) {
    index = itemsLength - 1;
  }
  this.scrollTo(itemSize * index);
};

VirtualRepeatContainerController.prototype.resetScroll = function() {
  this.scrollTo(0);
};


VirtualRepeatContainerController.prototype.handleScroll_ = function() {
  var doc = angular.element(document)[0];
  var ltr = doc.dir != 'rtl' && doc.body.dir != 'rtl';
  if(!ltr && !this.maxSize) {
    this.scroller.scrollLeft = this.scrollSize;
    this.maxSize = this.scroller.scrollLeft;
  }
  var offset = this.isHorizontal() ?
      (ltr?this.scroller.scrollLeft : this.maxSize - this.scroller.scrollLeft)
      : this.scroller.scrollTop;
  if (offset === this.scrollOffset || offset > this.scrollSize - this.size) return;

  var itemSize = this.repeater.getItemSize();
  if (!itemSize) return;

  var numItems = Math.max(0, Math.floor(offset / itemSize) - NUM_EXTRA);

  var transform = (this.isHorizontal() ? 'translateX(' : 'translateY(') +
      (!this.isHorizontal() || ltr ? (numItems * itemSize) : - (numItems * itemSize))  + 'px)';

  this.scrollOffset = offset;
  this.offsetter.style.webkitTransform = transform;
  this.offsetter.style.transform = transform;

  if (this.bindTopIndex) {
    var topIndex = Math.floor(offset / itemSize);
    if (topIndex !== this.topIndex && topIndex < this.repeater.getItemCount()) {
      this.topIndex = topIndex;
      this.bindTopIndex.assign(this.$scope, topIndex);
      if (!this.$rootScope.$$phase) this.$scope.$digest();
    }
  }

  this.repeater.containerUpdated();
};
function VirtualRepeatDirective($parse) {
  return {
    controller: VirtualRepeatController,
    priority: 1000,
    require: ['mdVirtualRepeat', '^^mdVirtualRepeatContainer'],
    restrict: 'A',
    terminal: true,
    transclude: 'element',
    compile: function VirtualRepeatCompile($element, $attrs) {
      var expression = $attrs.mdVirtualRepeat;
      var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)\s*$/);
      var repeatName = match[1];
      var repeatListExpression = $parse(match[2]);
      var extraName = $attrs.mdExtraName && $parse($attrs.mdExtraName);

      return function VirtualRepeatLink($scope, $element, $attrs, ctrl, $transclude) {
        ctrl[0].link_(ctrl[1], $transclude, repeatName, repeatListExpression, extraName);
      };
    }
  };
}
function VirtualRepeatController($scope, $element, $attrs, $browser, $document, $rootScope,
    $$rAF, $mdUtil) {
  this.$scope = $scope;
  this.$element = $element;
  this.$attrs = $attrs;
  this.$browser = $browser;
  this.$document = $document;
  this.$rootScope = $rootScope;
  this.$$rAF = $$rAF;
  this.onDemand = $mdUtil.parseAttributeBoolean($attrs.mdOnDemand);
  this.browserCheckUrlChange = $browser.$$checkUrlChange;
  this.newStartIndex = 0;
  this.newEndIndex = 0;
  this.newVisibleEnd = 0;
  this.startIndex = 0;
  this.endIndex = 0;
  this.itemSize = $scope.$eval($attrs.mdItemSize) || null;
  this.isFirstRender = true;
  this.isVirtualRepeatUpdating_ = false;
  this.itemsLength = 0;
  this.unwatchItemSize_ = angular.noop;
  this.blocks = {};
  this.pooledBlocks = [];

  $scope.$on('$destroy', angular.bind(this, this.cleanupBlocks_));
}
VirtualRepeatController.Block;
VirtualRepeatController.prototype.link_ =
    function(container, transclude, repeatName, repeatListExpression, extraName) {
  this.container = container;
  this.transclude = transclude;
  this.repeatName = repeatName;
  this.rawRepeatListExpression = repeatListExpression;
  this.extraName = extraName;
  this.sized = false;

  this.repeatListExpression = angular.bind(this, this.repeatListExpression_);

  this.container.register(this);
};
VirtualRepeatController.prototype.cleanupBlocks_ = function() {
  angular.forEach(this.pooledBlocks, function cleanupBlock(block) {
    block.element.remove();
  });
};
VirtualRepeatController.prototype.readItemSize_ = function() {
  if (this.itemSize) {
    return;
  }

  this.items = this.repeatListExpression(this.$scope);
  this.parentNode = this.$element[0].parentNode;
  var block = this.getBlock_(0);
  if (!block.element[0].parentNode) {
    this.parentNode.appendChild(block.element[0]);
  }

  this.itemSize = block.element[0][
      this.container.isHorizontal() ? 'offsetWidth' : 'offsetHeight'] || null;

  this.blocks[0] = block;
  this.poolBlock_(0);

  if (this.itemSize) {
    this.containerUpdated();
  }
};
VirtualRepeatController.prototype.repeatListExpression_ = function(scope) {
  var repeatList = this.rawRepeatListExpression(scope);

  if (this.onDemand && repeatList) {
    var virtualList = new VirtualRepeatModelArrayLike(repeatList);
    virtualList.$$includeIndexes(this.newStartIndex, this.newVisibleEnd);
    return virtualList;
  } else {
    return repeatList;
  }
};
VirtualRepeatController.prototype.containerUpdated = function() {
  if (!this.itemSize) {
    if(this.unwatchItemSize_ && this.unwatchItemSize_ !== angular.noop){
      this.unwatchItemSize_();
    }
    this.unwatchItemSize_ = this.$scope.$watchCollection(
        this.repeatListExpression,
        angular.bind(this, function(items) {
          if (items && items.length) {
            this.readItemSize_();
          }
        }));
    if (!this.$rootScope.$$phase) this.$scope.$digest();

    return;
  } else if (!this.sized) {
    this.items = this.repeatListExpression(this.$scope);
  }

  if (!this.sized) {
    this.unwatchItemSize_();
    this.sized = true;
    this.$scope.$watchCollection(this.repeatListExpression,
        angular.bind(this, function(items, oldItems) {
          if (!this.isVirtualRepeatUpdating_) {
            this.virtualRepeatUpdate_(items, oldItems);
          }
        }));
  }

  this.updateIndexes_();

  if (this.newStartIndex !== this.startIndex ||
      this.newEndIndex !== this.endIndex ||
      this.container.getScrollOffset() > this.container.getScrollSize()) {
    if (this.items instanceof VirtualRepeatModelArrayLike) {
      this.items.$$includeIndexes(this.newStartIndex, this.newEndIndex);
    }
    this.virtualRepeatUpdate_(this.items, this.items);
  }
};
VirtualRepeatController.prototype.getItemSize = function() {
  return this.itemSize;
};
VirtualRepeatController.prototype.getItemCount = function() {
  return this.itemsLength;
};
VirtualRepeatController.prototype.virtualRepeatUpdate_ = function(items, oldItems) {
  this.isVirtualRepeatUpdating_ = true;

  var itemsLength = items && items.length || 0;
  var lengthChanged = false;
  if (this.items && itemsLength < this.items.length && this.container.getScrollOffset() !== 0) {
    this.items = items;
    var previousScrollOffset = this.container.getScrollOffset();
    this.container.resetScroll();
    this.container.scrollTo(previousScrollOffset);
  }

  if (itemsLength !== this.itemsLength) {
    lengthChanged = true;
    this.itemsLength = itemsLength;
  }

  this.items = items;
  if (items !== oldItems || lengthChanged) {
    this.updateIndexes_();
  }

  this.parentNode = this.$element[0].parentNode;

  if (lengthChanged) {
    this.container.setScrollSize(itemsLength * this.itemSize);
  }

  if (this.isFirstRender) {
    this.isFirstRender = false;
    var startIndex = this.$attrs.mdStartIndex ?
      this.$scope.$eval(this.$attrs.mdStartIndex) :
      this.container.topIndex;
    this.container.scrollToIndex(startIndex);
  }
  Object.keys(this.blocks).forEach(function(blockIndex) {
    var index = parseInt(blockIndex, 10);
    if (index < this.newStartIndex || index >= this.newEndIndex) {
      this.poolBlock_(index);
    }
  }, this);
  this.$browser.$$checkUrlChange = angular.noop;

  var i, block,
      newStartBlocks = [],
      newEndBlocks = [];
  for (i = this.newStartIndex; i < this.newEndIndex && this.blocks[i] == null; i++) {
    block = this.getBlock_(i);
    this.updateBlock_(block, i);
    newStartBlocks.push(block);
  }
  for (; this.blocks[i] != null; i++) {
    this.updateBlock_(this.blocks[i], i);
  }
  var maxIndex = i - 1;
  for (; i < this.newEndIndex; i++) {
    block = this.getBlock_(i);
    this.updateBlock_(block, i);
    newEndBlocks.push(block);
  }
  if (newStartBlocks.length) {
    this.parentNode.insertBefore(
        this.domFragmentFromBlocks_(newStartBlocks),
        this.$element[0].nextSibling);
  }
  if (newEndBlocks.length) {
    this.parentNode.insertBefore(
        this.domFragmentFromBlocks_(newEndBlocks),
        this.blocks[maxIndex] && this.blocks[maxIndex].element[0].nextSibling);
  }
  this.$browser.$$checkUrlChange = this.browserCheckUrlChange;

  this.startIndex = this.newStartIndex;
  this.endIndex = this.newEndIndex;

  this.isVirtualRepeatUpdating_ = false;
};
VirtualRepeatController.prototype.getBlock_ = function(index) {
  if (this.pooledBlocks.length) {
    return this.pooledBlocks.pop();
  }

  var block;
  this.transclude(angular.bind(this, function(clone, scope) {
    block = {
      element: clone,
      new: true,
      scope: scope
    };

    this.updateScope_(scope, index);
    this.parentNode.appendChild(clone[0]);
  }));

  return block;
};
VirtualRepeatController.prototype.updateBlock_ = function(block, index) {
  this.blocks[index] = block;

  if (!block.new &&
      (block.scope.$index === index && block.scope[this.repeatName] === this.items[index])) {
    return;
  }
  block.new = false;
  this.updateScope_(block.scope, index);
  if (!this.$rootScope.$$phase) {
    block.scope.$digest();
  }
};
VirtualRepeatController.prototype.updateScope_ = function(scope, index) {
  scope.$index = index;
  scope[this.repeatName] = this.items && this.items[index];
  if (this.extraName) scope[this.extraName(this.$scope)] = this.items[index];
};
VirtualRepeatController.prototype.poolBlock_ = function(index) {
  this.pooledBlocks.push(this.blocks[index]);
  this.parentNode.removeChild(this.blocks[index].element[0]);
  delete this.blocks[index];
};
VirtualRepeatController.prototype.domFragmentFromBlocks_ = function(blocks) {
  var fragment = this.$document[0].createDocumentFragment();
  blocks.forEach(function(block) {
    fragment.appendChild(block.element[0]);
  });
  return fragment;
};
VirtualRepeatController.prototype.updateIndexes_ = function() {
  var itemsLength = this.items ? this.items.length : 0;
  var containerLength = Math.ceil(this.container.getSize() / this.itemSize);

  this.newStartIndex = Math.max(0, Math.min(
      itemsLength - containerLength,
      Math.floor(this.container.getScrollOffset() / this.itemSize)));
  this.newVisibleEnd = this.newStartIndex + containerLength + NUM_EXTRA;
  this.newEndIndex = Math.min(itemsLength, this.newVisibleEnd);
  this.newStartIndex = Math.max(0, this.newStartIndex - NUM_EXTRA);
};
function VirtualRepeatModelArrayLike(model) {
  if (!angular.isFunction(model.getItemAtIndex) ||
      !angular.isFunction(model.getLength)) {
    throw Error('When md-on-demand is enabled, the Object passed to md-virtual-repeat must implement ' +
        'functions getItemAtIndex() and getLength() ');
  }

  this.model = model;
}


VirtualRepeatModelArrayLike.prototype.$$includeIndexes = function(start, end) {
  for (var i = start; i < end; i++) {
    if (!this.hasOwnProperty(i)) {
      this[i] = this.model.getItemAtIndex(i);
    }
  }
  this.length = this.model.getLength();
};


function abstractMethod() {
  throw Error('Non-overridden abstract method called.');
}

})();
(function(){
"use strict";
MdWhiteframeDirective.$inject = ["$log"];
angular
  .module('material.components.whiteframe', ['material.core'])
  .directive('mdWhiteframe', MdWhiteframeDirective);
function MdWhiteframeDirective($log) {
  var DISABLE_DP = -1;
  var MIN_DP = 1;
  var MAX_DP = 24;
  var DEFAULT_DP = 4;

  return {
    link: postLink
  };

  function postLink(scope, element, attr) {
    var oldClass = '';

    attr.$observe('mdWhiteframe', function(elevation) {
      elevation = parseInt(elevation, 10) || DEFAULT_DP;

      if (elevation != DISABLE_DP && (elevation > MAX_DP || elevation < MIN_DP)) {
        $log.warn('md-whiteframe attribute value is invalid. It should be a number between ' + MIN_DP + ' and ' + MAX_DP, element[0]);
        elevation = DEFAULT_DP;
      }

      var newClass = elevation == DISABLE_DP ? '' : 'md-whiteframe-' + elevation + 'dp';
      attr.$updateClass(newClass, oldClass);
      oldClass = newClass;
    });
  }
}


})();
(function(){
"use strict";


MdAutocompleteCtrl.$inject = ["$scope", "$element", "$mdUtil", "$mdConstant", "$mdTheming", "$window", "$animate", "$rootElement", "$attrs", "$q", "$log"];angular
    .module('material.components.autocomplete')
    .controller('MdAutocompleteCtrl', MdAutocompleteCtrl);

var ITEM_HEIGHT   = 41,
    MAX_HEIGHT    = 5.5 * ITEM_HEIGHT,
    MENU_PADDING  = 8,
    INPUT_PADDING = 2; // Padding provided by `md-input-container`

function MdAutocompleteCtrl ($scope, $element, $mdUtil, $mdConstant, $mdTheming, $window,
                             $animate, $rootElement, $attrs, $q, $log) {
  var ctrl                 = this,
      itemParts            = $scope.itemsExpr.split(/ in /i),
      itemExpr             = itemParts[ 1 ],
      elements             = null,
      cache                = {},
      noBlur               = false,
      selectedItemWatchers = [],
      hasFocus             = false,
      lastCount            = 0,
      fetchesInProgress    = 0,
      enableWrapScroll     = null,
      inputModelCtrl       = null;
  defineProperty('hidden', handleHiddenChange, true);
  ctrl.scope      = $scope;
  ctrl.parent     = $scope.$parent;
  ctrl.itemName   = itemParts[ 0 ];
  ctrl.matches    = [];
  ctrl.loading    = false;
  ctrl.hidden     = true;
  ctrl.index      = null;
  ctrl.messages   = [];
  ctrl.id         = $mdUtil.nextUid();
  ctrl.isDisabled = null;
  ctrl.isRequired = null;
  ctrl.isReadonly = null;
  ctrl.hasNotFound = false;
  ctrl.keydown                       = keydown;
  ctrl.blur                          = blur;
  ctrl.focus                         = focus;
  ctrl.clear                         = clearValue;
  ctrl.select                        = select;
  ctrl.listEnter                     = onListEnter;
  ctrl.listLeave                     = onListLeave;
  ctrl.mouseUp                       = onMouseup;
  ctrl.getCurrentDisplayValue        = getCurrentDisplayValue;
  ctrl.registerSelectedItemWatcher   = registerSelectedItemWatcher;
  ctrl.unregisterSelectedItemWatcher = unregisterSelectedItemWatcher;
  ctrl.notFoundVisible               = notFoundVisible;
  ctrl.loadingIsVisible              = loadingIsVisible;
  ctrl.positionDropdown              = positionDropdown;

  return init();
  function init () {
    $mdUtil.initOptionalProperties($scope, $attrs, { searchText: '', selectedItem: null });
    $mdTheming($element);
    configureWatchers();
    $mdUtil.nextTick(function () {

      gatherElements();
      moveDropdown();
      if ($scope.autofocus) {
        $element.on('focus', focusInputElement);
      }
    });
  }

  function updateModelValidators() {
    if (!$scope.requireMatch || !inputModelCtrl) return;

    inputModelCtrl.$setValidity('md-require-match', !!$scope.selectedItem);
  }
  function positionDropdown () {
    if (!elements) return $mdUtil.nextTick(positionDropdown, false, $scope);
    var hrect  = elements.wrap.getBoundingClientRect(),
        vrect  = elements.snap.getBoundingClientRect(),
        root   = elements.root.getBoundingClientRect(),
        top    = vrect.bottom - root.top,
        bot    = root.bottom - vrect.top,
        left   = hrect.left - root.left,
        width  = hrect.width,
        offset = getVerticalOffset(),
        styles;
    if ($attrs.mdFloatingLabel) {
      left += INPUT_PADDING;
      width -= INPUT_PADDING * 2;
    }
    styles = {
      left:     left + 'px',
      minWidth: width + 'px',
      maxWidth: Math.max(hrect.right - root.left, root.right - hrect.left) - MENU_PADDING + 'px'
    };
    if (top > bot && root.height - hrect.bottom - MENU_PADDING < MAX_HEIGHT) {
      styles.top       = 'auto';
      styles.bottom    = bot + 'px';
      styles.maxHeight = Math.min(MAX_HEIGHT, hrect.top - root.top - MENU_PADDING) + 'px';
    } else {
      styles.top       = (top - offset) + 'px';
      styles.bottom    = 'auto';
      styles.maxHeight = Math.min(MAX_HEIGHT, root.bottom + $mdUtil.scrollTop() - hrect.bottom - MENU_PADDING) + 'px';
    }

    elements.$.scrollContainer.css(styles);
    $mdUtil.nextTick(correctHorizontalAlignment, false);
    function getVerticalOffset () {
      var offset = 0;
      var inputContainer = $element.find('md-input-container');
      if (inputContainer.length) {
        var input = inputContainer.find('input');
        offset = inputContainer.prop('offsetHeight');
        offset -= input.prop('offsetTop');
        offset -= input.prop('offsetHeight');
        offset += inputContainer.prop('offsetTop');
      }
      return offset;
    }
    function correctHorizontalAlignment () {
      var dropdown = elements.scrollContainer.getBoundingClientRect(),
          styles   = {};
      if (dropdown.right > root.right - MENU_PADDING) {
        styles.left = (hrect.right - dropdown.width) + 'px';
      }
      elements.$.scrollContainer.css(styles);
    }
  }
  function moveDropdown () {
    if (!elements.$.root.length) return;
    $mdTheming(elements.$.scrollContainer);
    elements.$.scrollContainer.detach();
    elements.$.root.append(elements.$.scrollContainer);
    if ($animate.pin) $animate.pin(elements.$.scrollContainer, $rootElement);
  }
  function focusInputElement () {
    elements.input.focus();
  }
  function configureWatchers () {
    var wait = parseInt($scope.delay, 10) || 0;
    $attrs.$observe('disabled', function (value) { ctrl.isDisabled = $mdUtil.parseAttributeBoolean(value, false); });
    $attrs.$observe('required', function (value) { ctrl.isRequired = $mdUtil.parseAttributeBoolean(value, false); });
    $attrs.$observe('readonly', function (value) { ctrl.isReadonly = $mdUtil.parseAttributeBoolean(value, false); });
    $scope.$watch('searchText', wait ? $mdUtil.debounce(handleSearchText, wait) : handleSearchText);
    $scope.$watch('selectedItem', selectedItemChange);
    angular.element($window).on('resize', positionDropdown);
    $scope.$on('$destroy', cleanup);
  }
  function cleanup () {
    if (!ctrl.hidden) {
      $mdUtil.enableScrolling();
    }

    angular.element($window).off('resize', positionDropdown);
    if ( elements ){
      var items = ['ul', 'scroller', 'scrollContainer', 'input'];
      angular.forEach(items, function(key){
        elements.$[key].remove();
      });
    }
  }
  function gatherElements () {
    elements = {
      main:  $element[0],
      scrollContainer: $element[0].querySelector('.md-virtual-repeat-container'),
      scroller: $element[0].querySelector('.md-virtual-repeat-scroller'),
      ul:    $element.find('ul')[0],
      input: $element.find('input')[0],
      wrap:  $element.find('md-autocomplete-wrap')[0],
      root:  document.body
    };

    elements.li   = elements.ul.getElementsByTagName('li');
    elements.snap = getSnapTarget();
    elements.$    = getAngularElements(elements);

    inputModelCtrl = elements.$.input.controller('ngModel');
  }
  function getSnapTarget () {
    for (var element = $element; element.length; element = element.parent()) {
      if (angular.isDefined(element.attr('md-autocomplete-snap'))) return element[ 0 ];
    }
    return elements.wrap;
  }
  function getAngularElements (elements) {
    var obj = {};
    for (var key in elements) {
      if (elements.hasOwnProperty(key)) obj[ key ] = angular.element(elements[ key ]);
    }
    return obj;
  }
  function handleHiddenChange (hidden, oldHidden) {
    if (!hidden && oldHidden) {
      positionDropdown();

      if (elements) {
        $mdUtil.disableScrollAround(elements.ul);
        enableWrapScroll = disableElementScrollEvents(angular.element(elements.wrap));
      }
    } else if (hidden && !oldHidden) {
      $mdUtil.enableScrolling();

      if (enableWrapScroll) {
        enableWrapScroll();
        enableWrapScroll = null;
      }
    }
  }
  function disableElementScrollEvents(element) {

    function preventDefault(e) {
      e.preventDefault();
    }

    element.on('wheel', preventDefault);
    element.on('touchmove', preventDefault);

    return function() {
      element.off('wheel', preventDefault);
      element.off('touchmove', preventDefault);
    };
  }
  function onListEnter () {
    noBlur = true;
  }
  function onListLeave () {
    if (!hasFocus && !ctrl.hidden) elements.input.focus();
    noBlur = false;
    ctrl.hidden = shouldHide();
  }
  function onMouseup () {
    elements.input.focus();
  }
  function selectedItemChange (selectedItem, previousSelectedItem) {

    updateModelValidators();

    if (selectedItem) {
      getDisplayValue(selectedItem).then(function (val) {
        $scope.searchText = val;
        handleSelectedItemChange(selectedItem, previousSelectedItem);
      });
    } else if (previousSelectedItem && $scope.searchText) {
      getDisplayValue(previousSelectedItem).then(function(displayValue) {
        if (displayValue.toString().toLowerCase() === $scope.searchText.toLowerCase()) {
          $scope.searchText = '';
        }
      });
    }

    if (selectedItem !== previousSelectedItem) announceItemChange();
  }
  function announceItemChange () {
    angular.isFunction($scope.itemChange) && $scope.itemChange(getItemAsNameVal($scope.selectedItem));
  }
  function announceTextChange () {
    angular.isFunction($scope.textChange) && $scope.textChange();
  }
  function handleSelectedItemChange (selectedItem, previousSelectedItem) {
    selectedItemWatchers.forEach(function (watcher) { watcher(selectedItem, previousSelectedItem); });
  }
  function registerSelectedItemWatcher (cb) {
    if (selectedItemWatchers.indexOf(cb) == -1) {
      selectedItemWatchers.push(cb);
    }
  }
  function unregisterSelectedItemWatcher (cb) {
    var i = selectedItemWatchers.indexOf(cb);
    if (i != -1) {
      selectedItemWatchers.splice(i, 1);
    }
  }
  function handleSearchText (searchText, previousSearchText) {
    ctrl.index = getDefaultIndex();
    if (searchText === previousSearchText) return;

    updateModelValidators();

    getDisplayValue($scope.selectedItem).then(function (val) {
      if (searchText !== val) {
        $scope.selectedItem = null;
        if (searchText !== previousSearchText) announceTextChange();
        if (!isMinLengthMet()) {
          ctrl.matches = [];
          setLoading(false);
          updateMessages();
        } else {
          handleQuery();
        }
      }
    });

  }
  function blur($event) {
    hasFocus = false;

    if (!noBlur) {
      ctrl.hidden = shouldHide();
      evalAttr('ngBlur', { $event: $event });
    }
  }
  function doBlur(forceBlur) {
    if (forceBlur) {
      noBlur = false;
      hasFocus = false;
    }
    elements.input.blur();
  }
  function focus($event) {
    hasFocus = true;

    if (isSearchable() && isMinLengthMet()) {
      handleQuery();
    }

    ctrl.hidden = shouldHide();

    evalAttr('ngFocus', { $event: $event });
  }
  function keydown (event) {
    switch (event.keyCode) {
      case $mdConstant.KEY_CODE.DOWN_ARROW:
        if (ctrl.loading) return;
        event.stopPropagation();
        event.preventDefault();
        ctrl.index   = Math.min(ctrl.index + 1, ctrl.matches.length - 1);
        updateScroll();
        updateMessages();
        break;
      case $mdConstant.KEY_CODE.UP_ARROW:
        if (ctrl.loading) return;
        event.stopPropagation();
        event.preventDefault();
        ctrl.index   = ctrl.index < 0 ? ctrl.matches.length - 1 : Math.max(0, ctrl.index - 1);
        updateScroll();
        updateMessages();
        break;
      case $mdConstant.KEY_CODE.TAB:
        onListLeave();

        if (ctrl.hidden || ctrl.loading || ctrl.index < 0 || ctrl.matches.length < 1) return;
        select(ctrl.index);
        break;
      case $mdConstant.KEY_CODE.ENTER:
        if (ctrl.hidden || ctrl.loading || ctrl.index < 0 || ctrl.matches.length < 1) return;
        if (hasSelection()) return;
        event.stopPropagation();
        event.preventDefault();
        select(ctrl.index);
        break;
      case $mdConstant.KEY_CODE.ESCAPE:
        event.preventDefault(); // Prevent browser from always clearing input
        if (!shouldProcessEscape()) return;
        event.stopPropagation();

        clearSelectedItem();
        if ($scope.searchText && hasEscapeOption('clear')) {
          clearSearchText();
        }
        ctrl.hidden = true;

        if (hasEscapeOption('blur')) {
          doBlur(true);
        }

        break;
      default:
    }
  }
  function getMinLength () {
    return angular.isNumber($scope.minLength) ? $scope.minLength : 1;
  }
  function getDisplayValue (item) {
    return $q.when(getItemText(item) || item).then(function(itemText) {
      if (itemText && !angular.isString(itemText)) {
        $log.warn('md-autocomplete: Could not resolve display value to a string. ' +
          'Please check the `md-item-text` attribute.');
      }

      return itemText;
    });
    function getItemText (item) {
      return (item && $scope.itemText) ? $scope.itemText(getItemAsNameVal(item)) : null;
    }
  }
  function getItemAsNameVal (item) {
    if (!item) return undefined;

    var locals = {};
    if (ctrl.itemName) locals[ ctrl.itemName ] = item;

    return locals;
  }
  function getDefaultIndex () {
    return $scope.autoselect ? 0 : -1;
  }
  function setLoading(value) {
    if (ctrl.loading != value) {
      ctrl.loading = value;
    }
    ctrl.hidden = shouldHide();
  }
  function shouldHide () {
    if (!isSearchable()) return true;    // Hide when not able to query
    else return !shouldShow();            // Hide when the dropdown is not able to show.
  }
  function isSearchable() {
    if (ctrl.loading && !hasMatches()) return false; // No query when query is in progress.
    else if (hasSelection()) return false;           // No query if there is already a selection
    else if (!hasFocus) return false;                // No query if the input does not have focus
    return true;
  }
  function shouldProcessEscape() {
    return hasEscapeOption('blur') || !ctrl.hidden || ctrl.loading || hasEscapeOption('clear') && $scope.searchText;
  }
  function hasEscapeOption(option) {
    return !$scope.escapeOptions || $scope.escapeOptions.toLowerCase().indexOf(option) !== -1;
  }
  function shouldShow() {
    return (isMinLengthMet() && hasMatches()) || notFoundVisible();
  }
  function hasMatches() {
    return ctrl.matches.length ? true : false;
  }
  function hasSelection() {
    return ctrl.scope.selectedItem ? true : false;
  }
  function loadingIsVisible() {
    return ctrl.loading && !hasSelection();
  }
  function getCurrentDisplayValue () {
    return getDisplayValue(ctrl.matches[ ctrl.index ]);
  }
  function isMinLengthMet () {
    return ($scope.searchText || '').length >= getMinLength();
  }
  function defineProperty (key, handler, value) {
    Object.defineProperty(ctrl, key, {
      get: function () { return value; },
      set: function (newValue) {
        var oldValue = value;
        value        = newValue;
        handler(newValue, oldValue);
      }
    });
  }
  function select (index) {
    $mdUtil.nextTick(function () {
      getDisplayValue(ctrl.matches[ index ]).then(function (val) {
        var ngModel = elements.$.input.controller('ngModel');
        ngModel.$setViewValue(val);
        ngModel.$render();
      }).finally(function () {
        $scope.selectedItem = ctrl.matches[ index ];
        setLoading(false);
      });
    }, false);
  }
  function clearValue () {
    clearSelectedItem();
    clearSearchText();
  }
  function clearSelectedItem () {
    ctrl.index = 0;
    ctrl.matches = [];
  }
  function clearSearchText () {
    setLoading(true);

    $scope.searchText = '';
    var eventObj = document.createEvent('CustomEvent');
    eventObj.initCustomEvent('change', true, true, { value: '' });
    elements.input.dispatchEvent(eventObj);
    elements.input.blur();
    $scope.searchText = '';
    elements.input.focus();
  }
  function fetchResults (searchText) {
    var items = $scope.$parent.$eval(itemExpr),
        term  = searchText.toLowerCase(),
        isList = angular.isArray(items),
        isPromise = !!items.then; // Every promise should contain a `then` property

    if (isList) onResultsRetrieved(items);
    else if (isPromise) handleAsyncResults(items);

    function handleAsyncResults(items) {
      if ( !items ) return;

      items = $q.when(items);
      fetchesInProgress++;
      setLoading(true);

      $mdUtil.nextTick(function () {
          items
            .then(onResultsRetrieved)
            .finally(function(){
              if (--fetchesInProgress === 0) {
                setLoading(false);
              }
            });
      },true, $scope);
    }

    function onResultsRetrieved(matches) {
      cache[term] = matches;
      if ((searchText || '') !== ($scope.searchText || '')) {
        return;
      }

      handleResults(matches);
    }
  }
  function updateMessages () {
    getCurrentDisplayValue().then(function (msg) {
      ctrl.messages = [ getCountMessage(), msg ];
    });
  }
  function getCountMessage () {
    if (lastCount === ctrl.matches.length) return '';
    lastCount = ctrl.matches.length;
    switch (ctrl.matches.length) {
      case 0:
        return 'There are no matches available.';
      case 1:
        return 'There is 1 match available.';
      default:
        return 'There are ' + ctrl.matches.length + ' matches available.';
    }
  }
  function updateScroll () {
    if (!elements.li[0]) return;
    var height = elements.li[0].offsetHeight,
        top = height * ctrl.index,
        bot = top + height,
        hgt = elements.scroller.clientHeight,
        scrollTop = elements.scroller.scrollTop;
    if (top < scrollTop) {
      scrollTo(top);
    } else if (bot > scrollTop + hgt) {
      scrollTo(bot - hgt);
    }
  }

  function isPromiseFetching() {
    return fetchesInProgress !== 0;
  }

  function scrollTo (offset) {
    elements.$.scrollContainer.controller('mdVirtualRepeatContainer').scrollTo(offset);
  }

  function notFoundVisible () {
    var textLength = (ctrl.scope.searchText || '').length;

    return ctrl.hasNotFound && !hasMatches() && (!ctrl.loading || isPromiseFetching()) && textLength >= getMinLength() && (hasFocus || noBlur) && !hasSelection();
  }
  function handleQuery () {
    var searchText = $scope.searchText || '';
    var term = searchText.toLowerCase();
    if (!$scope.noCache && cache[term]) {
      handleResults(cache[term]);
    } else {
      fetchResults(searchText);
    }

    ctrl.hidden = shouldHide();
  }
  function handleResults(results) {
    ctrl.matches = results;
    ctrl.hidden  = shouldHide();
    if (ctrl.loading) setLoading(false);

    if ($scope.selectOnMatch) selectItemOnMatch();

    updateMessages();
    positionDropdown();
  }
  function selectItemOnMatch () {
    var searchText = $scope.searchText,
        matches    = ctrl.matches,
        item       = matches[ 0 ];
    if (matches.length === 1) getDisplayValue(item).then(function (displayValue) {
      var isMatching = searchText == displayValue;
      if ($scope.matchInsensitive && !isMatching) {
        isMatching = searchText.toLowerCase() == displayValue.toLowerCase();
      }

      if (isMatching) select(0);
    });
  }
 function evalAttr(attr, locals) {
    if ($attrs[attr]) {
      $scope.$parent.$eval($attrs[attr], locals || {});
    }
  }

}

})();
(function(){
"use strict";


MdAutocomplete.$inject = ["$$mdSvgRegistry"];angular
    .module('material.components.autocomplete')
    .directive('mdAutocomplete', MdAutocomplete);

function MdAutocomplete ($$mdSvgRegistry) {

  return {
    controller:   'MdAutocompleteCtrl',
    controllerAs: '$mdAutocompleteCtrl',
    scope:        {
      inputName:        '@mdInputName',
      inputMinlength:   '@mdInputMinlength',
      inputMaxlength:   '@mdInputMaxlength',
      searchText:       '=?mdSearchText',
      selectedItem:     '=?mdSelectedItem',
      itemsExpr:        '@mdItems',
      itemText:         '&mdItemText',
      placeholder:      '@placeholder',
      noCache:          '=?mdNoCache',
      requireMatch:     '=?mdRequireMatch',
      selectOnMatch:    '=?mdSelectOnMatch',
      matchInsensitive: '=?mdMatchCaseInsensitive',
      itemChange:       '&?mdSelectedItemChange',
      textChange:       '&?mdSearchTextChange',
      minLength:        '=?mdMinLength',
      delay:            '=?mdDelay',
      autofocus:        '=?mdAutofocus',
      floatingLabel:    '@?mdFloatingLabel',
      autoselect:       '=?mdAutoselect',
      menuClass:        '@?mdMenuClass',
      inputId:          '@?mdInputId',
      escapeOptions:    '@?mdEscapeOptions'
    },
    link: function(scope, element, attrs, controller) {
      controller.hasNotFound = !!element.attr('md-has-not-found');
    },
    template:     function (element, attr) {
      var noItemsTemplate = getNoItemsTemplate(),
          itemTemplate    = getItemTemplate(),
          leftover        = element.html(),
          tabindex        = attr.tabindex;
      if (noItemsTemplate) element.attr('md-has-not-found', true);
      element.attr('tabindex', '-1');

      return '\
        <md-autocomplete-wrap\
            ng-class="{ \'md-whiteframe-z1\': !floatingLabel, \'md-menu-showing\': !$mdAutocompleteCtrl.hidden }">\
          ' + getInputElement() + '\
          <md-progress-linear\
              class="' + (attr.mdFloatingLabel ? 'md-inline' : '') + '"\
              ng-if="$mdAutocompleteCtrl.loadingIsVisible()"\
              md-mode="indeterminate"></md-progress-linear>\
          <md-virtual-repeat-container\
              md-auto-shrink\
              md-auto-shrink-min="1"\
              ng-mouseenter="$mdAutocompleteCtrl.listEnter()"\
              ng-mouseleave="$mdAutocompleteCtrl.listLeave()"\
              ng-mouseup="$mdAutocompleteCtrl.mouseUp()"\
              ng-hide="$mdAutocompleteCtrl.hidden"\
              class="md-autocomplete-suggestions-container md-whiteframe-z1"\
              ng-class="{ \'md-not-found\': $mdAutocompleteCtrl.notFoundVisible() }"\
              role="presentation">\
            <ul class="md-autocomplete-suggestions"\
                ng-class="::menuClass"\
                id="ul-{{$mdAutocompleteCtrl.id}}">\
              <li md-virtual-repeat="item in $mdAutocompleteCtrl.matches"\
                  ng-class="{ selected: $index === $mdAutocompleteCtrl.index }"\
                  ng-click="$mdAutocompleteCtrl.select($index)"\
                  md-extra-name="$mdAutocompleteCtrl.itemName">\
                  ' + itemTemplate + '\
                  </li>' + noItemsTemplate + '\
            </ul>\
          </md-virtual-repeat-container>\
        </md-autocomplete-wrap>\
        <aria-status\
            class="md-visually-hidden"\
            role="status"\
            aria-live="assertive">\
          <p ng-repeat="message in $mdAutocompleteCtrl.messages track by $index" ng-if="message">{{message}}</p>\
        </aria-status>';

      function getItemTemplate() {
        var templateTag = element.find('md-item-template').detach(),
            html = templateTag.length ? templateTag.html() : element.html();
        if (!templateTag.length) element.empty();
        return '<md-autocomplete-parent-scope md-autocomplete-replace>' + html + '</md-autocomplete-parent-scope>';
      }

      function getNoItemsTemplate() {
        var templateTag = element.find('md-not-found').detach(),
            template = templateTag.length ? templateTag.html() : '';
        return template
            ? '<li ng-if="$mdAutocompleteCtrl.notFoundVisible()"\
                         md-autocomplete-parent-scope>' + template + '</li>'
            : '';

      }

      function getInputElement () {
        if (attr.mdFloatingLabel) {
          return '\
            <md-input-container ng-if="floatingLabel">\
              <label>{{floatingLabel}}</label>\
              <input type="search"\
                  ' + (tabindex != null ? 'tabindex="' + tabindex + '"' : '') + '\
                  id="{{ inputId || \'fl-input-\' + $mdAutocompleteCtrl.id }}"\
                  name="{{inputName}}"\
                  autocomplete="off"\
                  ng-required="$mdAutocompleteCtrl.isRequired"\
                  ng-readonly="$mdAutocompleteCtrl.isReadonly"\
                  ng-minlength="inputMinlength"\
                  ng-maxlength="inputMaxlength"\
                  ng-disabled="$mdAutocompleteCtrl.isDisabled"\
                  ng-model="$mdAutocompleteCtrl.scope.searchText"\
                  ng-model-options="{ allowInvalid: true }"\
                  ng-keydown="$mdAutocompleteCtrl.keydown($event)"\
                  ng-blur="$mdAutocompleteCtrl.blur($event)"\
                  ng-focus="$mdAutocompleteCtrl.focus($event)"\
                  aria-owns="ul-{{$mdAutocompleteCtrl.id}}"\
                  ' + (attr.mdNoAsterisk != null ? 'md-no-asterisk="' + attr.mdNoAsterisk + '"' : '') + '\
                  ' + (attr.mdSelectOnFocus != null ? 'md-select-on-focus=""' : '') + '\
                  aria-label="{{floatingLabel}}"\
                  aria-autocomplete="list"\
                  role="combobox"\
                  aria-haspopup="true"\
                  aria-activedescendant=""\
                  aria-expanded="{{!$mdAutocompleteCtrl.hidden}}"/>\
              <div md-autocomplete-parent-scope md-autocomplete-replace>' + leftover + '</div>\
            </md-input-container>';
        } else {
          return '\
            <input type="search"\
                ' + (tabindex != null ? 'tabindex="' + tabindex + '"' : '') + '\
                id="{{ inputId || \'input-\' + $mdAutocompleteCtrl.id }}"\
                name="{{inputName}}"\
                ng-if="!floatingLabel"\
                autocomplete="off"\
                ng-required="$mdAutocompleteCtrl.isRequired"\
                ng-disabled="$mdAutocompleteCtrl.isDisabled"\
                ng-readonly="$mdAutocompleteCtrl.isReadonly"\
                ng-model="$mdAutocompleteCtrl.scope.searchText"\
                ng-keydown="$mdAutocompleteCtrl.keydown($event)"\
                ng-blur="$mdAutocompleteCtrl.blur($event)"\
                ng-focus="$mdAutocompleteCtrl.focus($event)"\
                placeholder="{{placeholder}}"\
                aria-owns="ul-{{$mdAutocompleteCtrl.id}}"\
                ' + (attr.mdSelectOnFocus != null ? 'md-select-on-focus=""' : '') + '\
                aria-label="{{placeholder}}"\
                aria-autocomplete="list"\
                role="combobox"\
                aria-haspopup="true"\
                aria-activedescendant=""\
                aria-expanded="{{!$mdAutocompleteCtrl.hidden}}"/>\
            <button\
                type="button"\
                tabindex="-1"\
                ng-if="$mdAutocompleteCtrl.scope.searchText && !$mdAutocompleteCtrl.isDisabled"\
                ng-click="$mdAutocompleteCtrl.clear($event)">\
              <md-icon md-svg-src="' + $$mdSvgRegistry.mdClose + '"></md-icon>\
              <span class="md-visually-hidden">Clear</span>\
            </button>\
                ';
        }
      }
    }
  };
}

})();
(function(){
"use strict";


MdAutocompleteItemScopeDirective.$inject = ["$compile", "$mdUtil"];angular
  .module('material.components.autocomplete')
  .directive('mdAutocompleteParentScope', MdAutocompleteItemScopeDirective);

function MdAutocompleteItemScopeDirective($compile, $mdUtil) {
  return {
    restrict: 'AE',
    compile: compile,
    terminal: true,
    transclude: 'element'
  };

  function compile(tElement, tAttr, transclude) {
    return function postLink(scope, element, attr) {
      var ctrl = scope.$mdAutocompleteCtrl;
      var newScope = ctrl.parent.$new();
      var itemName = ctrl.itemName;
      watchVariable('$index', '$index');
      watchVariable('item', itemName);
      connectScopes();
      transclude(newScope, function(clone) {
        element.after(clone);
      });
      function watchVariable(variable, alias) {
        newScope[alias] = scope[variable];

        scope.$watch(variable, function(value) {
          $mdUtil.nextTick(function() {
            newScope[alias] = value;
          });
        });
      }
      function connectScopes() {
        var scopeDigesting = false;
        var newScopeDigesting = false;

        scope.$watch(function() {
          if (newScopeDigesting || scopeDigesting) {
            return;
          }

          scopeDigesting = true;
          scope.$$postDigest(function() {
            if (!newScopeDigesting) {
              newScope.$digest();
            }

            scopeDigesting = newScopeDigesting = false;
          });
        });

        newScope.$watch(function() {
          newScopeDigesting = true;
        });
      }
    };
  }
}
})();
(function(){
"use strict";


MdHighlightCtrl.$inject = ["$scope", "$element", "$attrs"];angular
    .module('material.components.autocomplete')
    .controller('MdHighlightCtrl', MdHighlightCtrl);

function MdHighlightCtrl ($scope, $element, $attrs) {
  this.$scope = $scope;
  this.$element = $element;
  this.$attrs = $attrs;
  this.regex = null;
}

MdHighlightCtrl.prototype.init = function(unsafeTermFn, unsafeContentFn) {

  this.flags = this.$attrs.mdHighlightFlags || '';

  this.unregisterFn = this.$scope.$watch(function($scope) {
    return {
      term: unsafeTermFn($scope),
      contentText: unsafeContentFn($scope)
    };
  }.bind(this), this.onRender.bind(this), true);

  this.$element.on('$destroy', this.unregisterFn);
};
MdHighlightCtrl.prototype.onRender = function(state, prevState) {

  var contentText = state.contentText;
  if (this.regex === null || state.term !== prevState.term) {
    this.regex = this.createRegex(state.term, this.flags);
  }
  if (state.term) {
    this.applyRegex(contentText);
  } else {
    this.$element.text(contentText);
  }

};
MdHighlightCtrl.prototype.applyRegex = function(text) {
  var tokens = this.resolveTokens(text);

  this.$element.empty();

  tokens.forEach(function (token) {

    if (token.isMatch) {
      var tokenEl = angular.element('<span class="highlight">').text(token.text);

      this.$element.append(tokenEl);
    } else {
      this.$element.append(document.createTextNode(token));
    }

  }.bind(this));

};
MdHighlightCtrl.prototype.resolveTokens = function(string) {
  var tokens = [];
  var lastIndex = 0;
  string.replace(this.regex, function(match, index) {
    appendToken(lastIndex, index);

    tokens.push({
      text: match,
      isMatch: true
    });

    lastIndex = index + match.length;
  });
  appendToken(lastIndex);

  return tokens;

  function appendToken(from, to) {
    var targetText = string.slice(from, to);
    targetText && tokens.push(targetText);
  }
};
MdHighlightCtrl.prototype.createRegex = function(term, flags) {
  var startFlag = '', endFlag = '';
  var regexTerm = this.sanitizeRegex(term);

  if (flags.indexOf('^') >= 0) startFlag = '^';
  if (flags.indexOf('$') >= 0) endFlag = '$';

  return new RegExp(startFlag + regexTerm + endFlag, flags.replace(/[$\^]/g, ''));
};
MdHighlightCtrl.prototype.sanitizeRegex = function(term) {
  return term && term.toString().replace(/[\\\^\$\*\+\?\.\(\)\|\{}\[\]]/g, '\\$&');
};

})();
(function(){
"use strict";


MdHighlight.$inject = ["$interpolate", "$parse"];angular
    .module('material.components.autocomplete')
    .directive('mdHighlightText', MdHighlight);

function MdHighlight ($interpolate, $parse) {
  return {
    terminal: true,
    controller: 'MdHighlightCtrl',
    compile: function mdHighlightCompile(tElement, tAttr) {
      var termExpr = $parse(tAttr.mdHighlightText);
      var unsafeContentExpr = $interpolate(tElement.html());

      return function mdHighlightLink(scope, element, attr, ctrl) {
        ctrl.init(termExpr, unsafeContentExpr);
      };
    }
  };
}

})();
(function(){
"use strict";


MdChipCtrl.$inject = ["$scope", "$element", "$mdConstant", "$timeout", "$mdUtil"];angular
  .module('material.components.chips')
  .controller('MdChipCtrl', MdChipCtrl);
function MdChipCtrl ($scope, $element, $mdConstant, $timeout, $mdUtil) {
  this.$scope = $scope;
  this.$element = $element;
  this.$mdConstant = $mdConstant;
  this.$timeout = $timeout;
  this.$mdUtil = $mdUtil;
  this.isEditting = false;
  this.parentController = undefined;
  this.enableChipEdit = false;
}
MdChipCtrl.prototype.init = function(controller) {
  this.parentController = controller;
  this.enableChipEdit = this.parentController.enableChipEdit;

  if (this.enableChipEdit) {
    this.$element.on('keydown', this.chipKeyDown.bind(this));
    this.$element.on('mousedown', this.chipMouseDown.bind(this));
    this.getChipContent().addClass('_md-chip-content-edit-is-enabled');
  }
};
MdChipCtrl.prototype.getChipContent = function() {
  var chipContents = this.$element[0].getElementsByClassName('md-chip-content');
  return angular.element(chipContents[0]);
};
MdChipCtrl.prototype.getContentElement = function() {
  return angular.element(this.getChipContent().children()[0]);
};
MdChipCtrl.prototype.getChipIndex = function() {
  return parseInt(this.$element.attr('index'));
};
MdChipCtrl.prototype.goOutOfEditMode = function() {
  if (!this.isEditting) return;

  this.isEditting = false;
  this.$element.removeClass('_md-chip-editing');
  this.getChipContent()[0].contentEditable = 'false';
  var chipIndex = this.getChipIndex();

  var content = this.getContentElement().text();
  if (content) {
    this.parentController.updateChipContents(
        chipIndex,
        this.getContentElement().text()
    );

    this.$mdUtil.nextTick(function() {
      if (this.parentController.selectedChip === chipIndex) {
        this.parentController.focusChip(chipIndex);
      }
    }.bind(this));
  } else {
    this.parentController.removeChipAndFocusInput(chipIndex);
  }
};
MdChipCtrl.prototype.selectNodeContents = function(node) {
  var range, selection;
  if (document.body.createTextRange) {
    range = document.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    selection = window.getSelection();
    range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};
MdChipCtrl.prototype.goInEditMode = function() {
  this.isEditting = true;
  this.$element.addClass('_md-chip-editing');
  this.getChipContent()[0].contentEditable = 'true';
  this.getChipContent().on('blur', function() {
    this.goOutOfEditMode();
  }.bind(this));

  this.selectNodeContents(this.getChipContent()[0]);
};
MdChipCtrl.prototype.chipKeyDown = function(event) {
  if (!this.isEditting &&
    (event.keyCode === this.$mdConstant.KEY_CODE.ENTER ||
    event.keyCode === this.$mdConstant.KEY_CODE.SPACE)) {
    event.preventDefault();
    this.goInEditMode();
  } else if (this.isEditting &&
    event.keyCode === this.$mdConstant.KEY_CODE.ENTER) {
    event.preventDefault();
    this.goOutOfEditMode();
  }
};
MdChipCtrl.prototype.chipMouseDown = function() {
  if(this.getChipIndex() == this.parentController.selectedChip &&
    this.enableChipEdit &&
    !this.isEditting) {
    this.goInEditMode();
  }
};

})();
(function(){
"use strict";


MdChip.$inject = ["$mdTheming", "$mdUtil"];angular
    .module('material.components.chips')
    .directive('mdChip', MdChip);
var DELETE_HINT_TEMPLATE = '\
    <span ng-if="!$mdChipsCtrl.readonly" class="md-visually-hidden">\
      {{$mdChipsCtrl.deleteHint}}\
    </span>';
function MdChip($mdTheming, $mdUtil) {
  var hintTemplate = $mdUtil.processTemplate(DELETE_HINT_TEMPLATE);

  return {
    restrict: 'E',
    require: ['^?mdChips', 'mdChip'],
    compile:  compile,
    controller: 'MdChipCtrl'
  };

  function compile(element, attr) {
    element.append($mdUtil.processTemplate(hintTemplate));

    return function postLink(scope, element, attr, ctrls) {
      var chipsController = ctrls.shift();
      var chipController  = ctrls.shift();
      $mdTheming(element);

      if (chipsController) {
        chipController.init(chipsController);

        angular
          .element(element[0]
          .querySelector('.md-chip-content'))
          .on('blur', function () {
            chipsController.resetSelectedChip();
            chipsController.$scope.$applyAsync();
          });
      }
    };
  }
}

})();
(function(){
"use strict";


MdChipRemove.$inject = ["$timeout"];angular
    .module('material.components.chips')
    .directive('mdChipRemove', MdChipRemove);
function MdChipRemove ($timeout) {
  return {
    restrict: 'A',
    require: '^mdChips',
    scope: false,
    link: postLink
  };

  function postLink(scope, element, attr, ctrl) {
    element.on('click', function(event) {
      scope.$apply(function() {
        ctrl.removeChip(scope.$$replacedScope.$index);
      });
    });
    $timeout(function() {
      element.attr({ tabindex: -1, 'aria-hidden': true });
      element.find('button').attr('tabindex', '-1');
    });
  }
}

})();
(function(){
"use strict";


MdChipTransclude.$inject = ["$compile"];angular
    .module('material.components.chips')
    .directive('mdChipTransclude', MdChipTransclude);

function MdChipTransclude ($compile) {
  return {
    restrict: 'EA',
    terminal: true,
    link: link,
    scope: false
  };
  function link (scope, element, attr) {
    var ctrl = scope.$parent.$mdChipsCtrl,
        newScope = ctrl.parent.$new(false, ctrl.parent);
    newScope.$$replacedScope = scope;
    newScope.$chip = scope.$chip;
    newScope.$index = scope.$index;
    newScope.$mdChipsCtrl = ctrl;

    var newHtml = ctrl.$scope.$eval(attr.mdChipTransclude);

    element.html(newHtml);
    $compile(element.contents())(newScope);
  }
}

})();
(function(){
"use strict";


MdChipsCtrl.$inject = ["$scope", "$attrs", "$mdConstant", "$log", "$element", "$timeout", "$mdUtil"];angular
    .module('material.components.chips')
    .controller('MdChipsCtrl', MdChipsCtrl);
function MdChipsCtrl ($scope, $attrs, $mdConstant, $log, $element, $timeout, $mdUtil) {
  this.$timeout = $timeout;
  this.$mdConstant = $mdConstant;
  this.$scope = $scope;
  this.parent = $scope.$parent;
  this.$log = $log;
  this.$element = $element;
  this.ngModelCtrl = null;
  this.userInputNgModelCtrl = null;
  this.autocompleteCtrl = null;
  this.userInputElement = null;
  this.items = [];
  this.selectedChip = -1;
  this.enableChipEdit = $mdUtil.parseAttributeBoolean($attrs.mdEnableChipEdit);
  this.addOnBlur = $mdUtil.parseAttributeBoolean($attrs.mdAddOnBlur);
  this.deleteHint = 'Press delete to remove this chip.';
  this.deleteButtonLabel = 'Remove';
  this.chipBuffer = '';
  this.useTransformChip = false;
  this.useOnAdd = false;
  this.useOnRemove = false;
}
MdChipsCtrl.prototype.inputKeydown = function(event) {
  var chipBuffer = this.getChipBuffer();
  if (this.autocompleteCtrl && event.isDefaultPrevented && event.isDefaultPrevented()) {
    return;
  }

  if (event.keyCode === this.$mdConstant.KEY_CODE.BACKSPACE) {
    if (this.getCursorPosition(event.target) !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (this.items.length) {
      this.selectAndFocusChipSafe(this.items.length - 1);
    }

    return;
  }
  if (!this.separatorKeys || this.separatorKeys.length < 1) {
    this.separatorKeys = [this.$mdConstant.KEY_CODE.ENTER];
  }
  if (this.separatorKeys.indexOf(event.keyCode) !== -1) {
    if ((this.autocompleteCtrl && this.requireMatch) || !chipBuffer) return;
    event.preventDefault();
    if (this.hasMaxChipsReached()) return;

    this.appendChip(chipBuffer.trim());
    this.resetChipBuffer();
  }
};
MdChipsCtrl.prototype.getCursorPosition = function(element) {
  try {
    if (element.selectionStart === element.selectionEnd) {
      return element.selectionStart;
    }
  } catch (e) {
    if (!element.value) {
      return 0;
    }
  }
};
MdChipsCtrl.prototype.updateChipContents = function(chipIndex, chipContents){
  if(chipIndex >= 0 && chipIndex < this.items.length) {
    this.items[chipIndex] = chipContents;
    this.ngModelCtrl.$setDirty();
  }
};
MdChipsCtrl.prototype.isEditingChip = function() {
  return !!this.$element[0].getElementsByClassName('_md-chip-editing').length;
};


MdChipsCtrl.prototype.isRemovable = function() {
  if (!this.ngModelCtrl) {
    return false;
  }

  return this.readonly ? this.removable :
         angular.isDefined(this.removable) ? this.removable : true;
};
MdChipsCtrl.prototype.chipKeydown = function (event) {
  if (this.getChipBuffer()) return;
  if (this.isEditingChip()) return;
  
  switch (event.keyCode) {
    case this.$mdConstant.KEY_CODE.BACKSPACE:
    case this.$mdConstant.KEY_CODE.DELETE:
      if (this.selectedChip < 0) return;
      event.preventDefault();
      if (!this.isRemovable()) return;
      this.removeAndSelectAdjacentChip(this.selectedChip);
      break;
    case this.$mdConstant.KEY_CODE.LEFT_ARROW:
      event.preventDefault();
      if (this.selectedChip < 0) this.selectedChip = this.items.length;
      if (this.items.length) this.selectAndFocusChipSafe(this.selectedChip - 1);
      break;
    case this.$mdConstant.KEY_CODE.RIGHT_ARROW:
      event.preventDefault();
      this.selectAndFocusChipSafe(this.selectedChip + 1);
      break;
    case this.$mdConstant.KEY_CODE.ESCAPE:
    case this.$mdConstant.KEY_CODE.TAB:
      if (this.selectedChip < 0) return;
      event.preventDefault();
      this.onFocus();
      break;
  }
};
MdChipsCtrl.prototype.getPlaceholder = function() {
  var useSecondary = (this.items && this.items.length &&
      (this.secondaryPlaceholder == '' || this.secondaryPlaceholder));
  return useSecondary ? this.secondaryPlaceholder : this.placeholder;
};
MdChipsCtrl.prototype.removeAndSelectAdjacentChip = function(index) {
  var selIndex = this.getAdjacentChipIndex(index);
  this.removeChip(index);
  this.$timeout(angular.bind(this, function () {
      this.selectAndFocusChipSafe(selIndex);
  }));
};
MdChipsCtrl.prototype.resetSelectedChip = function() {
  this.selectedChip = -1;
};
MdChipsCtrl.prototype.getAdjacentChipIndex = function(index) {
  var len = this.items.length - 1;
  return (len == 0) ? -1 :
      (index == len) ? index -1 : index;
};
MdChipsCtrl.prototype.appendChip = function(newChip) {
  if (this.useTransformChip && this.transformChip) {
    var transformedChip = this.transformChip({'$chip': newChip});
    if (angular.isDefined(transformedChip)) {
      newChip = transformedChip;
    }
  }
  if (angular.isObject(newChip)){
    var identical = this.items.some(function(item){
      return angular.equals(newChip, item);
    });
    if (identical) return;
  }
  if (newChip == null || this.items.indexOf(newChip) + 1) return;
  var index = this.items.push(newChip);
  this.ngModelCtrl.$setDirty();
  this.validateModel();
  if (this.useOnAdd && this.onAdd) {
    this.onAdd({ '$chip': newChip, '$index': index });
  }
};
MdChipsCtrl.prototype.useTransformChipExpression = function() {
  this.useTransformChip = true;
};
MdChipsCtrl.prototype.useOnAddExpression = function() {
  this.useOnAdd = true;
};
MdChipsCtrl.prototype.useOnRemoveExpression = function() {
  this.useOnRemove = true;
};
MdChipsCtrl.prototype.useOnSelectExpression = function() {
  this.useOnSelect = true;
};
MdChipsCtrl.prototype.getChipBuffer = function() {
  return !this.userInputElement ? this.chipBuffer :
      this.userInputNgModelCtrl ? this.userInputNgModelCtrl.$viewValue :
          this.userInputElement[0].value;
};
MdChipsCtrl.prototype.resetChipBuffer = function() {
  if (this.userInputElement) {
    if (this.userInputNgModelCtrl) {
      this.userInputNgModelCtrl.$setViewValue('');
      this.userInputNgModelCtrl.$render();
    } else {
      this.userInputElement[0].value = '';
    }
  } else {
    this.chipBuffer = '';
  }
};

MdChipsCtrl.prototype.hasMaxChipsReached = function() {
  if (angular.isString(this.maxChips)) this.maxChips = parseInt(this.maxChips, 10) || 0;

  return this.maxChips > 0 && this.items.length >= this.maxChips;
};
MdChipsCtrl.prototype.validateModel = function() {
  this.ngModelCtrl.$setValidity('md-max-chips', !this.hasMaxChipsReached());
};
MdChipsCtrl.prototype.removeChip = function(index) {
  var removed = this.items.splice(index, 1);
  this.ngModelCtrl.$setDirty();
  this.validateModel();

  if (removed && removed.length && this.useOnRemove && this.onRemove) {
    this.onRemove({ '$chip': removed[0], '$index': index });
  }
};

MdChipsCtrl.prototype.removeChipAndFocusInput = function (index) {
  this.removeChip(index);

  if (this.autocompleteCtrl) {
    this.autocompleteCtrl.hidden = true;
    this.$mdUtil.nextTick(this.onFocus.bind(this));
  } else {
    this.onFocus();
  }

};
MdChipsCtrl.prototype.selectAndFocusChipSafe = function(index) {
  if (!this.items.length) {
    this.selectChip(-1);
    this.onFocus();
    return;
  }
  if (index === this.items.length) return this.onFocus();
  index = Math.max(index, 0);
  index = Math.min(index, this.items.length - 1);
  this.selectChip(index);
  this.focusChip(index);
};
MdChipsCtrl.prototype.selectChip = function(index) {
  if (index >= -1 && index <= this.items.length) {
    this.selectedChip = index;
    if (this.useOnSelect && this.onSelect) {
      this.onSelect({'$chip': this.items[this.selectedChip] });
    }
  } else {
    this.$log.warn('Selected Chip index out of bounds; ignoring.');
  }
};
MdChipsCtrl.prototype.selectAndFocusChip = function(index) {
  this.selectChip(index);
  if (index != -1) {
    this.focusChip(index);
  }
};
MdChipsCtrl.prototype.focusChip = function(index) {
  this.$element[0].querySelector('md-chip[index="' + index + '"] .md-chip-content').focus();
};
MdChipsCtrl.prototype.configureNgModel = function(ngModelCtrl) {
  this.ngModelCtrl = ngModelCtrl;

  var self = this;
  ngModelCtrl.$render = function() {
    self.items = self.ngModelCtrl.$viewValue;
  };
};

MdChipsCtrl.prototype.onFocus = function () {
  var input = this.$element[0].querySelector('input');
  input && input.focus();
  this.resetSelectedChip();
};

MdChipsCtrl.prototype.onInputFocus = function () {
  this.inputHasFocus = true;
  this.resetSelectedChip();
};

MdChipsCtrl.prototype.onInputBlur = function () {
  this.inputHasFocus = false;

  var chipBuffer = this.getChipBuffer().trim();
  this.validateModel();

  var isModelValid = this.ngModelCtrl.$valid;

  if (this.userInputNgModelCtrl) {
    isModelValid &= this.userInputNgModelCtrl.$valid;
  }
  if (this.addOnBlur && chipBuffer && isModelValid) {
    this.appendChip(chipBuffer);
    this.resetChipBuffer();
  }
};
MdChipsCtrl.prototype.configureUserInput = function(inputElement) {
  this.userInputElement = inputElement;
  var ngModelCtrl = inputElement.controller('ngModel');
  if (ngModelCtrl != this.ngModelCtrl) {
    this.userInputNgModelCtrl = ngModelCtrl;
  }

  var scope = this.$scope;
  var ctrl = this;
  var scopeApplyFn = function(event, fn) {
    scope.$evalAsync(angular.bind(ctrl, fn, event));
  };
  inputElement
      .attr({ tabindex: 0 })
      .on('keydown', function(event) { scopeApplyFn(event, ctrl.inputKeydown) })
      .on('focus', function(event) { scopeApplyFn(event, ctrl.onInputFocus) })
      .on('blur', function(event) { scopeApplyFn(event, ctrl.onInputBlur) })
};

MdChipsCtrl.prototype.configureAutocomplete = function(ctrl) {
  if (ctrl) {
    this.autocompleteCtrl = ctrl;

    ctrl.registerSelectedItemWatcher(angular.bind(this, function (item) {
      if (item) {
        if (this.hasMaxChipsReached()) return;

        this.appendChip(item);
        this.resetChipBuffer();
      }
    }));

    this.$element.find('input')
        .on('focus',angular.bind(this, this.onInputFocus) )
        .on('blur', angular.bind(this, this.onInputBlur) );
  }
};

MdChipsCtrl.prototype.hasFocus = function () {
  return this.inputHasFocus || this.selectedChip >= 0;
};

})();
(function(){
"use strict";

  
  MdChips.$inject = ["$mdTheming", "$mdUtil", "$compile", "$log", "$timeout", "$$mdSvgRegistry"];angular
      .module('material.components.chips')
      .directive('mdChips', MdChips);


  var MD_CHIPS_TEMPLATE = '\
      <md-chips-wrap\
          ng-keydown="$mdChipsCtrl.chipKeydown($event)"\
          ng-class="{ \'md-focused\': $mdChipsCtrl.hasFocus(), \
                      \'md-readonly\': !$mdChipsCtrl.ngModelCtrl || $mdChipsCtrl.readonly,\
                      \'md-removable\': $mdChipsCtrl.isRemovable() }"\
          class="md-chips">\
        <md-chip ng-repeat="$chip in $mdChipsCtrl.items"\
            index="{{$index}}"\
            ng-class="{\'md-focused\': $mdChipsCtrl.selectedChip == $index, \'md-readonly\': !$mdChipsCtrl.ngModelCtrl || $mdChipsCtrl.readonly}">\
          <div class="md-chip-content"\
              tabindex="-1"\
              aria-hidden="true"\
              ng-click="!$mdChipsCtrl.readonly && $mdChipsCtrl.focusChip($index)"\
              ng-focus="!$mdChipsCtrl.readonly && $mdChipsCtrl.selectChip($index)"\
              md-chip-transclude="$mdChipsCtrl.chipContentsTemplate"></div>\
          <div ng-if="$mdChipsCtrl.isRemovable()"\
               class="md-chip-remove-container"\
               md-chip-transclude="$mdChipsCtrl.chipRemoveTemplate"></div>\
        </md-chip>\
        <div class="md-chip-input-container" ng-if="!$mdChipsCtrl.readonly && $mdChipsCtrl.ngModelCtrl">\
          <div md-chip-transclude="$mdChipsCtrl.chipInputTemplate"></div>\
        </div>\
      </md-chips-wrap>';

  var CHIP_INPUT_TEMPLATE = '\
        <input\
            class="md-input"\
            tabindex="0"\
            placeholder="{{$mdChipsCtrl.getPlaceholder()}}"\
            aria-label="{{$mdChipsCtrl.getPlaceholder()}}"\
            ng-model="$mdChipsCtrl.chipBuffer"\
            ng-focus="$mdChipsCtrl.onInputFocus()"\
            ng-blur="$mdChipsCtrl.onInputBlur()"\
            ng-keydown="$mdChipsCtrl.inputKeydown($event)">';

  var CHIP_DEFAULT_TEMPLATE = '\
      <span>{{$chip}}</span>';

  var CHIP_REMOVE_TEMPLATE = '\
      <button\
          class="md-chip-remove"\
          ng-if="$mdChipsCtrl.isRemovable()"\
          ng-click="$mdChipsCtrl.removeChipAndFocusInput($$replacedScope.$index)"\
          type="button"\
          aria-hidden="true"\
          tabindex="-1">\
        <md-icon md-svg-src="{{ $mdChipsCtrl.mdCloseIcon }}"></md-icon>\
        <span class="md-visually-hidden">\
          {{$mdChipsCtrl.deleteButtonLabel}}\
        </span>\
      </button>';
  function MdChips ($mdTheming, $mdUtil, $compile, $log, $timeout, $$mdSvgRegistry) {
    var templates = getTemplates();

    return {
      template: function(element, attrs) {
        attrs['$mdUserTemplate'] = element.clone();
        return templates.chips;
      },
      require: ['mdChips'],
      restrict: 'E',
      controller: 'MdChipsCtrl',
      controllerAs: '$mdChipsCtrl',
      bindToController: true,
      compile: compile,
      scope: {
        readonly: '=readonly',
        removable: '=mdRemovable',
        placeholder: '@',
        secondaryPlaceholder: '@',
        maxChips: '@mdMaxChips',
        transformChip: '&mdTransformChip',
        onAppend: '&mdOnAppend',
        onAdd: '&mdOnAdd',
        onRemove: '&mdOnRemove',
        onSelect: '&mdOnSelect',
        deleteHint: '@',
        deleteButtonLabel: '@',
        separatorKeys: '=?mdSeparatorKeys',
        requireMatch: '=?mdRequireMatch'
      }
    };
    function compile(element, attr) {
      var userTemplate = attr['$mdUserTemplate'];
      attr['$mdUserTemplate'] = null;

      var chipTemplate = getTemplateByQuery('md-chips>md-chip-template');

      var chipRemoveSelector = $mdUtil
        .prefixer()
        .buildList('md-chip-remove')
        .map(function(attr) {
          return 'md-chips>*[' + attr + ']';
        })
        .join(',');
      var chipRemoveTemplate   = getTemplateByQuery(chipRemoveSelector) || templates.remove,
          chipContentsTemplate = chipTemplate || templates.default,
          chipInputTemplate    = getTemplateByQuery('md-chips>md-autocomplete')
              || getTemplateByQuery('md-chips>input')
              || templates.input,
          staticChips = userTemplate.find('md-chip');
      if (userTemplate[0].querySelector('md-chip-template>*[md-chip-remove]')) {
        $log.warn('invalid placement of md-chip-remove within md-chip-template.');
      }

      function getTemplateByQuery (query) {
        if (!attr.ngModel) return;
        var element = userTemplate[0].querySelector(query);
        return element && element.outerHTML;
      }
      return function postLink(scope, element, attrs, controllers) {
        $mdUtil.initOptionalProperties(scope, attr);

        $mdTheming(element);
        var mdChipsCtrl = controllers[0];
        if(chipTemplate) {
          mdChipsCtrl.enableChipEdit = false;
        }

        mdChipsCtrl.chipContentsTemplate = chipContentsTemplate;
        mdChipsCtrl.chipRemoveTemplate   = chipRemoveTemplate;
        mdChipsCtrl.chipInputTemplate    = chipInputTemplate;

        mdChipsCtrl.mdCloseIcon = $$mdSvgRegistry.mdClose;

        element
            .attr({ 'aria-hidden': true, tabindex: -1 })
            .on('focus', function () { mdChipsCtrl.onFocus(); });

        if (attr.ngModel) {
          mdChipsCtrl.configureNgModel(element.controller('ngModel'));
          if (attrs.mdTransformChip) mdChipsCtrl.useTransformChipExpression();
          if (attrs.mdOnAppend) mdChipsCtrl.useOnAppendExpression();
          if (attrs.mdOnAdd) mdChipsCtrl.useOnAddExpression();
          if (attrs.mdOnRemove) mdChipsCtrl.useOnRemoveExpression();
          if (attrs.mdOnSelect) mdChipsCtrl.useOnSelectExpression();
          if (chipInputTemplate != templates.input) {
            scope.$watch('$mdChipsCtrl.readonly', function(readonly) {
              if (!readonly) {

                $mdUtil.nextTick(function(){

                  if (chipInputTemplate.indexOf('<md-autocomplete') === 0) {
                    var autocompleteEl = element.find('md-autocomplete');
                    mdChipsCtrl.configureAutocomplete(autocompleteEl.controller('mdAutocomplete'));
                  }

                  mdChipsCtrl.configureUserInput(element.find('input'));
                });
              }
            });
          }
          $mdUtil.nextTick(function() {
            var input = element.find('input');

            input && input.toggleClass('md-input', true);
          });
        }
        if (staticChips.length > 0) {
          var compiledStaticChips = $compile(staticChips.clone())(scope.$parent);
          $timeout(function() { element.find('md-chips-wrap').prepend(compiledStaticChips); });
        }
      };
    }

    function getTemplates() {
      return {
        chips: $mdUtil.processTemplate(MD_CHIPS_TEMPLATE),
        input: $mdUtil.processTemplate(CHIP_INPUT_TEMPLATE),
        default: $mdUtil.processTemplate(CHIP_DEFAULT_TEMPLATE),
        remove: $mdUtil.processTemplate(CHIP_REMOVE_TEMPLATE)
      };
    }
  }

})();
(function(){
"use strict";

angular
    .module('material.components.chips')
    .controller('MdContactChipsCtrl', MdContactChipsCtrl);
function MdContactChipsCtrl () {
  this.selectedItem = null;
  this.searchText = '';
}


MdContactChipsCtrl.prototype.queryContact = function(searchText) {
  var results = this.contactQuery({'$query': searchText});
  return this.filterSelected ?
      results.filter(angular.bind(this, this.filterSelectedContacts)) : results;
};


MdContactChipsCtrl.prototype.itemName = function(item) {
  return item[this.contactName];
};


MdContactChipsCtrl.prototype.filterSelectedContacts = function(contact) {
  return this.contacts.indexOf(contact) == -1;
};

})();
(function(){
"use strict";


MdContactChips.$inject = ["$mdTheming", "$mdUtil"];angular
  .module('material.components.chips')
  .directive('mdContactChips', MdContactChips);


var MD_CONTACT_CHIPS_TEMPLATE = '\
      <md-chips class="md-contact-chips"\
          ng-model="$mdContactChipsCtrl.contacts"\
          md-require-match="$mdContactChipsCtrl.requireMatch"\
          md-autocomplete-snap>\
          <md-autocomplete\
              md-menu-class="md-contact-chips-suggestions"\
              md-selected-item="$mdContactChipsCtrl.selectedItem"\
              md-search-text="$mdContactChipsCtrl.searchText"\
              md-items="item in $mdContactChipsCtrl.queryContact($mdContactChipsCtrl.searchText)"\
              md-item-text="$mdContactChipsCtrl.itemName(item)"\
              md-no-cache="true"\
              md-autoselect\
              placeholder="{{$mdContactChipsCtrl.contacts.length == 0 ?\
                  $mdContactChipsCtrl.placeholder : $mdContactChipsCtrl.secondaryPlaceholder}}">\
            <div class="md-contact-suggestion">\
              <img \
                  ng-src="{{item[$mdContactChipsCtrl.contactImage]}}"\
                  alt="{{item[$mdContactChipsCtrl.contactName]}}"\
                  ng-if="item[$mdContactChipsCtrl.contactImage]" />\
              <span class="md-contact-name" md-highlight-text="$mdContactChipsCtrl.searchText"\
                    md-highlight-flags="{{$mdContactChipsCtrl.highlightFlags}}">\
                {{item[$mdContactChipsCtrl.contactName]}}\
              </span>\
              <span class="md-contact-email" >{{item[$mdContactChipsCtrl.contactEmail]}}</span>\
            </div>\
          </md-autocomplete>\
          <md-chip-template>\
            <div class="md-contact-avatar">\
              <img \
                  ng-src="{{$chip[$mdContactChipsCtrl.contactImage]}}"\
                  alt="{{$chip[$mdContactChipsCtrl.contactName]}}"\
                  ng-if="$chip[$mdContactChipsCtrl.contactImage]" />\
            </div>\
            <div class="md-contact-name">\
              {{$chip[$mdContactChipsCtrl.contactName]}}\
            </div>\
          </md-chip-template>\
      </md-chips>';
function MdContactChips($mdTheming, $mdUtil) {
  return {
    template: function(element, attrs) {
      return MD_CONTACT_CHIPS_TEMPLATE;
    },
    restrict: 'E',
    controller: 'MdContactChipsCtrl',
    controllerAs: '$mdContactChipsCtrl',
    bindToController: true,
    compile: compile,
    scope: {
      contactQuery: '&mdContacts',
      placeholder: '@',
      secondaryPlaceholder: '@',
      contactName: '@mdContactName',
      contactImage: '@mdContactImage',
      contactEmail: '@mdContactEmail',
      contacts: '=ngModel',
      requireMatch: '=?mdRequireMatch',
      highlightFlags: '@?mdHighlightFlags'
    }
  };

  function compile(element, attr) {
    return function postLink(scope, element, attrs, controllers) {

      $mdUtil.initOptionalProperties(scope, attr);
      $mdTheming(element);

      element.attr('tabindex', '-1');
    };
  }
}

})();
(function(){
"use strict";

(function() {
  'use strict';
  CalendarCtrl.$inject = ["$element", "$scope", "$$mdDateUtil", "$mdUtil", "$mdConstant", "$mdTheming", "$$rAF", "$attrs", "$mdDateLocale"];
  angular.module('material.components.datepicker')
    .directive('mdCalendar', calendarDirective);

  function calendarDirective() {
    return {
      template: function(tElement, tAttr) {
        var extraAttrs = tAttr.hasOwnProperty('ngIf') ? '' : 'ng-if="calendarCtrl.isInitialized"';
        var template = '' +
          '<div ng-switch="calendarCtrl.currentView" ' + extraAttrs + '>' +
            '<md-calendar-year ng-switch-when="year"></md-calendar-year>' +
            '<md-calendar-month ng-switch-default></md-calendar-month>' +
          '</div>';

        return template;
      },
      scope: {
        minDate: '=mdMinDate',
        maxDate: '=mdMaxDate',
        dateFilter: '=mdDateFilter',
        _currentView: '@mdCurrentView'
      },
      require: ['ngModel', 'mdCalendar'],
      controller: CalendarCtrl,
      controllerAs: 'calendarCtrl',
      bindToController: true,
      link: function(scope, element, attrs, controllers) {
        var ngModelCtrl = controllers[0];
        var mdCalendarCtrl = controllers[1];
        mdCalendarCtrl.configureNgModel(ngModelCtrl);
      }
    };
  }
  var FALLBACK_WIDTH = 340;
  var nextUniqueId = 0;
  function CalendarCtrl($element, $scope, $$mdDateUtil, $mdUtil,
    $mdConstant, $mdTheming, $$rAF, $attrs, $mdDateLocale) {

    $mdTheming($element);
    this.$element = $element;
    this.$scope = $scope;
    this.dateUtil = $$mdDateUtil;
    this.$mdUtil = $mdUtil;
    this.keyCode = $mdConstant.KEY_CODE;
    this.$$rAF = $$rAF;
    this.today = this.dateUtil.createDateAtMidnight();
    this.ngModelCtrl = null;
    this.currentView = this._currentView || 'month';
    this.SELECTED_DATE_CLASS = 'md-calendar-selected-date';
    this.TODAY_CLASS = 'md-calendar-date-today';
    this.FOCUSED_DATE_CLASS = 'md-focus';
    this.id = nextUniqueId++;
    this.displayDate = null;
    this.selectedDate = null;
    this.firstRenderableDate = null;
    this.lastRenderableDate = null;
    this.isInitialized = false;
    this.width = 0;
    this.scrollbarWidth = 0;
    if (!$attrs.tabindex) {
      $element.attr('tabindex', '-1');
    }

    var boundKeyHandler = angular.bind(this, this.handleKeyEvent);
    angular.element(document.body).on('keydown', boundKeyHandler);

    $scope.$on('$destroy', function() {
      angular.element(document.body).off('keydown', boundKeyHandler);
    });

    if (this.minDate && this.minDate > $mdDateLocale.firstRenderableDate) {
      this.firstRenderableDate = this.minDate;
    } else {
      this.firstRenderableDate = $mdDateLocale.firstRenderableDate;
    }

    if (this.maxDate && this.maxDate < $mdDateLocale.lastRenderableDate) {
      this.lastRenderableDate = this.maxDate;
    } else {
      this.lastRenderableDate = $mdDateLocale.lastRenderableDate;
    }
  }
  CalendarCtrl.prototype.configureNgModel = function(ngModelCtrl) {
    var self = this;

    self.ngModelCtrl = ngModelCtrl;

    self.$mdUtil.nextTick(function() {
      self.isInitialized = true;
    });

    ngModelCtrl.$render = function() {
      var value = this.$viewValue;
      self.$scope.$broadcast('md-calendar-parent-changed', value);
      if (!self.selectedDate) {
        self.selectedDate = value;
      }
      if (!self.displayDate) {
        self.displayDate = self.selectedDate || self.today;
      }
    };
  };
  CalendarCtrl.prototype.setNgModelValue = function(date) {
    var value = this.dateUtil.createDateAtMidnight(date);
    this.focus(value);
    this.$scope.$emit('md-calendar-change', value);
    this.ngModelCtrl.$setViewValue(value);
    this.ngModelCtrl.$render();
    return value;
  };
  CalendarCtrl.prototype.setCurrentView = function(newView, time) {
    var self = this;

    self.$mdUtil.nextTick(function() {
      self.currentView = newView;

      if (time) {
        self.displayDate = angular.isDate(time) ? time : new Date(time);
      }
    });
  };
  CalendarCtrl.prototype.focus = function(date) {
    if (this.dateUtil.isValidDate(date)) {
      var previousFocus = this.$element[0].querySelector('.md-focus');
      if (previousFocus) {
        previousFocus.classList.remove(this.FOCUSED_DATE_CLASS);
      }

      var cellId = this.getDateId(date, this.currentView);
      var cell = document.getElementById(cellId);
      if (cell) {
        cell.classList.add(this.FOCUSED_DATE_CLASS);
        cell.focus();
        this.displayDate = date;
      }
    } else {
      var rootElement = this.$element[0].querySelector('[ng-switch]');

      if (rootElement) {
        rootElement.focus();
      }
    }
  };
  CalendarCtrl.prototype.getActionFromKeyEvent = function(event) {
    var keyCode = this.keyCode;

    switch (event.which) {
      case keyCode.ENTER: return 'select';

      case keyCode.RIGHT_ARROW: return 'move-right';
      case keyCode.LEFT_ARROW: return 'move-left';
      case keyCode.DOWN_ARROW: return event.metaKey ? 'move-page-down' : 'move-row-down';
      case keyCode.UP_ARROW: return event.metaKey ? 'move-page-up' : 'move-row-up';

      case keyCode.PAGE_DOWN: return 'move-page-down';
      case keyCode.PAGE_UP: return 'move-page-up';

      case keyCode.HOME: return 'start';
      case keyCode.END: return 'end';

      default: return null;
    }
  };
  CalendarCtrl.prototype.handleKeyEvent = function(event) {
    var self = this;

    this.$scope.$apply(function() {
      if (event.which == self.keyCode.ESCAPE || event.which == self.keyCode.TAB) {
        self.$scope.$emit('md-calendar-close');

        if (event.which == self.keyCode.TAB) {
          event.preventDefault();
        }

        return;
      }
      var action = self.getActionFromKeyEvent(event);
      if (action) {
        event.preventDefault();
        event.stopPropagation();
        self.$scope.$broadcast('md-calendar-parent-action', action);
      }
    });
  };
  CalendarCtrl.prototype.hideVerticalScrollbar = function(childCtrl) {
    var self = this;
    var element = childCtrl.$element[0];
    var scrollMask = element.querySelector('.md-calendar-scroll-mask');

    if (self.width > 0) {
      setWidth();
    } else {
      self.$$rAF(function() {
        var scroller = childCtrl.calendarScroller;

        self.scrollbarWidth = scroller.offsetWidth - scroller.clientWidth;
        self.width = element.querySelector('table').offsetWidth;
        setWidth();
      });
    }

    function setWidth() {
      var width = self.width || FALLBACK_WIDTH;
      var scrollbarWidth = self.scrollbarWidth;
      var scroller = childCtrl.calendarScroller;

      scrollMask.style.width = width + 'px';
      scroller.style.width = (width + scrollbarWidth) + 'px';
      scroller.style.paddingRight = scrollbarWidth + 'px';
    }
  };
  CalendarCtrl.prototype.getDateId = function(date, namespace) {
    if (!namespace) {
      throw new Error('A namespace for the date id has to be specified.');
    }

    return [
      'md',
      this.id,
      namespace,
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ].join('-');
  };
  CalendarCtrl.prototype.updateVirtualRepeat = function() {
    var scope = this.$scope;
    var virtualRepeatResizeListener = scope.$on('$md-resize-enable', function() {
      if (!scope.$$phase) {
        scope.$apply();
      }

      virtualRepeatResizeListener();
    });
  };
})();

})();
(function(){
"use strict";

(function() {
  'use strict';

  CalendarMonthCtrl.$inject = ["$element", "$scope", "$animate", "$q", "$$mdDateUtil", "$mdDateLocale"];
  angular.module('material.components.datepicker')
    .directive('mdCalendarMonth', calendarDirective);
  var TBODY_HEIGHT = 265;
  var TBODY_SINGLE_ROW_HEIGHT = 45;
  function calendarDirective() {
    return {
      template:
        '<table aria-hidden="true" class="md-calendar-day-header"><thead></thead></table>' +
        '<div class="md-calendar-scroll-mask">' +
        '<md-virtual-repeat-container class="md-calendar-scroll-container" ' +
              'md-offset-size="' + (TBODY_SINGLE_ROW_HEIGHT - TBODY_HEIGHT) + '">' +
            '<table role="grid" tabindex="0" class="md-calendar" aria-readonly="true">' +
              '<tbody ' +
                  'md-calendar-month-body ' +
                  'role="rowgroup" ' +
                  'md-virtual-repeat="i in monthCtrl.items" ' +
                  'md-month-offset="$index" ' +
                  'class="md-calendar-month" ' +
                  'md-start-index="monthCtrl.getSelectedMonthIndex()" ' +
                  'md-item-size="' + TBODY_HEIGHT + '"></tbody>' +
            '</table>' +
          '</md-virtual-repeat-container>' +
        '</div>',
      require: ['^^mdCalendar', 'mdCalendarMonth'],
      controller: CalendarMonthCtrl,
      controllerAs: 'monthCtrl',
      bindToController: true,
      link: function(scope, element, attrs, controllers) {
        var calendarCtrl = controllers[0];
        var monthCtrl = controllers[1];
        monthCtrl.initialize(calendarCtrl);
      }
    };
  }
  function CalendarMonthCtrl($element, $scope, $animate, $q,
    $$mdDateUtil, $mdDateLocale) {
    this.$element = $element;
    this.$scope = $scope;
    this.$animate = $animate;
    this.$q = $q;
    this.dateUtil = $$mdDateUtil;
    this.dateLocale = $mdDateLocale;
    this.calendarScroller = $element[0].querySelector('.md-virtual-repeat-scroller');
    this.isInitialized = false;
    this.isMonthTransitionInProgress = false;

    var self = this;
    this.cellClickHandler = function() {
      var timestamp = $$mdDateUtil.getTimestampFromNode(this);
      self.$scope.$apply(function() {
        self.calendarCtrl.setNgModelValue(timestamp);
      });
    };
    this.headerClickHandler = function() {
      self.calendarCtrl.setCurrentView('year', $$mdDateUtil.getTimestampFromNode(this));
    };
  }
  CalendarMonthCtrl.prototype.initialize = function(calendarCtrl) {

    this.items = {
      length: this.dateUtil.getMonthDistance(
        calendarCtrl.firstRenderableDate,
        calendarCtrl.lastRenderableDate
      ) + 2
    };

    this.calendarCtrl = calendarCtrl;
    this.attachScopeListeners();
    calendarCtrl.updateVirtualRepeat();
    calendarCtrl.ngModelCtrl && calendarCtrl.ngModelCtrl.$render();
  };
  CalendarMonthCtrl.prototype.getSelectedMonthIndex = function() {
    var calendarCtrl = this.calendarCtrl;

    return this.dateUtil.getMonthDistance(
      calendarCtrl.firstRenderableDate,
      calendarCtrl.displayDate || calendarCtrl.selectedDate || calendarCtrl.today
    );
  };
  CalendarMonthCtrl.prototype.changeSelectedDate = function(date) {
    var self = this;
    var calendarCtrl = self.calendarCtrl;
    var previousSelectedDate = calendarCtrl.selectedDate;
    calendarCtrl.selectedDate = date;

    this.changeDisplayDate(date).then(function() {
      var selectedDateClass = calendarCtrl.SELECTED_DATE_CLASS;
      var namespace = 'month';
      if (previousSelectedDate) {
        var prevDateCell = document.getElementById(calendarCtrl.getDateId(previousSelectedDate, namespace));
        if (prevDateCell) {
          prevDateCell.classList.remove(selectedDateClass);
          prevDateCell.setAttribute('aria-selected', 'false');
        }
      }
      if (date) {
        var dateCell = document.getElementById(calendarCtrl.getDateId(date, namespace));
        if (dateCell) {
          dateCell.classList.add(selectedDateClass);
          dateCell.setAttribute('aria-selected', 'true');
        }
      }
    });
  };
  CalendarMonthCtrl.prototype.changeDisplayDate = function(date) {
    if (!this.isInitialized) {
      this.buildWeekHeader();
      this.calendarCtrl.hideVerticalScrollbar(this);
      this.isInitialized = true;
      return this.$q.when();
    }
    if (!this.dateUtil.isValidDate(date) || this.isMonthTransitionInProgress) {
      return this.$q.when();
    }

    this.isMonthTransitionInProgress = true;
    var animationPromise = this.animateDateChange(date);

    this.calendarCtrl.displayDate = date;

    var self = this;
    animationPromise.then(function() {
      self.isMonthTransitionInProgress = false;
    });

    return animationPromise;
  };
  CalendarMonthCtrl.prototype.animateDateChange = function(date) {
    if (this.dateUtil.isValidDate(date)) {
      var monthDistance = this.dateUtil.getMonthDistance(this.calendarCtrl.firstRenderableDate, date);
      this.calendarScroller.scrollTop = monthDistance * TBODY_HEIGHT;
    }

    return this.$q.when();
  };
  CalendarMonthCtrl.prototype.buildWeekHeader = function() {
    var firstDayOfWeek = this.dateLocale.firstDayOfWeek;
    var shortDays = this.dateLocale.shortDays;

    var row = document.createElement('tr');
    for (var i = 0; i < 7; i++) {
      var th = document.createElement('th');
      th.textContent = shortDays[(i + firstDayOfWeek) % 7];
      row.appendChild(th);
    }

    this.$element.find('thead').append(row);
  };
  CalendarMonthCtrl.prototype.attachScopeListeners = function() {
    var self = this;

    self.$scope.$on('md-calendar-parent-changed', function(event, value) {
      self.changeSelectedDate(value);
    });

    self.$scope.$on('md-calendar-parent-action', angular.bind(this, this.handleKeyEvent));
  };
  CalendarMonthCtrl.prototype.handleKeyEvent = function(event, action) {
    var calendarCtrl = this.calendarCtrl;
    var displayDate = calendarCtrl.displayDate;

    if (action === 'select') {
      calendarCtrl.setNgModelValue(displayDate);
    } else {
      var date = null;
      var dateUtil = this.dateUtil;

      switch (action) {
        case 'move-right': date = dateUtil.incrementDays(displayDate, 1); break;
        case 'move-left': date = dateUtil.incrementDays(displayDate, -1); break;

        case 'move-page-down': date = dateUtil.incrementMonths(displayDate, 1); break;
        case 'move-page-up': date = dateUtil.incrementMonths(displayDate, -1); break;

        case 'move-row-down': date = dateUtil.incrementDays(displayDate, 7); break;
        case 'move-row-up': date = dateUtil.incrementDays(displayDate, -7); break;

        case 'start': date = dateUtil.getFirstDateOfMonth(displayDate); break;
        case 'end': date = dateUtil.getLastDateOfMonth(displayDate); break;
      }

      if (date) {
        date = this.dateUtil.clampDate(date, calendarCtrl.minDate, calendarCtrl.maxDate);

        this.changeDisplayDate(date).then(function() {
          calendarCtrl.focus(date);
        });
      }
    }
  };
})();

})();
(function(){
"use strict";

(function() {
  'use strict';

  mdCalendarMonthBodyDirective.$inject = ["$compile", "$$mdSvgRegistry"];
  CalendarMonthBodyCtrl.$inject = ["$element", "$$mdDateUtil", "$mdDateLocale"];
  angular.module('material.components.datepicker')
      .directive('mdCalendarMonthBody', mdCalendarMonthBodyDirective);
  function mdCalendarMonthBodyDirective($compile, $$mdSvgRegistry) {
    var ARROW_ICON = $compile('<md-icon md-svg-src="' +
      $$mdSvgRegistry.mdTabsArrow + '"></md-icon>')({})[0];

    return {
      require: ['^^mdCalendar', '^^mdCalendarMonth', 'mdCalendarMonthBody'],
      scope: { offset: '=mdMonthOffset' },
      controller: CalendarMonthBodyCtrl,
      controllerAs: 'mdMonthBodyCtrl',
      bindToController: true,
      link: function(scope, element, attrs, controllers) {
        var calendarCtrl = controllers[0];
        var monthCtrl = controllers[1];
        var monthBodyCtrl = controllers[2];

        monthBodyCtrl.calendarCtrl = calendarCtrl;
        monthBodyCtrl.monthCtrl = monthCtrl;
        monthBodyCtrl.arrowIcon = ARROW_ICON.cloneNode(true);
        scope.$watch(function() { return monthBodyCtrl.offset; }, function(offset, oldOffset) {
          if (offset !== oldOffset) {
            monthBodyCtrl.generateContent();
          }
        });
      }
    };
  }
  function CalendarMonthBodyCtrl($element, $$mdDateUtil, $mdDateLocale) {
    this.$element = $element;
    this.dateUtil = $$mdDateUtil;
    this.dateLocale = $mdDateLocale;
    this.monthCtrl = null;
    this.calendarCtrl = null;
    this.offset = null;
    this.focusAfterAppend = null;
  }
  CalendarMonthBodyCtrl.prototype.generateContent = function() {
    var date = this.dateUtil.incrementMonths(this.calendarCtrl.firstRenderableDate, this.offset);

    this.$element
      .empty()
      .append(this.buildCalendarForMonth(date));

    if (this.focusAfterAppend) {
      this.focusAfterAppend.classList.add(this.calendarCtrl.FOCUSED_DATE_CLASS);
      this.focusAfterAppend.focus();
      this.focusAfterAppend = null;
    }
  };
  CalendarMonthBodyCtrl.prototype.buildDateCell = function(opt_date) {
    var monthCtrl = this.monthCtrl;
    var calendarCtrl = this.calendarCtrl;
    var cell = document.createElement('td');
    cell.tabIndex = -1;
    cell.classList.add('md-calendar-date');
    cell.setAttribute('role', 'gridcell');

    if (opt_date) {
      cell.setAttribute('tabindex', '-1');
      cell.setAttribute('aria-label', this.dateLocale.longDateFormatter(opt_date));
      cell.id = calendarCtrl.getDateId(opt_date, 'month');
      cell.setAttribute('data-timestamp', opt_date.getTime());
      if (this.dateUtil.isSameDay(opt_date, calendarCtrl.today)) {
        cell.classList.add(calendarCtrl.TODAY_CLASS);
      }

      if (this.dateUtil.isValidDate(calendarCtrl.selectedDate) &&
          this.dateUtil.isSameDay(opt_date, calendarCtrl.selectedDate)) {
        cell.classList.add(calendarCtrl.SELECTED_DATE_CLASS);
        cell.setAttribute('aria-selected', 'true');
      }

      var cellText = this.dateLocale.dates[opt_date.getDate()];

      if (this.isDateEnabled(opt_date)) {
        var selectionIndicator = document.createElement('span');
        selectionIndicator.classList.add('md-calendar-date-selection-indicator');
        selectionIndicator.textContent = cellText;
        cell.appendChild(selectionIndicator);
        cell.addEventListener('click', monthCtrl.cellClickHandler);

        if (calendarCtrl.displayDate && this.dateUtil.isSameDay(opt_date, calendarCtrl.displayDate)) {
          this.focusAfterAppend = cell;
        }
      } else {
        cell.classList.add('md-calendar-date-disabled');
        cell.textContent = cellText;
      }
    }

    return cell;
  };
  CalendarMonthBodyCtrl.prototype.isDateEnabled = function(opt_date) {
    return this.dateUtil.isDateWithinRange(opt_date,
          this.calendarCtrl.minDate, this.calendarCtrl.maxDate) &&
          (!angular.isFunction(this.calendarCtrl.dateFilter)
           || this.calendarCtrl.dateFilter(opt_date));
  };
  CalendarMonthBodyCtrl.prototype.buildDateRow = function(rowNumber) {
    var row = document.createElement('tr');
    row.setAttribute('role', 'row');
    row.setAttribute('aria-label', this.dateLocale.weekNumberFormatter(rowNumber));

    return row;
  };
  CalendarMonthBodyCtrl.prototype.buildCalendarForMonth = function(opt_dateInMonth) {
    var date = this.dateUtil.isValidDate(opt_dateInMonth) ? opt_dateInMonth : new Date();

    var firstDayOfMonth = this.dateUtil.getFirstDateOfMonth(date);
    var firstDayOfTheWeek = this.getLocaleDay_(firstDayOfMonth);
    var numberOfDaysInMonth = this.dateUtil.getNumberOfDaysInMonth(date);
    var monthBody = document.createDocumentFragment();

    var rowNumber = 1;
    var row = this.buildDateRow(rowNumber);
    monthBody.appendChild(row);
    var isFinalMonth = this.offset === this.monthCtrl.items.length - 1;
    var blankCellOffset = 0;
    var monthLabelCell = document.createElement('td');
    var monthLabelCellContent = document.createElement('span');

    monthLabelCellContent.textContent = this.dateLocale.monthHeaderFormatter(date);
    monthLabelCell.appendChild(monthLabelCellContent);
    monthLabelCell.classList.add('md-calendar-month-label');
    if (this.calendarCtrl.maxDate && firstDayOfMonth > this.calendarCtrl.maxDate) {
      monthLabelCell.classList.add('md-calendar-month-label-disabled');
    } else {
      monthLabelCell.addEventListener('click', this.monthCtrl.headerClickHandler);
      monthLabelCell.setAttribute('data-timestamp', firstDayOfMonth.getTime());
      monthLabelCell.setAttribute('aria-label', this.dateLocale.monthFormatter(date));
      monthLabelCell.appendChild(this.arrowIcon.cloneNode(true));
    }

    if (firstDayOfTheWeek <= 2) {
      monthLabelCell.setAttribute('colspan', '7');

      var monthLabelRow = this.buildDateRow();
      monthLabelRow.appendChild(monthLabelCell);
      monthBody.insertBefore(monthLabelRow, row);

      if (isFinalMonth) {
        return monthBody;
      }
    } else {
      blankCellOffset = 3;
      monthLabelCell.setAttribute('colspan', '3');
      row.appendChild(monthLabelCell);
    }
    for (var i = blankCellOffset; i < firstDayOfTheWeek; i++) {
      row.appendChild(this.buildDateCell());
    }
    var dayOfWeek = firstDayOfTheWeek;
    var iterationDate = firstDayOfMonth;
    for (var d = 1; d <= numberOfDaysInMonth; d++) {
      if (dayOfWeek === 7) {
        if (isFinalMonth) {
          return monthBody;
        }
        dayOfWeek = 0;
        rowNumber++;
        row = this.buildDateRow(rowNumber);
        monthBody.appendChild(row);
      }

      iterationDate.setDate(d);
      var cell = this.buildDateCell(iterationDate);
      row.appendChild(cell);

      dayOfWeek++;
    }
    while (row.childNodes.length < 7) {
      row.appendChild(this.buildDateCell());
    }
    while (monthBody.childNodes.length < 6) {
      var whitespaceRow = this.buildDateRow();
      for (var j = 0; j < 7; j++) {
        whitespaceRow.appendChild(this.buildDateCell());
      }
      monthBody.appendChild(whitespaceRow);
    }

    return monthBody;
  };
  CalendarMonthBodyCtrl.prototype.getLocaleDay_ = function(date) {
    return (date.getDay() + (7 - this.dateLocale.firstDayOfWeek)) % 7;
  };
})();

})();
(function(){
"use strict";

(function() {
  'use strict';

  CalendarYearCtrl.$inject = ["$element", "$scope", "$animate", "$q", "$$mdDateUtil"];
  angular.module('material.components.datepicker')
    .directive('mdCalendarYear', calendarDirective);
  var TBODY_HEIGHT = 88;
  function calendarDirective() {
    return {
      template:
        '<div class="md-calendar-scroll-mask">' +
          '<md-virtual-repeat-container class="md-calendar-scroll-container">' +
            '<table role="grid" tabindex="0" class="md-calendar" aria-readonly="true">' +
              '<tbody ' +
                  'md-calendar-year-body ' +
                  'role="rowgroup" ' +
                  'md-virtual-repeat="i in yearCtrl.items" ' +
                  'md-year-offset="$index" class="md-calendar-year" ' +
                  'md-start-index="yearCtrl.getFocusedYearIndex()" ' +
                  'md-item-size="' + TBODY_HEIGHT + '"></tbody>' +
            '</table>' +
          '</md-virtual-repeat-container>' +
        '</div>',
      require: ['^^mdCalendar', 'mdCalendarYear'],
      controller: CalendarYearCtrl,
      controllerAs: 'yearCtrl',
      bindToController: true,
      link: function(scope, element, attrs, controllers) {
        var calendarCtrl = controllers[0];
        var yearCtrl = controllers[1];
        yearCtrl.initialize(calendarCtrl);
      }
    };
  }
  function CalendarYearCtrl($element, $scope, $animate, $q, $$mdDateUtil) {
    this.$element = $element;
    this.$scope = $scope;
    this.$animate = $animate;
    this.$q = $q;
    this.dateUtil = $$mdDateUtil;
    this.calendarScroller = $element[0].querySelector('.md-virtual-repeat-scroller');
    this.isInitialized = false;
    this.isMonthTransitionInProgress = false;

    var self = this;
    this.cellClickHandler = function() {
      self.calendarCtrl.setCurrentView('month', $$mdDateUtil.getTimestampFromNode(this));
    };
  }
  CalendarYearCtrl.prototype.initialize = function(calendarCtrl) {
    this.items = {
      length: this.dateUtil.getYearDistance(
        calendarCtrl.firstRenderableDate,
        calendarCtrl.lastRenderableDate
      ) + 1
    };

    this.calendarCtrl = calendarCtrl;
    this.attachScopeListeners();
    calendarCtrl.updateVirtualRepeat();
    calendarCtrl.ngModelCtrl && calendarCtrl.ngModelCtrl.$render();
  };
  CalendarYearCtrl.prototype.getFocusedYearIndex = function() {
    var calendarCtrl = this.calendarCtrl;

    return this.dateUtil.getYearDistance(
      calendarCtrl.firstRenderableDate,
      calendarCtrl.displayDate || calendarCtrl.selectedDate || calendarCtrl.today
    );
  };
  CalendarYearCtrl.prototype.changeDate = function(date) {
    if (!this.isInitialized) {
      this.calendarCtrl.hideVerticalScrollbar(this);
      this.isInitialized = true;
      return this.$q.when();
    } else if (this.dateUtil.isValidDate(date) && !this.isMonthTransitionInProgress) {
      var self = this;
      var animationPromise = this.animateDateChange(date);

      self.isMonthTransitionInProgress = true;
      self.calendarCtrl.displayDate = date;

      return animationPromise.then(function() {
        self.isMonthTransitionInProgress = false;
      });
    }
  };
  CalendarYearCtrl.prototype.animateDateChange = function(date) {
    if (this.dateUtil.isValidDate(date)) {
      var monthDistance = this.dateUtil.getYearDistance(this.calendarCtrl.firstRenderableDate, date);
      this.calendarScroller.scrollTop = monthDistance * TBODY_HEIGHT;
    }

    return this.$q.when();
  };
  CalendarYearCtrl.prototype.handleKeyEvent = function(event, action) {
    var calendarCtrl = this.calendarCtrl;
    var displayDate = calendarCtrl.displayDate;

    if (action === 'select') {
      this.changeDate(displayDate).then(function() {
        calendarCtrl.setCurrentView('month', displayDate);
        calendarCtrl.focus(displayDate);
      });
    } else {
      var date = null;
      var dateUtil = this.dateUtil;

      switch (action) {
        case 'move-right': date = dateUtil.incrementMonths(displayDate, 1); break;
        case 'move-left': date = dateUtil.incrementMonths(displayDate, -1); break;

        case 'move-row-down': date = dateUtil.incrementMonths(displayDate, 6); break;
        case 'move-row-up': date = dateUtil.incrementMonths(displayDate, -6); break;
      }

      if (date) {
        var min = calendarCtrl.minDate ? dateUtil.getFirstDateOfMonth(calendarCtrl.minDate) : null;
        var max = calendarCtrl.maxDate ? dateUtil.getFirstDateOfMonth(calendarCtrl.maxDate) : null;
        date = dateUtil.getFirstDateOfMonth(this.dateUtil.clampDate(date, min, max));

        this.changeDate(date).then(function() {
          calendarCtrl.focus(date);
        });
      }
    }
  };
  CalendarYearCtrl.prototype.attachScopeListeners = function() {
    var self = this;

    self.$scope.$on('md-calendar-parent-changed', function(event, value) {
      self.changeDate(value);
    });

    self.$scope.$on('md-calendar-parent-action', angular.bind(self, self.handleKeyEvent));
  };
})();

})();
(function(){
"use strict";

(function() {
  'use strict';

  CalendarYearBodyCtrl.$inject = ["$element", "$$mdDateUtil", "$mdDateLocale"];
  angular.module('material.components.datepicker')
      .directive('mdCalendarYearBody', mdCalendarYearDirective);
  function mdCalendarYearDirective() {
    return {
      require: ['^^mdCalendar', '^^mdCalendarYear', 'mdCalendarYearBody'],
      scope: { offset: '=mdYearOffset' },
      controller: CalendarYearBodyCtrl,
      controllerAs: 'mdYearBodyCtrl',
      bindToController: true,
      link: function(scope, element, attrs, controllers) {
        var calendarCtrl = controllers[0];
        var yearCtrl = controllers[1];
        var yearBodyCtrl = controllers[2];

        yearBodyCtrl.calendarCtrl = calendarCtrl;
        yearBodyCtrl.yearCtrl = yearCtrl;

        scope.$watch(function() { return yearBodyCtrl.offset; }, function(offset, oldOffset) {
          if (offset !== oldOffset) {
            yearBodyCtrl.generateContent();
          }
        });
      }
    };
  }
  function CalendarYearBodyCtrl($element, $$mdDateUtil, $mdDateLocale) {
    this.$element = $element;
    this.dateUtil = $$mdDateUtil;
    this.dateLocale = $mdDateLocale;
    this.calendarCtrl = null;
    this.yearCtrl = null;
    this.offset = null;
    this.focusAfterAppend = null;
  }
  CalendarYearBodyCtrl.prototype.generateContent = function() {
    var date = this.dateUtil.incrementYears(this.calendarCtrl.firstRenderableDate, this.offset);

    this.$element
      .empty()
      .append(this.buildCalendarForYear(date));

    if (this.focusAfterAppend) {
      this.focusAfterAppend.classList.add(this.calendarCtrl.FOCUSED_DATE_CLASS);
      this.focusAfterAppend.focus();
      this.focusAfterAppend = null;
    }
  };
  CalendarYearBodyCtrl.prototype.buildMonthCell = function(year, month) {
    var calendarCtrl = this.calendarCtrl;
    var yearCtrl = this.yearCtrl;
    var cell = this.buildBlankCell();
    var firstOfMonth = new Date(year, month, 1);
    cell.setAttribute('aria-label', this.dateLocale.monthFormatter(firstOfMonth));
    cell.id = calendarCtrl.getDateId(firstOfMonth, 'year');
    cell.setAttribute('data-timestamp', firstOfMonth.getTime());

    if (this.dateUtil.isSameMonthAndYear(firstOfMonth, calendarCtrl.today)) {
      cell.classList.add(calendarCtrl.TODAY_CLASS);
    }

    if (this.dateUtil.isValidDate(calendarCtrl.selectedDate) &&
        this.dateUtil.isSameMonthAndYear(firstOfMonth, calendarCtrl.selectedDate)) {
      cell.classList.add(calendarCtrl.SELECTED_DATE_CLASS);
      cell.setAttribute('aria-selected', 'true');
    }

    var cellText = this.dateLocale.shortMonths[month];

    if (this.dateUtil.isMonthWithinRange(firstOfMonth,
        calendarCtrl.minDate, calendarCtrl.maxDate)) {
      var selectionIndicator = document.createElement('span');
      selectionIndicator.classList.add('md-calendar-date-selection-indicator');
      selectionIndicator.textContent = cellText;
      cell.appendChild(selectionIndicator);
      cell.addEventListener('click', yearCtrl.cellClickHandler);

      if (calendarCtrl.displayDate && this.dateUtil.isSameMonthAndYear(firstOfMonth, calendarCtrl.displayDate)) {
        this.focusAfterAppend = cell;
      }
    } else {
      cell.classList.add('md-calendar-date-disabled');
      cell.textContent = cellText;
    }

    return cell;
  };
  CalendarYearBodyCtrl.prototype.buildBlankCell = function() {
    var cell = document.createElement('td');
    cell.tabIndex = -1;
    cell.classList.add('md-calendar-date');
    cell.setAttribute('role', 'gridcell');

    cell.setAttribute('tabindex', '-1');
    return cell;
  };
  CalendarYearBodyCtrl.prototype.buildCalendarForYear = function(date) {
    var year = date.getFullYear();
    var yearBody = document.createDocumentFragment();

    var monthCell, i;
    var firstRow = document.createElement('tr');
    var labelCell = document.createElement('td');
    labelCell.className = 'md-calendar-month-label';
    labelCell.textContent = year;
    firstRow.appendChild(labelCell);

    for (i = 0; i < 6; i++) {
      firstRow.appendChild(this.buildMonthCell(year, i));
    }
    yearBody.appendChild(firstRow);
    var secondRow = document.createElement('tr');
    secondRow.appendChild(this.buildBlankCell());
    for (i = 6; i < 12; i++) {
      secondRow.appendChild(this.buildMonthCell(year, i));
    }
    yearBody.appendChild(secondRow);

    return yearBody;
  };
})();

})();
(function(){
"use strict";

(function() {
  'use strict';
  angular.module('material.components.datepicker').config(["$provide", function($provide) {
    function DateLocaleProvider() {
      this.months = null;
      this.shortMonths = null;
      this.days = null;
      this.shortDays = null;
      this.dates = null;
      this.firstDayOfWeek = 0;
      this.formatDate = null;
      this.parseDate = null;
      this.monthHeaderFormatter = null;
      this.weekNumberFormatter = null;
      this.longDateFormatter = null;
      this.msgCalendar = '';
      this.msgOpenCalendar = '';
    }
    DateLocaleProvider.prototype.$get = function($locale, $filter) {
      function defaultFormatDate(date) {
        if (!date) {
          return '';
        }
        var localeTime = date.toLocaleTimeString();
        var formatDate = date;
        if (date.getHours() == 0 &&
            (localeTime.indexOf('11:') !== -1 || localeTime.indexOf('23:') !== -1)) {
          formatDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1, 0, 0);
        }

        return $filter('date')(formatDate, 'M/d/yyyy');
      }
      function defaultParseDate(dateString) {
        return new Date(dateString);
      }
      function defaultIsDateComplete(dateString) {
        dateString = dateString.trim();
        var re = /^(([a-zA-Z]{3,}|[0-9]{1,4})([ \.,]+|[\/\-])){2}([a-zA-Z]{3,}|[0-9]{1,4})$/;
        return re.test(dateString);
      }
      function defaultMonthHeaderFormatter(date) {
        return service.shortMonths[date.getMonth()] + ' ' + date.getFullYear();
      }
      function defaultMonthFormatter(date) {
        return service.months[date.getMonth()] + ' ' + date.getFullYear();
      }
      function defaultWeekNumberFormatter(number) {
        return 'Week ' + number;
      }
      function defaultLongDateFormatter(date) {
        return [
          service.days[date.getDay()],
          service.months[date.getMonth()],
          service.dates[date.getDate()],
          date.getFullYear()
        ].join(' ');
      }
      var defaultShortDays = $locale.DATETIME_FORMATS.SHORTDAY.map(function(day) {
        return day.substring(0, 1);
      });
      var defaultDates = Array(32);
      for (var i = 1; i <= 31; i++) {
        defaultDates[i] = i;
      }
      var defaultMsgCalendar = 'Calendar';
      var defaultMsgOpenCalendar = 'Open calendar';
      var defaultFirstRenderableDate = new Date(1880, 0, 1);
      var defaultLastRendereableDate = new Date(defaultFirstRenderableDate.getFullYear() + 250, 0, 1);

      var service = {
        months: this.months || $locale.DATETIME_FORMATS.MONTH,
        shortMonths: this.shortMonths || $locale.DATETIME_FORMATS.SHORTMONTH,
        days: this.days || $locale.DATETIME_FORMATS.DAY,
        shortDays: this.shortDays || defaultShortDays,
        dates: this.dates || defaultDates,
        firstDayOfWeek: this.firstDayOfWeek || 0,
        formatDate: this.formatDate || defaultFormatDate,
        parseDate: this.parseDate || defaultParseDate,
        isDateComplete: this.isDateComplete || defaultIsDateComplete,
        monthHeaderFormatter: this.monthHeaderFormatter || defaultMonthHeaderFormatter,
        monthFormatter: this.monthFormatter || defaultMonthFormatter,
        weekNumberFormatter: this.weekNumberFormatter || defaultWeekNumberFormatter,
        longDateFormatter: this.longDateFormatter || defaultLongDateFormatter,
        msgCalendar: this.msgCalendar || defaultMsgCalendar,
        msgOpenCalendar: this.msgOpenCalendar || defaultMsgOpenCalendar,
        firstRenderableDate: this.firstRenderableDate || defaultFirstRenderableDate,
        lastRenderableDate: this.lastRenderableDate || defaultLastRendereableDate
      };

      return service;
    };
    DateLocaleProvider.prototype.$get.$inject = ["$locale", "$filter"];

    $provide.provider('$mdDateLocale', new DateLocaleProvider());
  }]);
})();

})();
(function(){
"use strict";

(function() {
  'use strict';
  angular.module('material.components.datepicker').factory('$$mdDateUtil', function() {
    return {
      getFirstDateOfMonth: getFirstDateOfMonth,
      getNumberOfDaysInMonth: getNumberOfDaysInMonth,
      getDateInNextMonth: getDateInNextMonth,
      getDateInPreviousMonth: getDateInPreviousMonth,
      isInNextMonth: isInNextMonth,
      isInPreviousMonth: isInPreviousMonth,
      getDateMidpoint: getDateMidpoint,
      isSameMonthAndYear: isSameMonthAndYear,
      getWeekOfMonth: getWeekOfMonth,
      incrementDays: incrementDays,
      incrementMonths: incrementMonths,
      getLastDateOfMonth: getLastDateOfMonth,
      isSameDay: isSameDay,
      getMonthDistance: getMonthDistance,
      isValidDate: isValidDate,
      setDateTimeToMidnight: setDateTimeToMidnight,
      createDateAtMidnight: createDateAtMidnight,
      isDateWithinRange: isDateWithinRange,
      incrementYears: incrementYears,
      getYearDistance: getYearDistance,
      clampDate: clampDate,
      getTimestampFromNode: getTimestampFromNode,
      isMonthWithinRange: isMonthWithinRange
    };
    function getFirstDateOfMonth(date) {
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    function getNumberOfDaysInMonth(date) {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }
    function getDateInNextMonth(date) {
      return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }
    function getDateInPreviousMonth(date) {
      return new Date(date.getFullYear(), date.getMonth() - 1, 1);
    }
    function isSameMonthAndYear(d1, d2) {
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
    }
    function isSameDay(d1, d2) {
      return d1.getDate() == d2.getDate() && isSameMonthAndYear(d1, d2);
    }
    function isInNextMonth(startDate, endDate) {
      var nextMonth = getDateInNextMonth(startDate);
      return isSameMonthAndYear(nextMonth, endDate);
    }
    function isInPreviousMonth(startDate, endDate) {
      var previousMonth = getDateInPreviousMonth(startDate);
      return isSameMonthAndYear(endDate, previousMonth);
    }
    function getDateMidpoint(d1, d2) {
      return createDateAtMidnight((d1.getTime() + d2.getTime()) / 2);
    }
    function getWeekOfMonth(date) {
      var firstDayOfMonth = getFirstDateOfMonth(date);
      return Math.floor((firstDayOfMonth.getDay() + date.getDate() - 1) / 7);
    }
    function incrementDays(date, numberOfDays) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + numberOfDays);
    }
    function incrementMonths(date, numberOfMonths) {
      var dateInTargetMonth = new Date(date.getFullYear(), date.getMonth() + numberOfMonths, 1);
      var numberOfDaysInMonth = getNumberOfDaysInMonth(dateInTargetMonth);
      if (numberOfDaysInMonth < date.getDate()) {
        dateInTargetMonth.setDate(numberOfDaysInMonth);
      } else {
        dateInTargetMonth.setDate(date.getDate());
      }

      return dateInTargetMonth;
    }
    function getMonthDistance(start, end) {
      return (12 * (end.getFullYear() - start.getFullYear())) + (end.getMonth() - start.getMonth());
    }
    function getLastDateOfMonth(date) {
      return new Date(date.getFullYear(), date.getMonth(), getNumberOfDaysInMonth(date));
    }
    function isValidDate(date) {
      return date != null && date.getTime && !isNaN(date.getTime());
    }
    function setDateTimeToMidnight(date) {
      if (isValidDate(date)) {
        date.setHours(0, 0, 0, 0);
      }
    }
    function createDateAtMidnight(opt_value) {
      var date;
      if (angular.isUndefined(opt_value)) {
        date = new Date();
      } else {
        date = new Date(opt_value);
      }
      setDateTimeToMidnight(date);
      return date;
    }
     function isDateWithinRange(date, minDate, maxDate) {
       var dateAtMidnight = createDateAtMidnight(date);
       var minDateAtMidnight = isValidDate(minDate) ? createDateAtMidnight(minDate) : null;
       var maxDateAtMidnight = isValidDate(maxDate) ? createDateAtMidnight(maxDate) : null;
       return (!minDateAtMidnight || minDateAtMidnight <= dateAtMidnight) &&
           (!maxDateAtMidnight || maxDateAtMidnight >= dateAtMidnight);
     }
     function incrementYears(date, numberOfYears) {
       return incrementMonths(date, numberOfYears * 12);
     }
     function getYearDistance(start, end) {
       return end.getFullYear() - start.getFullYear();
     }
     function clampDate(date, minDate, maxDate) {
       var boundDate = date;
       if (minDate && date < minDate) {
         boundDate = new Date(minDate.getTime());
       }
       if (maxDate && date > maxDate) {
         boundDate = new Date(maxDate.getTime());
       }
       return boundDate;
     }
     function getTimestampFromNode(node) {
       if (node && node.hasAttribute('data-timestamp')) {
         return Number(node.getAttribute('data-timestamp'));
       }
     }
     function isMonthWithinRange(date, minDate, maxDate) {
       var month = date.getMonth();
       var year = date.getFullYear();

       return (!minDate || minDate.getFullYear() < year || minDate.getMonth() <= month) &&
        (!maxDate || maxDate.getFullYear() > year || maxDate.getMonth() >= month);
     }
  });
})();

})();
(function(){
"use strict";

(function() {
  'use strict';


  DatePickerCtrl.$inject = ["$scope", "$element", "$attrs", "$window", "$mdConstant", "$mdTheming", "$mdUtil", "$mdDateLocale", "$$mdDateUtil", "$$rAF", "$mdGesture", "$filter"];
  datePickerDirective.$inject = ["$$mdSvgRegistry", "$mdUtil", "$mdAria", "inputDirective"];
  angular.module('material.components.datepicker')
      .directive('mdDatepicker', datePickerDirective);

  function datePickerDirective($$mdSvgRegistry, $mdUtil, $mdAria, inputDirective) {
    return {
      template: function(tElement, tAttrs) {
        var hiddenIcons = tAttrs.mdHideIcons;
        var ariaLabelValue = tAttrs.ariaLabel || tAttrs.mdPlaceholder;

        var calendarButton = (hiddenIcons === 'all' || hiddenIcons === 'calendar') ? '' :
          '<md-button class="md-datepicker-button md-icon-button" type="button" ' +
              'tabindex="-1" aria-hidden="true" ' +
              'ng-click="ctrl.openCalendarPane($event)">' +
            '<md-icon class="md-datepicker-calendar-icon" aria-label="md-calendar" ' +
                     'md-svg-src="' + $$mdSvgRegistry.mdCalendar + '"></md-icon>' +
          '</md-button>';

        var triangleButton = (hiddenIcons === 'all' || hiddenIcons === 'triangle') ? '' :
          '<md-button type="button" md-no-ink ' +
              'class="md-datepicker-triangle-button md-icon-button" ' +
              'ng-click="ctrl.openCalendarPane($event)" ' +
              'aria-label="{{::ctrl.dateLocale.msgOpenCalendar}}">' +
            '<div class="md-datepicker-expand-triangle"></div>' +
          '</md-button>';

        return calendarButton +
        '<div class="md-datepicker-input-container" ng-class="{\'md-datepicker-focused\': ctrl.isFocused}">' +
          '<input ' +
            (ariaLabelValue ? 'aria-label="' + ariaLabelValue + '" ' : '') +
            'class="md-datepicker-input" ' +
            'aria-haspopup="true" ' +
            'ng-focus="ctrl.setFocused(true)" ' +
            'ng-blur="ctrl.setFocused(false)"> ' +
            triangleButton +
        '</div>' +
        '<div class="md-datepicker-calendar-pane md-whiteframe-z1">' +
          '<div class="md-datepicker-input-mask">' +
            '<div class="md-datepicker-input-mask-opaque"></div>' +
          '</div>' +
          '<div class="md-datepicker-calendar">' +
            '<md-calendar role="dialog" aria-label="{{::ctrl.dateLocale.msgCalendar}}" ' +
                'md-current-view="{{::ctrl.currentView}}"' +
                'md-min-date="ctrl.minDate"' +
                'md-max-date="ctrl.maxDate"' +
                'md-date-filter="ctrl.dateFilter"' +
                'ng-model="ctrl.date" ng-if="ctrl.isCalendarOpen">' +
            '</md-calendar>' +
          '</div>' +
        '</div>';
      },
      require: ['ngModel', 'mdDatepicker', '?^mdInputContainer', '?^form'],
      scope: {
        minDate: '=mdMinDate',
        maxDate: '=mdMaxDate',
        placeholder: '@mdPlaceholder',
        currentView: '@mdCurrentView',
        dateFilter: '=mdDateFilter',
        isOpen: '=?mdIsOpen',
        debounceInterval: '=mdDebounceInterval'
      },
      controller: DatePickerCtrl,
      controllerAs: 'ctrl',
      bindToController: true,
      link: function(scope, element, attr, controllers) {
        var ngModelCtrl = controllers[0];
        var mdDatePickerCtrl = controllers[1];
        var mdInputContainer = controllers[2];
        var parentForm = controllers[3];
        var mdNoAsterisk = $mdUtil.parseAttributeBoolean(attr.mdNoAsterisk);

        mdDatePickerCtrl.configureNgModel(ngModelCtrl, mdInputContainer, inputDirective);

        if (mdInputContainer) {
          var spacer = element[0].querySelector('.md-errors-spacer');

          if (spacer) {
            element.after(angular.element('<div>').append(spacer));
          }

          mdInputContainer.setHasPlaceholder(attr.mdPlaceholder);
          mdInputContainer.input = element;
          mdInputContainer.element
            .addClass(INPUT_CONTAINER_CLASS)
            .toggleClass(HAS_ICON_CLASS, attr.mdHideIcons !== 'calendar' && attr.mdHideIcons !== 'all');

          if (!mdInputContainer.label) {
            $mdAria.expect(element, 'aria-label', attr.mdPlaceholder);
          } else if(!mdNoAsterisk) {
            attr.$observe('required', function(value) {
              mdInputContainer.label.toggleClass('md-required', !!value);
            });
          }

          scope.$watch(mdInputContainer.isErrorGetter || function() {
            return ngModelCtrl.$invalid && (ngModelCtrl.$touched || (parentForm && parentForm.$submitted));
          }, mdInputContainer.setInvalid);
        } else if (parentForm) {
          var parentSubmittedWatcher = scope.$watch(function() {
            return parentForm.$submitted;
          }, function(isSubmitted) {
            if (isSubmitted) {
              mdDatePickerCtrl.updateErrorState();
              parentSubmittedWatcher();
            }
          });
        }
      }
    };
  }
  var EXTRA_INPUT_SIZE = 3;
  var INVALID_CLASS = 'md-datepicker-invalid';
  var OPEN_CLASS = 'md-datepicker-open';
  var INPUT_CONTAINER_CLASS = '_md-datepicker-floating-label';
  var HAS_ICON_CLASS = '_md-datepicker-has-calendar-icon';
  var DEFAULT_DEBOUNCE_INTERVAL = 500;
  var CALENDAR_PANE_HEIGHT = 368;
  var CALENDAR_PANE_WIDTH = 360;
  function DatePickerCtrl($scope, $element, $attrs, $window, $mdConstant,
    $mdTheming, $mdUtil, $mdDateLocale, $$mdDateUtil, $$rAF, $mdGesture, $filter) {
    this.$window = $window;
    this.dateLocale = $mdDateLocale;
    this.dateUtil = $$mdDateUtil;
    this.$mdConstant = $mdConstant;
    this.$mdUtil = $mdUtil;
    this.$$rAF = $$rAF;
    this.documentElement = angular.element(document.documentElement);
    this.ngModelCtrl = null;
    this.inputElement = $element[0].querySelector('input');
    this.ngInputElement = angular.element(this.inputElement);
    this.inputContainer = $element[0].querySelector('.md-datepicker-input-container');
    this.calendarPane = $element[0].querySelector('.md-datepicker-calendar-pane');
    this.calendarButton = $element[0].querySelector('.md-datepicker-button');
    this.inputMask = angular.element($element[0].querySelector('.md-datepicker-input-mask-opaque'));
    this.$element = $element;
    this.$attrs = $attrs;
    this.$scope = $scope;
    this.date = null;
    this.isFocused = false;
    this.isDisabled;
    this.setDisabled($element[0].disabled || angular.isString($attrs.disabled));
    this.isCalendarOpen = false;
    this.openOnFocus = $attrs.hasOwnProperty('mdOpenOnFocus');
    this.mdInputContainer = null;
    this.calendarPaneOpenedFrom = null;
    this.calendarPane.id = 'md-date-pane' + $mdUtil.nextUid();
    this.bodyClickHandler = angular.bind(this, this.handleBodyClick);
    this.windowEventName = ($mdGesture.isIos || $mdGesture.isAndroid) ? 'orientationchange' : 'resize';
    this.windowEventHandler = $mdUtil.debounce(angular.bind(this, this.closeCalendarPane), 100);
    this.windowBlurHandler = angular.bind(this, this.handleWindowBlur);
    this.ngDateFilter = $filter('date');
    this.leftMargin = 20;
    this.topMargin = null;
    if ($attrs.tabindex) {
      this.ngInputElement.attr('tabindex', $attrs.tabindex);
      $attrs.$set('tabindex', null);
    } else {
      $attrs.$set('tabindex', '-1');
    }

    $mdTheming($element);
    $mdTheming(angular.element(this.calendarPane));

    this.installPropertyInterceptors();
    this.attachChangeListeners();
    this.attachInteractionListeners();

    var self = this;

    $scope.$on('$destroy', function() {
      self.detachCalendarPane();
    });

    if ($attrs.mdIsOpen) {
      $scope.$watch('ctrl.isOpen', function(shouldBeOpen) {
        if (shouldBeOpen) {
          self.openCalendarPane({
            target: self.inputElement
          });
        } else {
          self.closeCalendarPane();
        }
      });
    }
  }
  DatePickerCtrl.prototype.configureNgModel = function(ngModelCtrl, mdInputContainer, inputDirective) {
    this.ngModelCtrl = ngModelCtrl;
    this.mdInputContainer = mdInputContainer;
    this.$attrs.$set('type', 'date');
    inputDirective[0].link.pre(this.$scope, {
      on: angular.noop,
      val: angular.noop,
      0: {}
    }, this.$attrs, [ngModelCtrl]);

    var self = this;
    self.ngModelCtrl.$formatters.push(function(value) {
      if (value && !(value instanceof Date)) {
        throw Error('The ng-model for md-datepicker must be a Date instance. ' +
            'Currently the model is a: ' + (typeof value));
      }

      self.date = value;
      self.inputElement.value = self.dateLocale.formatDate(value);
      self.mdInputContainer && self.mdInputContainer.setHasValue(!!value);
      self.resizeInputElement();
      self.updateErrorState();

      return value;
    });
    ngModelCtrl.$viewChangeListeners.unshift(angular.bind(this, this.updateErrorState));
  };
  DatePickerCtrl.prototype.attachChangeListeners = function() {
    var self = this;

    self.$scope.$on('md-calendar-change', function(event, date) {
      self.setModelValue(date);
      self.date = date;
      self.inputElement.value = self.dateLocale.formatDate(date);
      self.mdInputContainer && self.mdInputContainer.setHasValue(!!date);
      self.closeCalendarPane();
      self.resizeInputElement();
      self.updateErrorState();
    });

    self.ngInputElement.on('input', angular.bind(self, self.resizeInputElement));

    var debounceInterval = angular.isDefined(this.debounceInterval) ?
        this.debounceInterval : DEFAULT_DEBOUNCE_INTERVAL;
    self.ngInputElement.on('input', self.$mdUtil.debounce(self.handleInputEvent,
        debounceInterval, self));
  };
  DatePickerCtrl.prototype.attachInteractionListeners = function() {
    var self = this;
    var $scope = this.$scope;
    var keyCodes = this.$mdConstant.KEY_CODE;
    self.ngInputElement.on('keydown', function(event) {
      if (event.altKey && event.keyCode == keyCodes.DOWN_ARROW) {
        self.openCalendarPane(event);
        $scope.$digest();
      }
    });

    if (self.openOnFocus) {
      self.ngInputElement.on('focus', angular.bind(self, self.openCalendarPane));
      angular.element(self.$window).on('blur', self.windowBlurHandler);

      $scope.$on('$destroy', function() {
        angular.element(self.$window).off('blur', self.windowBlurHandler);
      });
    }

    $scope.$on('md-calendar-close', function() {
      self.closeCalendarPane();
    });
  };
  DatePickerCtrl.prototype.installPropertyInterceptors = function() {
    var self = this;

    if (this.$attrs.ngDisabled) {
      var scope = this.$scope.$parent;

      if (scope) {
        scope.$watch(this.$attrs.ngDisabled, function(isDisabled) {
          self.setDisabled(isDisabled);
        });
      }
    }

    Object.defineProperty(this, 'placeholder', {
      get: function() { return self.inputElement.placeholder; },
      set: function(value) { self.inputElement.placeholder = value || ''; }
    });
  };
  DatePickerCtrl.prototype.setDisabled = function(isDisabled) {
    this.isDisabled = isDisabled;
    this.inputElement.disabled = isDisabled;

    if (this.calendarButton) {
      this.calendarButton.disabled = isDisabled;
    }
  };
  DatePickerCtrl.prototype.updateErrorState = function(opt_date) {
    var date = opt_date || this.date;
    this.clearErrorState();

    if (this.dateUtil.isValidDate(date)) {
      date = this.dateUtil.createDateAtMidnight(date);

      if (this.dateUtil.isValidDate(this.minDate)) {
        var minDate = this.dateUtil.createDateAtMidnight(this.minDate);
        this.ngModelCtrl.$setValidity('mindate', date >= minDate);
      }

      if (this.dateUtil.isValidDate(this.maxDate)) {
        var maxDate = this.dateUtil.createDateAtMidnight(this.maxDate);
        this.ngModelCtrl.$setValidity('maxdate', date <= maxDate);
      }

      if (angular.isFunction(this.dateFilter)) {
        this.ngModelCtrl.$setValidity('filtered', this.dateFilter(date));
      }
    } else {
      this.ngModelCtrl.$setValidity('valid', date == null);
    }
    if (!this.ngModelCtrl.$valid) {
      this.inputContainer.classList.add(INVALID_CLASS);
    }
  };
  DatePickerCtrl.prototype.clearErrorState = function() {
    this.inputContainer.classList.remove(INVALID_CLASS);
    ['mindate', 'maxdate', 'filtered', 'valid'].forEach(function(field) {
      this.ngModelCtrl.$setValidity(field, true);
    }, this);
  };
  DatePickerCtrl.prototype.resizeInputElement = function() {
    this.inputElement.size = this.inputElement.value.length + EXTRA_INPUT_SIZE;
  };
  DatePickerCtrl.prototype.handleInputEvent = function() {
    var inputString = this.inputElement.value;
    var parsedDate = inputString ? this.dateLocale.parseDate(inputString) : null;
    this.dateUtil.setDateTimeToMidnight(parsedDate);
    var isValidInput = inputString == '' || (
      this.dateUtil.isValidDate(parsedDate) &&
      this.dateLocale.isDateComplete(inputString) &&
      this.isDateEnabled(parsedDate)
    );
    if (isValidInput) {
      this.setModelValue(parsedDate);
      this.date = parsedDate;
    }

    this.updateErrorState(parsedDate);
  };
  DatePickerCtrl.prototype.isDateEnabled = function(opt_date) {
    return this.dateUtil.isDateWithinRange(opt_date, this.minDate, this.maxDate) &&
          (!angular.isFunction(this.dateFilter) || this.dateFilter(opt_date));
  };
  DatePickerCtrl.prototype.attachCalendarPane = function() {
    var calendarPane = this.calendarPane;
    var body = document.body;

    calendarPane.style.transform = '';
    this.$element.addClass(OPEN_CLASS);
    this.mdInputContainer && this.mdInputContainer.element.addClass(OPEN_CLASS);
    angular.element(body).addClass('md-datepicker-is-showing');

    var elementRect = this.inputContainer.getBoundingClientRect();
    var bodyRect = body.getBoundingClientRect();

    if (!this.topMargin || this.topMargin < 0) {
      this.topMargin = (this.inputMask.parent().prop('clientHeight') - this.ngInputElement.prop('clientHeight')) / 2;
    }
    var paneTop = elementRect.top - bodyRect.top - this.topMargin;
    var paneLeft = elementRect.left - bodyRect.left - this.leftMargin;
    var viewportTop = (bodyRect.top < 0 && document.body.scrollTop == 0) ?
        -bodyRect.top :
        document.body.scrollTop;

    var viewportLeft = (bodyRect.left < 0 && document.body.scrollLeft == 0) ?
        -bodyRect.left :
        document.body.scrollLeft;

    var viewportBottom = viewportTop + this.$window.innerHeight;
    var viewportRight = viewportLeft + this.$window.innerWidth;
    this.inputMask.css({
      position: 'absolute',
      left: this.leftMargin + 'px',
      top: this.topMargin + 'px',
      width: (elementRect.width - 1) + 'px',
      height: (elementRect.height - 2) + 'px'
    });
    if (paneLeft + CALENDAR_PANE_WIDTH > viewportRight) {
      if (viewportRight - CALENDAR_PANE_WIDTH > 0) {
        paneLeft = viewportRight - CALENDAR_PANE_WIDTH;
      } else {
        paneLeft = viewportLeft;
        var scale = this.$window.innerWidth / CALENDAR_PANE_WIDTH;
        calendarPane.style.transform = 'scale(' + scale + ')';
      }

      calendarPane.classList.add('md-datepicker-pos-adjusted');
    }
    if (paneTop + CALENDAR_PANE_HEIGHT > viewportBottom &&
        viewportBottom - CALENDAR_PANE_HEIGHT > viewportTop) {
      paneTop = viewportBottom - CALENDAR_PANE_HEIGHT;
      calendarPane.classList.add('md-datepicker-pos-adjusted');
    }

    calendarPane.style.left = paneLeft + 'px';
    calendarPane.style.top = paneTop + 'px';
    document.body.appendChild(calendarPane);
    this.$$rAF(function() {
      calendarPane.classList.add('md-pane-open');
    });
  };
  DatePickerCtrl.prototype.detachCalendarPane = function() {
    this.$element.removeClass(OPEN_CLASS);
    this.mdInputContainer && this.mdInputContainer.element.removeClass(OPEN_CLASS);
    angular.element(document.body).removeClass('md-datepicker-is-showing');
    this.calendarPane.classList.remove('md-pane-open');
    this.calendarPane.classList.remove('md-datepicker-pos-adjusted');

    if (this.isCalendarOpen) {
      this.$mdUtil.enableScrolling();
    }

    if (this.calendarPane.parentNode) {
      this.calendarPane.parentNode.removeChild(this.calendarPane);
    }
  };
  DatePickerCtrl.prototype.openCalendarPane = function(event) {
    if (!this.isCalendarOpen && !this.isDisabled && !this.inputFocusedOnWindowBlur) {
      this.isCalendarOpen = this.isOpen = true;
      this.calendarPaneOpenedFrom = event.target;
      this.$mdUtil.disableScrollAround(this.calendarPane);

      this.attachCalendarPane();
      this.focusCalendar();
      this.evalAttr('ngFocus');
      var self = this;
      this.$mdUtil.nextTick(function() {
        self.documentElement.on('click touchstart', self.bodyClickHandler);
      }, false);

      window.addEventListener(this.windowEventName, this.windowEventHandler);
    }
  };
  DatePickerCtrl.prototype.closeCalendarPane = function() {
    if (this.isCalendarOpen) {
      var self = this;

      self.detachCalendarPane();
      self.ngModelCtrl.$setTouched();
      self.evalAttr('ngBlur');

      self.documentElement.off('click touchstart', self.bodyClickHandler);
      window.removeEventListener(self.windowEventName, self.windowEventHandler);

      self.calendarPaneOpenedFrom.focus();
      self.calendarPaneOpenedFrom = null;

      if (self.openOnFocus) {
        self.$mdUtil.nextTick(reset);
      } else {
        reset();
      }
    }

    function reset(){
      self.isCalendarOpen = self.isOpen = false;
    }
  };
  DatePickerCtrl.prototype.getCalendarCtrl = function() {
    return angular.element(this.calendarPane.querySelector('md-calendar')).controller('mdCalendar');
  };
  DatePickerCtrl.prototype.focusCalendar = function() {
    var self = this;
    this.$mdUtil.nextTick(function() {
      self.getCalendarCtrl().focus();
    }, false);
  };
  DatePickerCtrl.prototype.setFocused = function(isFocused) {
    if (!isFocused) {
      this.ngModelCtrl.$setTouched();
    }
    if (!this.openOnFocus) {
      this.evalAttr(isFocused ? 'ngFocus' : 'ngBlur');
    }

    this.isFocused = isFocused;
  };
  DatePickerCtrl.prototype.handleBodyClick = function(event) {
    if (this.isCalendarOpen) {
      var isInCalendar = this.$mdUtil.getClosest(event.target, 'md-calendar');

      if (!isInCalendar) {
        this.closeCalendarPane();
      }

      this.$scope.$digest();
    }
  };
  DatePickerCtrl.prototype.handleWindowBlur = function() {
    this.inputFocusedOnWindowBlur = document.activeElement === this.inputElement;
  };
  DatePickerCtrl.prototype.evalAttr = function(attr) {
    if (this.$attrs[attr]) {
      this.$scope.$parent.$eval(this.$attrs[attr]);
    }
  };
  DatePickerCtrl.prototype.setModelValue = function(value) {
    this.ngModelCtrl.$setViewValue(this.ngDateFilter(value, 'yyyy-MM-dd'));
  };
})();

})();
(function(){
"use strict";

angular
  .module('material.components.icon')
  .directive('mdIcon', ['$mdIcon', '$mdTheming', '$mdAria', '$sce', mdIconDirective]);
function mdIconDirective($mdIcon, $mdTheming, $mdAria, $sce) {

  return {
    restrict: 'E',
    link : postLink
  };
  function postLink(scope, element, attr) {
    $mdTheming(element);
    var lastFontIcon = attr.mdFontIcon;
    var lastFontSet = $mdIcon.fontSet(attr.mdFontSet);

    prepareForFontIcon();

    attr.$observe('mdFontIcon', fontIconChanged);
    attr.$observe('mdFontSet', fontIconChanged);
    var originalSvgSrc = element[0].getAttribute(attr.$attr.mdSvgSrc);

    var label = attr.alt || attr.mdFontIcon || attr.mdSvgIcon || element.text();
    var attrName = attr.$normalize(attr.$attr.mdSvgIcon || attr.$attr.mdSvgSrc || '');

    if ( !attr['aria-label'] ) {

      if (label !== '' && !parentsHaveText() ) {

        $mdAria.expect(element, 'aria-label', label);
        $mdAria.expect(element, 'role', 'img');

      } else if ( !element.text() ) {

        $mdAria.expect(element, 'aria-hidden', 'true');
      }
    }

    if (attrName) {
      attr.$observe(attrName, function(attrVal) {
        element.empty();
        if (attrVal) {
          $mdIcon(attrVal)
            .then(function(svg) {
            element.empty();
            element.append(svg);
          });
        }

      });
    }

    function parentsHaveText() {
      var parent = element.parent();
      if (parent.attr('aria-label') || parent.text()) {
        return true;
      }
      else if(parent.parent().attr('aria-label') || parent.parent().text()) {
        return true;
      }
      return false;
    }

    function prepareForFontIcon() {
      if (!attr.mdSvgIcon && !attr.mdSvgSrc) {
        if (attr.mdFontIcon) {
          element.addClass('md-font ' + attr.mdFontIcon);
        }

        element.addClass(lastFontSet);
      }
    }

    function fontIconChanged() {
      if (!attr.mdSvgIcon && !attr.mdSvgSrc) {
        if (attr.mdFontIcon) {
          element.removeClass(lastFontIcon);
          element.addClass(attr.mdFontIcon);

          lastFontIcon = attr.mdFontIcon;
        }

        var fontSet = $mdIcon.fontSet(attr.mdFontSet);

        if (lastFontSet !== fontSet) {
          element.removeClass(lastFontSet);
          element.addClass(fontSet);

          lastFontSet = fontSet;
        }
      }
    }
  }
}

})();
(function(){
"use strict";

  
MdIconService.$inject = ["config", "$templateRequest", "$q", "$log", "$mdUtil", "$sce"];angular
    .module('material.components.icon')
    .constant('$$mdSvgRegistry', {
        'mdTabsArrow':   'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnPjxwb2x5Z29uIHBvaW50cz0iMTUuNCw3LjQgMTQsNiA4LDEyIDE0LDE4IDE1LjQsMTYuNiAxMC44LDEyICIvPjwvZz48L3N2Zz4=',
        'mdClose':       'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnPjxwYXRoIGQ9Ik0xOSA2LjQxbC0xLjQxLTEuNDEtNS41OSA1LjU5LTUuNTktNS41OS0xLjQxIDEuNDEgNS41OSA1LjU5LTUuNTkgNS41OSAxLjQxIDEuNDEgNS41OS01LjU5IDUuNTkgNS41OSAxLjQxLTEuNDEtNS41OS01LjU5eiIvPjwvZz48L3N2Zz4=',
        'mdCancel':      'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnPjxwYXRoIGQ9Ik0xMiAyYy01LjUzIDAtMTAgNC40Ny0xMCAxMHM0LjQ3IDEwIDEwIDEwIDEwLTQuNDcgMTAtMTAtNC40Ny0xMC0xMC0xMHptNSAxMy41OWwtMS40MSAxLjQxLTMuNTktMy41OS0zLjU5IDMuNTktMS40MS0xLjQxIDMuNTktMy41OS0zLjU5LTMuNTkgMS40MS0xLjQxIDMuNTkgMy41OSAzLjU5LTMuNTkgMS40MSAxLjQxLTMuNTkgMy41OSAzLjU5IDMuNTl6Ii8+PC9nPjwvc3ZnPg==',
        'mdMenu':        'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGQ9Ik0zLDZIMjFWOEgzVjZNMywxMUgyMVYxM0gzVjExTTMsMTZIMjFWMThIM1YxNloiIC8+PC9zdmc+',
        'mdToggleArrow': 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiPjxwYXRoIGQ9Ik0yNCAxNmwtMTIgMTIgMi44MyAyLjgzIDkuMTctOS4xNyA5LjE3IDkuMTcgMi44My0yLjgzeiIvPjxwYXRoIGQ9Ik0wIDBoNDh2NDhoLTQ4eiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
        'mdCalendar':    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkgM2gtMVYxaC0ydjJIOFYxSDZ2Mkg1Yy0xLjExIDAtMS45OS45LTEuOTkgMkwzIDE5YzAgMS4xLjg5IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjVjMC0xLjEtLjktMi0yLTJ6bTAgMTZINVY4aDE0djExek03IDEwaDV2NUg3eiIvPjwvc3ZnPg==',
        'mdChecked':     'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnPjxwYXRoIGQ9Ik05IDE2LjE3TDQuODMgMTJsLTEuNDIgMS40MUw5IDE5IDIxIDdsLTEuNDEtMS40MXoiLz48L2c+PC9zdmc+'
    })
    .provider('$mdIcon', MdIconProvider);

var config = {
  defaultViewBoxSize: 24,
  defaultFontSet: 'material-icons',
  fontSets: []
};

function MdIconProvider() {
}

MdIconProvider.prototype = {
  icon: function(id, url, viewBoxSize) {
    if (id.indexOf(':') == -1) id = '$default:' + id;

    config[id] = new ConfigurationItem(url, viewBoxSize);
    return this;
  },

  iconSet: function(id, url, viewBoxSize) {
    config[id] = new ConfigurationItem(url, viewBoxSize);
    return this;
  },

  defaultIconSet: function(url, viewBoxSize) {
    var setName = '$default';

    if (!config[setName]) {
      config[setName] = new ConfigurationItem(url, viewBoxSize);
    }

    config[setName].viewBoxSize = viewBoxSize || config.defaultViewBoxSize;

    return this;
  },

  defaultViewBoxSize: function(viewBoxSize) {
    config.defaultViewBoxSize = viewBoxSize;
    return this;
  },
  fontSet: function fontSet(alias, className) {
    config.fontSets.push({
      alias: alias,
      fontSet: className || alias
    });
    return this;
  },
  defaultFontSet: function defaultFontSet(className) {
    config.defaultFontSet = !className ? '' : className;
    return this;
  },

  defaultIconSize: function defaultIconSize(iconSize) {
    config.defaultIconSize = iconSize;
    return this;
  },

  $get: ['$templateRequest', '$q', '$log', '$mdUtil', '$sce', function($templateRequest, $q, $log, $mdUtil, $sce) {
    return MdIconService(config, $templateRequest, $q, $log, $mdUtil, $sce);
  }]
};
function ConfigurationItem(url, viewBoxSize) {
  this.url = url;
  this.viewBoxSize = viewBoxSize || config.defaultViewBoxSize;
}
function MdIconService(config, $templateRequest, $q, $log, $mdUtil, $sce) {
  var iconCache = {};
  var svgCache = {};
  var urlRegex = /[-\w@:%\+.~#?&//=]{2,}\.[a-z]{2,4}\b(\/[-\w@:%\+.~#?&//=]*)?/i;
  var dataUrlRegex = /^data:image\/svg\+xml[\s*;\w\-\=]*?(base64)?,(.*)$/i;

  Icon.prototype = {clone: cloneSVG, prepare: prepareAndStyle};
  getIcon.fontSet = findRegisteredFontSet;
  return getIcon;
  function getIcon(id) {
    id = id || '';
    if (!angular.isString(id)) {
      id = $sce.getTrustedUrl(id);
    }

    if (iconCache[id]) {
      return $q.when(transformClone(iconCache[id]));
    }

    if (urlRegex.test(id) || dataUrlRegex.test(id)) {
      return loadByURL(id).then(cacheIcon(id));
    }

    if (id.indexOf(':') == -1) {
      id = '$default:' + id;
    }

    var load = config[id] ? loadByID : loadFromIconSet;
    return load(id)
      .then(cacheIcon(id));
  }
  function findRegisteredFontSet(alias) {
    var useDefault = angular.isUndefined(alias) || !(alias && alias.length);
    if (useDefault) return config.defaultFontSet;

    var result = alias;
    angular.forEach(config.fontSets, function(it) {
      if (it.alias == alias) result = it.fontSet || result;
    });

    return result;
  }

  function transformClone(cacheElement) {
    var clone = cacheElement.clone();
    var cacheSuffix = '_cache' + $mdUtil.nextUid();
    if (clone.id) clone.id += cacheSuffix;
    angular.forEach(clone.querySelectorAll('[id]'), function(item) {
      item.id += cacheSuffix;
    });

    return clone;
  }
  function cacheIcon(id) {

    return function updateCache(icon) {
      iconCache[id] = isIcon(icon) ? icon : new Icon(icon, config[id]);

      return iconCache[id].clone();
    };
  }
  function loadByID(id) {
    var iconConfig = config[id];
    return loadByURL(iconConfig.url).then(function(icon) {
      return new Icon(icon, iconConfig);
    });
  }
  function loadFromIconSet(id) {
    var setName = id.substring(0, id.lastIndexOf(':')) || '$default';
    var iconSetConfig = config[setName];

    return !iconSetConfig ? announceIdNotFound(id) : loadByURL(iconSetConfig.url).then(extractFromSet);

    function extractFromSet(set) {
      var iconName = id.slice(id.lastIndexOf(':') + 1);
      var icon = set.querySelector('#' + iconName);
      return icon ? new Icon(icon, iconSetConfig) : announceIdNotFound(id);
    }

    function announceIdNotFound(id) {
      var msg = 'icon ' + id + ' not found';
      $log.warn(msg);

      return $q.reject(msg || id);
    }
  }
  function loadByURL(url) {
    function loadByDataUrl(url) {
      var results = dataUrlRegex.exec(url);
      var isBase64 = /base64/i.test(url);
      var data = isBase64 ? window.atob(results[2]) : results[2];

      return $q.when(angular.element(data)[0]);
    }
    function loadByHttpUrl(url) {
      return $q(function(resolve, reject) {
        var announceAndReject = function(err) {
            var msg = angular.isString(err) ? err : (err.message || err.data || err.statusText);
            $log.warn(msg);
            reject(err);
          },
          extractSvg = function(response) {
            if (!svgCache[url]) {
              svgCache[url] = angular.element('<div>').append(response)[0].querySelector('svg');
            }
            resolve(svgCache[url]);
          };

        $templateRequest(url, true).then(extractSvg, announceAndReject);
      });
    }

    return dataUrlRegex.test(url)
      ? loadByDataUrl(url)
      : loadByHttpUrl(url);
  }
  function isIcon(target) {
    return angular.isDefined(target.element) && angular.isDefined(target.config);
  }
  function Icon(el, config) {
    if (el && el.tagName != 'svg') {
      el = angular.element('<svg xmlns="http://www.w3.org/2000/svg">').append(el.cloneNode(true))[0];
    }
    if (!el.getAttribute('xmlns')) {
      el.setAttribute('xmlns', "http://www.w3.org/2000/svg");
    }

    this.element = el;
    this.config = config;
    this.prepare();
  }
  function prepareAndStyle() {
    var viewBoxSize = this.config ? this.config.viewBoxSize : config.defaultViewBoxSize;
    angular.forEach({
      'fit': '',
      'height': '100%',
      'width': '100%',
      'preserveAspectRatio': 'xMidYMid meet',
      'viewBox': this.element.getAttribute('viewBox') || ('0 0 ' + viewBoxSize + ' ' + viewBoxSize),
      'focusable': false // Disable IE11s default behavior to make SVGs focusable
    }, function(val, attr) {
      this.element.setAttribute(attr, val);
    }, this);
  }
  function cloneSVG() {
    return this.element.cloneNode(true);
  }

}

})();
(function(){
"use strict";



MenuController.$inject = ["$mdMenu", "$attrs", "$element", "$scope", "$mdUtil", "$timeout", "$rootScope", "$q"];
angular
    .module('material.components.menu')
    .controller('mdMenuCtrl', MenuController);
function MenuController($mdMenu, $attrs, $element, $scope, $mdUtil, $timeout, $rootScope, $q) {

  var prefixer = $mdUtil.prefixer();
  var menuContainer;
  var self = this;
  var triggerElement;

  this.nestLevel = parseInt($attrs.mdNestLevel, 10) || 0;
  this.init = function init(setMenuContainer, opts) {
    opts = opts || {};
    menuContainer = setMenuContainer;
    triggerElement = $element[0].querySelector(prefixer.buildSelector(['ng-click', 'ng-mouseenter']));
    triggerElement.setAttribute('aria-expanded', 'false');

    this.isInMenuBar = opts.isInMenuBar;
    this.nestedMenus = $mdUtil.nodesToArray(menuContainer[0].querySelectorAll('.md-nested-menu'));

    menuContainer.on('$mdInterimElementRemove', function() {
      self.isOpen = false;
      $mdUtil.nextTick(function(){ self.onIsOpenChanged(self.isOpen);});
    });
    $mdUtil.nextTick(function(){ self.onIsOpenChanged(self.isOpen);});

    var menuContainerId = 'menu_container_' + $mdUtil.nextUid();
    menuContainer.attr('id', menuContainerId);
    angular.element(triggerElement).attr({
      'aria-owns': menuContainerId,
      'aria-haspopup': 'true'
    });

    $scope.$on('$destroy', angular.bind(this, function() {
      this.disableHoverListener();
      $mdMenu.destroy();
    }));

    menuContainer.on('$destroy', function() {
      $mdMenu.destroy();
    });
  };

  var openMenuTimeout, menuItems, deregisterScopeListeners = [];
  this.enableHoverListener = function() {
    deregisterScopeListeners.push($rootScope.$on('$mdMenuOpen', function(event, el) {
      if (menuContainer[0].contains(el[0])) {
        self.currentlyOpenMenu = el.controller('mdMenu');
        self.isAlreadyOpening = false;
        self.currentlyOpenMenu.registerContainerProxy(self.triggerContainerProxy.bind(self));
      }
    }));
    deregisterScopeListeners.push($rootScope.$on('$mdMenuClose', function(event, el) {
      if (menuContainer[0].contains(el[0])) {
        self.currentlyOpenMenu = undefined;
      }
    }));
    menuItems = angular.element($mdUtil.nodesToArray(menuContainer[0].children[0].children));
    menuItems.on('mouseenter', self.handleMenuItemHover);
    menuItems.on('mouseleave', self.handleMenuItemMouseLeave);
  };

  this.disableHoverListener = function() {
    while (deregisterScopeListeners.length) {
      deregisterScopeListeners.shift()();
    }
    menuItems && menuItems.off('mouseenter', self.handleMenuItemHover);
    menuItems && menuItems.off('mouseleave', self.handleMenuItemMouseLeave);
  };

  this.handleMenuItemHover = function(event) {
    if (self.isAlreadyOpening) return;
    var nestedMenu = (
      event.target.querySelector('md-menu')
        || $mdUtil.getClosest(event.target, 'MD-MENU')
    );
    openMenuTimeout = $timeout(function() {
      if (nestedMenu) {
        nestedMenu = angular.element(nestedMenu).controller('mdMenu');
      }

      if (self.currentlyOpenMenu && self.currentlyOpenMenu != nestedMenu) {
        var closeTo = self.nestLevel + 1;
        self.currentlyOpenMenu.close(true, { closeTo: closeTo });
        self.isAlreadyOpening = !!nestedMenu;
        nestedMenu && nestedMenu.open();
      } else if (nestedMenu && !nestedMenu.isOpen && nestedMenu.open) {
        self.isAlreadyOpening = !!nestedMenu;
        nestedMenu && nestedMenu.open();
      }
    }, nestedMenu ? 100 : 250);
    var focusableTarget = event.currentTarget.querySelector('.md-button:not([disabled])');
    focusableTarget && focusableTarget.focus();
  };

  this.handleMenuItemMouseLeave = function() {
    if (openMenuTimeout) {
      $timeout.cancel(openMenuTimeout);
      openMenuTimeout = undefined;
    }
  };
  this.open = function openMenu(ev) {
    ev && ev.stopPropagation();
    ev && ev.preventDefault();
    if (self.isOpen) return;
    self.enableHoverListener();
    self.isOpen = true;
    $mdUtil.nextTick(function(){ self.onIsOpenChanged(self.isOpen);});
    triggerElement = triggerElement || (ev ? ev.target : $element[0]);
    triggerElement.setAttribute('aria-expanded', 'true');
    $scope.$emit('$mdMenuOpen', $element);
    $mdMenu.show({
      scope: $scope,
      mdMenuCtrl: self,
      nestLevel: self.nestLevel,
      element: menuContainer,
      target: triggerElement,
      preserveElement: true,
      parent: 'body'
    }).finally(function() {
      triggerElement.setAttribute('aria-expanded', 'false');
      self.disableHoverListener();
    });
  };
  $scope.$mdOpenMenu = this.open;

  this.onIsOpenChanged = function(isOpen) {
    if (isOpen) {
      menuContainer.attr('aria-hidden', 'false');
      $element[0].classList.add('md-open');
      angular.forEach(self.nestedMenus, function(el) {
        el.classList.remove('md-open');
      });
    } else {
      menuContainer.attr('aria-hidden', 'true');
      $element[0].classList.remove('md-open');
    }
    $scope.$mdMenuIsOpen = self.isOpen;
  };

  this.focusMenuContainer = function focusMenuContainer() {
    var focusTarget = menuContainer[0]
      .querySelector(prefixer.buildSelector(['md-menu-focus-target', 'md-autofocus']));

    if (!focusTarget) focusTarget = menuContainer[0].querySelector('.md-button');
    focusTarget.focus();
  };

  this.registerContainerProxy = function registerContainerProxy(handler) {
    this.containerProxy = handler;
  };

  this.triggerContainerProxy = function triggerContainerProxy(ev) {
    this.containerProxy && this.containerProxy(ev);
  };

  this.destroy = function() {
    return self.isOpen ? $mdMenu.destroy() : $q.when(false);
  };
  this.close = function closeMenu(skipFocus, closeOpts) {
    if ( !self.isOpen ) return;
    self.isOpen = false;
    $mdUtil.nextTick(function(){ self.onIsOpenChanged(self.isOpen);});

    var eventDetails = angular.extend({}, closeOpts, { skipFocus: skipFocus });
    $scope.$emit('$mdMenuClose', $element, eventDetails);
    $mdMenu.hide(null, closeOpts);

    if (!skipFocus) {
      var el = self.restoreFocusTo || $element.find('button')[0];
      if (el instanceof angular.element) el = el[0];
      if (el) el.focus();
    }
  };
  this.positionMode = function positionMode() {
    var attachment = ($attrs.mdPositionMode || 'target').split(' ');
    if (attachment.length == 1) {
      attachment.push(attachment[0]);
    }

    return {
      left: attachment[0],
      top: attachment[1]
    };
  };
  this.offsets = function offsets() {
    var position = ($attrs.mdOffset || '0 0').split(' ').map(parseFloat);
    if (position.length == 2) {
      return {
        left: position[0],
        top: position[1]
      };
    } else if (position.length == 1) {
      return {
        top: position[0],
        left: position[0]
      };
    } else {
      throw Error('Invalid offsets specified. Please follow format <x, y> or <n>');
    }
  };
}

})();
(function(){
"use strict";

MenuDirective.$inject = ["$mdUtil"];
angular
    .module('material.components.menu')
    .directive('mdMenu', MenuDirective);
function MenuDirective($mdUtil) {
  var INVALID_PREFIX = 'Invalid HTML for md-menu: ';
  return {
    restrict: 'E',
    require: ['mdMenu', '?^mdMenuBar'],
    controller: 'mdMenuCtrl', // empty function to be built by link
    scope: true,
    compile: compile
  };

  function compile(templateElement) {
    templateElement.addClass('md-menu');
    var triggerElement = templateElement.children()[0];
    var prefixer = $mdUtil.prefixer();

    if (!prefixer.hasAttribute(triggerElement, 'ng-click')) {
      triggerElement = triggerElement
          .querySelector(prefixer.buildSelector(['ng-click', 'ng-mouseenter'])) || triggerElement;
    }
    if (triggerElement && (
      triggerElement.nodeName == 'MD-BUTTON' ||
      triggerElement.nodeName == 'BUTTON'
    ) && !triggerElement.hasAttribute('type')) {
      triggerElement.setAttribute('type', 'button');
    }

    if (templateElement.children().length != 2) {
      throw Error(INVALID_PREFIX + 'Expected two children elements.');
    }
    triggerElement && triggerElement.setAttribute('aria-haspopup', 'true');

    var nestedMenus = templateElement[0].querySelectorAll('md-menu');
    var nestingDepth = parseInt(templateElement[0].getAttribute('md-nest-level'), 10) || 0;
    if (nestedMenus) {
      angular.forEach($mdUtil.nodesToArray(nestedMenus), function(menuEl) {
        if (!menuEl.hasAttribute('md-position-mode')) {
          menuEl.setAttribute('md-position-mode', 'cascade');
        }
        menuEl.classList.add('_md-nested-menu');
        menuEl.setAttribute('md-nest-level', nestingDepth + 1);
      });
    }
    return link;
  }

  function link(scope, element, attr, ctrls) {
    var mdMenuCtrl = ctrls[0];
    var isInMenuBar = ctrls[1] != undefined;
    var menuContainer = angular.element( '<div class="_md md-open-menu-container md-whiteframe-z2"></div>');
    var menuContents = element.children()[1];

    element.addClass('_md');     // private md component indicator for styling

    if (!menuContents.hasAttribute('role')) {
      menuContents.setAttribute('role', 'menu');
    }
    menuContainer.append(menuContents);

    element.on('$destroy', function() {
      menuContainer.remove();
    });

    element.append(menuContainer);
    menuContainer[0].style.display = 'none';
    mdMenuCtrl.init(menuContainer, { isInMenuBar: isInMenuBar });

  }
}

})();
(function(){
"use strict";


MenuProvider.$inject = ["$$interimElementProvider"];angular
  .module('material.components.menu')
  .provider('$mdMenu', MenuProvider);

function MenuProvider($$interimElementProvider) {
  menuDefaultOptions.$inject = ["$mdUtil", "$mdTheming", "$mdConstant", "$document", "$window", "$q", "$$rAF", "$animateCss", "$animate"];
  var MENU_EDGE_MARGIN = 8;

  return $$interimElementProvider('$mdMenu')
    .setDefaults({
      methods: ['target'],
      options: menuDefaultOptions
    });
  function menuDefaultOptions($mdUtil, $mdTheming, $mdConstant, $document, $window, $q, $$rAF, $animateCss, $animate) {
    var prefixer = $mdUtil.prefixer();
    var animator = $mdUtil.dom.animator;

    return {
      parent: 'body',
      onShow: onShow,
      onRemove: onRemove,
      hasBackdrop: true,
      disableParentScroll: true,
      skipCompile: true,
      preserveScope: true,
      skipHide: true,
      themable: true
    };
    function showBackdrop(scope, element, options) {
      if (options.nestLevel) return angular.noop;
      if (options.disableParentScroll && !$mdUtil.getClosest(options.target, 'MD-DIALOG')) {
        options.restoreScroll = $mdUtil.disableScrollAround(options.element, options.parent);
      } else {
        options.disableParentScroll = false;
      }

      if (options.hasBackdrop) {
        options.backdrop = $mdUtil.createBackdrop(scope, "md-menu-backdrop md-click-catcher");

        $animate.enter(options.backdrop, $document[0].body);
      }
      return function hideBackdrop() {
        if (options.backdrop) options.backdrop.remove();
        if (options.disableParentScroll) options.restoreScroll();
      };
    }
    function onRemove(scope, element, opts) {
      opts.cleanupInteraction && opts.cleanupInteraction();
      opts.cleanupResizing();
      opts.hideBackdrop();

      return (opts.$destroy === true) ? detachAndClean() : animateRemoval().then( detachAndClean );
      function animateRemoval() {
        return $animateCss(element, {addClass: 'md-leave'}).start();
      }
      function detachAndClean() {
        element.removeClass('md-active');
        detachElement(element, opts);
        opts.alreadyOpen = false;
      }

    }
    function onShow(scope, element, opts) {
      sanitizeAndConfigure(opts);
      $mdTheming.inherit(opts.menuContentEl, opts.target);
      opts.cleanupResizing = startRepositioningOnResize();
      opts.hideBackdrop = showBackdrop(scope, element, opts);
      return showMenu()
        .then(function(response) {
          opts.alreadyOpen = true;
          opts.cleanupInteraction = activateInteraction();
          return response;
        });
      function showMenu() {
        opts.parent.append(element);
        element[0].style.display = '';

        return $q(function(resolve) {
          var position = calculateMenuPosition(element, opts);

          element.removeClass('md-leave');
          $animateCss(element, {
            addClass: 'md-active',
            from: animator.toCss(position),
            to: animator.toCss({transform: ''})
          })
          .start()
          .then(resolve);

        });
      }
      function sanitizeAndConfigure() {
        if (!opts.target) {
          throw Error(
            '$mdMenu.show() expected a target to animate from in options.target'
          );
        }
        angular.extend(opts, {
          alreadyOpen: false,
          isRemoved: false,
          target: angular.element(opts.target), //make sure it's not a naked dom node
          parent: angular.element(opts.parent),
          menuContentEl: angular.element(element[0].querySelector('md-menu-content'))
        });
      }
      function startRepositioningOnResize() {

        var repositionMenu = (function(target, options) {
          return $$rAF.throttle(function() {
            if (opts.isRemoved) return;
            var position = calculateMenuPosition(target, options);

            target.css(animator.toCss(position));
          });
        })(element, opts);

        $window.addEventListener('resize', repositionMenu);
        $window.addEventListener('orientationchange', repositionMenu);

        return function stopRepositioningOnResize() {
          $window.removeEventListener('resize', repositionMenu);
          $window.removeEventListener('orientationchange', repositionMenu);

        }
      }
      function activateInteraction() {
        element.addClass('md-clickable');
        if (opts.backdrop) opts.backdrop.on('click', onBackdropClick);
        opts.menuContentEl.on('keydown', onMenuKeyDown);
        opts.menuContentEl[0].addEventListener('click', captureClickListener, true);
        var focusTarget = opts.menuContentEl[0]
          .querySelector(prefixer.buildSelector(['md-menu-focus-target', 'md-autofocus']));

        if ( !focusTarget ) {
          var firstChild = opts.menuContentEl[0].firstElementChild;

          focusTarget = firstChild && (firstChild.querySelector('.md-button:not([disabled])') || firstChild.firstElementChild);
        }

        focusTarget && focusTarget.focus();

        return function cleanupInteraction() {
          element.removeClass('md-clickable');
          if (opts.backdrop) opts.backdrop.off('click', onBackdropClick);
          opts.menuContentEl.off('keydown', onMenuKeyDown);
          opts.menuContentEl[0].removeEventListener('click', captureClickListener, true);
        };

        function onMenuKeyDown(ev) {
          var handled;
          switch (ev.keyCode) {
            case $mdConstant.KEY_CODE.ESCAPE:
              opts.mdMenuCtrl.close(false, { closeAll: true });
              handled = true;
              break;
            case $mdConstant.KEY_CODE.UP_ARROW:
              if (!focusMenuItem(ev, opts.menuContentEl, opts, -1) && !opts.nestLevel) {
                opts.mdMenuCtrl.triggerContainerProxy(ev);
              }
              handled = true;
              break;
            case $mdConstant.KEY_CODE.DOWN_ARROW:
              if (!focusMenuItem(ev, opts.menuContentEl, opts, 1) && !opts.nestLevel) {
                opts.mdMenuCtrl.triggerContainerProxy(ev);
              }
              handled = true;
              break;
            case $mdConstant.KEY_CODE.LEFT_ARROW:
              if (opts.nestLevel) {
                opts.mdMenuCtrl.close();
              } else {
                opts.mdMenuCtrl.triggerContainerProxy(ev);
              }
              handled = true;
              break;
            case $mdConstant.KEY_CODE.RIGHT_ARROW:
              var parentMenu = $mdUtil.getClosest(ev.target, 'MD-MENU');
              if (parentMenu && parentMenu != opts.parent[0]) {
                ev.target.click();
              } else {
                opts.mdMenuCtrl.triggerContainerProxy(ev);
              }
              handled = true;
              break;
          }
          if (handled) {
            ev.preventDefault();
            ev.stopImmediatePropagation();
          }
        }

        function onBackdropClick(e) {
          e.preventDefault();
          e.stopPropagation();
          scope.$apply(function() {
            opts.mdMenuCtrl.close(true, { closeAll: true });
          });
        }
        function captureClickListener(e) {
          var target = e.target;
          do {
            if (target == opts.menuContentEl[0]) return;
            if ((hasAnyAttribute(target, ['ng-click', 'ng-href', 'ui-sref']) ||
                target.nodeName == 'BUTTON' || target.nodeName == 'MD-BUTTON') && !hasAnyAttribute(target, ['md-prevent-menu-close'])) {
              var closestMenu = $mdUtil.getClosest(target, 'MD-MENU');
              if (!target.hasAttribute('disabled') && (!closestMenu || closestMenu == opts.parent[0])) {
                close();
              }
              break;
            }
          } while (target = target.parentNode)

          function close() {
            scope.$apply(function() {
              opts.mdMenuCtrl.close(true, { closeAll: true });
            });
          }

          function hasAnyAttribute(target, attrs) {
            if (!target) return false;

            for (var i = 0, attr; attr = attrs[i]; ++i) {
              if (prefixer.hasAttribute(target, attr)) {
                return true;
              }
            }

            return false;
          }
        }

      }
    }
    function focusMenuItem(e, menuEl, opts, direction) {
      var currentItem = $mdUtil.getClosest(e.target, 'MD-MENU-ITEM');

      var items = $mdUtil.nodesToArray(menuEl[0].children);
      var currentIndex = items.indexOf(currentItem);
      var didFocus;
      for (var i = currentIndex + direction; i >= 0 && i < items.length; i = i + direction) {
        var focusTarget = items[i].querySelector('.md-button');
        didFocus = attemptFocus(focusTarget);
        if (didFocus) {
          break;
        }
      }
      return didFocus;
    }
    function attemptFocus(el) {
      if (el && el.getAttribute('tabindex') != -1) {
        el.focus();
        return ($document[0].activeElement == el);
      }
    }
    function detachElement(element, opts) {
      if (!opts.preserveElement) {
        if (toNode(element).parentNode === toNode(opts.parent)) {
          toNode(opts.parent).removeChild(toNode(element));
        }
      } else {
        toNode(element).style.display = 'none';
      }
    }
    function calculateMenuPosition(el, opts) {

      var containerNode = el[0],
        openMenuNode = el[0].firstElementChild,
        openMenuNodeRect = openMenuNode.getBoundingClientRect(),
        boundryNode = $document[0].body,
        boundryNodeRect = boundryNode.getBoundingClientRect();

      var menuStyle = $window.getComputedStyle(openMenuNode);

      var originNode = opts.target[0].querySelector(prefixer.buildSelector('md-menu-origin')) || opts.target[0],
        originNodeRect = originNode.getBoundingClientRect();

      var bounds = {
        left: boundryNodeRect.left + MENU_EDGE_MARGIN,
        top: Math.max(boundryNodeRect.top, 0) + MENU_EDGE_MARGIN,
        bottom: Math.max(boundryNodeRect.bottom, Math.max(boundryNodeRect.top, 0) + boundryNodeRect.height) - MENU_EDGE_MARGIN,
        right: boundryNodeRect.right - MENU_EDGE_MARGIN
      };

      var alignTarget, alignTargetRect = { top:0, left : 0, right:0, bottom:0 }, existingOffsets  = { top:0, left : 0, right:0, bottom:0  };
      var positionMode = opts.mdMenuCtrl.positionMode();

      if (positionMode.top == 'target' || positionMode.left == 'target' || positionMode.left == 'target-right') {
        alignTarget = firstVisibleChild();
        if ( alignTarget ) {
          alignTarget = alignTarget.firstElementChild || alignTarget;
          alignTarget = alignTarget.querySelector(prefixer.buildSelector('md-menu-align-target')) || alignTarget;
          alignTargetRect = alignTarget.getBoundingClientRect();

          existingOffsets = {
            top: parseFloat(containerNode.style.top || 0),
            left: parseFloat(containerNode.style.left || 0)
          };
        }
      }

      var position = {};
      var transformOrigin = 'top ';

      switch (positionMode.top) {
        case 'target':
          position.top = existingOffsets.top + originNodeRect.top - alignTargetRect.top;
          break;
        case 'cascade':
          position.top = originNodeRect.top - parseFloat(menuStyle.paddingTop) - originNode.style.top;
          break;
        case 'bottom':
          position.top = originNodeRect.top + originNodeRect.height;
          break;
        default:
          throw new Error('Invalid target mode "' + positionMode.top + '" specified for md-menu on Y axis.');
      }

      var rtl = ($mdUtil.bidi() == 'rtl');

      switch (positionMode.left) {
        case 'target':
          position.left = existingOffsets.left + originNodeRect.left - alignTargetRect.left;
          transformOrigin += rtl ? 'right'  : 'left';
          break;
        case 'target-left':
          position.left = originNodeRect.left;
          transformOrigin += 'left';
          break;
        case 'target-right':
          position.left = originNodeRect.right - openMenuNodeRect.width + (openMenuNodeRect.right - alignTargetRect.right);
          transformOrigin += 'right';
          break;
        case 'cascade':
          var willFitRight = rtl ? (originNodeRect.left - openMenuNodeRect.width) < bounds.left : (originNodeRect.right + openMenuNodeRect.width) < bounds.right;
          position.left = willFitRight ? originNodeRect.right - originNode.style.left : originNodeRect.left - originNode.style.left - openMenuNodeRect.width;
          transformOrigin += willFitRight ? 'left' : 'right';
          break;
        case 'right':
          if (rtl) {
            position.left = originNodeRect.right - originNodeRect.width;
            transformOrigin += 'left';
          } else {
            position.left = originNodeRect.right - openMenuNodeRect.width;
            transformOrigin += 'right';
          }
          break;
        case 'left':
          if (rtl) {
            position.left = originNodeRect.right - openMenuNodeRect.width;
            transformOrigin += 'right';
          } else {
            position.left = originNodeRect.left;
            transformOrigin += 'left';
          }
          break;
        default:
          throw new Error('Invalid target mode "' + positionMode.left + '" specified for md-menu on X axis.');
      }

      var offsets = opts.mdMenuCtrl.offsets();
      position.top += offsets.top;
      position.left += offsets.left;

      clamp(position);

      var scaleX = Math.round(100 * Math.min(originNodeRect.width / containerNode.offsetWidth, 1.0)) / 100;
      var scaleY = Math.round(100 * Math.min(originNodeRect.height / containerNode.offsetHeight, 1.0)) / 100;

      return {
        top: Math.round(position.top),
        left: Math.round(position.left),
        transform: !opts.alreadyOpen ? $mdUtil.supplant('scale({0},{1})', [scaleX, scaleY]) : undefined,
        transformOrigin: transformOrigin
      };
      function clamp(pos) {
        pos.top = Math.max(Math.min(pos.top, bounds.bottom - containerNode.offsetHeight), bounds.top);
        pos.left = Math.max(Math.min(pos.left, bounds.right - containerNode.offsetWidth), bounds.left);
      }
      function firstVisibleChild() {
        for (var i = 0; i < openMenuNode.children.length; ++i) {
          if ($window.getComputedStyle(openMenuNode.children[i]).display != 'none') {
            return openMenuNode.children[i];
          }
        }
      }
    }
  }
  function toNode(el) {
    if (el instanceof angular.element) {
      el = el[0];
    }
    return el;
  }
}

})();
(function(){
"use strict";


MenuBarController.$inject = ["$scope", "$rootScope", "$element", "$attrs", "$mdConstant", "$document", "$mdUtil", "$timeout"];
angular
  .module('material.components.menuBar')
  .controller('MenuBarController', MenuBarController);

var BOUND_MENU_METHODS = ['handleKeyDown', 'handleMenuHover', 'scheduleOpenHoveredMenu', 'cancelScheduledOpen'];
function MenuBarController($scope, $rootScope, $element, $attrs, $mdConstant, $document, $mdUtil, $timeout) {
  this.$element = $element;
  this.$attrs = $attrs;
  this.$mdConstant = $mdConstant;
  this.$mdUtil = $mdUtil;
  this.$document = $document;
  this.$scope = $scope;
  this.$rootScope = $rootScope;
  this.$timeout = $timeout;

  var self = this;
  angular.forEach(BOUND_MENU_METHODS, function(methodName) {
    self[methodName] = angular.bind(self, self[methodName]);
  });
}

MenuBarController.prototype.init = function() {
  var $element = this.$element;
  var $mdUtil = this.$mdUtil;
  var $scope = this.$scope;

  var self = this;
  var deregisterFns = [];
  $element.on('keydown', this.handleKeyDown);
  this.parentToolbar = $mdUtil.getClosest($element, 'MD-TOOLBAR');

  deregisterFns.push(this.$rootScope.$on('$mdMenuOpen', function(event, el) {
    if (self.getMenus().indexOf(el[0]) != -1) {
      $element[0].classList.add('md-open');
      el[0].classList.add('md-open');
      self.currentlyOpenMenu = el.controller('mdMenu');
      self.currentlyOpenMenu.registerContainerProxy(self.handleKeyDown);
      self.enableOpenOnHover();
    }
  }));

  deregisterFns.push(this.$rootScope.$on('$mdMenuClose', function(event, el, opts) {
    var rootMenus = self.getMenus();
    if (rootMenus.indexOf(el[0]) != -1) {
      $element[0].classList.remove('md-open');
      el[0].classList.remove('md-open');
    }

    if ($element[0].contains(el[0])) {
      var parentMenu = el[0];
      while (parentMenu && rootMenus.indexOf(parentMenu) == -1) {
        parentMenu = $mdUtil.getClosest(parentMenu, 'MD-MENU', true);
      }
      if (parentMenu) {
        if (!opts.skipFocus) parentMenu.querySelector('button:not([disabled])').focus();
        self.currentlyOpenMenu = undefined;
        self.disableOpenOnHover();
        self.setKeyboardMode(true);
      }
    }
  }));

  $scope.$on('$destroy', function() {
    self.disableOpenOnHover();
    while (deregisterFns.length) {
      deregisterFns.shift()();
    }
  });


  this.setKeyboardMode(true);
};

MenuBarController.prototype.setKeyboardMode = function(enabled) {
  if (enabled) this.$element[0].classList.add('md-keyboard-mode');
  else this.$element[0].classList.remove('md-keyboard-mode');
};

MenuBarController.prototype.enableOpenOnHover = function() {
  if (this.openOnHoverEnabled) return;

  var self = this;

  self.openOnHoverEnabled = true;

  if (self.parentToolbar) {
    self.parentToolbar.classList.add('md-has-open-menu');
    self.$mdUtil.nextTick(function() {
      angular.element(self.parentToolbar).on('click', self.handleParentClick);
    }, false);
  }

  angular
    .element(self.getMenus())
    .on('mouseenter', self.handleMenuHover);
};

MenuBarController.prototype.handleMenuHover = function(e) {
  this.setKeyboardMode(false);
  if (this.openOnHoverEnabled) {
    this.scheduleOpenHoveredMenu(e);
  }
};

MenuBarController.prototype.disableOpenOnHover = function() {
  if (!this.openOnHoverEnabled) return;

  this.openOnHoverEnabled = false;

  if (this.parentToolbar) {
    this.parentToolbar.classList.remove('md-has-open-menu');
    angular.element(this.parentToolbar).off('click', this.handleParentClick);
  }

  angular
    .element(this.getMenus())
    .off('mouseenter', this.handleMenuHover);
};

MenuBarController.prototype.scheduleOpenHoveredMenu = function(e) {
  var menuEl = angular.element(e.currentTarget);
  var menuCtrl = menuEl.controller('mdMenu');
  this.setKeyboardMode(false);
  this.scheduleOpenMenu(menuCtrl);
};

MenuBarController.prototype.scheduleOpenMenu = function(menuCtrl) {
  var self = this;
  var $timeout = this.$timeout;
  if (menuCtrl != self.currentlyOpenMenu) {
    $timeout.cancel(self.pendingMenuOpen);
    self.pendingMenuOpen = $timeout(function() {
      self.pendingMenuOpen = undefined;
      if (self.currentlyOpenMenu) {
        self.currentlyOpenMenu.close(true, { closeAll: true });
      }
      menuCtrl.open();
    }, 200, false);
  }
};

MenuBarController.prototype.handleKeyDown = function(e) {
  var keyCodes = this.$mdConstant.KEY_CODE;
  var currentMenu = this.currentlyOpenMenu;
  var wasOpen = currentMenu && currentMenu.isOpen;
  this.setKeyboardMode(true);
  var handled, newMenu, newMenuCtrl;
  switch (e.keyCode) {
    case keyCodes.DOWN_ARROW:
      if (currentMenu) {
        currentMenu.focusMenuContainer();
      } else {
        this.openFocusedMenu();
      }
      handled = true;
      break;
    case keyCodes.UP_ARROW:
      currentMenu && currentMenu.close();
      handled = true;
      break;
    case keyCodes.LEFT_ARROW:
      newMenu = this.focusMenu(-1);
      if (wasOpen) {
        newMenuCtrl = angular.element(newMenu).controller('mdMenu');
        this.scheduleOpenMenu(newMenuCtrl);
      }
      handled = true;
      break;
    case keyCodes.RIGHT_ARROW:
      newMenu = this.focusMenu(+1);
      if (wasOpen) {
        newMenuCtrl = angular.element(newMenu).controller('mdMenu');
        this.scheduleOpenMenu(newMenuCtrl);
      }
      handled = true;
      break;
  }
  if (handled) {
    e && e.preventDefault && e.preventDefault();
    e && e.stopImmediatePropagation && e.stopImmediatePropagation();
  }
};

MenuBarController.prototype.focusMenu = function(direction) {
  var menus = this.getMenus();
  var focusedIndex = this.getFocusedMenuIndex();

  if (focusedIndex == -1) { focusedIndex = this.getOpenMenuIndex(); }

  var changed = false;

  if (focusedIndex == -1) { focusedIndex = 0; changed = true; }
  else if (
    direction < 0 && focusedIndex > 0 ||
    direction > 0 && focusedIndex < menus.length - direction
  ) {
    focusedIndex += direction;
    changed = true;
  }
  if (changed) {
    menus[focusedIndex].querySelector('button').focus();
    return menus[focusedIndex];
  }
};

MenuBarController.prototype.openFocusedMenu = function() {
  var menu = this.getFocusedMenu();
  menu && angular.element(menu).controller('mdMenu').open();
};

MenuBarController.prototype.getMenus = function() {
  var $element = this.$element;
  return this.$mdUtil.nodesToArray($element[0].children)
    .filter(function(el) { return el.nodeName == 'MD-MENU'; });
};

MenuBarController.prototype.getFocusedMenu = function() {
  return this.getMenus()[this.getFocusedMenuIndex()];
};

MenuBarController.prototype.getFocusedMenuIndex = function() {
  var $mdUtil = this.$mdUtil;
  var focusedEl = $mdUtil.getClosest(
    this.$document[0].activeElement,
    'MD-MENU'
  );
  if (!focusedEl) return -1;

  var focusedIndex = this.getMenus().indexOf(focusedEl);
  return focusedIndex;
};

MenuBarController.prototype.getOpenMenuIndex = function() {
  var menus = this.getMenus();
  for (var i = 0; i < menus.length; ++i) {
    if (menus[i].classList.contains('md-open')) return i;
  }
  return -1;
};

MenuBarController.prototype.handleParentClick = function(event) {
  var openMenu = this.querySelector('md-menu.md-open');

  if (openMenu && !openMenu.contains(event.target)) {
    angular.element(openMenu).controller('mdMenu').close();
  }
};







})();
(function(){
"use strict";

MenuBarDirective.$inject = ["$mdUtil", "$mdTheming"];
angular
  .module('material.components.menuBar')
  .directive('mdMenuBar', MenuBarDirective);
function MenuBarDirective($mdUtil, $mdTheming) {
  return {
    restrict: 'E',
    require: 'mdMenuBar',
    controller: 'MenuBarController',

    compile: function compile(templateEl, templateAttrs) {
      if (!templateAttrs.ariaRole) {
        templateEl[0].setAttribute('role', 'menubar');
      }
      angular.forEach(templateEl[0].children, function(menuEl) {
        if (menuEl.nodeName == 'MD-MENU') {
          if (!menuEl.hasAttribute('md-position-mode')) {
            menuEl.setAttribute('md-position-mode', 'left bottom');
            menuEl.querySelector('button, a, md-button').setAttribute('role', 'menuitem');
          }
          var contentEls = $mdUtil.nodesToArray(menuEl.querySelectorAll('md-menu-content'));
          angular.forEach(contentEls, function(contentEl) {
            contentEl.classList.add('md-menu-bar-menu');
            contentEl.classList.add('md-dense');
            if (!contentEl.hasAttribute('width')) {
              contentEl.setAttribute('width', 5);
            }
          });
        }
      });
      templateEl.find('md-menu-item').addClass('md-in-menu-bar');

      return function postLink(scope, el, attr, ctrl) {
        el.addClass('_md');     // private md component indicator for styling
        $mdTheming(scope, el);
        ctrl.init();
      };
    }
  };

}

})();
(function(){
"use strict";


angular
  .module('material.components.menuBar')
  .directive('mdMenuDivider', MenuDividerDirective);


function MenuDividerDirective() {
  return {
    restrict: 'E',
    compile: function(templateEl, templateAttrs) {
      if (!templateAttrs.role) {
        templateEl[0].setAttribute('role', 'separator');
      }
    }
  };
}

})();
(function(){
"use strict";


MenuItemController.$inject = ["$scope", "$element", "$attrs"];
angular
  .module('material.components.menuBar')
  .controller('MenuItemController', MenuItemController);
function MenuItemController($scope, $element, $attrs) {
  this.$element = $element;
  this.$attrs = $attrs;
  this.$scope = $scope;
}

MenuItemController.prototype.init = function(ngModel) {
  var $element = this.$element;
  var $attrs = this.$attrs;

  this.ngModel = ngModel;
  if ($attrs.type == 'checkbox' || $attrs.type == 'radio') {
    this.mode  = $attrs.type;
    this.iconEl = $element[0].children[0];
    this.buttonEl = $element[0].children[1];
    if (ngModel) {
      this.initClickListeners();
    }
  }
};
MenuItemController.prototype.clearNgAria = function() {
  var el = this.$element[0];
  var clearAttrs = ['role', 'tabindex', 'aria-invalid', 'aria-checked'];
  angular.forEach(clearAttrs, function(attr) {
    el.removeAttribute(attr);
  });
};

MenuItemController.prototype.initClickListeners = function() {
  var self = this;
  var ngModel = this.ngModel;
  var $scope = this.$scope;
  var $attrs = this.$attrs;
  var $element = this.$element;
  var mode = this.mode;

  this.handleClick = angular.bind(this, this.handleClick);

  var icon = this.iconEl;
  var button = angular.element(this.buttonEl);
  var handleClick = this.handleClick;

  $attrs.$observe('disabled', setDisabled);
  setDisabled($attrs.disabled);

  ngModel.$render = function render() {
    self.clearNgAria();
    if (isSelected()) {
      icon.style.display = '';
      button.attr('aria-checked', 'true');
    } else {
      icon.style.display = 'none';
      button.attr('aria-checked', 'false');
    }
  };

  $scope.$$postDigest(ngModel.$render);

  function isSelected() {
    if (mode == 'radio') {
      var val = $attrs.ngValue ? $scope.$eval($attrs.ngValue) : $attrs.value;
      return ngModel.$modelValue == val;
    } else {
      return ngModel.$modelValue;
    }
  }

  function setDisabled(disabled) {
    if (disabled) {
      button.off('click', handleClick);
    } else {
      button.on('click', handleClick);
    }
  }
};

MenuItemController.prototype.handleClick = function(e) {
  var mode = this.mode;
  var ngModel = this.ngModel;
  var $attrs = this.$attrs;
  var newVal;
  if (mode == 'checkbox') {
    newVal = !ngModel.$modelValue;
  } else if (mode == 'radio') {
    newVal = $attrs.ngValue ? this.$scope.$eval($attrs.ngValue) : $attrs.value;
  }
  ngModel.$setViewValue(newVal);
  ngModel.$render();
};

})();
(function(){
"use strict";


MenuItemDirective.$inject = ["$mdUtil", "$$mdSvgRegistry"];
angular
  .module('material.components.menuBar')
  .directive('mdMenuItem', MenuItemDirective);
function MenuItemDirective($mdUtil, $$mdSvgRegistry) {
  return {
    controller: 'MenuItemController',
    require: ['mdMenuItem', '?ngModel'],
    priority: 210, // ensure that our post link runs after ngAria
    compile: function(templateEl, templateAttrs) {
      var type = templateAttrs.type;
      var inMenuBarClass = 'md-in-menu-bar';
      if ((type == 'checkbox' || type == 'radio') && templateEl.hasClass(inMenuBarClass)) {
        var text = templateEl[0].textContent;
        var buttonEl = angular.element('<md-button type="button"></md-button>');
        var iconTemplate = '<md-icon md-svg-src="' + $$mdSvgRegistry.mdChecked + '"></md-icon>';

        buttonEl.html(text);
        buttonEl.attr('tabindex', '0');

        templateEl.html('');
        templateEl.append(angular.element(iconTemplate));
        templateEl.append(buttonEl);
        templateEl.addClass('md-indent').removeClass(inMenuBarClass);

        setDefault('role', type == 'checkbox' ? 'menuitemcheckbox' : 'menuitemradio', buttonEl);
        moveAttrToButton('ng-disabled');

      } else {
        setDefault('role', 'menuitem', templateEl[0].querySelector('md-button, button, a'));
      }


      return function(scope, el, attrs, ctrls) {
        var ctrl = ctrls[0];
        var ngModel = ctrls[1];
        ctrl.init(ngModel);
      };

      function setDefault(attr, val, el) {
        el = el || templateEl;
        if (el instanceof angular.element) {
          el = el[0];
        }
        if (!el.hasAttribute(attr)) {
          el.setAttribute(attr, val);
        }
      }

      function moveAttrToButton(attribute) {
        var attributes = $mdUtil.prefixer(attribute);

        angular.forEach(attributes, function(attr) {
          if (templateEl[0].hasAttribute(attr)) {
            var val = templateEl[0].getAttribute(attr);
            buttonEl[0].setAttribute(attr, val);
            templateEl[0].removeAttribute(attr);
          }
        });
      }
    }
  };
}

})();
(function(){
"use strict";

MdProgressCircularDirective.$inject = ["$window", "$mdProgressCircular", "$mdTheming", "$mdUtil", "$interval", "$log"];
angular
  .module('material.components.progressCircular')
  .directive('mdProgressCircular', MdProgressCircularDirective);
function MdProgressCircularDirective($window, $mdProgressCircular, $mdTheming,
                                     $mdUtil, $interval, $log) {
  var rAF = $window.requestAnimationFrame ||
            $window.webkitRequestAnimationFrame ||
            angular.noop;

  var cAF = $window.cancelAnimationFrame ||
            $window.webkitCancelAnimationFrame ||
            $window.webkitCancelRequestAnimationFrame ||
            angular.noop;

  var DEGREE_IN_RADIANS = $window.Math.PI / 180;
  var MODE_DETERMINATE = 'determinate';
  var MODE_INDETERMINATE = 'indeterminate';
  var DISABLED_CLASS = '_md-progress-circular-disabled';
  var INDETERMINATE_CLASS = 'md-mode-indeterminate';

  return {
    restrict: 'E',
    scope: {
      value: '@',
      mdDiameter: '@',
      mdMode: '@'
    },
    template:
      '<svg xmlns="http://www.w3.org/2000/svg">' +
        '<path fill="none"/>' +
      '</svg>',
    compile: function(element, attrs) {
      element.attr({
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'role': 'progressbar'
      });

      if (angular.isUndefined(attrs.mdMode)) {
        var hasValue = angular.isDefined(attrs.value);
        var mode = hasValue ? MODE_DETERMINATE : MODE_INDETERMINATE;
        var info = "Auto-adding the missing md-mode='{0}' to the ProgressCircular element";
        attrs.$set('mdMode', mode);
      } else {
        attrs.$set('mdMode', attrs.mdMode.trim());
      }

      return MdProgressCircularLink;
    }
  };

  function MdProgressCircularLink(scope, element, attrs) {
    var node = element[0];
    var svg = angular.element(node.querySelector('svg'));
    var path = angular.element(node.querySelector('path'));
    var startIndeterminate = $mdProgressCircular.startIndeterminate;
    var endIndeterminate = $mdProgressCircular.endIndeterminate;
    var rotationIndeterminate = 0;
    var lastAnimationId = 0;
    var lastDrawFrame;
    var interval;

    $mdTheming(element);
    element.toggleClass(DISABLED_CLASS, attrs.hasOwnProperty('disabled'));
    if(scope.mdMode === MODE_INDETERMINATE){
      startIndeterminateAnimation();
    }

    scope.$on('$destroy', function(){
      cleanupIndeterminateAnimation();

      if (lastDrawFrame) {
        cAF(lastDrawFrame);
      }
    });

    scope.$watchGroup(['value', 'mdMode', function() {
      var isDisabled = node.disabled;
      if (isDisabled === true || isDisabled === false){
        return isDisabled;
      }
      return angular.isDefined(element.attr('disabled'));

    }], function(newValues, oldValues) {
      var mode = newValues[1];
      var isDisabled = newValues[2];
      var wasDisabled = oldValues[2];

      if (isDisabled !== wasDisabled) {
        element.toggleClass(DISABLED_CLASS, !!isDisabled);
      }

      if (isDisabled) {
        cleanupIndeterminateAnimation();
      } else {
        if (mode !== MODE_DETERMINATE && mode !== MODE_INDETERMINATE) {
          mode = MODE_INDETERMINATE;
          attrs.$set('mdMode', mode);
        }

        if (mode === MODE_INDETERMINATE) {
          startIndeterminateAnimation();
        } else {
          var newValue = clamp(newValues[0]);

          cleanupIndeterminateAnimation();

          element.attr('aria-valuenow', newValue);
          renderCircle(clamp(oldValues[0]), newValue);
        }
      }

    });
    scope.$watch('mdDiameter', function(newValue) {
      var diameter = getSize(newValue);
      var strokeWidth = getStroke(diameter);
      var transformOrigin = (diameter / 2) + 'px';
      var dimensions = {
        width: diameter + 'px',
        height: diameter + 'px'
      };
      svg[0].setAttribute('viewBox', '0 0 ' + diameter + ' ' + diameter);
      svg
        .css(dimensions)
        .css('transform-origin', transformOrigin + ' ' + transformOrigin + ' ' + transformOrigin);

      element.css(dimensions);
      path.css('stroke-width',  strokeWidth + 'px');
    });

    function renderCircle(animateFrom, animateTo, easing, duration, rotation) {
      var id = ++lastAnimationId;
      var startTime = $mdUtil.now();
      var changeInValue = animateTo - animateFrom;
      var diameter = getSize(scope.mdDiameter);
      var pathDiameter = diameter - getStroke(diameter);
      var ease = easing || $mdProgressCircular.easeFn;
      var animationDuration = duration || $mdProgressCircular.duration;
      if (animateTo === animateFrom) {
        path.attr('d', getSvgArc(animateTo, diameter, pathDiameter, rotation));
      } else {
        lastDrawFrame = rAF(function animation() {
          var currentTime = $window.Math.max(0, $window.Math.min($mdUtil.now() - startTime, animationDuration));

          path.attr('d', getSvgArc(
            ease(currentTime, animateFrom, changeInValue, animationDuration),
            diameter,
            pathDiameter,
            rotation
          ));
          if (id === lastAnimationId && currentTime < animationDuration) {
            lastDrawFrame = rAF(animation);
          }
        });
      }
    }

    function animateIndeterminate() {
      renderCircle(
        startIndeterminate,
        endIndeterminate,
        $mdProgressCircular.easeFnIndeterminate,
        $mdProgressCircular.durationIndeterminate,
        rotationIndeterminate
      );
      rotationIndeterminate = (rotationIndeterminate + endIndeterminate) % 100;

      var temp = startIndeterminate;
      startIndeterminate = -endIndeterminate;
      endIndeterminate = -temp;
    }

    function startIndeterminateAnimation() {
      if (!interval) {
        interval = $interval(
          animateIndeterminate,
          $mdProgressCircular.durationIndeterminate + 50,
          0,
          false
        );

        animateIndeterminate();

        element
          .addClass(INDETERMINATE_CLASS)
          .removeAttr('aria-valuenow');
      }
    }

    function cleanupIndeterminateAnimation() {
      if (interval) {
        $interval.cancel(interval);
        interval = null;
        element.removeClass(INDETERMINATE_CLASS);
      }
    }
  }
  function getSvgArc(current, diameter, pathDiameter, rotation) {
    var maximumAngle = 359.99 / 100;
    var startPoint = rotation || 0;
    var radius = diameter / 2;
    var pathRadius = pathDiameter / 2;

    var startAngle = startPoint * maximumAngle;
    var endAngle = current * maximumAngle;
    var start = polarToCartesian(radius, pathRadius, startAngle);
    var end = polarToCartesian(radius, pathRadius, endAngle + startAngle);
    var arcSweep = endAngle < 0 ? 0 : 1;
    var largeArcFlag;

    if (endAngle < 0) {
      largeArcFlag = endAngle >= -180 ? 0 : 1;
    } else {
      largeArcFlag = endAngle <= 180 ? 0 : 1;
    }

    return 'M' + start + 'A' + pathRadius + ',' + pathRadius +
      ' 0 ' + largeArcFlag + ',' + arcSweep + ' ' + end;
  }
  function polarToCartesian(radius, pathRadius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * DEGREE_IN_RADIANS;

    return (radius + (pathRadius * $window.Math.cos(angleInRadians))) +
      ',' + (radius + (pathRadius * $window.Math.sin(angleInRadians)));
  }
  function clamp(value) {
    return $window.Math.max(0, $window.Math.min(value || 0, 100));
  }
  function getSize(value) {
    var defaultValue = $mdProgressCircular.progressSize;

    if (value) {
      var parsed = parseFloat(value);

      if (value.lastIndexOf('%') === value.length - 1) {
        parsed = (parsed / 100) * defaultValue;
      }

      return parsed;
    }

    return defaultValue;
  }
  function getStroke(diameter) {
    return $mdProgressCircular.strokeWidth / 100 * diameter;
  }
}

})();
(function(){
"use strict";

angular
  .module('material.components.progressCircular')
  .provider("$mdProgressCircular", MdProgressCircularProvider);

function MdProgressCircularProvider() {
  var progressConfig = {
    progressSize: 50,
    strokeWidth: 10,
    duration: 100,
    easeFn: linearEase,

    durationIndeterminate: 500,
    startIndeterminate: 3,
    endIndeterminate: 80,
    easeFnIndeterminate: materialEase,

    easingPresets: {
      linearEase: linearEase,
      materialEase: materialEase
    }
  };

  return {
    configure: function(options) {
      progressConfig = angular.extend(progressConfig, options || {});
      return progressConfig;
    },
    $get: function() { return progressConfig; }
  };

  function linearEase(t, b, c, d) {
    return c * t / d + b;
  }

  function materialEase(t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (6 * tc * ts + -15 * ts * ts + 10 * tc);
  }
}

})();
(function(){
"use strict";
angular
    .module('material.components.tabs')
    .directive('mdTab', MdTab);

function MdTab () {
  return {
    require:  '^?mdTabs',
    terminal: true,
    compile:  function (element, attr) {
      var label = firstChild(element, 'md-tab-label'),
          body  = firstChild(element, 'md-tab-body');

      if (label.length == 0) {
        label = angular.element('<md-tab-label></md-tab-label>');
        if (attr.label) label.text(attr.label);
        else label.append(element.contents());

        if (body.length == 0) {
          var contents = element.contents().detach();
          body         = angular.element('<md-tab-body></md-tab-body>');
          body.append(contents);
        }
      }

      element.append(label);
      if (body.html()) element.append(body);

      return postLink;
    },
    scope:    {
      active:   '=?mdActive',
      disabled: '=?ngDisabled',
      select:   '&?mdOnSelect',
      deselect: '&?mdOnDeselect'
    }
  };

  function postLink (scope, element, attr, ctrl) {
    if (!ctrl) return;
    var index = ctrl.getTabElementIndex(element),
        body  = firstChild(element, 'md-tab-body').remove(),
        label = firstChild(element, 'md-tab-label').remove(),
        data  = ctrl.insertTab({
          scope:    scope,
          parent:   scope.$parent,
          index:    index,
          element:  element,
          template: body.html(),
          label:    label.html()
        }, index);

    scope.select   = scope.select || angular.noop;
    scope.deselect = scope.deselect || angular.noop;

    scope.$watch('active', function (active) { if (active) ctrl.select(data.getIndex(), true); });
    scope.$watch('disabled', function () { ctrl.refreshIndex(); });
    scope.$watch(
        function () {
          return ctrl.getTabElementIndex(element);
        },
        function (newIndex) {
          data.index = newIndex;
          ctrl.updateTabOrder();
        }
    );
    scope.$on('$destroy', function () { ctrl.removeTab(data); });
  }

  function firstChild (element, tagName) {
    var children = element[0].children;
    for (var i = 0, len = children.length; i < len; i++) {
      var child = children[i];
      if (child.tagName === tagName.toUpperCase()) return angular.element(child);
    }
    return angular.element();
  }
}

})();
(function(){
"use strict";

angular
    .module('material.components.tabs')
    .directive('mdTabItem', MdTabItem);

function MdTabItem () {
  return {
    require: '^?mdTabs',
    link:    function link (scope, element, attr, ctrl) {
      if (!ctrl) return;
      ctrl.attachRipple(scope, element);
    }
  };
}

})();
(function(){
"use strict";

angular
    .module('material.components.tabs')
    .directive('mdTabLabel', MdTabLabel);

function MdTabLabel () {
  return { terminal: true };
}


})();
(function(){
"use strict";


MdTabScroll.$inject = ["$parse"];angular.module('material.components.tabs')
    .directive('mdTabScroll', MdTabScroll);

function MdTabScroll ($parse) {
  return {
    restrict: 'A',
    compile: function ($element, attr) {
      var fn = $parse(attr.mdTabScroll, null, true);
      return function ngEventHandler (scope, element) {
        element.on('mousewheel', function (event) {
          scope.$apply(function () { fn(scope, { $event: event }); });
        });
      };
    }
  }
}

})();
(function(){
"use strict";


MdTabsController.$inject = ["$scope", "$element", "$window", "$mdConstant", "$mdTabInkRipple", "$mdUtil", "$animateCss", "$attrs", "$compile", "$mdTheming"];angular
    .module('material.components.tabs')
    .controller('MdTabsController', MdTabsController);
function MdTabsController ($scope, $element, $window, $mdConstant, $mdTabInkRipple,
                           $mdUtil, $animateCss, $attrs, $compile, $mdTheming) {
  var ctrl      = this,
      locked    = false,
      elements  = getElements(),
      queue     = [],
      destroyed = false,
      loaded    = false;
  defineOneWayBinding('stretchTabs', handleStretchTabs);
  defineProperty('focusIndex', handleFocusIndexChange, ctrl.selectedIndex || 0);
  defineProperty('offsetLeft', handleOffsetChange, 0);
  defineProperty('hasContent', handleHasContent, false);
  defineProperty('maxTabWidth', handleMaxTabWidth, getMaxTabWidth());
  defineProperty('shouldPaginate', handleShouldPaginate, false);
  defineBooleanAttribute('noInkBar', handleInkBar);
  defineBooleanAttribute('dynamicHeight', handleDynamicHeight);
  defineBooleanAttribute('noPagination');
  defineBooleanAttribute('swipeContent');
  defineBooleanAttribute('noDisconnect');
  defineBooleanAttribute('autoselect');
  defineBooleanAttribute('noSelectClick');
  defineBooleanAttribute('centerTabs', handleCenterTabs, false);
  defineBooleanAttribute('enableDisconnect');
  ctrl.scope             = $scope;
  ctrl.parent            = $scope.$parent;
  ctrl.tabs              = [];
  ctrl.lastSelectedIndex = null;
  ctrl.hasFocus          = false;
  ctrl.lastClick         = true;
  ctrl.shouldCenterTabs  = shouldCenterTabs();
  ctrl.updatePagination   = $mdUtil.debounce(updatePagination, 100);
  ctrl.redirectFocus      = redirectFocus;
  ctrl.attachRipple       = attachRipple;
  ctrl.insertTab          = insertTab;
  ctrl.removeTab          = removeTab;
  ctrl.select             = select;
  ctrl.scroll             = scroll;
  ctrl.nextPage           = nextPage;
  ctrl.previousPage       = previousPage;
  ctrl.keydown            = keydown;
  ctrl.canPageForward     = canPageForward;
  ctrl.canPageBack        = canPageBack;
  ctrl.refreshIndex       = refreshIndex;
  ctrl.incrementIndex     = incrementIndex;
  ctrl.getTabElementIndex = getTabElementIndex;
  ctrl.updateInkBarStyles = $mdUtil.debounce(updateInkBarStyles, 100);
  ctrl.updateTabOrder     = $mdUtil.debounce(updateTabOrder, 100);

  init();
  function init () {
    ctrl.selectedIndex = ctrl.selectedIndex || 0;
    compileTemplate();
    configureWatchers();
    bindEvents();
    $mdTheming($element);
    $mdUtil.nextTick(function () {
      elements = getElements();
      updateHeightFromContent();
      adjustOffset();
      updateInkBarStyles();
      ctrl.tabs[ ctrl.selectedIndex ] && ctrl.tabs[ ctrl.selectedIndex ].scope.select();
      loaded = true;
      updatePagination();
    });
  }
  function compileTemplate () {
    var template = $attrs.$mdTabsTemplate,
        element  = angular.element($element[0].querySelector('md-tab-data'));

    element.html(template);
    $compile(element.contents())(ctrl.parent);
    delete $attrs.$mdTabsTemplate;
  }
  function bindEvents () {
    angular.element($window).on('resize', handleWindowResize);
    $scope.$on('$destroy', cleanup);
  }
  function configureWatchers () {
    $scope.$watch('$mdTabsCtrl.selectedIndex', handleSelectedIndexChange);
  }
  function defineOneWayBinding (key, handler) {
    var attr = $attrs.$normalize('md-' + key);
    if (handler) defineProperty(key, handler);
    $attrs.$observe(attr, function (newValue) { ctrl[ key ] = newValue; });
  }
  function defineBooleanAttribute (key, handler) {
    var attr = $attrs.$normalize('md-' + key);
    if (handler) defineProperty(key, handler);
    if ($attrs.hasOwnProperty(attr)) updateValue($attrs[attr]);
    $attrs.$observe(attr, updateValue);
    function updateValue (newValue) {
      ctrl[ key ] = newValue !== 'false';
    }
  }
  function cleanup () {
    destroyed = true;
    angular.element($window).off('resize', handleWindowResize);
  }
  function handleStretchTabs (stretchTabs) {
    var elements = getElements();
    angular.element(elements.wrapper).toggleClass('md-stretch-tabs', shouldStretchTabs());
    updateInkBarStyles();
  }

  function handleCenterTabs (newValue) {
    ctrl.shouldCenterTabs = shouldCenterTabs();
  }

  function handleMaxTabWidth (newWidth, oldWidth) {
    if (newWidth !== oldWidth) {
      var elements = getElements();

      angular.forEach(elements.tabs, function(tab) {
        tab.style.maxWidth = newWidth + 'px';
      });
      $mdUtil.nextTick(ctrl.updateInkBarStyles);
    }
  }

  function handleShouldPaginate (newValue, oldValue) {
    if (newValue !== oldValue) {
      ctrl.maxTabWidth      = getMaxTabWidth();
      ctrl.shouldCenterTabs = shouldCenterTabs();
      $mdUtil.nextTick(function () {
        ctrl.maxTabWidth = getMaxTabWidth();
        adjustOffset(ctrl.selectedIndex);
      });
    }
  }
  function handleHasContent (hasContent) {
    $element[ hasContent ? 'removeClass' : 'addClass' ]('md-no-tab-content');
  }
  function handleOffsetChange (left) {
    var elements = getElements();
    var newValue = ctrl.shouldCenterTabs ? '' : '-' + left + 'px';

    angular.element(elements.paging).css($mdConstant.CSS.TRANSFORM, 'translate3d(' + newValue + ', 0, 0)');
    $scope.$broadcast('$mdTabsPaginationChanged');
  }
  function handleFocusIndexChange (newIndex, oldIndex) {
    if (newIndex === oldIndex) return;
    if (!getElements().tabs[ newIndex ]) return;
    adjustOffset();
    redirectFocus();
  }
  function handleSelectedIndexChange (newValue, oldValue) {
    if (newValue === oldValue) return;

    ctrl.selectedIndex     = getNearestSafeIndex(newValue);
    ctrl.lastSelectedIndex = oldValue;
    ctrl.updateInkBarStyles();
    updateHeightFromContent();
    adjustOffset(newValue);
    $scope.$broadcast('$mdTabsChanged');
    ctrl.tabs[ oldValue ] && ctrl.tabs[ oldValue ].scope.deselect();
    ctrl.tabs[ newValue ] && ctrl.tabs[ newValue ].scope.select();
  }

  function getTabElementIndex(tabEl){
    var tabs = $element[0].getElementsByTagName('md-tab');
    return Array.prototype.indexOf.call(tabs, tabEl[0]);
  }
  function handleResizeWhenVisible () {
    if (handleResizeWhenVisible.watcher) return;
    handleResizeWhenVisible.watcher = $scope.$watch(function () {
      $mdUtil.nextTick(function () {
        if (!handleResizeWhenVisible.watcher) return;

        if ($element.prop('offsetParent')) {
          handleResizeWhenVisible.watcher();
          handleResizeWhenVisible.watcher = null;

          handleWindowResize();
        }
      }, false);
    });
  }
  function keydown (event) {
    switch (event.keyCode) {
      case $mdConstant.KEY_CODE.LEFT_ARROW:
        event.preventDefault();
        incrementIndex(-1, true);
        break;
      case $mdConstant.KEY_CODE.RIGHT_ARROW:
        event.preventDefault();
        incrementIndex(1, true);
        break;
      case $mdConstant.KEY_CODE.SPACE:
      case $mdConstant.KEY_CODE.ENTER:
        event.preventDefault();
        if (!locked) select(ctrl.focusIndex);
        break;
    }
    ctrl.lastClick = false;
  }
  function select (index, canSkipClick) {
    if (!locked) ctrl.focusIndex = ctrl.selectedIndex = index;
    ctrl.lastClick = true;
    if (canSkipClick && ctrl.noSelectClick) return;
    $mdUtil.nextTick(function () {
      ctrl.tabs[ index ].element.triggerHandler('click');
    }, false);
  }
  function scroll (event) {
    if (!ctrl.shouldPaginate) return;
    event.preventDefault();
    ctrl.offsetLeft = fixOffset(ctrl.offsetLeft - event.wheelDelta);
  }
  function nextPage () {
    var elements = getElements();
    var viewportWidth = elements.canvas.clientWidth,
        totalWidth    = viewportWidth + ctrl.offsetLeft,
        i, tab;
    for (i = 0; i < elements.tabs.length; i++) {
      tab = elements.tabs[ i ];
      if (tab.offsetLeft + tab.offsetWidth > totalWidth) break;
    }
    
    if (viewportWidth > tab.offsetWidth) {
      ctrl.offsetLeft = fixOffset(tab.offsetLeft);
    } else {
      ctrl.offsetLeft = fixOffset(tab.offsetLeft + (tab.offsetWidth - viewportWidth + 1));
    }
  }
  function previousPage () {
    var i, tab, elements = getElements();

    for (i = 0; i < elements.tabs.length; i++) {
      tab = elements.tabs[ i ];
      if (tab.offsetLeft + tab.offsetWidth >= ctrl.offsetLeft) break;
    }
    
    if (elements.canvas.clientWidth > tab.offsetWidth) {
      ctrl.offsetLeft = fixOffset(tab.offsetLeft + tab.offsetWidth - elements.canvas.clientWidth);
    } else {
      ctrl.offsetLeft = fixOffset(tab.offsetLeft);  
    }
  }
  function handleWindowResize () {
    ctrl.lastSelectedIndex = ctrl.selectedIndex;
    ctrl.offsetLeft        = fixOffset(ctrl.offsetLeft);
    $mdUtil.nextTick(function () {
      ctrl.updateInkBarStyles();
      updatePagination();
    });
  }

  function handleInkBar (hide) {
    angular.element(getElements().inkBar).toggleClass('ng-hide', hide);
  }
  function handleDynamicHeight (value) {
    $element.toggleClass('md-dynamic-height', value);
  }
  function removeTab (tabData) {
    if (destroyed) return;
    var selectedIndex = ctrl.selectedIndex,
        tab           = ctrl.tabs.splice(tabData.getIndex(), 1)[ 0 ];
    refreshIndex();
    if (ctrl.selectedIndex === selectedIndex) {
      tab.scope.deselect();
      ctrl.tabs[ ctrl.selectedIndex ] && ctrl.tabs[ ctrl.selectedIndex ].scope.select();
    }
    $mdUtil.nextTick(function () {
      updatePagination();
      ctrl.offsetLeft = fixOffset(ctrl.offsetLeft);
    });
  }
  function insertTab (tabData, index) {
    var hasLoaded = loaded;
    var proto     = {
          getIndex:     function () { return ctrl.tabs.indexOf(tab); },
          isActive:     function () { return this.getIndex() === ctrl.selectedIndex; },
          isLeft:       function () { return this.getIndex() < ctrl.selectedIndex; },
          isRight:      function () { return this.getIndex() > ctrl.selectedIndex; },
          shouldRender: function () { return !ctrl.noDisconnect || this.isActive(); },
          hasFocus:     function () {
            return !ctrl.lastClick
                && ctrl.hasFocus && this.getIndex() === ctrl.focusIndex;
          },
          id:           $mdUtil.nextUid()
        },
        tab       = angular.extend(proto, tabData);
    if (angular.isDefined(index)) {
      ctrl.tabs.splice(index, 0, tab);
    } else {
      ctrl.tabs.push(tab);
    }
    processQueue();
    updateHasContent();
    $mdUtil.nextTick(function () {
      updatePagination();
      if (hasLoaded && ctrl.autoselect) $mdUtil.nextTick(function () {
        $mdUtil.nextTick(function () { select(ctrl.tabs.indexOf(tab)); });
      });
    });
    return tab;
  }
  function getElements () {
    var elements = {};
    var node = $element[0];
    elements.wrapper = node.querySelector('md-tabs-wrapper');
    elements.canvas  = elements.wrapper.querySelector('md-tabs-canvas');
    elements.paging  = elements.canvas.querySelector('md-pagination-wrapper');
    elements.inkBar  = elements.paging.querySelector('md-ink-bar');

    elements.contents = node.querySelectorAll('md-tabs-content-wrapper > md-tab-content');
    elements.tabs    = elements.paging.querySelectorAll('md-tab-item');
    elements.dummies = elements.canvas.querySelectorAll('md-dummy-tab');

    return elements;
  }
  function canPageBack () {
    return ctrl.offsetLeft > 0;
  }
  function canPageForward () {
    var elements = getElements();
    var lastTab = elements.tabs[ elements.tabs.length - 1 ];
    return lastTab && lastTab.offsetLeft + lastTab.offsetWidth > elements.canvas.clientWidth +
        ctrl.offsetLeft;
  }
  function shouldStretchTabs () {
    switch (ctrl.stretchTabs) {
      case 'always':
        return true;
      case 'never':
        return false;
      default:
        return !ctrl.shouldPaginate
            && $window.matchMedia('(max-width: 600px)').matches;
    }
  }
  function shouldCenterTabs () {
    return ctrl.centerTabs && !ctrl.shouldPaginate;
  }
  function shouldPaginate () {
    if (ctrl.noPagination || !loaded) return false;
    var canvasWidth = $element.prop('clientWidth');

    angular.forEach(getElements().dummies, function (tab) {
      canvasWidth -= tab.offsetWidth;
    });

    return canvasWidth < 0;
  }
  function getNearestSafeIndex (newIndex) {
    if (newIndex === -1) return -1;
    var maxOffset = Math.max(ctrl.tabs.length - newIndex, newIndex),
        i, tab;
    for (i = 0; i <= maxOffset; i++) {
      tab = ctrl.tabs[ newIndex + i ];
      if (tab && (tab.scope.disabled !== true)) return tab.getIndex();
      tab = ctrl.tabs[ newIndex - i ];
      if (tab && (tab.scope.disabled !== true)) return tab.getIndex();
    }
    return newIndex;
  }
  function defineProperty (key, handler, value) {
    Object.defineProperty(ctrl, key, {
      get: function () { return value; },
      set: function (newValue) {
        var oldValue = value;
        value        = newValue;
        handler && handler(newValue, oldValue);
      }
    });
  }
  function updatePagination () {
    updatePagingWidth();
    ctrl.maxTabWidth = getMaxTabWidth();
    ctrl.shouldPaginate = shouldPaginate();
  }
  function updatePagingWidth() {
    var elements = getElements();
    if (shouldStretchTabs()) {
      angular.element(elements.paging).css('width', '');
    } else {
      angular.element(elements.paging).css('width', calcPagingWidth() + 'px');
    }
  }
  function calcPagingWidth () {
    return calcTabsWidth(getElements().dummies);
  }

  function calcTabsWidth(tabs) {
    var width = 0;

    angular.forEach(tabs, function (tab) {
      width += Math.max(tab.offsetWidth, tab.getBoundingClientRect().width);
    });

    return Math.ceil(width);
  }

  function getMaxTabWidth () {
    return $element.prop('clientWidth');
  }
  function updateTabOrder () {
    var selectedItem   = ctrl.tabs[ ctrl.selectedIndex ],
        focusItem      = ctrl.tabs[ ctrl.focusIndex ];
    ctrl.tabs          = ctrl.tabs.sort(function (a, b) {
      return a.index - b.index;
    });
    ctrl.selectedIndex = ctrl.tabs.indexOf(selectedItem);
    ctrl.focusIndex    = ctrl.tabs.indexOf(focusItem);
  }
  function incrementIndex (inc, focus) {
    var newIndex,
        key   = focus ? 'focusIndex' : 'selectedIndex',
        index = ctrl[ key ];
    for (newIndex = index + inc;
         ctrl.tabs[ newIndex ] && ctrl.tabs[ newIndex ].scope.disabled;
         newIndex += inc) {}
    if (ctrl.tabs[ newIndex ]) {
      ctrl[ key ] = newIndex;
    }
  }
  function redirectFocus () {
    getElements().dummies[ ctrl.focusIndex ].focus();
  }
  function adjustOffset (index) {
    var elements = getElements();

    if (index == null) index = ctrl.focusIndex;
    if (!elements.tabs[ index ]) return;
    if (ctrl.shouldCenterTabs) return;
    var tab         = elements.tabs[ index ],
        left        = tab.offsetLeft,
        right       = tab.offsetWidth + left;
    ctrl.offsetLeft = Math.max(ctrl.offsetLeft, fixOffset(right - elements.canvas.clientWidth + 32 * 2));
    ctrl.offsetLeft = Math.min(ctrl.offsetLeft, fixOffset(left));
  }
  function processQueue () {
    queue.forEach(function (func) { $mdUtil.nextTick(func); });
    queue = [];
  }
  function updateHasContent () {
    var hasContent  = false;
    angular.forEach(ctrl.tabs, function (tab) {
      if (tab.template) hasContent = true;
    });
    ctrl.hasContent = hasContent;
  }
  function refreshIndex () {
    ctrl.selectedIndex = getNearestSafeIndex(ctrl.selectedIndex);
    ctrl.focusIndex    = getNearestSafeIndex(ctrl.focusIndex);
  }
  function updateHeightFromContent () {
    if (!ctrl.dynamicHeight) return $element.css('height', '');
    if (!ctrl.tabs.length) return queue.push(updateHeightFromContent);

    var elements = getElements();

    var tabContent    = elements.contents[ ctrl.selectedIndex ],
        contentHeight = tabContent ? tabContent.offsetHeight : 0,
        tabsHeight    = elements.wrapper.offsetHeight,
        newHeight     = contentHeight + tabsHeight,
        currentHeight = $element.prop('clientHeight');

    if (currentHeight === newHeight) return;
    if ($element.attr('md-align-tabs') === 'bottom') {
      currentHeight -= tabsHeight;
      newHeight -= tabsHeight;
      if ($element.attr('md-border-bottom') !== undefined) ++currentHeight;
    }
    locked = true;

    var fromHeight = { height: currentHeight + 'px' },
        toHeight = { height: newHeight + 'px' };
    $element.css(fromHeight);
    $animateCss($element, {
      from: fromHeight,
      to: toHeight,
      easing: 'cubic-bezier(0.35, 0, 0.25, 1)',
      duration: 0.5
    }).start().done(function () {
      $element.css({
        transition: 'none',
        height: ''
      });
      $mdUtil.nextTick(function() {
        $element.css('transition', '');
      });
      locked = false;
    });
  }
  function updateInkBarStyles () {
    var elements = getElements();

    if (!elements.tabs[ ctrl.selectedIndex ]) {
      angular.element(elements.inkBar).css({ left: 'auto', right: 'auto' });
      return;
    }

    if (!ctrl.tabs.length) return queue.push(ctrl.updateInkBarStyles);
    if (!$element.prop('offsetParent')) return handleResizeWhenVisible();

    var index      = ctrl.selectedIndex,
        totalWidth = elements.paging.offsetWidth,
        tab        = elements.tabs[ index ],
        left       = tab.offsetLeft,
        right      = totalWidth - left - tab.offsetWidth;

    if (ctrl.shouldCenterTabs) {
      var tabWidth = calcTabsWidth(elements.tabs);

      if (totalWidth > tabWidth) {
        $mdUtil.nextTick(updateInkBarStyles, false);
      }
    }
    updateInkBarClassName();
    angular.element(elements.inkBar).css({ left: left + 'px', right: right + 'px' });
  }
  function updateInkBarClassName () {
    var elements = getElements();
    var newIndex = ctrl.selectedIndex,
        oldIndex = ctrl.lastSelectedIndex,
        ink      = angular.element(elements.inkBar);
    if (!angular.isNumber(oldIndex)) return;
    ink
        .toggleClass('md-left', newIndex < oldIndex)
        .toggleClass('md-right', newIndex > oldIndex);
  }
  function fixOffset (value) {
    var elements = getElements();

    if (!elements.tabs.length || !ctrl.shouldPaginate) return 0;
    var lastTab    = elements.tabs[ elements.tabs.length - 1 ],
        totalWidth = lastTab.offsetLeft + lastTab.offsetWidth;
    value          = Math.max(0, value);
    value          = Math.min(totalWidth - elements.canvas.clientWidth, value);
    return value;
  }
  function attachRipple (scope, element) {
    var elements = getElements();
    var options = { colorElement: angular.element(elements.inkBar) };
    $mdTabInkRipple.attach(scope, element, options);
  }
}

})();
(function(){
"use strict";
MdTabs.$inject = ["$$mdSvgRegistry"];
angular
    .module('material.components.tabs')
    .directive('mdTabs', MdTabs);

function MdTabs ($$mdSvgRegistry) {
  return {
    scope:            {
      selectedIndex: '=?mdSelected'
    },
    template:         function (element, attr) {
      attr[ "$mdTabsTemplate" ] = element.html();
      return '' +
        '<md-tabs-wrapper> ' +
          '<md-tab-data></md-tab-data> ' +
          '<md-prev-button ' +
              'tabindex="-1" ' +
              'role="button" ' +
              'aria-label="Previous Page" ' +
              'aria-disabled="{{!$mdTabsCtrl.canPageBack()}}" ' +
              'ng-class="{ \'md-disabled\': !$mdTabsCtrl.canPageBack() }" ' +
              'ng-if="$mdTabsCtrl.shouldPaginate" ' +
              'ng-click="$mdTabsCtrl.previousPage()"> ' +
            '<md-icon md-svg-src="'+ $$mdSvgRegistry.mdTabsArrow +'"></md-icon> ' +
          '</md-prev-button> ' +
          '<md-next-button ' +
              'tabindex="-1" ' +
              'role="button" ' +
              'aria-label="Next Page" ' +
              'aria-disabled="{{!$mdTabsCtrl.canPageForward()}}" ' +
              'ng-class="{ \'md-disabled\': !$mdTabsCtrl.canPageForward() }" ' +
              'ng-if="$mdTabsCtrl.shouldPaginate" ' +
              'ng-click="$mdTabsCtrl.nextPage()"> ' +
            '<md-icon md-svg-src="'+ $$mdSvgRegistry.mdTabsArrow +'"></md-icon> ' +
          '</md-next-button> ' +
          '<md-tabs-canvas ' +
              'tabindex="{{ $mdTabsCtrl.hasFocus ? -1 : 0 }}" ' +
              'aria-activedescendant="tab-item-{{$mdTabsCtrl.tabs[$mdTabsCtrl.focusIndex].id}}" ' +
              'ng-focus="$mdTabsCtrl.redirectFocus()" ' +
              'ng-class="{ ' +
                  '\'md-paginated\': $mdTabsCtrl.shouldPaginate, ' +
                  '\'md-center-tabs\': $mdTabsCtrl.shouldCenterTabs ' +
              '}" ' +
              'ng-keydown="$mdTabsCtrl.keydown($event)" ' +
              'role="tablist"> ' +
            '<md-pagination-wrapper ' +
                'ng-class="{ \'md-center-tabs\': $mdTabsCtrl.shouldCenterTabs }" ' +
                'md-tab-scroll="$mdTabsCtrl.scroll($event)"> ' +
              '<md-tab-item ' +
                  'tabindex="-1" ' +
                  'class="md-tab" ' +
                  'ng-repeat="tab in $mdTabsCtrl.tabs" ' +
                  'role="tab" ' +
                  'aria-controls="tab-content-{{::tab.id}}" ' +
                  'aria-selected="{{tab.isActive()}}" ' +
                  'aria-disabled="{{tab.scope.disabled || \'false\'}}" ' +
                  'ng-click="$mdTabsCtrl.select(tab.getIndex())" ' +
                  'ng-class="{ ' +
                      '\'md-active\':    tab.isActive(), ' +
                      '\'md-focused\':   tab.hasFocus(), ' +
                      '\'md-disabled\':  tab.scope.disabled ' +
                  '}" ' +
                  'ng-disabled="tab.scope.disabled" ' +
                  'md-swipe-left="$mdTabsCtrl.nextPage()" ' +
                  'md-swipe-right="$mdTabsCtrl.previousPage()" ' +
                  'md-tabs-template="::tab.label" ' +
                  'md-scope="::tab.parent"></md-tab-item> ' +
              '<md-ink-bar></md-ink-bar> ' +
            '</md-pagination-wrapper> ' +
            '<md-tabs-dummy-wrapper class="md-visually-hidden md-dummy-wrapper"> ' +
              '<md-dummy-tab ' +
                  'class="md-tab" ' +
                  'tabindex="-1" ' +
                  'id="tab-item-{{::tab.id}}" ' +
                  'role="tab" ' +
                  'aria-controls="tab-content-{{::tab.id}}" ' +
                  'aria-selected="{{tab.isActive()}}" ' +
                  'aria-disabled="{{tab.scope.disabled || \'false\'}}" ' +
                  'ng-focus="$mdTabsCtrl.hasFocus = true" ' +
                  'ng-blur="$mdTabsCtrl.hasFocus = false" ' +
                  'ng-repeat="tab in $mdTabsCtrl.tabs" ' +
                  'md-tabs-template="::tab.label" ' +
                  'md-scope="::tab.parent"></md-dummy-tab> ' +
            '</md-tabs-dummy-wrapper> ' +
          '</md-tabs-canvas> ' +
        '</md-tabs-wrapper> ' +
        '<md-tabs-content-wrapper ng-show="$mdTabsCtrl.hasContent && $mdTabsCtrl.selectedIndex >= 0" class="_md"> ' +
          '<md-tab-content ' +
              'id="tab-content-{{::tab.id}}" ' +
              'class="_md" ' +
              'role="tabpanel" ' +
              'aria-labelledby="tab-item-{{::tab.id}}" ' +
              'md-swipe-left="$mdTabsCtrl.swipeContent && $mdTabsCtrl.incrementIndex(1)" ' +
              'md-swipe-right="$mdTabsCtrl.swipeContent && $mdTabsCtrl.incrementIndex(-1)" ' +
              'ng-if="$mdTabsCtrl.hasContent" ' +
              'ng-repeat="(index, tab) in $mdTabsCtrl.tabs" ' +
              'ng-class="{ ' +
                '\'md-no-transition\': $mdTabsCtrl.lastSelectedIndex == null, ' +
                '\'md-active\':        tab.isActive(), ' +
                '\'md-left\':          tab.isLeft(), ' +
                '\'md-right\':         tab.isRight(), ' +
                '\'md-no-scroll\':     $mdTabsCtrl.dynamicHeight ' +
              '}"> ' +
            '<div ' +
                'md-tabs-template="::tab.template" ' +
                'md-connected-if="tab.isActive()" ' +
                'md-scope="::tab.parent" ' +
                'ng-if="$mdTabsCtrl.enableDisconnect || tab.shouldRender()"></div> ' +
          '</md-tab-content> ' +
        '</md-tabs-content-wrapper>';
    },
    controller:       'MdTabsController',
    controllerAs:     '$mdTabsCtrl',
    bindToController: true
  };
}

})();
(function(){
"use strict";


MdTabsDummyWrapper.$inject = ["$mdUtil", "$window"];angular
  .module('material.components.tabs')
  .directive('mdTabsDummyWrapper', MdTabsDummyWrapper);
function MdTabsDummyWrapper ($mdUtil, $window) {
  return {
    require: '^?mdTabs',
    link:    function link (scope, element, attr, ctrl) {
      if (!ctrl) return;

      var observer;
      var disconnect;

      var mutationCallback = function() {
        ctrl.updatePagination();
        ctrl.updateInkBarStyles();
      };

      if('MutationObserver' in $window) {
        var config = {
          childList: true,
          subtree: true,
          characterData: true
        };

        observer = new MutationObserver(mutationCallback);
        observer.observe(element[0], config);
        disconnect = observer.disconnect.bind(observer);
      } else {
        var debounced = $mdUtil.debounce(mutationCallback, 15, null, false);
        
        element.on('DOMSubtreeModified', debounced);
        disconnect = element.off.bind(element, 'DOMSubtreeModified', debounced);
      }
      scope.$on('$destroy', function() {
        disconnect();
      });
    }
  };
}

})();
(function(){
"use strict";


MdTabsTemplate.$inject = ["$compile", "$mdUtil"];angular
    .module('material.components.tabs')
    .directive('mdTabsTemplate', MdTabsTemplate);

function MdTabsTemplate ($compile, $mdUtil) {
  return {
    restrict: 'A',
    link:     link,
    scope:    {
      template:     '=mdTabsTemplate',
      connected:    '=?mdConnectedIf',
      compileScope: '=mdScope'
    },
    require:  '^?mdTabs'
  };
  function link (scope, element, attr, ctrl) {
    if (!ctrl) return;

    var compileScope = ctrl.enableDisconnect ? scope.compileScope.$new() : scope.compileScope;

    element.html(scope.template);
    $compile(element.contents())(compileScope);

    return $mdUtil.nextTick(handleScope);

    function handleScope () {
      scope.$watch('connected', function (value) { value === false ? disconnect() : reconnect(); });
      scope.$on('$destroy', reconnect);
    }

    function disconnect () {
      if (ctrl.enableDisconnect) $mdUtil.disconnectScope(compileScope);
    }

    function reconnect () {
      if (ctrl.enableDisconnect) $mdUtil.reconnectScope(compileScope);
    }
  }
}

})();
(function(){ 
angular.module("material.core").constant("$MD_THEME_CSS", "md-autocomplete.md-THEME_NAME-theme {  background: '{{background-A100}}'; }  md-autocomplete.md-THEME_NAME-theme[disabled]:not([md-floating-label]) {    background: '{{background-100}}'; }  md-autocomplete.md-THEME_NAME-theme button md-icon path {    fill: '{{background-600}}'; }  md-autocomplete.md-THEME_NAME-theme button:after {    background: '{{background-600-0.3}}'; }.md-autocomplete-suggestions-container.md-THEME_NAME-theme {  background: '{{background-A100}}'; }  .md-autocomplete-suggestions-container.md-THEME_NAME-theme li {    color: '{{background-900}}'; }    .md-autocomplete-suggestions-container.md-THEME_NAME-theme li .highlight {      color: '{{background-600}}'; }    .md-autocomplete-suggestions-container.md-THEME_NAME-theme li:hover, .md-autocomplete-suggestions-container.md-THEME_NAME-theme li.selected {      background: '{{background-200}}'; }md-backdrop {  background-color: '{{background-900-0.0}}'; }  md-backdrop.md-opaque.md-THEME_NAME-theme {    background-color: '{{background-900-1.0}}'; }md-bottom-sheet.md-THEME_NAME-theme {  background-color: '{{background-50}}';  border-top-color: '{{background-300}}'; }  md-bottom-sheet.md-THEME_NAME-theme.md-list md-list-item {    color: '{{foreground-1}}'; }  md-bottom-sheet.md-THEME_NAME-theme .md-subheader {    background-color: '{{background-50}}'; }  md-bottom-sheet.md-THEME_NAME-theme .md-subheader {    color: '{{foreground-1}}'; }.md-button.md-THEME_NAME-theme:not([disabled]):hover {  background-color: '{{background-500-0.2}}'; }.md-button.md-THEME_NAME-theme:not([disabled]).md-focused {  background-color: '{{background-500-0.2}}'; }.md-button.md-THEME_NAME-theme:not([disabled]).md-icon-button:hover {  background-color: transparent; }.md-button.md-THEME_NAME-theme.md-fab {  background-color: '{{accent-color}}';  color: '{{accent-contrast}}'; }  .md-button.md-THEME_NAME-theme.md-fab md-icon {    color: '{{accent-contrast}}'; }  .md-button.md-THEME_NAME-theme.md-fab:not([disabled]):hover {    background-color: '{{accent-A700}}'; }  .md-button.md-THEME_NAME-theme.md-fab:not([disabled]).md-focused {    background-color: '{{accent-A700}}'; }.md-button.md-THEME_NAME-theme.md-primary {  color: '{{primary-color}}'; }  .md-button.md-THEME_NAME-theme.md-primary.md-raised, .md-button.md-THEME_NAME-theme.md-primary.md-fab {    color: '{{primary-contrast}}';    background-color: '{{primary-color}}'; }    .md-button.md-THEME_NAME-theme.md-primary.md-raised:not([disabled]) md-icon, .md-button.md-THEME_NAME-theme.md-primary.md-fab:not([disabled]) md-icon {      color: '{{primary-contrast}}'; }    .md-button.md-THEME_NAME-theme.md-primary.md-raised:not([disabled]):hover, .md-button.md-THEME_NAME-theme.md-primary.md-fab:not([disabled]):hover {      background-color: '{{primary-600}}'; }    .md-button.md-THEME_NAME-theme.md-primary.md-raised:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme.md-primary.md-fab:not([disabled]).md-focused {      background-color: '{{primary-600}}'; }  .md-button.md-THEME_NAME-theme.md-primary:not([disabled]) md-icon {    color: '{{primary-color}}'; }.md-button.md-THEME_NAME-theme.md-fab {  background-color: '{{accent-color}}';  color: '{{accent-contrast}}'; }  .md-button.md-THEME_NAME-theme.md-fab:not([disabled]) .md-icon {    color: '{{accent-contrast}}'; }  .md-button.md-THEME_NAME-theme.md-fab:not([disabled]):hover {    background-color: '{{accent-A700}}'; }  .md-button.md-THEME_NAME-theme.md-fab:not([disabled]).md-focused {    background-color: '{{accent-A700}}'; }.md-button.md-THEME_NAME-theme.md-raised {  color: '{{background-900}}';  background-color: '{{background-50}}'; }  .md-button.md-THEME_NAME-theme.md-raised:not([disabled]) md-icon {    color: '{{background-900}}'; }  .md-button.md-THEME_NAME-theme.md-raised:not([disabled]):hover {    background-color: '{{background-50}}'; }  .md-button.md-THEME_NAME-theme.md-raised:not([disabled]).md-focused {    background-color: '{{background-200}}'; }.md-button.md-THEME_NAME-theme.md-warn {  color: '{{warn-color}}'; }  .md-button.md-THEME_NAME-theme.md-warn.md-raised, .md-button.md-THEME_NAME-theme.md-warn.md-fab {    color: '{{warn-contrast}}';    background-color: '{{warn-color}}'; }    .md-button.md-THEME_NAME-theme.md-warn.md-raised:not([disabled]) md-icon, .md-button.md-THEME_NAME-theme.md-warn.md-fab:not([disabled]) md-icon {      color: '{{warn-contrast}}'; }    .md-button.md-THEME_NAME-theme.md-warn.md-raised:not([disabled]):hover, .md-button.md-THEME_NAME-theme.md-warn.md-fab:not([disabled]):hover {      background-color: '{{warn-600}}'; }    .md-button.md-THEME_NAME-theme.md-warn.md-raised:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme.md-warn.md-fab:not([disabled]).md-focused {      background-color: '{{warn-600}}'; }  .md-button.md-THEME_NAME-theme.md-warn:not([disabled]) md-icon {    color: '{{warn-color}}'; }.md-button.md-THEME_NAME-theme.md-accent {  color: '{{accent-color}}'; }  .md-button.md-THEME_NAME-theme.md-accent.md-raised, .md-button.md-THEME_NAME-theme.md-accent.md-fab {    color: '{{accent-contrast}}';    background-color: '{{accent-color}}'; }    .md-button.md-THEME_NAME-theme.md-accent.md-raised:not([disabled]) md-icon, .md-button.md-THEME_NAME-theme.md-accent.md-fab:not([disabled]) md-icon {      color: '{{accent-contrast}}'; }    .md-button.md-THEME_NAME-theme.md-accent.md-raised:not([disabled]):hover, .md-button.md-THEME_NAME-theme.md-accent.md-fab:not([disabled]):hover {      background-color: '{{accent-A700}}'; }    .md-button.md-THEME_NAME-theme.md-accent.md-raised:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme.md-accent.md-fab:not([disabled]).md-focused {      background-color: '{{accent-A700}}'; }  .md-button.md-THEME_NAME-theme.md-accent:not([disabled]) md-icon {    color: '{{accent-color}}'; }.md-button.md-THEME_NAME-theme[disabled], .md-button.md-THEME_NAME-theme.md-raised[disabled], .md-button.md-THEME_NAME-theme.md-fab[disabled], .md-button.md-THEME_NAME-theme.md-accent[disabled], .md-button.md-THEME_NAME-theme.md-warn[disabled] {  color: '{{foreground-3}}';  cursor: default; }  .md-button.md-THEME_NAME-theme[disabled] md-icon, .md-button.md-THEME_NAME-theme.md-raised[disabled] md-icon, .md-button.md-THEME_NAME-theme.md-fab[disabled] md-icon, .md-button.md-THEME_NAME-theme.md-accent[disabled] md-icon, .md-button.md-THEME_NAME-theme.md-warn[disabled] md-icon {    color: '{{foreground-3}}'; }.md-button.md-THEME_NAME-theme.md-raised[disabled], .md-button.md-THEME_NAME-theme.md-fab[disabled] {  background-color: '{{foreground-4}}'; }.md-button.md-THEME_NAME-theme[disabled] {  background-color: transparent; }._md a.md-THEME_NAME-theme:not(.md-button).md-primary {  color: '{{primary-color}}'; }  ._md a.md-THEME_NAME-theme:not(.md-button).md-primary:hover {    color: '{{primary-700}}'; }._md a.md-THEME_NAME-theme:not(.md-button).md-accent {  color: '{{accent-color}}'; }  ._md a.md-THEME_NAME-theme:not(.md-button).md-accent:hover {    color: '{{accent-700}}'; }._md a.md-THEME_NAME-theme:not(.md-button).md-accent {  color: '{{accent-color}}'; }  ._md a.md-THEME_NAME-theme:not(.md-button).md-accent:hover {    color: '{{accent-A700}}'; }._md a.md-THEME_NAME-theme:not(.md-button).md-warn {  color: '{{warn-color}}'; }  ._md a.md-THEME_NAME-theme:not(.md-button).md-warn:hover {    color: '{{warn-700}}'; }md-card.md-THEME_NAME-theme {  color: '{{foreground-1}}';  background-color: '{{background-hue-1}}';  border-radius: 2px; }  md-card.md-THEME_NAME-theme .md-card-image {    border-radius: 2px 2px 0 0; }  md-card.md-THEME_NAME-theme md-card-header md-card-avatar md-icon {    color: '{{background-color}}';    background-color: '{{foreground-3}}'; }  md-card.md-THEME_NAME-theme md-card-header md-card-header-text .md-subhead {    color: '{{foreground-2}}'; }  md-card.md-THEME_NAME-theme md-card-title md-card-title-text:not(:only-child) .md-subhead {    color: '{{foreground-2}}'; }md-chips.md-THEME_NAME-theme .md-chips {  box-shadow: 0 1px '{{foreground-4}}'; }  md-chips.md-THEME_NAME-theme .md-chips.md-focused {    box-shadow: 0 2px '{{primary-color}}'; }  md-chips.md-THEME_NAME-theme .md-chips .md-chip-input-container input {    color: '{{foreground-1}}'; }    md-chips.md-THEME_NAME-theme .md-chips .md-chip-input-container input::-webkit-input-placeholder {      color: '{{foreground-3}}'; }    md-chips.md-THEME_NAME-theme .md-chips .md-chip-input-container input:-moz-placeholder {      color: '{{foreground-3}}'; }    md-chips.md-THEME_NAME-theme .md-chips .md-chip-input-container input::-moz-placeholder {      color: '{{foreground-3}}'; }    md-chips.md-THEME_NAME-theme .md-chips .md-chip-input-container input:-ms-input-placeholder {      color: '{{foreground-3}}'; }    md-chips.md-THEME_NAME-theme .md-chips .md-chip-input-container input::-webkit-input-placeholder {      color: '{{foreground-3}}'; }md-chips.md-THEME_NAME-theme md-chip {  background: '{{background-300}}';  color: '{{background-800}}'; }  md-chips.md-THEME_NAME-theme md-chip md-icon {    color: '{{background-700}}'; }  md-chips.md-THEME_NAME-theme md-chip.md-focused {    background: '{{primary-color}}';    color: '{{primary-contrast}}'; }    md-chips.md-THEME_NAME-theme md-chip.md-focused md-icon {      color: '{{primary-contrast}}'; }  md-chips.md-THEME_NAME-theme md-chip._md-chip-editing {    background: transparent;    color: '{{background-800}}'; }md-chips.md-THEME_NAME-theme md-chip-remove .md-button md-icon path {  fill: '{{background-500}}'; }.md-contact-suggestion span.md-contact-email {  color: '{{background-400}}'; }md-checkbox.md-THEME_NAME-theme .md-ripple {  color: '{{accent-A700}}'; }md-checkbox.md-THEME_NAME-theme.md-checked .md-ripple {  color: '{{background-600}}'; }md-checkbox.md-THEME_NAME-theme.md-checked.md-focused .md-container:before {  background-color: '{{accent-color-0.26}}'; }md-checkbox.md-THEME_NAME-theme .md-ink-ripple {  color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme.md-checked .md-ink-ripple {  color: '{{accent-color-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not(.md-checked) .md-icon {  border-color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme.md-checked .md-icon {  background-color: '{{accent-color-0.87}}'; }md-checkbox.md-THEME_NAME-theme.md-checked .md-icon:after {  border-color: '{{accent-contrast-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary .md-ripple {  color: '{{primary-600}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-ripple {  color: '{{background-600}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary .md-ink-ripple {  color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-ink-ripple {  color: '{{primary-color-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary:not(.md-checked) .md-icon {  border-color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-icon {  background-color: '{{primary-color-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked.md-focused .md-container:before {  background-color: '{{primary-color-0.26}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-icon:after {  border-color: '{{primary-contrast-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary .md-indeterminate[disabled] .md-container {  color: '{{foreground-3}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn .md-ripple {  color: '{{warn-600}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn .md-ink-ripple {  color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-ink-ripple {  color: '{{warn-color-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn:not(.md-checked) .md-icon {  border-color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-icon {  background-color: '{{warn-color-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked.md-focused:not([disabled]) .md-container:before {  background-color: '{{warn-color-0.26}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-icon:after {  border-color: '{{background-200}}'; }md-checkbox.md-THEME_NAME-theme[disabled]:not(.md-checked) .md-icon {  border-color: '{{foreground-3}}'; }md-checkbox.md-THEME_NAME-theme[disabled].md-checked .md-icon {  background-color: '{{foreground-3}}'; }md-checkbox.md-THEME_NAME-theme[disabled].md-checked .md-icon:after {  border-color: '{{background-200}}'; }md-checkbox.md-THEME_NAME-theme[disabled] .md-icon:after {  border-color: '{{foreground-3}}'; }md-checkbox.md-THEME_NAME-theme[disabled] .md-label {  color: '{{foreground-3}}'; }md-content.md-THEME_NAME-theme {  color: '{{foreground-1}}';  background-color: '{{background-default}}'; }/** Theme styles for mdCalendar. */.md-calendar.md-THEME_NAME-theme {  background: '{{background-A100}}';  color: '{{background-A200-0.87}}'; }  .md-calendar.md-THEME_NAME-theme tr:last-child td {    border-bottom-color: '{{background-200}}'; }.md-THEME_NAME-theme .md-calendar-day-header {  background: '{{background-300}}';  color: '{{background-A200-0.87}}'; }.md-THEME_NAME-theme .md-calendar-date.md-calendar-date-today .md-calendar-date-selection-indicator {  border: 1px solid '{{primary-500}}'; }.md-THEME_NAME-theme .md-calendar-date.md-calendar-date-today.md-calendar-date-disabled {  color: '{{primary-500-0.6}}'; }.md-calendar-date.md-focus .md-THEME_NAME-theme .md-calendar-date-selection-indicator, .md-THEME_NAME-theme .md-calendar-date-selection-indicator:hover {  background: '{{background-300}}'; }.md-THEME_NAME-theme .md-calendar-date.md-calendar-selected-date .md-calendar-date-selection-indicator,.md-THEME_NAME-theme .md-calendar-date.md-focus.md-calendar-selected-date .md-calendar-date-selection-indicator {  background: '{{primary-500}}';  color: '{{primary-500-contrast}}';  border-color: transparent; }.md-THEME_NAME-theme .md-calendar-date-disabled,.md-THEME_NAME-theme .md-calendar-month-label-disabled {  color: '{{background-A200-0.435}}'; }/** Theme styles for mdDatepicker. */.md-THEME_NAME-theme .md-datepicker-input {  color: '{{foreground-1}}'; }  .md-THEME_NAME-theme .md-datepicker-input::-webkit-input-placeholder {    color: '{{foreground-3}}'; }  .md-THEME_NAME-theme .md-datepicker-input:-moz-placeholder {    color: '{{foreground-3}}'; }  .md-THEME_NAME-theme .md-datepicker-input::-moz-placeholder {    color: '{{foreground-3}}'; }  .md-THEME_NAME-theme .md-datepicker-input:-ms-input-placeholder {    color: '{{foreground-3}}'; }  .md-THEME_NAME-theme .md-datepicker-input::-webkit-input-placeholder {    color: '{{foreground-3}}'; }.md-THEME_NAME-theme .md-datepicker-input-container {  border-bottom-color: '{{foreground-4}}'; }  .md-THEME_NAME-theme .md-datepicker-input-container.md-datepicker-focused {    border-bottom-color: '{{primary-color}}'; }    .md-accent .md-THEME_NAME-theme .md-datepicker-input-container.md-datepicker-focused {      border-bottom-color: '{{accent-color}}'; }    .md-warn .md-THEME_NAME-theme .md-datepicker-input-container.md-datepicker-focused {      border-bottom-color: '{{warn-A700}}'; }  .md-THEME_NAME-theme .md-datepicker-input-container.md-datepicker-invalid {    border-bottom-color: '{{warn-A700}}'; }.md-THEME_NAME-theme .md-datepicker-calendar-pane {  border-color: '{{background-hue-1}}'; }.md-THEME_NAME-theme .md-datepicker-triangle-button .md-datepicker-expand-triangle {  border-top-color: '{{foreground-3}}'; }.md-THEME_NAME-theme .md-datepicker-triangle-button:hover .md-datepicker-expand-triangle {  border-top-color: '{{foreground-2}}'; }.md-THEME_NAME-theme .md-datepicker-open .md-datepicker-calendar-icon {  color: '{{primary-color}}'; }.md-THEME_NAME-theme .md-datepicker-open.md-accent .md-datepicker-calendar-icon, .md-accent .md-THEME_NAME-theme .md-datepicker-open .md-datepicker-calendar-icon {  color: '{{accent-color}}'; }.md-THEME_NAME-theme .md-datepicker-open.md-warn .md-datepicker-calendar-icon, .md-warn .md-THEME_NAME-theme .md-datepicker-open .md-datepicker-calendar-icon {  color: '{{warn-A700}}'; }.md-THEME_NAME-theme .md-datepicker-calendar {  background: '{{background-A100}}'; }.md-THEME_NAME-theme .md-datepicker-input-mask-opaque {  box-shadow: 0 0 0 9999px \"{{background-hue-1}}\"; }.md-THEME_NAME-theme .md-datepicker-open .md-datepicker-input-container {  background: \"{{background-hue-1}}\"; }md-dialog.md-THEME_NAME-theme {  border-radius: 4px;  background-color: '{{background-hue-1}}';  color: '{{foreground-1}}'; }  md-dialog.md-THEME_NAME-theme.md-content-overflow .md-actions, md-dialog.md-THEME_NAME-theme.md-content-overflow md-dialog-actions {    border-top-color: '{{foreground-4}}'; }md-divider.md-THEME_NAME-theme {  border-top-color: '{{foreground-4}}'; }.layout-row > md-divider.md-THEME_NAME-theme,.layout-xs-row > md-divider.md-THEME_NAME-theme, .layout-gt-xs-row > md-divider.md-THEME_NAME-theme,.layout-sm-row > md-divider.md-THEME_NAME-theme, .layout-gt-sm-row > md-divider.md-THEME_NAME-theme,.layout-md-row > md-divider.md-THEME_NAME-theme, .layout-gt-md-row > md-divider.md-THEME_NAME-theme,.layout-lg-row > md-divider.md-THEME_NAME-theme, .layout-gt-lg-row > md-divider.md-THEME_NAME-theme,.layout-xl-row > md-divider.md-THEME_NAME-theme {  border-right-color: '{{foreground-4}}'; }md-icon.md-THEME_NAME-theme {  color: '{{foreground-2}}'; }  md-icon.md-THEME_NAME-theme.md-primary {    color: '{{primary-color}}'; }  md-icon.md-THEME_NAME-theme.md-accent {    color: '{{accent-color}}'; }  md-icon.md-THEME_NAME-theme.md-warn {    color: '{{warn-color}}'; }md-input-container.md-THEME_NAME-theme .md-input {  color: '{{foreground-1}}';  border-color: '{{foreground-4}}'; }  md-input-container.md-THEME_NAME-theme .md-input::-webkit-input-placeholder {    color: '{{foreground-3}}'; }  md-input-container.md-THEME_NAME-theme .md-input:-moz-placeholder {    color: '{{foreground-3}}'; }  md-input-container.md-THEME_NAME-theme .md-input::-moz-placeholder {    color: '{{foreground-3}}'; }  md-input-container.md-THEME_NAME-theme .md-input:-ms-input-placeholder {    color: '{{foreground-3}}'; }  md-input-container.md-THEME_NAME-theme .md-input::-webkit-input-placeholder {    color: '{{foreground-3}}'; }md-input-container.md-THEME_NAME-theme > md-icon {  color: '{{foreground-1}}'; }md-input-container.md-THEME_NAME-theme label,md-input-container.md-THEME_NAME-theme .md-placeholder {  color: '{{foreground-3}}'; }md-input-container.md-THEME_NAME-theme label.md-required:after {  color: '{{warn-A700}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-focused):not(.md-input-invalid) label.md-required:after {  color: '{{foreground-2}}'; }md-input-container.md-THEME_NAME-theme .md-input-messages-animation, md-input-container.md-THEME_NAME-theme .md-input-message-animation {  color: '{{warn-A700}}'; }  md-input-container.md-THEME_NAME-theme .md-input-messages-animation .md-char-counter, md-input-container.md-THEME_NAME-theme .md-input-message-animation .md-char-counter {    color: '{{foreground-1}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-has-value label {  color: '{{foreground-2}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused .md-input, md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-resized .md-input {  border-color: '{{primary-color}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused label,md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused md-icon {  color: '{{primary-color}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-accent .md-input {  border-color: '{{accent-color}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-accent label,md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-accent md-icon {  color: '{{accent-color}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-warn .md-input {  border-color: '{{warn-A700}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-warn label,md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-warn md-icon {  color: '{{warn-A700}}'; }md-input-container.md-THEME_NAME-theme.md-input-invalid .md-input {  border-color: '{{warn-A700}}'; }md-input-container.md-THEME_NAME-theme.md-input-invalid label,md-input-container.md-THEME_NAME-theme.md-input-invalid .md-input-message-animation,md-input-container.md-THEME_NAME-theme.md-input-invalid .md-char-counter {  color: '{{warn-A700}}'; }md-input-container.md-THEME_NAME-theme .md-input[disabled],[disabled] md-input-container.md-THEME_NAME-theme .md-input {  border-bottom-color: transparent;  color: '{{foreground-3}}';  background-image: linear-gradient(to right, \"{{foreground-3}}\" 0%, \"{{foreground-3}}\" 33%, transparent 0%);  background-image: -ms-linear-gradient(left, transparent 0%, \"{{foreground-3}}\" 100%); }md-list.md-THEME_NAME-theme md-list-item.md-2-line .md-list-item-text h3, md-list.md-THEME_NAME-theme md-list-item.md-2-line .md-list-item-text h4,md-list.md-THEME_NAME-theme md-list-item.md-3-line .md-list-item-text h3,md-list.md-THEME_NAME-theme md-list-item.md-3-line .md-list-item-text h4 {  color: '{{foreground-1}}'; }md-list.md-THEME_NAME-theme md-list-item.md-2-line .md-list-item-text p,md-list.md-THEME_NAME-theme md-list-item.md-3-line .md-list-item-text p {  color: '{{foreground-2}}'; }md-list.md-THEME_NAME-theme .md-proxy-focus.md-focused div.md-no-style {  background-color: '{{background-100}}'; }md-list.md-THEME_NAME-theme md-list-item .md-avatar-icon {  background-color: '{{foreground-3}}';  color: '{{background-color}}'; }md-list.md-THEME_NAME-theme md-list-item > md-icon {  color: '{{foreground-2}}'; }  md-list.md-THEME_NAME-theme md-list-item > md-icon.md-highlight {    color: '{{primary-color}}'; }    md-list.md-THEME_NAME-theme md-list-item > md-icon.md-highlight.md-accent {      color: '{{accent-color}}'; }md-menu-content.md-THEME_NAME-theme {  background-color: '{{background-A100}}'; }  md-menu-content.md-THEME_NAME-theme md-menu-item {    color: '{{background-A200-0.87}}'; }    md-menu-content.md-THEME_NAME-theme md-menu-item md-icon {      color: '{{background-A200-0.54}}'; }    md-menu-content.md-THEME_NAME-theme md-menu-item .md-button[disabled] {      color: '{{background-A200-0.25}}'; }      md-menu-content.md-THEME_NAME-theme md-menu-item .md-button[disabled] md-icon {        color: '{{background-A200-0.25}}'; }  md-menu-content.md-THEME_NAME-theme md-menu-divider {    background-color: '{{background-A200-0.11}}'; }md-menu-bar.md-THEME_NAME-theme > button.md-button {  color: '{{foreground-2}}';  border-radius: 2px; }md-menu-bar.md-THEME_NAME-theme md-menu.md-open > button, md-menu-bar.md-THEME_NAME-theme md-menu > button:focus {  outline: none;  background: '{{background-200}}'; }md-menu-bar.md-THEME_NAME-theme.md-open:not(.md-keyboard-mode) md-menu:hover > button {  background-color: '{{ background-500-0.2}}'; }md-menu-bar.md-THEME_NAME-theme:not(.md-keyboard-mode):not(.md-open) md-menu button:hover,md-menu-bar.md-THEME_NAME-theme:not(.md-keyboard-mode):not(.md-open) md-menu button:focus {  background: transparent; }md-menu-content.md-THEME_NAME-theme .md-menu > .md-button:after {  color: '{{background-A200-0.54}}'; }md-menu-content.md-THEME_NAME-theme .md-menu.md-open > .md-button {  background-color: '{{ background-500-0.2}}'; }md-toolbar.md-THEME_NAME-theme.md-menu-toolbar {  background-color: '{{background-A100}}';  color: '{{background-A200}}'; }  md-toolbar.md-THEME_NAME-theme.md-menu-toolbar md-toolbar-filler {    background-color: '{{primary-color}}';    color: '{{background-A100-0.87}}'; }    md-toolbar.md-THEME_NAME-theme.md-menu-toolbar md-toolbar-filler md-icon {      color: '{{background-A100-0.87}}'; }md-nav-bar.md-THEME_NAME-theme .md-nav-bar {  background-color: transparent;  border-color: '{{foreground-4}}'; }md-nav-bar.md-THEME_NAME-theme .md-button._md-nav-button.md-unselected {  color: '{{foreground-2}}'; }md-nav-bar.md-THEME_NAME-theme md-nav-ink-bar {  color: '{{accent-color}}';  background: '{{accent-color}}'; }.md-panel {  background-color: '{{background-900-0.0}}'; }  .md-panel._md-panel-backdrop.md-THEME_NAME-theme {    background-color: '{{background-900-1.0}}'; }md-progress-circular.md-THEME_NAME-theme path {  stroke: '{{primary-color}}'; }md-progress-circular.md-THEME_NAME-theme.md-warn path {  stroke: '{{warn-color}}'; }md-progress-circular.md-THEME_NAME-theme.md-accent path {  stroke: '{{accent-color}}'; }md-progress-linear.md-THEME_NAME-theme .md-container {  background-color: '{{primary-100}}'; }md-progress-linear.md-THEME_NAME-theme .md-bar {  background-color: '{{primary-color}}'; }md-progress-linear.md-THEME_NAME-theme.md-warn .md-container {  background-color: '{{warn-100}}'; }md-progress-linear.md-THEME_NAME-theme.md-warn .md-bar {  background-color: '{{warn-color}}'; }md-progress-linear.md-THEME_NAME-theme.md-accent .md-container {  background-color: '{{accent-100}}'; }md-progress-linear.md-THEME_NAME-theme.md-accent .md-bar {  background-color: '{{accent-color}}'; }md-progress-linear.md-THEME_NAME-theme[md-mode=buffer].md-warn .md-bar1 {  background-color: '{{warn-100}}'; }md-progress-linear.md-THEME_NAME-theme[md-mode=buffer].md-warn .md-dashed:before {  background: radial-gradient(\"{{warn-100}}\" 0%, \"{{warn-100}}\" 16%, transparent 42%); }md-progress-linear.md-THEME_NAME-theme[md-mode=buffer].md-accent .md-bar1 {  background-color: '{{accent-100}}'; }md-progress-linear.md-THEME_NAME-theme[md-mode=buffer].md-accent .md-dashed:before {  background: radial-gradient(\"{{accent-100}}\" 0%, \"{{accent-100}}\" 16%, transparent 42%); }md-radio-button.md-THEME_NAME-theme .md-off {  border-color: '{{foreground-2}}'; }md-radio-button.md-THEME_NAME-theme .md-on {  background-color: '{{accent-color-0.87}}'; }md-radio-button.md-THEME_NAME-theme.md-checked .md-off {  border-color: '{{accent-color-0.87}}'; }md-radio-button.md-THEME_NAME-theme.md-checked .md-ink-ripple {  color: '{{accent-color-0.87}}'; }md-radio-button.md-THEME_NAME-theme .md-container .md-ripple {  color: '{{accent-A700}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-primary .md-on, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-primary .md-on,md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-primary .md-on,md-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary .md-on {  background-color: '{{primary-color-0.87}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-primary .md-checked .md-off, md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-primary.md-checked .md-off, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-primary .md-checked .md-off, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-off,md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-primary .md-checked .md-off,md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-primary.md-checked .md-off,md-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary .md-checked .md-off,md-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-off {  border-color: '{{primary-color-0.87}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-primary .md-checked .md-ink-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-primary.md-checked .md-ink-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-primary .md-checked .md-ink-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-ink-ripple,md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-primary .md-checked .md-ink-ripple,md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-primary.md-checked .md-ink-ripple,md-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary .md-checked .md-ink-ripple,md-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-ink-ripple {  color: '{{primary-color-0.87}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-primary .md-container .md-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-primary .md-container .md-ripple,md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-primary .md-container .md-ripple,md-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary .md-container .md-ripple {  color: '{{primary-600}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-warn .md-on, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-warn .md-on,md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-warn .md-on,md-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn .md-on {  background-color: '{{warn-color-0.87}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-warn .md-checked .md-off, md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-warn.md-checked .md-off, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-warn .md-checked .md-off, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-off,md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-warn .md-checked .md-off,md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-warn.md-checked .md-off,md-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn .md-checked .md-off,md-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-off {  border-color: '{{warn-color-0.87}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-warn .md-checked .md-ink-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-warn.md-checked .md-ink-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-warn .md-checked .md-ink-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-ink-ripple,md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-warn .md-checked .md-ink-ripple,md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-warn.md-checked .md-ink-ripple,md-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn .md-checked .md-ink-ripple,md-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-ink-ripple {  color: '{{warn-color-0.87}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-warn .md-container .md-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-warn .md-container .md-ripple,md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-warn .md-container .md-ripple,md-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn .md-container .md-ripple {  color: '{{warn-600}}'; }md-radio-group.md-THEME_NAME-theme[disabled],md-radio-button.md-THEME_NAME-theme[disabled] {  color: '{{foreground-3}}'; }  md-radio-group.md-THEME_NAME-theme[disabled] .md-container .md-off,  md-radio-button.md-THEME_NAME-theme[disabled] .md-container .md-off {    border-color: '{{foreground-3}}'; }  md-radio-group.md-THEME_NAME-theme[disabled] .md-container .md-on,  md-radio-button.md-THEME_NAME-theme[disabled] .md-container .md-on {    border-color: '{{foreground-3}}'; }md-radio-group.md-THEME_NAME-theme .md-checked .md-ink-ripple {  color: '{{accent-color-0.26}}'; }md-radio-group.md-THEME_NAME-theme.md-primary .md-checked:not([disabled]) .md-ink-ripple, md-radio-group.md-THEME_NAME-theme .md-checked:not([disabled]).md-primary .md-ink-ripple {  color: '{{primary-color-0.26}}'; }md-radio-group.md-THEME_NAME-theme .md-checked.md-primary .md-ink-ripple {  color: '{{warn-color-0.26}}'; }md-radio-group.md-THEME_NAME-theme.md-focused:not(:empty) .md-checked .md-container:before {  background-color: '{{accent-color-0.26}}'; }md-radio-group.md-THEME_NAME-theme.md-focused:not(:empty).md-primary .md-checked .md-container:before,md-radio-group.md-THEME_NAME-theme.md-focused:not(:empty) .md-checked.md-primary .md-container:before {  background-color: '{{primary-color-0.26}}'; }md-radio-group.md-THEME_NAME-theme.md-focused:not(:empty).md-warn .md-checked .md-container:before,md-radio-group.md-THEME_NAME-theme.md-focused:not(:empty) .md-checked.md-warn .md-container:before {  background-color: '{{warn-color-0.26}}'; }md-input-container md-select.md-THEME_NAME-theme .md-select-value span:first-child:after {  color: '{{warn-A700}}'; }md-input-container:not(.md-input-focused):not(.md-input-invalid) md-select.md-THEME_NAME-theme .md-select-value span:first-child:after {  color: '{{foreground-3}}'; }md-input-container.md-input-focused:not(.md-input-has-value) md-select.md-THEME_NAME-theme .md-select-value {  color: '{{primary-color}}'; }  md-input-container.md-input-focused:not(.md-input-has-value) md-select.md-THEME_NAME-theme .md-select-value.md-select-placeholder {    color: '{{primary-color}}'; }md-input-container.md-input-invalid md-select.md-THEME_NAME-theme .md-select-value {  color: '{{warn-A700}}' !important;  border-bottom-color: '{{warn-A700}}' !important; }md-input-container.md-input-invalid md-select.md-THEME_NAME-theme.md-no-underline .md-select-value {  border-bottom-color: transparent !important; }md-select.md-THEME_NAME-theme[disabled] .md-select-value {  border-bottom-color: transparent;  background-image: linear-gradient(to right, \"{{foreground-3}}\" 0%, \"{{foreground-3}}\" 33%, transparent 0%);  background-image: -ms-linear-gradient(left, transparent 0%, \"{{foreground-3}}\" 100%); }md-select.md-THEME_NAME-theme .md-select-value {  border-bottom-color: '{{foreground-4}}'; }  md-select.md-THEME_NAME-theme .md-select-value.md-select-placeholder {    color: '{{foreground-3}}'; }  md-select.md-THEME_NAME-theme .md-select-value span:first-child:after {    color: '{{warn-A700}}'; }md-select.md-THEME_NAME-theme.md-no-underline .md-select-value {  border-bottom-color: transparent !important; }md-select.md-THEME_NAME-theme.ng-invalid.ng-touched .md-select-value {  color: '{{warn-A700}}' !important;  border-bottom-color: '{{warn-A700}}' !important; }md-select.md-THEME_NAME-theme.ng-invalid.ng-touched.md-no-underline .md-select-value {  border-bottom-color: transparent !important; }md-select.md-THEME_NAME-theme:not([disabled]):focus .md-select-value {  border-bottom-color: '{{primary-color}}';  color: '{{ foreground-1 }}'; }  md-select.md-THEME_NAME-theme:not([disabled]):focus .md-select-value.md-select-placeholder {    color: '{{ foreground-1 }}'; }md-select.md-THEME_NAME-theme:not([disabled]):focus.md-no-underline .md-select-value {  border-bottom-color: transparent !important; }md-select.md-THEME_NAME-theme:not([disabled]):focus.md-accent .md-select-value {  border-bottom-color: '{{accent-color}}'; }md-select.md-THEME_NAME-theme:not([disabled]):focus.md-warn .md-select-value {  border-bottom-color: '{{warn-color}}'; }md-select.md-THEME_NAME-theme[disabled] .md-select-value {  color: '{{foreground-3}}'; }  md-select.md-THEME_NAME-theme[disabled] .md-select-value.md-select-placeholder {    color: '{{foreground-3}}'; }md-select-menu.md-THEME_NAME-theme md-content {  background: '{{background-A100}}'; }  md-select-menu.md-THEME_NAME-theme md-content md-optgroup {    color: '{{background-600-0.87}}'; }  md-select-menu.md-THEME_NAME-theme md-content md-option {    color: '{{background-900-0.87}}'; }    md-select-menu.md-THEME_NAME-theme md-content md-option[disabled] .md-text {      color: '{{background-400-0.87}}'; }    md-select-menu.md-THEME_NAME-theme md-content md-option:not([disabled]):focus, md-select-menu.md-THEME_NAME-theme md-content md-option:not([disabled]):hover {      background: '{{background-200}}'; }    md-select-menu.md-THEME_NAME-theme md-content md-option[selected] {      color: '{{primary-500}}'; }      md-select-menu.md-THEME_NAME-theme md-content md-option[selected]:focus {        color: '{{primary-600}}'; }      md-select-menu.md-THEME_NAME-theme md-content md-option[selected].md-accent {        color: '{{accent-color}}'; }        md-select-menu.md-THEME_NAME-theme md-content md-option[selected].md-accent:focus {          color: '{{accent-A700}}'; }.md-checkbox-enabled.md-THEME_NAME-theme .md-ripple {  color: '{{primary-600}}'; }.md-checkbox-enabled.md-THEME_NAME-theme[selected] .md-ripple {  color: '{{background-600}}'; }.md-checkbox-enabled.md-THEME_NAME-theme .md-ink-ripple {  color: '{{foreground-2}}'; }.md-checkbox-enabled.md-THEME_NAME-theme[selected] .md-ink-ripple {  color: '{{primary-color-0.87}}'; }.md-checkbox-enabled.md-THEME_NAME-theme:not(.md-checked) .md-icon {  border-color: '{{foreground-2}}'; }.md-checkbox-enabled.md-THEME_NAME-theme[selected] .md-icon {  background-color: '{{primary-color-0.87}}'; }.md-checkbox-enabled.md-THEME_NAME-theme[selected].md-focused .md-container:before {  background-color: '{{primary-color-0.26}}'; }.md-checkbox-enabled.md-THEME_NAME-theme[selected] .md-icon:after {  border-color: '{{primary-contrast-0.87}}'; }.md-checkbox-enabled.md-THEME_NAME-theme .md-indeterminate[disabled] .md-container {  color: '{{foreground-3}}'; }.md-checkbox-enabled.md-THEME_NAME-theme md-option .md-text {  color: '{{background-900-0.87}}'; }md-sidenav.md-THEME_NAME-theme, md-sidenav.md-THEME_NAME-theme md-content {  background-color: '{{background-hue-1}}'; }md-slider.md-THEME_NAME-theme .md-track {  background-color: '{{foreground-3}}'; }md-slider.md-THEME_NAME-theme .md-track-ticks {  color: '{{background-contrast}}'; }md-slider.md-THEME_NAME-theme .md-focus-ring {  background-color: '{{accent-A200-0.2}}'; }md-slider.md-THEME_NAME-theme .md-disabled-thumb {  border-color: '{{background-color}}';  background-color: '{{background-color}}'; }md-slider.md-THEME_NAME-theme.md-min .md-thumb:after {  background-color: '{{background-color}}';  border-color: '{{foreground-3}}'; }md-slider.md-THEME_NAME-theme.md-min .md-focus-ring {  background-color: '{{foreground-3-0.38}}'; }md-slider.md-THEME_NAME-theme.md-min[md-discrete] .md-thumb:after {  background-color: '{{background-contrast}}';  border-color: transparent; }md-slider.md-THEME_NAME-theme.md-min[md-discrete] .md-sign {  background-color: '{{background-400}}'; }  md-slider.md-THEME_NAME-theme.md-min[md-discrete] .md-sign:after {    border-top-color: '{{background-400}}'; }md-slider.md-THEME_NAME-theme.md-min[md-discrete][md-vertical] .md-sign:after {  border-top-color: transparent;  border-left-color: '{{background-400}}'; }md-slider.md-THEME_NAME-theme .md-track.md-track-fill {  background-color: '{{accent-color}}'; }md-slider.md-THEME_NAME-theme .md-thumb:after {  border-color: '{{accent-color}}';  background-color: '{{accent-color}}'; }md-slider.md-THEME_NAME-theme .md-sign {  background-color: '{{accent-color}}'; }  md-slider.md-THEME_NAME-theme .md-sign:after {    border-top-color: '{{accent-color}}'; }md-slider.md-THEME_NAME-theme[md-vertical] .md-sign:after {  border-top-color: transparent;  border-left-color: '{{accent-color}}'; }md-slider.md-THEME_NAME-theme .md-thumb-text {  color: '{{accent-contrast}}'; }md-slider.md-THEME_NAME-theme.md-warn .md-focus-ring {  background-color: '{{warn-200-0.38}}'; }md-slider.md-THEME_NAME-theme.md-warn .md-track.md-track-fill {  background-color: '{{warn-color}}'; }md-slider.md-THEME_NAME-theme.md-warn .md-thumb:after {  border-color: '{{warn-color}}';  background-color: '{{warn-color}}'; }md-slider.md-THEME_NAME-theme.md-warn .md-sign {  background-color: '{{warn-color}}'; }  md-slider.md-THEME_NAME-theme.md-warn .md-sign:after {    border-top-color: '{{warn-color}}'; }md-slider.md-THEME_NAME-theme.md-warn[md-vertical] .md-sign:after {  border-top-color: transparent;  border-left-color: '{{warn-color}}'; }md-slider.md-THEME_NAME-theme.md-warn .md-thumb-text {  color: '{{warn-contrast}}'; }md-slider.md-THEME_NAME-theme.md-primary .md-focus-ring {  background-color: '{{primary-200-0.38}}'; }md-slider.md-THEME_NAME-theme.md-primary .md-track.md-track-fill {  background-color: '{{primary-color}}'; }md-slider.md-THEME_NAME-theme.md-primary .md-thumb:after {  border-color: '{{primary-color}}';  background-color: '{{primary-color}}'; }md-slider.md-THEME_NAME-theme.md-primary .md-sign {  background-color: '{{primary-color}}'; }  md-slider.md-THEME_NAME-theme.md-primary .md-sign:after {    border-top-color: '{{primary-color}}'; }md-slider.md-THEME_NAME-theme.md-primary[md-vertical] .md-sign:after {  border-top-color: transparent;  border-left-color: '{{primary-color}}'; }md-slider.md-THEME_NAME-theme.md-primary .md-thumb-text {  color: '{{primary-contrast}}'; }md-slider.md-THEME_NAME-theme[disabled] .md-thumb:after {  border-color: transparent; }md-slider.md-THEME_NAME-theme[disabled]:not(.md-min) .md-thumb:after, md-slider.md-THEME_NAME-theme[disabled][md-discrete] .md-thumb:after {  background-color: '{{foreground-3}}';  border-color: transparent; }md-slider.md-THEME_NAME-theme[disabled][readonly] .md-sign {  background-color: '{{background-400}}'; }  md-slider.md-THEME_NAME-theme[disabled][readonly] .md-sign:after {    border-top-color: '{{background-400}}'; }md-slider.md-THEME_NAME-theme[disabled][readonly][md-vertical] .md-sign:after {  border-top-color: transparent;  border-left-color: '{{background-400}}'; }md-slider.md-THEME_NAME-theme[disabled][readonly] .md-disabled-thumb {  border-color: transparent;  background-color: transparent; }md-slider-container[disabled] > *:first-child:not(md-slider),md-slider-container[disabled] > *:last-child:not(md-slider) {  color: '{{foreground-3}}'; }.md-subheader.md-THEME_NAME-theme {  color: '{{ foreground-2-0.23 }}';  background-color: '{{background-default}}'; }  .md-subheader.md-THEME_NAME-theme.md-primary {    color: '{{primary-color}}'; }  .md-subheader.md-THEME_NAME-theme.md-accent {    color: '{{accent-color}}'; }  .md-subheader.md-THEME_NAME-theme.md-warn {    color: '{{warn-color}}'; }md-switch.md-THEME_NAME-theme .md-ink-ripple {  color: '{{background-500}}'; }md-switch.md-THEME_NAME-theme .md-thumb {  background-color: '{{background-50}}'; }md-switch.md-THEME_NAME-theme .md-bar {  background-color: '{{background-500}}'; }md-switch.md-THEME_NAME-theme.md-checked .md-ink-ripple {  color: '{{accent-color}}'; }md-switch.md-THEME_NAME-theme.md-checked .md-thumb {  background-color: '{{accent-color}}'; }md-switch.md-THEME_NAME-theme.md-checked .md-bar {  background-color: '{{accent-color-0.5}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-focused .md-thumb:before {  background-color: '{{accent-color-0.26}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-primary .md-ink-ripple {  color: '{{primary-color}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-primary .md-thumb {  background-color: '{{primary-color}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-primary .md-bar {  background-color: '{{primary-color-0.5}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-primary.md-focused .md-thumb:before {  background-color: '{{primary-color-0.26}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-warn .md-ink-ripple {  color: '{{warn-color}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-warn .md-thumb {  background-color: '{{warn-color}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-warn .md-bar {  background-color: '{{warn-color-0.5}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-warn.md-focused .md-thumb:before {  background-color: '{{warn-color-0.26}}'; }md-switch.md-THEME_NAME-theme[disabled] .md-thumb {  background-color: '{{background-400}}'; }md-switch.md-THEME_NAME-theme[disabled] .md-bar {  background-color: '{{foreground-4}}'; }md-tabs.md-THEME_NAME-theme md-tabs-wrapper {  background-color: transparent;  border-color: '{{foreground-4}}'; }md-tabs.md-THEME_NAME-theme .md-paginator md-icon {  color: '{{primary-color}}'; }md-tabs.md-THEME_NAME-theme md-ink-bar {  color: '{{accent-color}}';  background: '{{accent-color}}'; }md-tabs.md-THEME_NAME-theme .md-tab {  color: '{{foreground-2}}'; }  md-tabs.md-THEME_NAME-theme .md-tab[disabled], md-tabs.md-THEME_NAME-theme .md-tab[disabled] md-icon {    color: '{{foreground-3}}'; }  md-tabs.md-THEME_NAME-theme .md-tab.md-active, md-tabs.md-THEME_NAME-theme .md-tab.md-active md-icon, md-tabs.md-THEME_NAME-theme .md-tab.md-focused, md-tabs.md-THEME_NAME-theme .md-tab.md-focused md-icon {    color: '{{primary-color}}'; }  md-tabs.md-THEME_NAME-theme .md-tab.md-focused {    background: '{{primary-color-0.1}}'; }  md-tabs.md-THEME_NAME-theme .md-tab .md-ripple-container {    color: '{{accent-A100}}'; }md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper {  background-color: '{{accent-color}}'; }  md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]) {    color: '{{accent-A100}}'; }    md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active, md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active md-icon, md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused, md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused md-icon {      color: '{{accent-contrast}}'; }    md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused {      background: '{{accent-contrast-0.1}}'; }  md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-ink-bar {    color: '{{primary-600-1}}';    background: '{{primary-600-1}}'; }md-tabs.md-THEME_NAME-theme.md-primary > md-tabs-wrapper {  background-color: '{{primary-color}}'; }  md-tabs.md-THEME_NAME-theme.md-primary > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]) {    color: '{{primary-100}}'; }    md-tabs.md-THEME_NAME-theme.md-primary > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active, md-tabs.md-THEME_NAME-theme.md-primary > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active md-icon, md-tabs.md-THEME_NAME-theme.md-primary > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused, md-tabs.md-THEME_NAME-theme.md-primary > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused md-icon {      color: '{{primary-contrast}}'; }    md-tabs.md-THEME_NAME-theme.md-primary > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused {      background: '{{primary-contrast-0.1}}'; }md-tabs.md-THEME_NAME-theme.md-warn > md-tabs-wrapper {  background-color: '{{warn-color}}'; }  md-tabs.md-THEME_NAME-theme.md-warn > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]) {    color: '{{warn-100}}'; }    md-tabs.md-THEME_NAME-theme.md-warn > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active, md-tabs.md-THEME_NAME-theme.md-warn > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active md-icon, md-tabs.md-THEME_NAME-theme.md-warn > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused, md-tabs.md-THEME_NAME-theme.md-warn > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused md-icon {      color: '{{warn-contrast}}'; }    md-tabs.md-THEME_NAME-theme.md-warn > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused {      background: '{{warn-contrast-0.1}}'; }md-toolbar > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper {  background-color: '{{primary-color}}'; }  md-toolbar > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]) {    color: '{{primary-100}}'; }    md-toolbar > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active, md-toolbar > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active md-icon, md-toolbar > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused, md-toolbar > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused md-icon {      color: '{{primary-contrast}}'; }    md-toolbar > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused {      background: '{{primary-contrast-0.1}}'; }md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper {  background-color: '{{accent-color}}'; }  md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]) {    color: '{{accent-A100}}'; }    md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active, md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active md-icon, md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused, md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused md-icon {      color: '{{accent-contrast}}'; }    md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused {      background: '{{accent-contrast-0.1}}'; }  md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-ink-bar {    color: '{{primary-600-1}}';    background: '{{primary-600-1}}'; }md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper {  background-color: '{{warn-color}}'; }  md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]) {    color: '{{warn-100}}'; }    md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active, md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active md-icon, md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused, md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused md-icon {      color: '{{warn-contrast}}'; }    md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused {      background: '{{warn-contrast-0.1}}'; }md-toast.md-THEME_NAME-theme .md-toast-content {  background-color: #323232;  color: '{{background-50}}'; }  md-toast.md-THEME_NAME-theme .md-toast-content .md-button {    color: '{{background-50}}'; }    md-toast.md-THEME_NAME-theme .md-toast-content .md-button.md-highlight {      color: '{{accent-color}}'; }      md-toast.md-THEME_NAME-theme .md-toast-content .md-button.md-highlight.md-primary {        color: '{{primary-color}}'; }      md-toast.md-THEME_NAME-theme .md-toast-content .md-button.md-highlight.md-warn {        color: '{{warn-color}}'; }md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar) {  background-color: '{{primary-color}}';  color: '{{primary-contrast}}'; }  md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar) md-icon {    color: '{{primary-contrast}}';    fill: '{{primary-contrast}}'; }  md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar) .md-button[disabled] md-icon {    color: '{{primary-contrast-0.26}}';    fill: '{{primary-contrast-0.26}}'; }  md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar).md-accent {    background-color: '{{accent-color}}';    color: '{{accent-contrast}}'; }    md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar).md-accent .md-ink-ripple {      color: '{{accent-contrast}}'; }    md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar).md-accent md-icon {      color: '{{accent-contrast}}';      fill: '{{accent-contrast}}'; }    md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar).md-accent .md-button[disabled] md-icon {      color: '{{accent-contrast-0.26}}';      fill: '{{accent-contrast-0.26}}'; }  md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar).md-warn {    background-color: '{{warn-color}}';    color: '{{warn-contrast}}'; }md-tooltip.md-THEME_NAME-theme {  color: '{{background-700-contrast}}'; }  md-tooltip.md-THEME_NAME-theme .md-content {    background-color: '{{background-700}}'; }/*  Only used with Theme processes */html.md-THEME_NAME-theme, body.md-THEME_NAME-theme {  color: '{{foreground-1}}';  background-color: '{{background-color}}'; }"); 
})();


})(window, window.angular);;window.ngMaterial={version:{full: "1.1.1"}};