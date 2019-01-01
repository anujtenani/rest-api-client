import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {FiChevronRight, FiCopy, FiEdit, FiInfo, FiTrash} from "react-icons/fi";
import {actionDeleteRequest} from "../../redux/requestActions";
import Popup from "reactjs-popup";

class RequestItemOptions extends Component {

    state = {
        toggleDeleteConfirm: false,
    }

    bindKeyDown = ()=>{

    }

    bindKeyUp = ()=>{

    }

    toggleDeleteConfirm = ()=>{
        this.setState({toggleDeleteConfirm:!this.state.toggleDeleteConfirm})
    }

    actuallyDeleteRequest = ()=>{
        this.props.history.push('/');
        this.props.deleteRequest();
    }

    render() {
        return (
            <Popup trigger={<button className={"px-2 opacity-50 hover:opacity-100"}><FiInfo /></button>} position="bottom right">
              <div className={"flex w-full flex-col p-2 primary-text"}>
                <button className={"text-right py-2 secondary-text"}>
                    <span className={"mx-2"}>Rename</span>
                    <FiEdit />
                </button>
                <button className={"text-right secondary-text py-2"}>
                    <span className={"mx-2"}>Duplicate</span>
                    <FiCopy />
                </button>
                  {!this.state.toggleDeleteConfirm ?
                      <button onClick={this.toggleDeleteConfirm} className={"text-right py-2 secondary-text"}>
                          <span className={"mx-2"}>Delete</span>
                          <FiTrash/>
                      </button>
                      :
                      <ConfirmDelete onConfirmed={this.actuallyDeleteRequest} onCancel={this.toggleDeleteConfirm}/>
                  }
                </div>
            </Popup>
        );
    }
}

function ConfirmDelete({onCancel, onConfirmed}){
    return (<div className={"text-right py-2"}>
        <span>
        <span>Confirm Delete</span>
        <button className={"primary-text mx-2"} onClick={onCancel}>no</button>
            <span>/</span>
        <button className={"text-red mx-2"} onClick={onConfirmed}>yes</button>
        </span>
    </div>)
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;

    return {
        deleteRequest:()=>dispatch(actionDeleteRequest(requestId))
    }
}

export default withRouter(connect(
    mapStateToProps, mapDispatchToProps
)(RequestItemOptions));
