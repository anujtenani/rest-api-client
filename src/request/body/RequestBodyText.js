import React, {Component} from 'react';
import {connect} from 'react-redux';

class RequestBodyText extends Component {
    render() {
        return (
            <div className={"flex-1 flex h-full"}>
                <textarea className="bg-black primary-text flex-1 h-full p-2" placeholder={"Request Body"}>
            </textarea>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch, props){

}

export default connect(
    mapStateToProps,
)(RequestBodyText);
