import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../../components/ExpandablePanel";

class TabGeneral extends Component {


    render() {
        const {headers} = this.props;
        if(headers) {
            return (
                <ExpandablePanel title={`Request Headers (${Object.keys(headers).length})`}>
                    <div className={"ml-2"}>
                        {Object.keys(headers).map((item) => {
                            return <LineItem title={item} key={item} value={headers[item]}/>
                        })}
                    </div>
                </ExpandablePanel>
            );
        }else{
            return null;
        }
    }
}


function LineItem({title, value}){
    return <p className={"p-1"}>
        <span className={"text-sm secondary-text capitalize"}>{title}: </span>
        <span>{value}</span>
    </p>
}


function mapStateToProps(state, props) {
    const {requestId, historyId} = props;
    return {
        headers: state.requests.byId[requestId].history.byId[historyId].requestHeaders
    };
}

export default connect(
    mapStateToProps,
)(TabGeneral);
