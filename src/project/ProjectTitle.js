import {FiSettings} from "react-icons/fi";
import React from "react";
import {Link, NavLink, Route, withRouter} from 'react-router-dom';
import EnvironmentSwitcher from "./EnvironmentSwitcher";
import {actionUpdateProjectMetadata} from "../redux/project/projectActions";
import {connect} from 'react-redux';

class ProjectTitle extends React.PureComponent{

    state = {
        showOptions:false,
        titleEditable:false,
    }

    constructor(props){
        super(props);
        this.state.showOptions  = document.location.pathname.includes("settings")
    }

    toggleOptions = ()=>{
        this.setState({showOptions:!this.state.showOptions})
    }

    onDblClick = ()=>{
        this.setState({titleEditable:true})
    }

    onInputBlur = (e)=>{
        this.setState({titleEditable:false});
        this.props.updateProjectMeta({name:e.target.value})
    }




    render(){
        const {projectId, name} = this.props;
        return  <div>
            <div className={"h-12 p-2 flex flex-row items-center border-b primary-border secondary-bg"}>
                {this.state.titleEditable ?
                    <input className={"font-bold text-lg flex-1"} defaultValue={name} placeholder={"Project Name"} onBlur={this.onInputBlur}/>
                    :  <h2 className={"flex-1"} onDoubleClick={this.onDblClick}>{name || 'My Project'}</h2>
                }
                <button onClick={this.toggleOptions} className={"primary-button flex flex-col items-center px-2"}>
                    <FiSettings className={"w-6 h-6"} />
                </button>
            </div>
            {this.state.showOptions ?
                <SettingsRoute projectId={projectId}/>
                : null
            }
                <div className={"flex flex-row items-center justify-center my-2 px-2"}>
                <p className={"mr-2"}>Environment</p>
                <EnvironmentSwitcher />
            </div>
        </div>
    }
}



function SettingsRoute({projectId}){
    return   <ul className={"list-reset ml-4 border-l border-b shadow-md rounded-bl overflow-none primary-border"}>
                <PLink title={"Functions"} to={`/p/${projectId}/settings/functions`} />
                <PLink title={"Environment"} to={`/p/${projectId}/settings/environment`} />
                <PLink title={"Import/Export"} to={`/p/${projectId}/settings/ie`} />
            </ul>
}

function PLink({to, title}){
    return (<li>
        <NavLink activeClassName={"list-item-active"}
                 className={"no-underline appearance-none p-2 block list-item"}
                 to={to}>{title}</NavLink>
    </li>);

}

function mapStateToProps(state, props){
    return {
        name:state.metadata.name,
    }
}

function mapDispatchToProps(dispatch, props){
    return {
        updateProjectMeta:(change)=>dispatch(actionUpdateProjectMetadata(change))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectTitle))
