import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import RequestList from "./request/list/RequestList";
import RequestCreator from "./request/index";
import ResponseView from './response';
import './css/tailwind.css';
import './css/normalize.css';
import {doImport} from "./importexport/har/importHar";
import {connect} from 'react-redux';
import {actionSetRequests} from "./redux/requestActions";
import CheckRequestExists from "./CheckRequestExists";
import LoadingOverlay from "./components/LoadingOverlay";
import ProjectTitle from "./project/ProjectTitle";
import ProjectSettings from "./project/ProjectSettings";
import BuildOAuth2 from "./oauth2page/BuildOAuth2";
import OAuth2Result from "./oauth2page/OAuth2Result";
import WSChat from "./websocket/wschat";

class ProjectPage extends Component {

    state = {
        loading: false
    }

    handleFileRead = (fileContents)=>{
        const imports = doImport(JSON.parse(fileContents));
        this.props.setRequests(imports.byId, imports.allIds);
        console.log(imports);
        console.log(fileContents)
    }

    render() {
        const {projectId} = this.props;
        return this.state.loading ? <LoadingOverlay/> :
            (<div className="main">
                <div className="flex flex-row flex-wrap relative h-screen overflow-x-hidden">
                    <div className="w-full md:w-1/5 md:h-screen md:overflow-y-scroll border-0 md:border-l md:border-r primary-border">
                        <ProjectTitle projectId={projectId}/>
                        <RequestList/>
                    </div>
                    <Route path={this.props.match.url+"/settings"} component={ProjectSettings} />
                    <Route path={this.props.match.url+"/oauth2/:requestId"} component={RenderOAuth} />
                    <Route path={this.props.match.url+"/ws/:requestId"} component={WSChat} />
                    <Route path={this.props.match.url+"/rest/:requestId"} component={RenderRequest} />
                </div>
            </div>
        );
    }
}


function RenderOAuth(props){
    const {requestId} = props.match.params;
    return <React.Fragment>
        <div className="w-full md:w-2/5 md:min-h-screen  overflow-scroll border-0 md:border-r primary-border">
            <BuildOAuth2 requestId={requestId}/>
        </div>
        <div className="w-full md:w-2/5">
            <OAuth2Result requestId={requestId}/>
        </div>
    </React.Fragment>
}


function RenderRequest(props){
    return <React.Fragment>
        <div className="w-full md:w-2/5 md:min-h-screen  overflow-scroll border-0 md:border-r primary-border">
            <RenderRequestCreator requestId={props.match.params.requestId}/>
        </div>
        <div className="w-full md:w-2/5">
            <RenderResponseView requestId={props.match.params.requestId}/>
        </div>
    </React.Fragment>
}

function RenderRequestCreator({requestId}){
    return <CheckRequestExists requestId={requestId}>
        <RequestCreator requestId={requestId}/>
    </CheckRequestExists>
}

function RenderResponseView({requestId}){
    return <CheckRequestExists requestId={requestId}>
        <ResponseView requestId={requestId}/>
    </CheckRequestExists>
}

const mapStateToProps = (state, props)=>{
    const {projectId} = props.match.params;
    console.log(props.match.params);
    return {
        //projectId:state.metadata.projectId
        projectId
    }
}


const mapDispatchToProps = (dispatch, props)=>{
    return {
        setRequests:(byId, allIds)=>dispatch(actionSetRequests(byId, allIds))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
