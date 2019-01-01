import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../../components/ExpandablePanel";
import PreviewVisualHtml from "../preview/PreviewVisualHtml";
import PreviewSourceHtml from "../preview/PreviewSourceHtml";
import PreviewText from "../preview/PreviewText";
import PreviewJson from "../preview/PreviewJson";
import PreviewMedia from "../preview/PreviewMedia";

class TabResponse extends Component {
    state = {
        previewType:"preview"
    };

    setDefaultPreviewType = ()=>{
        const { headers } = this.props;
        const contentType = Object.keys(headers).find((key)=>key.toLowerCase() === "content-type");
        if(headers[contentType] && headers[contentType].indexOf('json') > -1){

        }
    }

    onChange = (e)=>{
        this.setState({previewType: e.target.value});
    }

    render() {
        const {previewType} = this.state;
        const {responseBody} = this.props;

        return (
            <div className={"p-2"}>
                    <select value={previewType} onChange={this.onChange} className={"mb-2"}>
                        <option value={"preview"}>Preview</option>
                        <option value={"html"}>Source Code</option>
                        <option value={"raw"}>Raw</option>
                        <option value={"json"}>JSON</option>
                        <option value={"text"}>Text</option>
                        <option value={"image"}>Image</option>
                    </select>
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
        responseBody: state.requests.byId[requestId].history.byId[historyId].body,
        headers: state.requests.byId[requestId].history.byId[historyId].headers
    }
}


export default connect(mapStateToProps)(TabResponse);
