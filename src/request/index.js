import React, {Component} from 'react';
import {connect} from 'react-redux';
import RequestURL from "./url/RequestURL";
import TabRequestBody from "./body/TabRequestBody";
import TabRequestHeader from "./headers/TabRequestHeader";
import TabRequestAuth from "./auth/TabRequestAuth";
import TabRequestQueryString from "./querystring/TabRequestQueryString";
import RequestDoc from "./RequestDoc";
import {NavLink, Route, Switch, withRouter} from "react-router-dom";
import DocumentTitle from 'react-document-title';
import TabRequestComment from "./doc/TabRequestComment";

class Index extends Component {
    render() {
        const {requestId, name} = this.props;
        return (
            <DocumentTitle title={name}>
                <React.Fragment>
                    <RequestURL requestId={requestId} />
                    <ReqOpts/>
                    <div className={""}>
                        <Switch>
                            <Route path={this.props.match.url+"/doc"} render={()=><RequestDoc requestId={requestId} />} />
                            <Route path={this.props.match.url} render={()=><RequestBuild requestId={requestId} />} />
                        </Switch>
                    </div>
                </React.Fragment>
            </DocumentTitle>
        );
    }
}

function RequestBuild({requestId}){
    return <React.Fragment key={requestId}>
        <TabRequestComment requestId={requestId} />
        <TabRequestQueryString requestId={requestId} />
        <TabRequestBody requestId={requestId}/>
        <TabRequestHeader requestId={requestId}/>
        <TabRequestAuth requestId={requestId}/>
    </React.Fragment>
}
const ReqOpts = withRouter((props)=>{
    //TODO  maybe in the next version documentation will come
    return null;
    /*
    return <div className={"flex flex-row justify-end border-b primary-border border-dotted"}>
        <NavLink to={props.match.url} activeClassName={"font-bold border-b border-blue"} className={"no-underline text-xs primary-button p-2"}>Build</NavLink>
        <NavLink to={props.match.url+"/doc"} activeClassName={"font-bold border-b border-blue"} className={"no-underline primary-button text-xs p-2"}>Description</NavLink>
        <NavLink to={props.match.url+"/fn"} activeClassName={"font-bold border-b border-blue"} className={"no-underline primary-button text-xs p-2"}>Functions</NavLink>
    </div>
    */
})


function mapStateToProps(state, props) {
    const {requestId} = props;
    return {
        requestId,
        name: state.requests.byId[requestId].name
//        method: state.requests.byId[requestId].method
    };
}

export default withRouter(connect(
    mapStateToProps,
)(Index));
