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

  data() {
    return {
      offsetTop: 0,
      screenHeight: 0,
      scrollY: 0
    };
  },

  created() {
    this.setScreenHeight();
    window.addEventListener("resize", this.setScreenHeight);
    window.addEventListener("scroll", this.setScrollY);
  },

  mounted() {
    this.setOffsetTop();
  },

  updated() {
    this.setOffsetTop();
  },

  computed: {
    showBefore() {
      if (this.indexStart < this.overflow) {
        return this.indexStart;
      } else {
        return this.overflow;
      }
    },

    showAfter() {
      if (this.items.length - this.indexEnd < this.overflow) {
        return this.items.length - this.indexEnd;
      } else {
        return this.overflow;
      }
    },

    indexStart() {
      if (this.scrollY <= this.offsetTop) {
        return 0;
      } else {
        const indexStart = Math.ceil((this.scrollY - this.offsetTop) / this.itemHeight);

        if (indexStart >= this.items.length) {
          return this.items.length;
        }

        return indexStart;
      }
    },

    indexEnd() {
      const indexEnd = this.indexStart + this.canSee;

      if (indexEnd >= this.items.length) {
        return this.items.length;
      }

      return indexEnd;
    },

    realIndexStart() {
      if (this.scrollY > this.offsetTop + this.items.length * this.itemHeight + this.overflow * this.itemHeight) {
        return this.items.length;
      }

      return this.indexStart - this.showBefore;
    },

    realIndexEnd() {
      if (this.scrollY + this.screenHeight <= this.offsetTop - this.overflow * this.itemHeight) {
        return 0;
      }

      return this.indexEnd + this.showAfter;
    },

    paddingTop() {
      return this.realIndexStart * this.itemHeight;
    },

    paddingBottom() {
      const paddingBottom = this.items.length * this.itemHeight - this.visibleItems.length * this.itemHeight - this.paddingTop;

      if (paddingBottom < 0) {
        return 0;
      }

      return paddingBottom;
    },

    canSee() {
      const canSee = Math.floor(this.screenHeight / this.itemHeight);
      let hidden = 0;

      if (this.scrollY < this.offsetTop - this.screenHeight) {
        return 0;
      }

      if (this.scrollY < this.offsetTop) {
        hidden += Math.floor((this.offsetTop - this.scrollY) / this.itemHeight);
      }

      return canSee - hidden;
    },

    visibleItems() {
      let visibleItems = this.items.slice(this.realIndexStart, this.realIndexEnd);
      return visibleItems;
    }

  },
  methods: {
    setOffsetTop() {
      let element = this.$refs.container;
      let top = 0;

      do {
        top += element.offsetTop;
        element = element.offsetParent;
      } while (element.offsetParent !== null);

      this.offsetTop = top;
    },

    setScreenHeight() {
      this.screenHeight = window.innerHeight;
    },

    setScrollY() {
      this.scrollY = window.scrollY;
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
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
    return _c('div', {
      key: _vm.id ? item[_vm.id] : index,
      style: {
        height: _vm.itemHeight + "px"
      }
    }, [_vm._t("default", null, {
      "item": item,
      "index": index
    })], 2);
  }), 0);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = undefined;
/* scoped */

const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

// Import vue component

const install = function installVirtualScroll(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('VirtualScroll', __vue_component__);
}; // Create module definition for Vue.use()
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default __vue_component__;
