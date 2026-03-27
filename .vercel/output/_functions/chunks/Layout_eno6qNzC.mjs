import { e as createComponent, r as renderTemplate, l as renderSlot, n as renderHead, h as createAstro } from './astro/server_BahSWGGF.mjs';
import 'piccolore';
import 'clsx';
/* empty css                             */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate(_a || (_a = __template([`<html lang="zh-CN"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="DuoEye - \u591A\u90BB\u56FD\u5B66\u4E60\u6570\u636E\u4EEA\u8868\u76D8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><script>
      (() => {
        try {
          const savedTheme = localStorage.getItem('duoeye-theme');
          const themeMode =
            savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system'
              ? savedTheme
              : 'system';
          const resolvedTheme =
            themeMode === 'system'
              ? window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
              : themeMode;
          document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
        } catch {
          document.documentElement.classList.remove('dark');
        }
      })();
    <\/script><title>`, "</title>", '</head> <body class="min-h-screen font-sans antialiased text-apple-dark1 transition-colors dark:text-white"> ', " </body></html>"])), title, renderHead(), renderSlot($$result, $$slots["default"]));
}, "E:/duoeye/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
