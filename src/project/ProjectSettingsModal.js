import React, {Component} from 'react';
import {connect} from 'react-redux';
import EnvironmentVariables from "./environment/EnvironmentVariables";

class ProjectSettingsModal extends Component {

    state = {
        modalIsOpen: true
    }

    openModal = ()=> {
        this.setState({modalIsOpen: true});
    }

    closeModal = ()=> {
        this.setState({modalIsOpen: false});
    }



    render(){
        return <div className="w-full md:w-4/5 md:min-h-screen  overflow-scroll border-0 md:border-l md:border-r primary-border">
                <EnvironmentVariables/>
            </div>
    }
}




function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
)(ProjectSettingsModal);
