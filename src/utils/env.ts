/**
 * 跨平台环境配置与密钥提取工具
 * 支持 Cloudflare Workers (cloudflare:workers),
 * Node.js (process.env), 以及 Vite / Astro (import.meta.env)
 */

let workersModule: any = undefined;

// 在 Cloudflare Workers 运行时及支持的环境中动态导入 cloudflare:workers 模块
try {
  // @ts-ignore
  workersModule = await import('cloudflare:workers');
} catch {
  // 非 Cloudflare Workers 运行时或构建阶段，忽略
}

export function getRuntimeEnv(locals?: any): Record<string, any> {
  // 1. 优先从 cloudflare:workers 导出的 env 代理中获取（动态读取当前请求上下文环境绑定）
  try {
    if (workersModule?.env && typeof workersModule.env === 'object') {
      return workersModule.env;
    }
  } catch {
    // 忽略异常
  }

  // 2. 检查 locals.env（注意：绝对不能访问 locals.runtime.env，Astro Cloudflare 适配器设置了抛错 getter）
  if (locals && typeof locals === 'object') {
    const directEnv = (locals as any).env;
    if (directEnv && typeof directEnv === 'object') {
      return directEnv;
    }
  }

  return {};
}

export function getEnv(key: string, locals?: any): string {
  // 1. 优先读取 Cloudflare Workers 运行时环境 (cloudflare:workers)
  try {
    const runtimeEnv = getRuntimeEnv(locals);
    if (runtimeEnv && runtimeEnv[key] !== undefined && runtimeEnv[key] !== null) {
      const val = String(runtimeEnv[key]).trim();
      if (val) return val;
    }
  } catch {
    // 忽略异常
  }

  // 2. 读取 Node.js 环境变量 (process.env)
  if (typeof process !== 'undefined' && process.env && process.env[key] !== undefined && process.env[key] !== null) {
    const val = String(process.env[key]).trim();
    if (val) return val;
  }

  // 3. 读取 Vite / Astro 构建注入的环境变量 (import.meta.env)
  try {
    const metaEnv = (import.meta as any).env as Record<string, any> | undefined;
    if (metaEnv && metaEnv[key] !== undefined && metaEnv[key] !== null) {
      const val = String(metaEnv[key]).trim();
      if (val) return val;
    }
  } catch {
    // 忽略异常
  }

  return '';
}
