import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import WebWorker from "../../helpers/worker/WebWorker";
import store from '../../redux/store';
import UrlParser from 'url';

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


function basicUrlBuilder(state, requestId){
        const request = state.requests.byId[requestId];
        const {path, qs, url} = request;
        let ur = url;
        const qsObject = {};
        qs.allIds.forEach((qsId)=>{
            const {name, value} = qs.byId[qsId];
            qsObject[name] = value;
        });
        if(path && path.allIds){
            path.allIds.forEach((pathId)=>{
                const {name, value} = path.byId[pathId];
                ur = ur.split(name).join(value);
            });
        }
        const varmap = variableMapForCurrentEnv(state) || {};
        const baseurl = varmap['baseurl'] || '';
        ur = baseurl+ur;
        ur = ur.startsWith('http') ? ur : `http://${ur}`;

        const parsedUrl = UrlParser.parse(ur, true);
        parsedUrl.query = {...parsedUrl.query, ...qsObject};
        parsedUrl.search = undefined;
        return UrlParser.format(parsedUrl)
}

function variableMapForCurrentEnv(state){
    const {activeEnv, variableAllIds, variableById, envVariableMap} = state.env;
    const varmap = {}
    //generate variable map
    variableAllIds.forEach((id)=>{
        varmap[variableById[id].name] = envVariableMap[id][activeEnv];
    });
    return varmap;
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
