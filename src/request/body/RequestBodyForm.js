import React, {Component} from 'react';
import BodyFormInput from "./BodyFormInput";
import {connect} from 'react-redux';
import {FiPlus} from "react-icons/fi";
import {actionCreateBodyItem} from "../../redux/body/bodyActions";

class RequestBodyForm extends Component {

    createBodyItem = ()=>{
        this.props.createBodyItem()
    }

    render(){
        const { requestId } = this.props;
        return <div className="w-full h-full">
            {this.props.allIds.map((item)=>{
                return <BodyFormInput key={item} bodyId={item} requestId={requestId} multipart />
            })}
            <div className={"mt-2"}>
                <button onClick={this.createBodyItem} className={"addFieldButton"}>
                    <FiPlus /><span>Add Field</span></button>
            </div>
        </div>
    }
}


function mapStateToProps(state, props) {
    const { requestId } = props;
    return {
        allIds: state.requests.byId[requestId].body.allIds
    };
}

function mapDispatchToProps(dispatch, props){
    const {requestId, bodyId} = props;
    return {
        createBodyItem: ()=>dispatch(actionCreateBodyItem(requestId))
    }
}


export default connect(
    mapStateToProps, mapDispatchToProps
)(RequestBodyForm);
