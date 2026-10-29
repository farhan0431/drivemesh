import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-8jYXDYbZ.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "StatusBadge",
  __ssrInlineRender: true,
  props: {
    active: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: [
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
          __props.active ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/60" : "bg-zinc-900 text-zinc-400 border-zinc-800"
        ]
      }, _attrs))}><span class="${ssrRenderClass([__props.active ? "bg-emerald-400 animate-pulse" : "bg-zinc-500", "w-1.5 h-1.5 rounded-full"])}"></span>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/StatusBadge.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  __ssrInlineRender: true,
  props: {
    domain: {},
    smbActive: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur sticky top-0 z-40" }, _attrs))}><div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-sm"> D </div><div><div class="flex items-center gap-2"><h1 class="font-semibold text-zinc-100 text-sm tracking-tight">DriveMesh</h1><span class="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">v1.0</span></div><p class="text-xs text-zinc-400 font-mono hidden sm:block">${ssrInterpolate(__props.domain)}</p></div></div><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(_sfc_main$3, { active: __props.smbActive }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`SMB 3.1.1`);
          } else {
            return [
              createTextVNode("SMB 3.1.1")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$3, { active: true }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`TLS 1.3`);
          } else {
            return [
              createTextVNode("TLS 1.3")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></header>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/AppHeader.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "border-t border-zinc-900 py-6 text-center text-xs text-zinc-500 font-mono" }, _attrs))}><div class="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3"><p>DriveMesh \u2022 Stateless Streaming Bridge (Zero Local Storage)</p><p class="text-zinc-600">Open-Source Edition \u2022 PostgreSQL</p></div></footer>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/AppFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AppFooter = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  props: {
    domain: {},
    smbActive: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        domain: __props.domain,
        "smb-active": __props.smbActive
      }, null, _parent));
      _push(`<main class="flex-1 max-w-4xl w-full mx-auto px-4 py-8">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-CqgwUSJx.mjs.map
