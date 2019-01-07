import React, {Component} from 'react';
import {connect} from 'react-redux';
import {actionDeleteUrlPath, actionUpdateUrlPath} from "../../redux/path/pathActions";
import Input from "../../components/Input";
import {FiMenu, FiX} from "react-icons/fi";
import Textarea from "react-textarea-autosize";

class UrlPathInput extends Component {

    state = {
        docVisible:false
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
                <Input placeholder={"Find in path"} defaultValue={name} onBlur={this.onInputBlur('name')}  />
                <Input placeholder={"Replace with"} defaultValue={value} onBlur={this.onInputBlur('value')}  />
                <button className={"p-2 primary-text"} onClick={this.deleteItem}><FiX/></button>
                <button className={"p-2 primary-text"} onClick={this.toggleDoc}><FiMenu/></button>
            </div>
            {docVisible ?
            <div className={"my-2 flex flex-row items-center block"}>
                <Textarea placeholder={"Description"} onBlur={this.onInputBlur('comment')} defaultValue={comment} className={"flex-1 py-2 border-b  bg-transparent primary-border primary-text"}/>
            </div> : null }
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
