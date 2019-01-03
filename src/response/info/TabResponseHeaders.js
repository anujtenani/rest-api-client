import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../../components/ExpandablePanel";


/**
 * Response headers are in {name, value} format as there can by multiple set-cookie headers
 */
class TabResponseHeaders extends Component {


    render() {
        const {headers} = this.props;
        return (
            <ExpandablePanel title={`Response Headers (${headers.length})`}>
                <div className={"ml-2"}>
                    {headers.map(({name, value})=>{
                        return <LineItem title={name} key={value} value={value} />
                    })}
                </div>
            </ExpandablePanel>
        );
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
        headers: state.requests.byId[requestId].history.byId[historyId].headers
    };
}

export default connect(
    mapStateToProps,
)(TabResponseHeaders);
