import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {FiChevronDown, FiCopy, FiEdit, FiInfo, FiTrash} from "react-icons/fi";
import {actionDeleteRequest} from "../../redux/requestActions";
import Popup from "../../components/Popup";

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
        this.props.deleteRequest();
    }

    handleRename = (e)=>{
        this.popper.hide();
        this.props.onRename();
    }


    handleRef = (ref)=>{
        this.popper = ref
    }

    render() {
        return (
            <Popup ref={this.handleRef} placement="bottom-end" trigger={<FiChevronDown className={"request-item-icon"} />}>
              <div className={"flex w-48 flex-col primary-text"}>
                <button className={"list-item text-right p-2"} onClick={this.handleRename}>
                    <span className={"mx-2"}>Rename</span>
                    <FiEdit />
                </button>
                <button className={"list-item text-right  p-2"}>
                    <span className={"mx-2"}>Duplicate</span>
                    <FiCopy />
                </button>
                  {!this.state.toggleDeleteConfirm ?
                      <button onClick={this.toggleDeleteConfirm} className={"list-item text-right  p-2"}>
                          <span className={"mx-2"}>Delete</span>
                          <FiTrash/>
                      </button>
                      :
                      <button className={"text-right p-2 list-item"} onClick={this.actuallyDeleteRequest}>
                          <span className={"text-red mx-2"}>Click to confirm</span>
                          <FiInfo/>
                      </button>
                  }
                </div>
            </Popup>
        );
    }
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
