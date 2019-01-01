import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FiLink, FiMenu, FiStar, FiX} from "react-icons/fi";
import Textarea from "react-textarea-autosize";
import Input from "../../components/Input";
import {actionDeleteQueryStringItem, actionUpdateQueryStringItem} from "../../redux/querystring/queryStringActions";

class QueryStringInput extends Component {
    state = {
        description:'',
        autoval:undefined,
        docVisible:false
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
        const {docVisible, autoval} = this.state;
        return (
            <div className={"my-2"}>
                <div className="flex flex-row items-center">
                    <Input placeholder={"name"} defaultValue={name} onBlur={this.onInputBlur('value')}/>
                    <Input placeholder={"value"} defaultValue={value} onBlur={this.onInputBlur('value')}/>
                    <button className={"p-2 primary-text"} onClick={this.deleteItem}><FiX/></button>
                    <button className={"p-2 primary-text"} onClick={this.toggleDoc}><FiMenu/></button>
                </div>

                {docVisible ?
                    <div className={"my-2 flex flex-row items-center block"}>
                        <div className="flex-1 flex flex-row items-center">
                            <select className={"bg-transparent primary-text"}>
                                <option>String</option>
                                <option>Number</option>
                            </select>
                            <button className={"mx-2 text-red-lighter p-2 bg-grey-dark rounded"}><FiStar/></button>
                            <p><FiLink/></p>
                        </div>
                        <Textarea placeholder={"Description"} class={"flex-1 py-2 border-b  bg-transparent primary-border primary-text"}/>
                        <FiX/>
                    </div> : null }
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
