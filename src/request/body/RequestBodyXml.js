import React from 'react';
import {connect} from 'react-redux';
import {actionUpdateBodyData} from "../../redux/body/bodyActions";
import XmlInput from "../../components/codemirror/XmlInput";

class RequestBodyXml extends React.Component{


    onBlur = (value)=>{
        this.props.updateBody({value:value});
    }


    render(){
        const {value} = this.props;
        return <XmlInput onBlur={this.onBlur} defaultValue={value || ''} />
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

export default connect(mapStateToProps, mapDispatchToProps)(RequestBodyXml);
