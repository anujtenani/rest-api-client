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
	group:'group',
};

export function createActionConstant(method, type) {
	return `${method}-${type}`;
}
