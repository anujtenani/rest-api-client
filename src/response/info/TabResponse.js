import React, {Component} from 'react';
import {connect} from 'react-redux';
import PreviewVisualHtml from "../preview/PreviewVisualHtml";
import PreviewMedia from "../preview/PreviewMedia";
import PreviewSource from "../preview/PreviewSource";
import PreviewRaw from "../preview/PreviewRaw";
import prettyBytes from 'pretty-bytes';
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
        const {responseBody, headers, statusCode, bodySize, endTime, startTime} = this.props;
        //get conte ntSize;

       const contentLengthHeader = headers && headers.length > 0 ? headers.find(({name, value})=> name.toLowerCase() === 'content-length') : 0;
       const contentLength = contentLengthHeader ? contentLengthHeader.value : 0;
       const contentTypeHeader = headers && headers.length > 0 ? headers.find(({name, value})=> name.toLowerCase() === 'content-type') : '';
       const contentType =  contentTypeHeader ? contentTypeHeader.value : '';

        //only 2 types of response views
        //1. preview (shows formatted html or media element)
        //2. source (shows the data in a codemirror)
        return (
            <div className={"m-px"}>
                <div className={"flex flex-row items-center justify-between mb-px"}>
                    <div className={"flex flex-row items-center"}>
                    <RenderTag text={statusCode} className={"tag--statuscode-2xx"} />
                    <RenderTag text={prettyBytes(getHeaderVal(headers, 'content-length', bodySize))} className={"tag--bodysize"} />
                    <RenderTag text={`${endTime-startTime}ms`}  className={"tag--totaltime"}/>
                    </div>
                    <select value={previewType} onChange={this.onChange}>
                        <option value={"preview"}>Preview</option>
                        <option value={"html"}>Source Code</option>
                        <option value={"raw"}>Raw</option>
                        <option value={"json"}>JSON</option>
                    </select>
                </div>

                    {previewType === "preview" ? <RenderContentPreview contentType={contentType} responseBody={responseBody} contentLength={contentLength} /> : null }
                    {previewType === "html" ? <PreviewSource previewMode={"html"} responseBody={responseBody} contentLength={contentLength} /> : null }
                    {previewType === "raw" ? <PreviewRaw responseBody={responseBody} contentLength={contentLength} /> : null }
                    {previewType === "json" ? <PreviewSource previewMode={"json"}  responseBody={responseBody} contentLength={contentLength} /> : null }
            </div>
     );
    }
}

function RenderTag({className, text}){
    return <p className={`ml-2 tag--responsetags ${className}`}>{text}</p>
}

function RenderContentPreview({contentType, responseBody, contentLength}){
    if(contentType.startsWith("image")){
        return <PreviewMedia responseBody={responseBody} contentLength={contentLength} />
    }else if(contentType.includes('json') || contentType.includes("javascript")) {
        return <PreviewSource previewMode={"json"} responseBody={responseBody} contentLength={contentLength}/>
    } else if(contentType.includes('xml')) {
        return <PreviewSource previewMode={"xml"} responseBody={responseBody} contentLength={contentLength}/>
    } else{
        return <PreviewVisualHtml responseBody={responseBody} contentLength={contentLength} />
    }
}


function getHeaderVal(headers, key, defaultValue=''){
    const contentLengthKey = Object.keys(headers).find((item)=>{
        return item.toLowerCase() === key.toLowerCase()
    })

    return contentLengthKey ? headers[contentLengthKey] : defaultValue;
}



function mapStateToProps(state, props){
    const {requestId, historyId} = props;
    const history = state.requests.byId[requestId].history.byId[historyId];
    return {
        responseBody: history.body,
        headers: history.headers,
        statusCode: history.statusCode,
        bodySize: history.bodySize || 0,
        startTime: history.startTime || 0,
        endTime: history.endTime || 0,
    }
}


export default connect(mapStateToProps)(TabResponse);
