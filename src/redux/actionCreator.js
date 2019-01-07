export const methods = {
	set: 'set',
	create: 'insert',
	bulkinsert: 'bulkinsert',
	bulkdelete: 'bulkdelete',
	bulkupdate: 'bulkupdate',
	updateall: 'updateall',
	deleteall: 'deleteall',
	update: 'update',
	delete: 'delete',
	loading: 'loading'
};

export const types = {
	metadata:'metadata',
	headers: 'headers',
	form: 'form',
    request: 'request',
	loadingState: 'loadingstate',
	auth: 'auth',
	body:'body',
	bodyType:'bodyType',
	bodyData:'bodydata',
	cookies:'cookies',
	history:'history',
	queryString: 'qs',
	urlpath:'path',
	group:'group',
	func:'function',
	variable:'variable',
	env:'env'
};

export function createActionConstant(method, type) {
	return `${method}-${type}`;
}
