import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FiMenu, FiX} from "react-icons/fi";
import Textarea from "react-textarea-autosize";
import Input from "../../components/Input";
import {actionDeleteQueryStringItem, actionUpdateQueryStringItem} from "../../redux/querystring/queryStringActions";
import FieldCommentTextArea from "../commons/FieldCommentTextArea";

class QueryStringInput extends Component {
    state = {
        description:'',
        commentState:undefined
    }


    componentDidMount() {
        this.setState({docVisible:this.props.comment && this.props.comment.length > 0});
    }


    onInputBlur = (key)=>(e)=>{
        this.props.updateQueryString({[key]: e.target.value})
    }

    toggleDoc = (e)=>{
        this.setState({docVisible: !this.state.docVisible});
    }

    deleteItem = (e)=>{
        this.props.deleteQueryString();
    }

    render() {
        const {name, value} = this.props;
        const {docVisible} = this.state;
        return (
            <div>
                <div className="flex flex-row">
                    <div className={"flex flex-col items-center justify-center bg-purple"}>
                        <span className={"px-1 text-white font-mono"}>Q</span>
                    </div>                    <Input placeholder={"name"} defaultValue={name} onBlur={this.onInputBlur('name')}/>
                    <Input placeholder={"value"} defaultValue={value} onBlur={this.onInputBlur('value')}/>
                    <button className={"p-2 primary-text"} onClick={this.deleteItem}><FiX/></button>
                    <button className={"p-2 primary-text"} onClick={this.toggleDoc}><FiMenu/></button>
                </div>
                {docVisible ? <FieldCommentTextArea onBlur={this.onInputBlur('comment')} defaultValue={this.props.comment} /> : null }
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const {qsId, requestId} = props;
    return {
        ...state.requests.byId[requestId].qs.byId[qsId]
    };
}

function mapDispatchToProps(dispatch, props){
    const {qsId, requestId} = props;
    return {
        updateQueryString:(change)=>dispatch(actionUpdateQueryStringItem(requestId, qsId, change)),
        deleteQueryString:()=>dispatch(actionDeleteQueryStringItem(requestId, qsId))
    }
}

export default connect(
    mapStateToProps,mapDispatchToProps
)(QueryStringInput);
