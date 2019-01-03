import React, {Component} from 'react';
import {connect} from 'react-redux';
import PreviewVisualHtml from "../preview/PreviewVisualHtml";
import PreviewMedia from "../preview/PreviewMedia";
import PreviewSource from "../preview/PreviewSource";
import PreviewRaw from "../preview/PreviewRaw";

class TabResponse extends Component {
    state = {
        previewType:"preview"
    };

    setDefaultPreviewType = ()=>{
        const { headers } = this.props;
        const contentType = Object.keys(headers).find((key)=>key.toLowerCase() === "content-type");
        if(headers[contentType] && headers[contentType].indexOf('json') > -1){
            this.setState({previewType:'json'});
        }else if(headers[contentType] && headers[contentType].indexOf('html') > -1) {
            this.setState({previewType: 'preview'})
        } else if(headers[contentType] && headers[contentType].indexOf('image') > -1) {
            this.setState({previewType:'image'})
        }
    }

    onChange = (e)=>{
        this.setState({previewType: e.target.value});
    }

    render() {
        const {previewType} = this.state;
        const {responseBody, headers} = this.props;
        //get conte ntSize;

       const contentLengthHeader = headers.find(({name, value})=> name.toLowerCase() === 'content-length');
       const contentLength = contentLengthHeader ? contentLengthHeader.value : 0;
       const contentTypeHeader = headers.find(({name, value})=> name.toLowerCase() === 'content-type');
       const contentType =  contentTypeHeader ? contentTypeHeader.value : '';

        //only 2 types of response views
        //1. preview (shows formatted html or media element)
        //2. source (shows the data in a codemirror)
        return (
            <div className={"p-2"}>
                    <select value={previewType} onChange={this.onChange} className={"mb-2"}>
                        <option value={"preview"}>Preview</option>
                        <option value={"html"}>Source Code</option>
                        <option value={"raw"}>Raw</option>
                        <option value={"json"}>JSON</option>
                    </select>

                    {previewType === "preview" ? <RenderContentPreview contentType={contentType} responseBody={responseBody} contentLength={contentLength} /> : null }
                    {previewType === "html" ? <PreviewSource previewMode={"html"} responseBody={responseBody} contentLength={contentLength} /> : null }
                    {previewType === "raw" ? <PreviewRaw responseBody={responseBody} contentLength={contentLength} /> : null }
                    {previewType === "json" ? <PreviewSource previewMode={"json"}  responseBody={responseBody} contentLength={contentLength} /> : null }
            </div>
     );
    }
}

function RenderContentPreview({contentType, responseBody, contentLength}){
    if(contentType.startsWith("image")){
        return <PreviewMedia responseBody={responseBody} contentLength={contentLength} />
    }else if(contentType.includes('json')) {
        return <PreviewSource previewMode={"json"} responseBody={responseBody} contentLength={contentLength}/>
    } else if(contentType.includes('xml')) {
        return <PreviewSource previewMode={"xml"} responseBody={responseBody} contentLength={contentLength}/>
    } else{
        return <PreviewVisualHtml responseBody={responseBody} contentLength={contentLength} />
    }
}


function getHeaderVal(headers, key, defaultValue=''){
    const contentLengthKey = Object.keys(headers).find((item)=>{
        return item.toLowerCase() === key
    })

    return contentLengthKey ? headers[contentLengthKey] : defaultValue;
}



function mapStateToProps(state, props){
    const {requestId, historyId} = props;
    return {
        responseBody: state.requests.byId[requestId].history.byId[historyId].body,
        headers: state.requests.byId[requestId].history.byId[historyId].headers
    }
}


export default connect(mapStateToProps)(TabResponse);
