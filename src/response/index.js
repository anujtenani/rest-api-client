import React, {Component} from 'react';
import {connect} from 'react-redux';

import RequestRunningOverlay from "./RequestRunningOverlay";
import TabGeneral from "./info/TabGeneral";
import TabHeaders from "./info/TabResponseHeaders";
import TabResponse from "./info/TabResponse";
import {actionExecuteRequest} from "../redux/requestActions";
import TabRequestHeader from "../request/headers/TabRequestHeader";
import TabRequestHeaders from "./info/TabRequestHeaders";
import TabResponseTiming from "./info/TabResponseTiming";

class Response extends Component {

    state = {
        historyIndex:0,
        showPanel:"response",
    }

    onClickSendRequest = ()=>{
        this.props.executeRequest()
    }

    render() {
        const {showPanel} = this.state;
        const {requestId, historyIds} = this.props;
        if(this.props.executing){
            return <RequestRunningOverlay requestId={requestId}/>
        }
        if(historyIds.length === 0){
            return <NoResponseAvailable onClickSendRequest={this.onClickSendRequest}/>
        }
        return (
            <div>
                <ResponseResult url={"https://google.com"} contentLength={254} statusCode={200} timing={430}/>
                <ResponsePanelHeading onChange={(val)=>this.setState({showPanel:val})}/>
                {showPanel === "info" ?
                    <div>
                        <TabGeneral requestId={requestId} historyId={historyIds[0]}/>
                        <TabHeaders requestId={requestId} historyId={historyIds[0]}/>
                        <TabRequestHeaders requestId={requestId} historyId={historyIds[0]} />
                        <TabResponseTiming requestId={requestId} historyId={historyIds[0]} />
                    </div> :
                    <TabResponse requestId={requestId} historyId={historyIds[0]}/>
                }
            </div>
        );
    }
}

function NoResponseAvailable({onClickSendRequest}){
    return <div className={"my-8 flex flex-col items-center justify-center"}>
        <h3>HTTP Response</h3>
        <p className={"mt-2 mb-4"}>No HTTP response data is available</p>
        <button className={"primary-button"} onClick={onClickSendRequest}>Send request</button>
    </div>
}

function OptionItem({title, onClick}){
    return <li className={"flex-1"}>
        <button onClick={onClick} className={'w-full text-center font-sm py-2 primary-button'}>{title}</button></li>
}

function ResponsePanelHeading({onChange}){
    return <ul className="border-t border-b primary-border list-reset flex flex-row justify-around items-center">
            <OptionItem title={"Response"} requestId={"1"} onClick={()=>onChange('response')}/>
            <OptionItem title={"Info"} requestId={"1"}  onClick={()=>onChange('info')}/>
        </ul>
}


function ResponseResult({url, statusCode, contentLength, timing}){
    return <div className="flex flex-row flex-wrap items-center p-2 h-10">
            <p className="bg-green px-2 py-1 mr-2 rounded">{statusCode}</p>
            <p className="bg-orange px-2 py-1 mr-2 rounded">{contentLength} bytes</p>
            <p className="bg-purple px-2 py-1 mr-2 rounded">{timing} ms</p>
    </div>
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    return {
        executing: state.requests.byId[requestId].executing,
        requestId,
        historyIds: state.requests.byId[requestId].history.allIds,
    };
}


function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        executeRequest: ()=>dispatch(actionExecuteRequest(requestId))
    }
}
export default connect(
    mapStateToProps, mapDispatchToProps
)(Response);
