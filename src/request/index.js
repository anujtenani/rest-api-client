import React, {Component} from 'react';
import {connect} from 'react-redux';
import RequestURL from "./url/RequestURL";
import RequestOptions from "./RequestOptions";
import TabRequestBody from "./body/TabRequestBody";
import TabRequestHeader from "./headers/TabRequestHeader";
import TabRequestAuth from "./auth/TabRequestAuth";
import TabRequestQueryString from "./querystring/TabRequestQueryString";
import RequestSettings from "./RequestSettings";
import RequestDoc from "./RequestDoc";
import {Link, NavLink, Route, Switch, withRouter} from "react-router-dom";

class Index extends Component {
    render() {
        const {requestId} = this.props;
        return (
            <div>
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
            </div>
        );
    }
}

function RequestBuild({requestId}){
    return <React.Fragment>
        <TabRequestQueryString requestId={requestId} />
        <TabRequestBody requestId={requestId}/>
        <TabRequestHeader requestId={requestId}/>
        <TabRequestAuth requestId={requestId}/>
    </React.Fragment>
}
const ReqOpts = withRouter((props)=>{
    return <div className={"flex flex-row justify-end border-b primary-border border-dotted"}>
        <NavLink to={props.match.url} activeClassName={"opacity-100 font-bold border-b border-blue"} className={"no-underline text-xs opacity-50 hover:opacity-100 p-2"}>Build</NavLink>
        <NavLink to={props.match.url+"/doc"} activeClassName={"opacity-100 font-bold border-b border-blue"} className={"no-underline  text-xs opacity-50 hover:opacity-100 p-2"}>Description</NavLink>
        <NavLink to={props.match.url+"/fn"} activeClassName={"opacity-100 font-bold border-b border-blue"} className={"no-underline  text-xs opacity-50 hover:opacity-100 p-2"}>Functions</NavLink>
    </div>
})


function mapStateToProps(state, props) {
    const {requestId} = props;
    return {
        requestId,
//        method: state.requests.byId[requestId].method
    };
}

export default withRouter(connect(
    mapStateToProps,
)(Index));
