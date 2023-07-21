import * as universal from '../entries/pages/chat/_channel_/_layout.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/chat/[channel]/+layout.js";
export const imports = ["_app/immutable/nodes/2.0e747538.js","_app/immutable/chunks/layout.593db684.js","_app/immutable/chunks/scheduler.7dea6fa4.js","_app/immutable/chunks/index.def36dde.js"];
export const stylesheets = [];
export const fonts = [];
