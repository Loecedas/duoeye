import { defineMiddleware } from 'astro:middleware';
import { getRuntimeEnv } from './utils/env';

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const runtimeEnv = getRuntimeEnv(context.locals);
    if (runtimeEnv && typeof process !== 'undefined' && process.env) {
      for (const [key, value] of Object.entries(runtimeEnv)) {
        if (value !== undefined && value !== null && !process.env[key]) {
          process.env[key] = String(value);
        }
      }
    }
  } catch {
    // 忽略异常
  }
  return next();
});
