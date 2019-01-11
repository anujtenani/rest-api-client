import React, {Component} from 'react';
import {connect} from 'react-redux';
import {actionUpdateBodyData} from "../../redux/body/bodyActions";

class RequestBodyText extends Component {

    onBlur = (e)=>{
        this.props.updateBody({value:e.target.value})
    }

    render() {
        return (
            <div className={"flex-1 flex h-full"}>
                <textarea className="primary-text flex-1 h-full p-2" onBlur={this.onBlur} defaultValue={this.props.value} placeholder={"Request Body"}>
            </textarea>
            </div>
        );
    }
}

function mapStateToProps(state, props){
    const {requestId} = props;
    const data = state.requests.byId[requestId].body.data || {}
    return {
        value: data.value
    }
}
function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        updateBody: (data)=> dispatch(actionUpdateBodyData(requestId, data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestBodyText);
