import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FiPlus} from "react-icons/fi";
import {actionCreateQueryStringItem} from "../../redux/querystring/queryStringActions";
import QueryStringInput from "./QueryStringInput";
import UrlPreview from "../urlbuilder/UrlPreview";
import UrlPathInput from "../urlbuilder/UrlPathInput";
import {actionCreateUrlPath} from "../../redux/path/pathActions";

class QueryStringContainer extends Component {

    createQueryStringItem = ()=>{
        this.props.createQueryStringItem()
    }

    createUrlPath = ()=>{
        this.props.createUrlPath();
    }

    render() {
        const {queryStringIds, requestId, pathIds} = this.props;
        return (
            <div className={"p-2"}>
                <UrlPreview requestId={requestId}/>
                {pathIds.map((pathId)=>{
                    return <UrlPathInput requestId={requestId} pathId={pathId} key={pathId} />
                })}
                {queryStringIds.map((queryStringIds, index, arr)=> {
                    return <QueryStringInput key={queryStringIds} qsId={queryStringIds} requestId={requestId} />
                })}

                <div className={"flex flex-row"}>
                    <button onClick={this.createUrlPath} className={"addFieldButton"}>
                        <FiPlus />
                        <span>Add Path Variable</span>
                    </button>
                    <button onClick={this.createQueryStringItem} className={"addFieldButton"}>
                        <FiPlus /><span>Add Query</span></button>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state, props) {
    const {requestId} = props;
    const path = state.requests.byId[requestId].path;
    return {
        requestId,
        queryStringIds: state.requests.byId[requestId].qs.allIds,
        pathIds: path ? path.allIds : []
    };
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        createQueryStringItem:()=>dispatch(actionCreateQueryStringItem(requestId)),
        createUrlPath:()=>dispatch(actionCreateUrlPath(requestId))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(QueryStringContainer);
