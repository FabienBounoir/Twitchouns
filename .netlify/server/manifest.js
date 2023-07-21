export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","tmi.min.js"]),
	mimeTypes: {".png":"image/png",".js":"application/javascript"},
	_: {
		client: {"start":"_app/immutable/entry/start.e552219f.js","app":"_app/immutable/entry/app.08ba1acb.js","imports":["_app/immutable/entry/start.e552219f.js","_app/immutable/chunks/scheduler.7dea6fa4.js","_app/immutable/chunks/singletons.0c55e50d.js","_app/immutable/entry/app.08ba1acb.js","_app/immutable/chunks/scheduler.7dea6fa4.js","_app/immutable/chunks/index.def36dde.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/4.js'))
		],
		routes: [
			{
				id: "/api/getCBadge",
				pattern: /^\/api\/getCBadge\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/getCBadge/_server.js'))
			},
			{
				id: "/api/getGBadge",
				pattern: /^\/api\/getGBadge\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/getGBadge/_server.js'))
			},
			{
				id: "/chat/[channel]",
				pattern: /^\/chat\/([^/]+?)\/?$/,
				params: [{"name":"channel","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
