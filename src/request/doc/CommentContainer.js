import React, {Component} from 'react';
import {connect} from 'react-redux';
import MarkdownInput from "../../components/codemirror/MarkdownInput";
import {actionUpdateRequest} from "../../redux/requestActions";

class CommentContainer extends Component {



    createQueryStringItem = ()=>{
        this.props.createQueryStringItem()
    }

    createUrlPath = ()=>{
        this.props.createUrlPath();
    }

    updateComment = (comment)=>{
        this.props.updateRequest({comment})
    }

    render() {
        const {comment} = this.props;
        return (
            <div className={"mt-2"}>
               <MarkdownInput onBlur={this.updateComment} defaultValue={comment || ''}/>
            </div>
        );
    }
}


function mapStateToProps(state, props) {
    const {requestId} = props;
    return {
        requestId,
       comment: state.requests.byId[requestId].comment
    };
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        updateRequest:(change)=>dispatch(actionUpdateRequest(requestId, change)),
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(CommentContainer);
