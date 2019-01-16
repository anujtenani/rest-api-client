import React, {Component} from 'react';
import {connect} from 'react-redux';
import {actionDeleteUrlPath, actionUpdateUrlPath} from "../../redux/path/pathActions";
import Input from "../../components/Input";
import {FiMenu, FiX} from "react-icons/fi";
import Textarea from "react-textarea-autosize";
import FieldCommentTextArea from "../commons/FieldCommentTextArea";

class UrlPathInput extends Component {

    state = {
        docVisible:false
    }

    componentDidMount() {
        this.setState({docVisible:this.props.comment && this.props.comment.length > 0});
    }

    onInputBlur = (key)=>(e)=>{
        this.props.updatePathItem({[key]:e.target.value})
    }


    deleteItem = (e)=>{
        this.props.deletePathItem();
    }

    toggleDoc = (e)=>{
        this.setState({docVisible: !this.state.docVisible})
    }

    render() {
        const {name, value, comment} = this.props;
        const {docVisible} = this.state;
        return (
            <div>
            <div className={"flex flex-row"}>
                <div className={"flex flex-col items-center justify-center bg-orange"}>
                    <span className={"px-1 text-white font-mono"}>P</span>
                </div>
                <Input placeholder={"Find in path"} defaultValue={name} onBlur={this.onInputBlur('name')}  />
                <Input placeholder={"Replace with"} defaultValue={value} onBlur={this.onInputBlur('value')}  />
                <button className={"p-2 primary-text"} onClick={this.deleteItem}><FiX/></button>
                <button className={"p-2 primary-text"} onClick={this.toggleDoc}><FiMenu/></button>
            </div>
            {docVisible ?
               <FieldCommentTextArea onBlur={this.onInputBlur('comment')} defaultValue={comment} /> : null }
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const {pathId, requestId} = props;
    return {
        ...state.requests.byId[requestId].path.byId[pathId],
    };
}

function mapDispatchToProps(dispatch, props){
    const {pathId, requestId} = props;
    return {
        updatePathItem:(change)=>dispatch(actionUpdateUrlPath(requestId, pathId, change)),
        deletePathItem:()=>dispatch(actionDeleteUrlPath(requestId, pathId))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(UrlPathInput);
