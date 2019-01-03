import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import RequestList from "./request/list/RequestList";
import RequestCreator from "./request/index";
import ResponseView from './response';
import './css/tailwind.css';
import './css/normalize.css';
import OAUTH from './request/auth/oAuth2';
import CodemirrorInput from "./components/richinput/CodemirrorInput";
import {startWorker} from "./helpers/worker/WorkerHelper";
import FileInputWithReader from "./components/FileInputWithReader";
import {doImport} from "./converters/har/importHar";
import {connect} from 'react-redux';
import {actionSetRequests} from "./redux/requestActions";
import CheckRequestExists from "./CheckRequestExists";
import LoadingOverlay from "./components/LoadingOverlay";
import DropDown from "./components/DropDown";
import GenerateCode from "./transformers/GenerateCode";

class ProjectPage extends Component {

    state = {
        loading: false
    }

    componentDidMount(){
        startWorker();
        //load the project data if store is empty and block the router till then
        const { project_id } = this.props.match.params;
        if(project_id !== this.props.projectId){
            //load the project and set the project request as well as project data
            console.log('loading project');
           // this.setState({loading:true});
        }
    }

    handleFileRead = (fileContents)=>{
        const imports = doImport(JSON.parse(fileContents));
        this.props.setRequests(imports.byId, imports.allIds);
        console.log(imports);
        console.log(fileContents)
    }

    render() {
        return this.state.loading ?                 <LoadingOverlay/> :
            (<div className="main">
                <div className="flex flex-row flex-wrap relative h-screen overflow-x-hidden">
                    <div className="w-full md:w-1/5 md:min-h-screen">
                        <FileInputWithReader onFile={this.handleFileRead}/>
                        <OAUTH />
                        <CodemirrorInput/>
                        <RequestList/>
                        <DropDown />
                    </div>
                    <div className="w-full md:w-2/5 md:min-h-screen  overflow-scroll border-0 md:border-l md:border-r primary-border">
                        <Route path={this.props.match.url+"/request/:requestId"} component={RenderRequestCreator} />
                    </div>
                    <div className="w-full md:w-2/5 md:min-h-screen  overflow-scroll">
                        <Route path={this.props.match.url+"/request/:requestId"} component={RenderResponseView} />
                    </div>
                </div>
            </div>
        );
    }
}

function RenderRequestCreator(props){
    const {requestId} = props.match.params;
    return <CheckRequestExists requestId={requestId}>
        <GenerateCode requestId={requestId} />
        <RequestCreator requestId={requestId}/>
    </CheckRequestExists>
}

function RenderResponseView(props){
    const {requestId} = props.match.params;
    return <CheckRequestExists requestId={requestId}>
        <ResponseView requestId={requestId}/>
    </CheckRequestExists>
}

const mapStateToProps = (state, props)=>{
    return {
        projectId:state.metadata.projectId
    }
}


const mapDispatchToProps = (dispatch, props)=>{
    return {
        setRequests:(byId, allIds)=>dispatch(actionSetRequests(byId, allIds))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
