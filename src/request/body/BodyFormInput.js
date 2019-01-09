import React, {Component} from 'react';
import {connect} from 'react-redux';
import Input from "../../components/Input";
import {FiLink, FiMenu, FiStar, FiX} from "react-icons/fi";
import Textarea from "react-textarea-autosize";
import FileInput from "../../components/FileInput";
import {actionDeleteBodyItem, actionUpdateBodyItem} from "../../redux/body/bodyActions";

class BodyFormInput extends Component {
    state = {
        docVisible: false,
    }

    onInputChange = (key)=>(e)=>{
        this.setState({[key]:e.target.value})
    }
    onInputBlur = (key)=>(e)=>{
        this.props.updateBodyItem({[key]: e.target.value})
    }

    onInputTypeChange = ({target})=>{
        const {value} = target;
        if(value === "text"){
            this.props.updateBodyItem({value:'', fileName:undefined, size:undefined, contentType:undefined, inputType:value})
        }else{
            this.props.updateBodyItem({value:'', inputType:value})
        }
    }

    onFileInput = ({name, size, mimetype, data})=>{
        this.props.updateBodyItem({value: data, fileName:name, size, contentType:mimetype});
    }

    toggleDoc = (e)=>{
        this.setState({docVisible: !this.state.docVisible});
    }

    deleteItem = ()=>{
        this.props.deleteBodyItem();
    }


    render() {
        const {docVisible} = this.state;
        const {bodyType, name, value, inputType, fileName} = this.props;
        return (
            <div className={"my-2"}>
                <div className="flex flex-row items-center">
                    {bodyType === "multipart" ?
                    <select className={"mr-2"} defaultValue={inputType} onChange={this.onInputTypeChange}>
                        <option value={"text"}>Text</option>
                        <option value={"file"}>File</option>
                    </select>
                        : null
                    }
                    <Input placeholder={"name"} defaultValue={name} onBlur={this.onInputBlur('name')} />
                    {inputType === "file" ? <FileInput fileName={fileName} onChange={this.onFileInput}/> :
                        <Input placeholder={"value"} defaultValue={value} onBlur={this.onInputBlur('value')}/>
                    }
                    <button className={"p-2 primary-text"} onClick={this.deleteItem}><FiX/></button>
                    <button className={"p-2 primary-text"} onClick={this.toggleDoc}><FiMenu/></button>
                </div>
                {docVisible ?
                    <div className={"my-2 flex flex-row items-center block"}>
                        <Textarea placeholder={"Description"} onBlur={this.onInputBlur('comment')} defaultValue={this.props.comment} className={"flex-1 py-2 border-b  bg-transparent primary-border primary-text"}/>
                    </div> : null }
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const {requestId, bodyId} = props;
    return {
        bodyType: state.requests.byId[requestId].body.bodyType,
        ...state.requests.byId[requestId].body.byId[bodyId]
    };
}

function mapDispatchToProps(dispatch, props){
    const {requestId, bodyId} = props;
    return {
        updateBodyItem: (change)=>dispatch(actionUpdateBodyItem(requestId, bodyId, change)),
        deleteBodyItem: ()=>dispatch(actionDeleteBodyItem(requestId, bodyId))
    }
}


export default connect(
    mapStateToProps, mapDispatchToProps
)(BodyFormInput);
