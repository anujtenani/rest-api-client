import React, {Component} from 'react';
import {connect} from 'react-redux';
import HeaderInput from "./HeaderInput";
import {FiPlus} from "react-icons/fi";
import {actionCreateHeaderItem} from "../../redux/headers/headerActions";

class HeaderParent extends Component {

    onInputChange = (key)=>(e)=>{
        console.log('input chaned')
    }

    createHeader = ()=>{
        this.props.createHeader()
    }


    render() {
        const {requestId, headerIds} = this.props;
        return (
            <div className={"p-2"}>
                {headerIds.map((headerId, index, arr)=> {
                    return <HeaderInput headerId={headerId} requestId={requestId} />
                })}
                <button onClick={this.createHeader} className={"addFieldButton"}>
                    <FiPlus /><span>Add Header</span>
                </button>
            </div>
        );
    }
}


function mapStateToProps(state, props) {
    const {requestId} = props;
    return {
        requestId,
        headerIds: state.requests.byId[requestId].headers.allIds
    };
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        createHeader:()=>dispatch(actionCreateHeaderItem(requestId))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(HeaderParent);
