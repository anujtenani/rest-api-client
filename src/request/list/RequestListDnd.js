import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import RequestListItem from "./RequestListItem";
import {actionCreateRequest} from "../../redux/requestActions";
import Mousetrap from 'mousetrap';
import {FiPlusCircle} from "react-icons/fi";
import Popup from "../../components/Popup";
import {Route, withRouter} from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RenderGroup from "./dnd/RenderGroup";
import {actionAddToGroup, actionRemoveFromGroup} from "../../redux/group/groupActions";


class RequestList extends PureComponent {

    state = {
        focus:0,
        filteredIds:undefined
    }

    onFilterInput = (e)=>{
        this.filter(e.target.value)
    };

    filter = (kwd)=>{
        if(kwd.length === 0){
            this.setState({filteredIds:undefined})
        }else {
            const filteredIds = this.props.names.filter(({name}) => name.toLowerCase().includes(kwd.toLowerCase()))
                .map(({id}) => id);
            this.setState({filteredIds});
        }
    };


    onFocus = ()=>{
        Mousetrap.bind('up', this.updateFocusedRow);
        Mousetrap.bind('down', this.updateFocusedRow)
    }

    updateFocusedRow = ()=>{
        console.log('updatedfocusedrow');
    }

    onBlur = ()=>{
        Mousetrap.unbind('up', this.updateFocusedRow);
        Mousetrap.unbind('down', this.updateFocusedRow);
        console.log('is in blur');
    }


    createWebsocket = ()=>{
        this.hidePopper();
        const action = this.props.createRequest({name:'New Websocket',type:'ws'});
        console.log(action);
    }

    createOAuth = ()=>{
        this.hidePopper();
        this.props.createRequest({name:'New OAuth2',type:'oauth2'}).then((r)=>{
            console.log();
        })
    }


    createANewRequest = ()=>{
        this.hidePopper();
        const {payload} = this.props.createRequest({name:'New Request',type:'rest'});
        this.props.history.push(`/p/${this.props.projectId}/rest/${payload.requestId}`);
    }

    hidePopper = ()=>{
        if(this.popper){
            this.popper.hide();
        }
    }

    popperRef = (ref)=>{
        this.popper = ref
    }

    onDragEnd = (result) =>{
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        console.log("dragend", result);
        const {source, destination, draggableId} = result;
//        this.props.removeFromGroup(source.droppableId, draggableId);
//        this.props.addToGroup(destination.droppableId, draggableId, destination.index);
    }

    render() {
        const filteredIds = this.state.filteredIds ? this.state.filteredIds : this.props.ids;
        return <div>
            <div className="flex flex-row items-center p-2">
                <input type={"text"} onChange={this.onFilterInput} className="flex-1 p-1 mx-2 bg-transparent primary-text rounded border border-grey-darker" placeholder={"filter"} />
                <Popup ref={this.popperRef} trigger={<FiPlusCircle className={"w-6 h-6"} />} placement={"bottom-end"}>
                    <button className={"p-2 text-right list-item"} onClick={this.createANewRequest}><Tag className={"tag--get"} title={"REST"} />New Request</button>
                    <button className={"p-2 text-right list-item"} onClick={this.createOAuth}><Tag className={"tag--oauth"} title={"oAuth"} />New oAuth2</button>
                    <button className={"p-2 text-right list-item"} onClick={this.createWebsocket}><Tag className={"tag--ws"} title={"ws"} />New Websocket</button>
                </Popup>
            </div>

            {this.props.ids.length === 0 ? <NoRequestsHereCard /> : null}
            <DragDropContext onDragEnd={this.onDragEnd}>
                <RenderGroup groupId={"group1"} groupTitle={"Accounts"} requests={["uAbtHgVo-"]}/>
                <RenderGroup groupId={"default"} groupTitle={"Default"} requests={filteredIds.filter((id)=> ["uAbtHgVo-"].indexOf(id) < 0)} />
            </DragDropContext>
        </div>
    }
}

function NoRequestsHereCard(){
    return <div className={"helper-card m-2 shadow"}>
        <p className={"text-center text-xl"}>You have not created a request. Tap the <FiPlusCircle className={"w-6 h-6"} /> icon to create a new request</p>
    </div>

}

function Tag({title, className}){
    return <span className={`text-xs mx-2 uppercase ${className}`}>{title}</span>
}




const mapListStateToProps = (state, props)=>{
    const names = state.requests.allIds.map((id)=> {
        return {
            name: state.requests.byId[id].name, id
        }
    });
    return {
        ids: state.requests.allIds,
        byId: state.requests.byId,
        names,
        projectId: state.metadata.id,
        groups: state.groups.allIds,
    }
}
const mapDispatchToProps = (dispatch,props)=>{
    return {
        createRequest:({name, type})=>dispatch(actionCreateRequest({name, type})),
        addToGroup:(groupId, requestId, index)=>dispatch(actionAddToGroup(groupId, requestId, index)),
        removeFromGroup:(groupId, requestId)=>dispatch(actionRemoveFromGroup(groupId, requestId))
    }
}

export default withRouter(connect(mapListStateToProps, mapDispatchToProps)(RequestList))
