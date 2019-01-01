import React, {Component} from 'react';
import {connect} from 'react-redux';
import HeaderInput from "../headers/HeaderInput";
import {FiPlus} from "react-icons/fi";
import {actionCreateQueryStringItem} from "../../redux/querystring/queryStringActions";
import QueryStringInput from "./QueryStringInput";

class QueryStringContainer extends Component {

    createQueryStringItem = ()=>{
        this.props.createQueryStringItem()
    }


    render() {
        const {queryStringIds, requestId} = this.props;
        return (
            <div className={"p-2"}>
                {queryStringIds.map((queryStringIds, index, arr)=> {
                    return <QueryStringInput key={queryStringIds} qsId={queryStringIds} requestId={requestId} />
                })}
                <button onClick={this.createQueryStringItem} className={"addFieldButton"}>
                    <FiPlus /><span>Add Query</span></button>
            </div>
        );
    }
}


function mapStateToProps(state, props) {
    const {requestId} = props;
    return {
        requestId,
        queryStringIds: state.requests.byId[requestId].qs.allIds
    };
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        createQueryStringItem:()=>dispatch(actionCreateQueryStringItem(requestId))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(QueryStringContainer);
