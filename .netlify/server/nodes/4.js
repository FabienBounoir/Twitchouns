

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/chat/_channel_/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.ba320687.js","_app/immutable/chunks/scheduler.7dea6fa4.js","_app/immutable/chunks/index.def36dde.js","_app/immutable/chunks/singletons.0c55e50d.js","_app/immutable/chunks/stores.33add08a.js"];
export const stylesheets = ["_app/immutable/assets/4.868b463e.css"];
export const fonts = [];
