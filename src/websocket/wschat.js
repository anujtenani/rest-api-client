import React, {Component} from 'react';
import {connect} from 'react-redux';
import Input from "../components/Input";
import PayloadView from "./PayloadView";
import SocketResponseView from "./SocketResponseView";
import shortId from 'shortid';
import Spinner from "../components/spinner";

class WSChat extends Component {
    state = {
        server:'',
        data:'',
        connectionState:'default',
        history:[{
            id:'asd13ad',
            mode:'send',
            data:'this is the string payload',
            timestamp:new Date().getTime(),
        },{
            id:'ad1asdasd',
            mode:'receive',
            data:'the payload received',
            timestamp:new Date().getTime(),
        }]
    }

    onBlur = (key)=>(e)=>{
        this.setState({[key]: e.target.value});
    }

    handleSocketClosed = (e)=>{
        if(e.wasClean && e.code === 1000) { //1000 code is sent when the socket is connected explicitely by the user, hence we update the state
            this.setState({connectionState: 'closed'});
        }
        console.log('socket closed', e);
    }

    handleSocketError = (e)=>{
        this.setState({connectionState:'error'});
        console.log('socket error', e);
    }

    handleSocketOpen = ()=>{
        this.setState({connectionState:'open'});
        console.log('socket opened');
    }
    handleMessage = (messageEvent)=>{
        const {data} = messageEvent;
        const history = this.state.history.slice();
        history.unshift({mode:'receive', timestamp: new Date().getTime(), data, id: shortId.generate()})
        this.setState({history});
        console.log('got message', messageEvent);
    }
    sendMessage = ()=>{
        if(this.socket){
            const {data} = this.state;
            this.socket.send(data);
            const history = this.state.history.slice();
            history.unshift({mode:'send', timestamp: new Date().getTime(), data, id: shortId.generate()})
            this.setState({history, data:''});
        }
    }

    componentWillUnmount(){
        if(this.socket) {
            this.socket.close(); //do not send 1000 code, so that we do not update the state
        }
    }

    connect = ()=>{
        console.log('connecting', this.state.server);
        let url = this.state.server;
        if(!url.startsWith("ws://") || !url.startsWith("wss://")){
            url = "ws://"+url
        }
        this.setState({connectionState:'connecting'});
        this.socket = new WebSocket(url/*, ["protocolOne", "protocolTwo"] */);
        this.socket.onclose = this.handleSocketClosed;
        this.socket.onerror = this.handleSocketError;
        this.socket.onmessage = this.handleMessage;
        this.socket.onopen = this.handleSocketOpen;
    }

    disconnect = ()=>{
        if(this.socket){
            this.socket.close(1000, "Closed by user");
            this.socket = undefined;
        }
    }

    render() {
        const {server, data, history, connectionState} = this.state;
        console.log('history', history);
        let btn = null;
        switch (connectionState) {
            case "open":
                btn = <button className={"primary-button"} onClick={this.disconnect}>Disconnect</button>;
                break;
            case "connecting":
                btn=  <Spinner/>;
                break;
            default:
                btn = <button className={"primary-button"} onClick={this.connect}>Connect</button>
                break;
        }
        return (
            <div>
                <Input placeholder={"Websocket server url"} defaultValue={server} onBlur={this.onBlur('server')} />
                {btn}
                {history.map(({mode, data, timestamp, id})=>{
                    return <RenderHistoryView key={id} mode={mode} data={data} timestamp={timestamp} />
                })}
                {connectionState === "open" ? <div>
                        <Input placeholder={"data"} defaultValue={data} onBlur={this.onBlur('data')} />
                        <button className={"primary-button"} onClick={this.sendMessage}>Send</button>
                    </div> : null
                }
            </div>
        );
    }
}

function RenderHistoryView({mode, data, timestamp, id}){
    if(mode === "send"){
        return <PayloadView value={data} timestamp={timestamp}/>
    }else{
        return <SocketResponseView value={data} timestamp={timestamp}/>
    }
}


function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
)(WSChat);
