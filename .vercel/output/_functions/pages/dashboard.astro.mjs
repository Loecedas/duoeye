/* empty css                                     */
import { e as createComponent, k as renderComponent, r as renderTemplate, g as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_BahSWGGF.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_eno6qNzC.mjs';
export { renderers } from '../renderers.mjs';

const mountDashboardUrl = "data:video/mp2t;base64,aW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gJ3JlYWN0JzsKaW1wb3J0IHsgY3JlYXRlUm9vdCB9IGZyb20gJ3JlYWN0LWRvbS9jbGllbnQnOwppbXBvcnQgRHVvRGFzaEFwcCBmcm9tICcuLi9jb21wb25lbnRzL0R1b0Rhc2hBcHAnOwoKY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rhc2hib2FyZC1yb290Jyk7CgppZiAoY29udGFpbmVyKSB7CiAgY3JlYXRlUm9vdChjb250YWluZXIpLnJlbmRlcihjcmVhdGVFbGVtZW50KER1b0Rhc2hBcHApKTsKfQo=";

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Dashboard = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "DuoEye - \u4EEA\u8868\u76D8" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div id="dashboard-root"></div> <script type="module"', "><\/script> "])), maybeRenderHead(), addAttribute(mountDashboardUrl, "src")) })}`;
}, "E:/duoeye/src/pages/dashboard.astro", void 0);

const $$file = "E:/duoeye/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
