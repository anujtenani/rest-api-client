import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../components/ExpandablePanel";
import {doExport} from "../importexport";

class ExportPanel extends Component {
    state = {
        exportFormat:'native'
    }

    onSelectChange = (e)=>{
        this.setState({exportFormat:e.target.value})
    }

    download = (content, filename, contentType)=> {
        if(!contentType) contentType = 'application/octet-stream';
        var a = document.createElement('a');
        var blob = new Blob([content], {'type':contentType});
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        console.log(a);
        document.body.appendChild(a); //required for firefox
        a.click();
        document.body.removeChild(a); //dont want to keep that a tag in the body
        window.URL.revokeObjectURL(a.href);
    }

    exportData = (e)=>{
        const {state} = this.props;
        const date = new Date().toLocaleString().replace(/[^a-z0-9]/gi, '-').toLowerCase();

        switch (this.state.exportFormat) {
            case "native":
                console.log('downloading native');
                this.download(doExport(state), `Export${date}.json`);
                break;
            case "har":
                this.download(doExport(state, "har"), `Export${date}.json`)
        }
    }



    render() {
        return (
            <ExpandablePanel title={"Export Data"} defaultState={"open"}>
                <div className={"ml-2"}>
                    <div className={"flex flex-row items-center"}>
                        <p className={"mx-2"}>Export Format</p>
                        <select value={this.state.exportFormat} onChange={this.onSelectChange}>
                            <option value={"native"}>RestApe</option>
                            <option value={"har"}>HAR</option>
                        </select>
                    </div>
                    <div className={"text-right"}>
                        <button className={"my-4 primary-button"} onClick={this.exportData}>Export Data</button>
                    </div>
                </div>
            </ExpandablePanel>
        );
    }
}

function mapStateToProps(state) {
    return {
        state
    };
}

export default connect(
    mapStateToProps,
)(ExportPanel);
