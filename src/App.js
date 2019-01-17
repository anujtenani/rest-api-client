import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './css/tailwind.css';
import './css/normalize.css';
import {doImport} from "./importexport/har/importHar";
import {connect} from 'react-redux';
import {actionSetRequests} from "./redux/requestActions";
import MainPage from "./MainPage";
import {extensionInstalled} from "./servicehandlers";
import Loadable from "react-loadable";
import Spinner from "./components/spinner";

const ProjectPage = Loadable({
    loader: () => import('./ProjectPage'), //why ?  because JSHINT for JSONLinting is a huge dependency
    loading: ()=><div className={"flex h-screen w-screen flex-row items-center justify-center"}><Spinner/></div>,
});


class App extends Component {

    componentDidMount(){
        extensionInstalled().then(()=>{
            console.log('yes extension is installed, you may hide it now');
        }).catch((e)=>{
            console.log('redirect to chrome webstore or show a popup');
//            document.location.href = "https://chrome.webs"
        })
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
                <Route path={"/p/:projectId"} component={ProjectPage} />
                <Route path={"/"} component={MainPage} />
            </Switch>
        </Router>
    );
  }
}


const mapStateToProps = (state)=>{
    return {
        state
    }
}

const mapDispatchToProps = (dispatch, props)=>{
    return {
        setRequests:(byId, allIds)=>dispatch(actionSetRequests(byId, allIds))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
