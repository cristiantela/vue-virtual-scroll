'use strict';Object.defineProperty(exports,'__esModule',{value:true});//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  name: "virtual-scroll",
  // vue component name
  props: {
    items: {
      type: Array,
      required: true
    },
    itemHeight: {
      type: Number,
      required: true
    },
    id: {
      type: String,
      default: ""
    },
    overflow: {
      type: Number,
      default: 5
    }
  },
  data: function data() {
    return {
      offsetTop: 0,
      screenHeight: 0,
      scrollY: 0
    };
  },
  created: function created() {
    this.setScreenHeight();
    window.addEventListener("resize", this.setScreenHeight);
    window.addEventListener("scroll", this.setScrollY);
  },
  mounted: function mounted() {
    this.setOffsetTop();
  },
  updated: function updated() {
    this.setOffsetTop();
  },
  computed: {
    showBefore: function showBefore() {
      if (this.indexStart < this.overflow) {
        return this.indexStart;
      } else {
        return this.overflow;
      }
    },
    showAfter: function showAfter() {
      if (this.items.length - this.indexEnd < this.overflow) {
        return this.items.length - this.indexEnd;
      } else {
        return this.overflow;
      }
    },
    indexStart: function indexStart() {
      if (this.scrollY <= this.offsetTop) {
        return 0;
      } else {
        var indexStart = Math.ceil((this.scrollY - this.offsetTop) / this.itemHeight);

        if (indexStart >= this.items.length) {
          return this.items.length;
        }

        return indexStart;
      }
    },
    indexEnd: function indexEnd() {
      var indexEnd = this.indexStart + this.canSee;

      if (indexEnd >= this.items.length) {
        return this.items.length;
      }

      return indexEnd;
    },
    realIndexStart: function realIndexStart() {
      if (this.scrollY > this.offsetTop + this.items.length * this.itemHeight + this.overflow * this.itemHeight) {
        return this.items.length;
      }

      return this.indexStart - this.showBefore;
    },
    realIndexEnd: function realIndexEnd() {
      if (this.scrollY + this.screenHeight <= this.offsetTop - this.overflow * this.itemHeight) {
        return 0;
      }

      return this.indexEnd + this.showAfter;
    },
    paddingTop: function paddingTop() {
      return this.realIndexStart * this.itemHeight;
    },
    paddingBottom: function paddingBottom() {
      var paddingBottom = this.items.length * this.itemHeight - this.visibleItems.length * this.itemHeight - this.paddingTop;

      if (paddingBottom < 0) {
        return 0;
      }

      return paddingBottom;
    },
    canSee: function canSee() {
      var canSee = Math.floor(this.screenHeight / this.itemHeight);
      var hidden = 0;

      if (this.scrollY < this.offsetTop - this.screenHeight) {
        return 0;
      }

      if (this.scrollY < this.offsetTop) {
        hidden += Math.floor((this.offsetTop - this.scrollY) / this.itemHeight);
      }

      return canSee - hidden;
    },
    visibleItems: function visibleItems() {
      var visibleItems = this.items.slice(this.realIndexStart, this.realIndexEnd);
      return visibleItems;
    }
  },
  methods: {
    setOffsetTop: function setOffsetTop() {
      var element = this.$refs.container;
      var top = 0;

      do {
        top += element.offsetTop;
        element = element.offsetParent;
      } while (element.offsetParent !== null);

      this.offsetTop = top;
    },
    setScreenHeight: function setScreenHeight() {
      this.screenHeight = window.innerHeight;
    },
    setScrollY: function setScrollY() {
      this.scrollY = window.scrollY;
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    ref: "container",
    style: {
      paddingTop: _vm.paddingTop + "px",
      paddingBottom: _vm.paddingBottom + "px"
    }
  }, _vm._l(_vm.visibleItems, function (item, index) {
    return _vm._ssrNode("<div" + _vm._ssrStyle(null, {
      height: _vm.itemHeight + "px"
    }, null) + ">", "</div>", [_vm._t("default", null, {
      "item": item,
      "index": index
    })], 2);
  }), 0);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = "data-v-337cb29c";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);// Import vue component

var install = function installVirtualScroll(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('VirtualScroll', __vue_component__);
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

{
  var GlobalVue = null;

  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  }
} // Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;
exports.default=__vue_component__;