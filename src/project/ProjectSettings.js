import React, {Component} from 'react';
import {connect} from 'react-redux';
import MarkdownInput from "../components/codemirror/MarkdownInput";
import {actionUpdateProjectMetadata} from "../redux/projectActions";
import ReactMarkdown from 'react-markdown';

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
            <div className="w-full md:w-2/5 md:min-h-screen  overflow-scroll border-0 md:border-l md:border-r primary-border">
                <div className={"flex flex-row justify-end"}>
                    <button onClick={this.changeMode('preview')}>Preview</button>
                    <button onClick={this.changeMode('edit')}>Edit</button>
                </div>
                {this.state.mode === "edit" ?
                    <MarkdownInput onBlur={this.updateProjectComment} defaultValue={this.props.comment}/>
                    : <ReactMarkdown source={this.props.comment} className={"markdown"}/>
                }
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
