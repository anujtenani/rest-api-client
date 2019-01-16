import {createActionConstant, methods, types} from "../actionCreator";
import {getItem, setItem} from "../../servicehandlers";

export const actionUpdateProjectMetadata = (change)=>{
    return {
        type: createActionConstant(methods.update, types.metadata),
        change
    }
}

export const actionUpdateProjectName = (name)=>{
    return (dispatch, getState)=>{
        const projectId = getState().metadata.id;
        dispatch(actionUpdateProjectMetadata({name}));
        getItem('projects').then((res)=>{
            console.log(typeof  res);
            if(!res){
                res = [{id: projectId, name}]
            }else{
                res = JSON.parse(res);
            }
            const projects = res.map((project)=>{
               return project.id === projectId ? {...project, name} :  project;
            });
            setItem('projects', projects)
        });
    }
}
