const defaultState = {
    projectTitle:'',
    maxHistory:5,
    projectId:undefined,
}


export default (state = defaultState, action)=>{
    switch (action.type) {
        default:
            return state;
    }
};
