import {createActionConstant, methods, types} from "../actionCreator";
import {getItem, setItem} from "../../servicehandlers";
import {getProjectName} from "../../helpers/func";

export const actionUpdateProjectMetadata = (change)=>{
    return {
        type: createActionConstant(methods.update, types.metadata),
        change
    }
}


export const actionUpdateProjectName = (name)=>{
    return (dispatch, getState)=>{
        const projectId = getProjectName();
        console.log('got project id', projectId);
        dispatch(actionUpdateProjectMetadata({name}));
        getItem('projects').then((res)=>{
            if(!res){
                res = [{id: projectId, name}]
            }else{
                res = JSON.parse(res);
            }
            const projects = res.map((project)=>{
               return String(project.id) === String(projectId) ? {...project, name} :  project;
            });
            setItem('projects', projects)
        });
    }
}

export const actionDeleteProject = (projectId)=>{
    return (dispatch, getState)=>{
        if(!projectId){
            projectId = getState().metadata.id || getProjectName();
        }
        getItem('projects').then((res)=>{
            if(res) {
                const projects = JSON.parse(res);
                setItem('projects', projects.filter((project)=> String(project.id) !== String(projectId)));
            }
        });
        setItem(`persist:${projectId}`,{});
    }
}
