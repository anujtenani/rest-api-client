import React, {Component} from 'react';
import PreviewVisualHtml from "./PreviewVisualHtml";
import PreviewText from "./PreviewRaw";
import PreviewJson from "./PreviewJson";
import PreviewMedia from "./PreviewMedia";
import {connect} from 'react-redux';
import PreviewSourceHtml from "./PreviewSourceHtml";

class PreviewResponse extends Component {

    state = {
        previewType:'html',

    }

    onChange = (e)=>{
        this.setState({previewType:e.target.value})
    }



    render() {
        const {previewType, previewMode} = this.state;
        const {responseBody} = this.props;
        return (
            <div className={"p-2"}>
                <div className={"mb-2"}>
                    <select value={previewType} onChange={this.onChange}>
                        <option value={"preview"}>Preview</option>
                        <option value={"html"}>Source Code</option>
                        <option value={"raw"}>Raw</option>
                        <option value={"json"}>JSON</option>
                        <option value={"text"}>Text</option>
                        <option value={"image"}>Image</option>
                    </select>
                    <select value={previewMode} onChange={this.onChange}>
                        <option value={"preview"}>Preview</option>
                        <option value={"html"}>Source Code</option>
                        <option value={"raw"}>Raw</option>
                        <option value={"json"}>JSON</option>
                        <option value={"text"}>Text</option>
                        <option value={"image"}>Image</option>
                    </select>

                </div>
                {previewType === "preview" ? <PreviewVisualHtml responseBody={responseBody}/> : null }
                {previewType === "html" ? <PreviewSourceHtml responseBody={responseBody}/> : null }
                {previewType === "raw" ? <PreviewText responseBody={responseBody}/> : null }
                {previewType === "text" ? <PreviewText responseBody={responseBody}/> : null }
                {previewType === "json" ? <PreviewJson responseBody={responseBody}/> : null }
                {previewType === "image" ? <PreviewMedia responseBody={responseBody}/> : null }
            </div>
        );
    }
}

function mapStateToProps(state, props){
    const {requestId, historyId} = props;
    return {
        ...state.requests.byId[requestId].history.byId[historyId],
    }
}


export default connect(mapStateToProps)(PreviewResponse);
