import React, {Component} from 'react';
import {connect} from 'react-redux';
import RequestURL from "./url/RequestURL";
import RequestOptions from "./RequestOptions";
import TabRequestBody from "./body/TabRequestBody";
import TabRequestHeader from "./headers/TabRequestHeader";
import TabRequestAuth from "./auth/TabRequestAuth";
import TabRequestQueryString from "./querystring/TabRequestQueryString";

class Index extends Component {
    render() {
        const {requestId} = this.props;
        return (
            <div>
                <React.Fragment>
                    <RequestURL requestId={requestId} />
                    <RequestOptions requestId={requestId} />
                    <div className={""}>
                        <TabRequestBody requestId={requestId}/>
                        <TabRequestHeader requestId={requestId}/>
                        <TabRequestAuth requestId={requestId}/>
                        <TabRequestQueryString requestId={requestId} />
                    </div>
                </React.Fragment>
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    return {
        requestId,
//        method: state.requests.byId[requestId].method
    };
}

export default connect(
    mapStateToProps,
)(Index);
