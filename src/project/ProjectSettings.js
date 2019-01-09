import React, {Component} from 'react';
import {connect} from 'react-redux';
import MarkdownInput from "../components/codemirror/MarkdownInput";
import {actionUpdateProjectMetadata} from "../redux/project/projectActions";
import ReactMarkdown from 'react-markdown';
import ImportExport from "./ImportExport";
import ProjectDoc from "./ProjectDoc";
import {Route} from "react-router-dom";
import FunctionsList from "./functions/FunctionsList";
import EnvironmentVariables from "./environment/EnvironmentVariables";

class ProjectSettings extends Component {

    state = {
        mode: 'edit',
    }

    updateProjectComment = (value)=>{
        this.props.updateProjectComment({comment:value})
    }


    changeMode = (mode)=>()=>{
        this.setState({mode})
    }



    render() {
        return (
                <div className="w-full md:w-4/5 md:min-h-screen overflow-scroll">
                    <Route path={this.props.match.url+"/functions"} component={FunctionsList} />
                    <Route path={this.props.match.url+"/environment"} component={EnvironmentVariables} />
                    <Route path={this.props.match.url+"/ie"} component={ImportExport} />
                    <Route path={this.props.match.url+"/doc"} component={ProjectDoc} />
                </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        comment: state.metadata.comment
    };
}

function mapDispatchToProps(dispatch, props){
    return {
        updateProjectComment:(change)=>dispatch(actionUpdateProjectMetadata(change))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(ProjectSettings);
