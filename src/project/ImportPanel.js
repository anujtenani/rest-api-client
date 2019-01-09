import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../components/ExpandablePanel";
import doImport from "../importexport/import";
import {actionCreateRequest} from "../redux/requestActions";

class ImportPanel extends Component {

    state = {
        requests:[],
        importResult:null,
        files:undefined,
    }

    onFileInput = (e)=>{
        this.setState({requests:[], importResult:null, files: e.target.files});
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = (ev)=>{
            const requests = doImport(reader.result, "har");
            console.log(requests);
            this.setState({requests});
        };
        reader.readAsText(file);
    }

    startImport = ()=>{
        this.state.requests.reverse().forEach((req)=>{
            this.props.insertRequest(req);
        });
        this.setState({importResult:this.state.requests.length, requests:[], files:undefined});
    }

    render() {
        return (
            <ExpandablePanel title={"Import Data"} defaultState={"open"}>
                <div className={"ml-2"}>
                    <p className={"mb-2"}>Supports <strong>RestApe</strong>, <strong>HAR</strong> format. Imported requests will be added to the project</p>
                    <input type={"file"} onChange={this.onFileInput}/>
                        {this.state.importResult ? <p>Imported {this.state.importResult} requests</p> : null }
                        <div className={"text-right"}>
                        {this.state.requests.length > 0 ? <span>{this.state.requests.length} requests</span> : null }
                        <button className={"ml-2 my-4 primary-button"}
                                onClick={this.startImport}
                                disabled={this.state.requests.length === 0}>Import Data</button>
                    </div>
                </div>
            </ExpandablePanel>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch, props){
    return {
        insertRequest:(payload)=>dispatch(actionCreateRequest(payload))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(ImportPanel);
