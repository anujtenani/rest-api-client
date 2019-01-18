import React, {Component} from 'react';
import {connect} from 'react-redux';

import RequestRunningOverlay from "./RequestRunningOverlay";
import {actionExecuteRequest} from "../redux/requestActions";
import RenderResponsePage from "./RenderResponsePage";
import {FiChevronLeft, FiChevronRight, FiTrash} from "react-icons/fi";
import {actionDeleteResponseHistory} from "../redux/history/historyActions";

class Response extends Component {

    state = {
        historyIndex:0,
    }

    showPrevResponse = ()=>{
        const {historyIds} = this.props;
        let {historyIndex} = this.state;
        console.log(historyIds.length);
        if(historyIds.length > historyIndex + 1){
            historyIndex += 1;
        }
        console.log(historyIds[historyIndex]);
        this.setState({historyIndex})
    }

    componentDidUpdate(){
        if(this.props.executing && this.state.historyIndex > 0){
            this.setState({historyIndex:0})
        }
    }

    showNextResponse = ()=>{
        let {historyIndex} = this.state;
        if(historyIndex > 0){
            historyIndex -= 1;
        }
        this.setState({historyIndex})
    }

    deleteResponse = ()=>{
        const {historyIds} = this.props;
        const {historyIndex} = this.state;
        const historyId = historyIds[historyIndex];
        this.showNextResponse();
        this.props.deleteResponseHistoryItem(historyId);
    }


    onClickSendRequest = ()=>{
        this.props.executeRequest()
    }

    render() {
        const {requestId, historyIds} = this.props;
        const {historyIndex} = this.state;
        if(this.props.executing){
            return <RequestRunningOverlay requestId={requestId}/>
        }
        if(historyIds.length === 0){
            return <NoResponseAvailable onClickSendRequest={this.onClickSendRequest}/>
        }
        console.log('showing history index', historyIndex);
        return (
            <div>
                <div className={"flex flex-row justify-between items-center px-4 h-12 border-b primary-border border-dashed"}>
                    <div>
                        <button onClick={this.showPrevResponse} disabled={historyIds.length <= historyIndex + 1}><FiChevronLeft /></button>
                        <button onClick={this.showNextResponse} disabled={historyIndex === 0}><FiChevronRight /></button>
                    </div>

                    <div />
                    <div>
                        <button onClick={this.deleteResponse}><FiTrash /></button>
                    </div>
                </div>
                <RenderResponsePage requestId={requestId} historyId={historyIds[historyIndex]}/>
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
        executeRequest: ()=>dispatch(actionExecuteRequest(requestId)),
        deleteResponseHistoryItem:(historyId)=>dispatch(actionDeleteResponseHistory(requestId, historyId))
    }
}
export default connect(
    mapStateToProps, mapDispatchToProps
)(Response);
