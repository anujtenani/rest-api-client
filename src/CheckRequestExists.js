import React, {Component} from 'react';
import {connect} from 'react-redux';

class CheckRequestExists extends Component {
    render() {
        const {exists} = this.props;
        if(exists){
            return <React.Fragment>
                {this.props.children}
            </React.Fragment>
        }else {
            return (
                <div className={"flex items-center justify-center flex-col p-2 border bg-red-lightest rounded border-red m-4"}>
                    <p className={"text-2xl"}>Request does not exists</p>
                </div>
            );
        }
    }
}

function mapStateToProps(state, props){
    const {requestId} = props;
    return {
        exists: state.requests.byId[requestId] !== undefined
    }
}

export default connect(mapStateToProps)(CheckRequestExists);
