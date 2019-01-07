import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {NavLink, withRouter} from 'react-router-dom';
import Mousetrap from 'mousetrap';
import {actionUpdateRequest} from "../../redux/requestActions";
import RequestItemOptions from "./RequestItemOptions";


class RequestListItem extends PureComponent{

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

    toggleOpts = ()=>{
        this.setState({showOpts:true});
    }
    /*
    openContextMenu = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        console.log(e.clientX, e.clientY);
        console.log(window.innerWidth, window.innerHeight);
    }
    */

    render(){
        const {requestId, name, method} = this.props;
        const {contentEditable} = this.state;
        return <div>
            <div className={"flex-row flex items-center"}>
            <NavLink onDoubleClick={this.handleDoubleClick}
                    onFocus={this.bindRenameKey}
                    // onContextMenu={this.openContextMenu}
                     onBlur={this.unbindRenameKey}
                     activeClassName={"secondary-bg"}
                     className="flex-1 items-center opacity-75 px-2 py-2 appearance-none no-underline block flex flex-row"
                     to={this.props.match.url+`/request/${requestId}`}>
            <RenderTag method={method}/>
            {contentEditable ?
                <input
                    ref={this.inputRef}
                    className={"bg-transparent primary-text italic"}
                    defaultValue={name}
                    onFocus={this.onInputFocus}
                    onBlur={this.onBlur}/> :
                <span className="bg-transparent primary-text">{name}</span>
                }
                <RequestItemOptions requestId={requestId}/>
            </NavLink>
            </div>
        </div>
    }
}


function RenderTag({method}){
    return <span className="text-green px-2 w-16 text-xs">{method}</span>
}

const mapStateToProps = (state, props)=>{
    const {requestId} = props;
    return {
        ...state.requests.byId[requestId]
    }
}

const mapDispatchToProps = (dispatch, props)=>{
    const {requestId} = props;
    return{
        updateRequest: (change)=>dispatch(actionUpdateRequest(requestId, change))
    }
}


export default  withRouter(connect(mapStateToProps, mapDispatchToProps)(RequestListItem))
