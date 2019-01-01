import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import RequestListItem from "./RequestListItem";
import {actionCreateRequest} from "../../redux/requestActions";
import Mousetrap from 'mousetrap';
import {FiPlusCircle} from "react-icons/fi";
import {withRouter} from 'react-router-dom';
class RequestList extends PureComponent {

    state = {
        focus:0
    }


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


    createANewRequest = ()=>{
        this.props.createRequest('New Request')
    }

    render() {
        return <div>
            <div className="flex flex-row items-center p-2">
                <input type={"text"} className="flex-1 p-1 bg-transparent primary-text rounded border border-grey-darker" placeholder={"filter"} />
                <button className={"px-2 primary-text"} onClick={this.createANewRequest}>
                    <FiPlusCircle className={"w-6 h-6"} />
                </button>
            </div>
            <div onFocus={this.onFocus} onBlur={this.onBlur}>
            {this.props.ids.map((requestId)=>{
                return <RequestListItem requestId={requestId} key={requestId} />
            })}
            </div>
        </div>
    }
}

function NewRequestButton(){

}


const mapListStateToProps = (state, props)=>{
    return {
        ids: state.requests.allIds
    }
}
const mapDispatchToProps = (dispatch,props)=>{
    return {
        createRequest:(title)=>dispatch(actionCreateRequest({title}))
    }
}

export default withRouter(connect(mapListStateToProps, mapDispatchToProps)(RequestList))
