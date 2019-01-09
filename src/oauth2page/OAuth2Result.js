import React, {Component} from 'react';
import {connect} from 'react-redux';

class OAuth2Result extends Component {
    render() {
        return (
            <div>
                <pre>
                    {JSON.stringify(this.props.body, null, 2)}
                </pre>
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    const {allIds, byId} = state.requests.byId[requestId].history || {};
    const history = allIds && allIds.length > 0 ? byId[allIds[0]] : {}
    return {
        body: history.body
    };
}

export default connect(
    mapStateToProps,
)(OAuth2Result);
