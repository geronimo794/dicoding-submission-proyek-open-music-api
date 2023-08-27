const routes = (handler) => [
	{
		method: 'POST',
		path: '/collaborations',
		handler: (request, h) => handler.postCollaborationHandler(request, h),
		options: {
			auth: 'auth_jwt',
		},
	},
	{
		method: 'DELETE',
		path: '/collaborations',
		handler: (request, h) => handler.deleteCollaborationHandler(request, h),
		options: {
			auth: 'auth_jwt',
		},
	},
];
export default routes;
