import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './css/tailwind.css';
import './css/normalize.css';
import {startWorker} from "./helpers/worker/WorkerHelper";
import {doImport} from "./converters/har/importHar";
import {connect} from 'react-redux';
import {actionSetRequests} from "./redux/requestActions";
import ProjectPage from "./ProjectPage";
import MainPage from "./MainPage";

class App extends Component {

    componentDidMount(){
        startWorker();
        // load initial state with regards to the app and hydrate the store
        // this initial state is the allProjectData along with any requirement such as authentication or such
        //
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
            <Switch>
                <Route path={"/p/:project_id"} component={ProjectPage} />
                <Route path={"/"} component={MainPage} />
            </Switch>
        </Router>
    );
  }
}


const mapDispatchToProps = (dispatch, props)=>{
    return {
        setRequests:(byId, allIds)=>dispatch(actionSetRequests(byId, allIds))
    }
}

export default connect(null, mapDispatchToProps)(App);
