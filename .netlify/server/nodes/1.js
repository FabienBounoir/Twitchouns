

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.c47d72db.js","_app/immutable/chunks/scheduler.7dea6fa4.js","_app/immutable/chunks/index.def36dde.js","_app/immutable/chunks/stores.33add08a.js","_app/immutable/chunks/singletons.0c55e50d.js"];
export const stylesheets = [];
export const fonts = [];
