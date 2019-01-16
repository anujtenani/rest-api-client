import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../components/ExpandablePanel";
import {doImport} from "../importexport";
import {actionCreateRequest} from "../redux/requestActions";
import {githubProjectUrl, supportEmail} from '../config';

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
            <div className={"p-2"}>
                <h2>Customer Support</h2>
                <p>This project is fully supported and maintained. For any queries, issues, feature requests, get in touch using the links below</p>

                <div className={"py-2 my-2"}>
                    <p>Report bugs, issues, request for new features</p>
                    <a href={githubProjectUrl} target={"_blank"} className={"my-2 no-underline flex flex-row"}>
                        <span className={"rounded bg-black text-white px-2 py-1 text-xs font-bold mr-2"}>GITHUB</span>
                        <p>Project Page ({githubProjectUrl})</p>
                    </a>
                </div>
                <div className={"py-2 my-2"}>
                    <p>Get direct support</p>
                    <a href={`mailto:${supportEmail}`} target={"_blank"} className={"my-2 no-underline flex flex-row"}>
                        <span className={"rounded bg-orange text-white px-2 py-1 text-xs font-bold mr-2"}>EMAIL</span>
                        <p>Contact by Email ({supportEmail})</p>
                    </a>
                </div>
            </div>
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
