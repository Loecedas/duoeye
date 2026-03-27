/* empty css                                     */
import { e as createComponent, k as renderComponent, r as renderTemplate, g as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_BahSWGGF.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_eno6qNzC.mjs';
export { renderers } from '../renderers.mjs';

const mountLandingUrl = "data:video/mp2t;base64,aW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gJ3JlYWN0JzsKaW1wb3J0IHsgY3JlYXRlUm9vdCB9IGZyb20gJ3JlYWN0LWRvbS9jbGllbnQnOwppbXBvcnQgTGFuZGluZ0hlcm8gZnJvbSAnLi4vY29tcG9uZW50cy9MYW5kaW5nSGVybyc7Cgpjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGFuZGluZy1yb290Jyk7CgppZiAoY29udGFpbmVyKSB7CiAgY3JlYXRlUm9vdChjb250YWluZXIpLnJlbmRlcihjcmVhdGVFbGVtZW50KExhbmRpbmdIZXJvKSk7Cn0K";

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "DuoEye - \u591A\u90BB\u56FD\u5B66\u4E60\u6570\u636E\u4EEA\u8868\u76D8" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div id="landing-root"></div> <script type="module"', "><\/script> "])), maybeRenderHead(), addAttribute(mountLandingUrl, "src")) })}`;
}, "E:/duoeye/src/pages/index.astro", void 0);

const $$file = "E:/duoeye/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
