import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import RequestList from "./request/list/RequestList";
import RequestCreator from "./request/index";
import ResponseView from './response';
import './css/tailwind.css';
import './css/normalize.css';
import OAUTH from './request/auth/oAuth2';
import CodemirrorInput from "./components/richinput/CodemirrorInput";
import {callFunction, startWorker} from "./helpers/worker/WorkerHelper";
import FileInputWithReader from "./components/FileInputWithReader";
import {doImport} from "./converters/har/importHar";
import {connect} from 'react-redux';
import {actionSetRequests} from "./redux/requestActions";
import CheckRequestExists from "./CheckRequestExists";

class App extends Component {

    componentDidMount(){
//        startWorker();
        /*
        callFunction('timestamp','').then((result)=>{
            console.log(result);
        });
        */
//        this.substituteValuesForVariables("google.com/{{timestamp}}/{{mediaid}}")
    }

    substituteValuesForVariables = (line)=>{
        const fn = line.match(/{{(.*?)}}/g).map((item)=>{
            return item.replace("{{",'').replace("}}",'');
        });

        const promises = fn.map((fn)=>{
            return callFunction(fn, '');
        });

        Promise.all(promises).then((result)=>{
            console.log(result);

        });
    }

    handleFileRead = (fileContents)=>{
        const imports = doImport(JSON.parse(fileContents));
        this.props.setRequests(imports.byId, imports.allIds);
        console.log(imports);
        console.log(fileContents)
    }

  render() {
    return (
        <Router>
          <div className="main">
              <div className="flex flex-row flex-wrap relative h-screen overflow-x-hidden">
                      <div className="w-full md:w-1/5 md:min-h-screen">
                          <FileInputWithReader onFile={this.handleFileRead}/>
                          <OAUTH />
                          <CodemirrorInput/>
                          <RequestList/>
                      </div>
                      <div className="w-full md:w-2/5 md:min-h-screen  overflow-scroll border-0 md:border-l md:border-r primary-border">
                          <Route path={"/request/:requestId"} component={RenderRequestCreator} />
                      </div>
                      <div className="w-full md:w-2/5 md:min-h-screen  overflow-scroll">
                          <Route path={"/request/:requestId"} component={RenderResponseView} />
                      </div>
                  </div>
              </div>
        </Router>
    );
  }
}

function RenderRequestCreator(props){
    const {requestId} = props.match.params;
    return <CheckRequestExists requestId={requestId}>
        <RequestCreator requestId={requestId}/>
    </CheckRequestExists>
}

function RenderResponseView(props){
    const {requestId} = props.match.params;
    return <CheckRequestExists requestId={requestId}>
        <ResponseView requestId={requestId}/>
    </CheckRequestExists>
}


const mapDispatchToProps = (dispatch, props)=>{
    return {
        setRequests:(byId, allIds)=>dispatch(actionSetRequests(byId, allIds))
    }
}

export default connect(null, mapDispatchToProps)(App);
