import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import RequestListItem from "./RequestListItem";
import {actionCreateRequest} from "../../redux/requestActions";
import Mousetrap from 'mousetrap';
import {FiPlusCircle} from "react-icons/fi";
import {withRouter} from 'react-router-dom';
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


    createANewRequest = ()=>{
        this.props.createRequest('New Request')
    }

    render() {
       // console.log(this.props.titles);
        const filteredIds = this.state.filteredIds ? this.state.filteredIds : this.props.ids;
        return <div>
            <div className="flex flex-row items-center p-2">
                <input type={"text"} onChange={this.onFilterInput} className="flex-1 p-1 bg-transparent primary-text rounded border border-grey-darker" placeholder={"filter"} />
                <button className={"px-2 primary-text"} onClick={this.createANewRequest}>
                    <FiPlusCircle className={"w-6 h-6"} />
                </button>
            </div>
            <div onFocus={this.onFocus} onBlur={this.onBlur}>
            {filteredIds.map((requestId)=>{
                return <RequestListItem requestId={requestId} key={requestId} />
            })}
            </div>
        </div>
    }
}




const mapListStateToProps = (state, props)=>{
    const names = state.requests.allIds.map((id)=> {
        return {
            name: state.requests.byId[id].name, id
        }
    });
    return {
        ids: state.requests.allIds,
        names,
    }
}
const mapDispatchToProps = (dispatch,props)=>{
    return {
        createRequest:(name)=>dispatch(actionCreateRequest({name}))
    }
}

export default withRouter(connect(mapListStateToProps, mapDispatchToProps)(RequestList))
