import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Link, NavLink, withRouter} from 'react-router-dom';
import Mousetrap from 'mousetrap';
import {actionUpdateRequest} from "../../redux/requestActions";
import RequestItemOptions from "./RequestItemOptions";


class RequestListItem extends Component{

    state = {
        contentEditable:false,
        showOpts : false,
    }
    constructor(props){
        super(props);
        this.state.value = props.title;
    }

    handleDoubleClick = ()=>{
        this.setState({contentEditable:true});
    }

    bindRenameKey = ()=>{
        Mousetrap.bind('f2', this.handleDoubleClick)
    }


    unbindRenameKey = ()=>{
        Mousetrap.unbind('f2', this.handleDoubleClick );
    }

    inputRef = (ref)=>{
        this.ref = ref;
        if(ref){
            this.ref.focus();
        }
        Mousetrap(this.ref)
    }

    onInputFocus = ()=>{
        Mousetrap(this.ref).bind('enter', this.onBlur);
        Mousetrap(this.ref).bind('esc', this.onCancel)
    }

    onCancel = ()=>{
        this.setState({contentEditable:false});
        Mousetrap(this.ref).unbind('enter', this.onBlur)
        Mousetrap(this.ref).unbind('esc', this.onCancel)
    }

    onBlur = (e)=>{
        if(e){
            e.preventDefault();
            e.stopPropagation();
        }
        this.props.updateRequest({name: e.target.value});
        this.onCancel();
    }

    onRename = ()=>{
        this.setState({contentEditable:true});
    }

    onDuplicate = ()=>{

    }

    render(){
        const {requestId, name, method, path, type, isActive} = this.props;
        const {contentEditable} = this.state;
        return  <div className={`request-item flex-row flex items-center justify-between px-2 ${isActive ? 'shadow-inner secondary-bg' : ''}`}>
            <Link onDoubleClick={this.handleDoubleClick}
                    onFocus={this.bindRenameKey}
                    // onContextMenu={this.openContextMenu}
                     onBlur={this.unbindRenameKey}
                     // activeClassName={ 'shadow-inner secondary-bg'}
                     className="flex-1 items-center py-2 appearance-none no-underline block flex flex-row"
                     to={path}>
                <RenderTag method={method} type={type}/>
                {contentEditable ?
                    <input
                        ref={this.inputRef}
                        className={"bg-transparent primary-text italic"}
                        defaultValue={name}
                        onFocus={this.onInputFocus}
                        onBlur={this.onBlur}/> :
                    <span className="bg-transparent primary-text">{name}</span>
                    }
                </Link>
                <RequestItemOptions requestId={requestId} onRename={this.onRename} onDuplicate={this.onDuplicate}/>
            </div>
    }
}


function RenderTag({method, type}){
    let cls = "px-2 w-16 text-xs uppercase "
    switch (type) {
        case "oauth2":
            cls += "tag--oauth";
            break;
        case "ws":
            cls += "tag--ws";
            break;
        default:
            cls += "tag--"+method.toLowerCase();
    }
    return <span className={cls}>{type === "rest" ? method : type}</span>
}

const mapStateToProps = (state, props)=>{

    const {requestId} = props;
    const {name, method, type} = state.requests.byId[requestId];
    return {
        name, method, type, requestId,
    }
}

const mapDispatchToProps = (dispatch, props)=>{
    const {requestId} = props;
    return{
        updateRequest: (change)=>dispatch(actionUpdateRequest(requestId, change))
    }
}


export default  connect(mapStateToProps, mapDispatchToProps)(RequestListItem)
