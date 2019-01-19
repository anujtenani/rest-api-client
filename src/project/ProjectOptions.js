import React, {Component} from 'react';
import Input from "../components/Input";
import Label from "../components/Label";
import {connect} from 'react-redux';
import {actionDeleteProject, actionUpdateProjectName} from "../redux/project/projectActions";

class ProjectOptions extends Component {

    deleteProject = ()=>{
        this.props.deleteProject();
        document.location = '/';

    }

    onBlur = (e) => {
        this.props.updateProjectName(e.target.value);
    }

    render() {
        return  <div className={"md:w-1/2 w-full"}>
            <div className={"m-2 shadow rounded p-2"}>
                <Label>Project Title</Label>
                <Input defaultValue={this.props.name} placeholder={"Project Name"} onBlur={this.onBlur}/>
            </div>

            <div className={"m-2 shadow rounded p-2"}>
                <h3>Delete Project</h3>
                <p className={"my-2"}>This action is permanent, a deleted project cannot be recovered</p>
                <button className={"bg-red p-2 shadow text-white rounded hover:bg-red-dark"} onClick={this.deleteProject}>Delete Project</button>
            </div>

        </div>
    }
}

function mapStateToProps(state) {
    return {
        name: state.metadata.name
    };
}

function mapDispatchToProps(dispatch, props){
    return {
        deleteProject:()=>dispatch(actionDeleteProject()),
        updateProjectName:(name)=>dispatch(actionUpdateProjectName(name))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(ProjectOptions);
