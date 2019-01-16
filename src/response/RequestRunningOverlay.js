import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import Spinner from "../components/spinner";
import {actionCancelRequestExecution} from "../redux/requestActions";

class RequestRunningOverlay extends PureComponent {



    render() {
        return (
            <div className={"flex flex-col items-center h-48 w-full justify-center"}>
                <Spinner/>
                <span className={"text-2xl my-2"}><Timer /></span>
                <button onClick={this.props.cancelRequestExecution} className={"primary-button"}>Cancel Request</button>
            </div>
        );
    }
}

//ideally this timer should start after the sendMessage is done;
class Timer extends PureComponent{
    state = {
        timer:0,
        interval:45
    }

    componentDidMount(){
        this.startDate  = new Date().getTime();
        this.timer = setInterval(()=>{
            this.setState({timer: this.state.timer+this.state.interval})
        }, this.state.interval);
    }


    componentWillUnmount() {
        clearInterval(this.timer);
    }
    render(){
        return this.state.timer > 100 ? `${this.state.timer} ms` : null;
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        cancelRequestExecution:()=>dispatch(actionCancelRequestExecution(requestId))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(RequestRunningOverlay);
