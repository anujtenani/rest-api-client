import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import WebWorker from "../../helpers/worker/WebWorker";
import store from '../../redux/store';
import UrlParser from 'url';
import {basicUrlBuilder} from "../../helpers/func";

class UrlPreview extends PureComponent {

    state = {
        url:null
    }


    componentDidMount() {
        this.worker = new WebWorker(store.getState());
        this.refreshUrl();
    }


    componentWillUnmount() {
        this.worker.terminate();
    }


    componentDidUpdate(prevProps, prevState){
        if(prevProps.url !== this.props.url){
            this.refreshUrl();
        }
    }

    refreshUrl = ()=>{
        const{ requestId } = this.props;
        this.worker.callFunction(`getRequestUrl("${requestId}")`, store.getState(),null).then(({data})=>{
            this.setState({url:data});
        })
    }


    render() {
        return (
            <div className={"mb-2 border primary-border rounded px-2 flex flex-row items-center overflow-x-scroll"} style={{minHeight:'32px'}}>
                <p style={{whiteSpace:'nowrap'}}>{this.state.url || ' '}</p>
            </div>
        );
    }
}


function mapStateToProps(state,props) {
    const {requestId} = props;
    return {
        url :basicUrlBuilder(state, requestId)
    };
}

export default connect(
    mapStateToProps,
)(UrlPreview);
