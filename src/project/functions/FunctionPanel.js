import React, {Component} from 'react';
import {connect} from 'react-redux';
import ExpandablePanel from "../../components/ExpandablePanel";
import FunctionBuilder from "./FunctionBuilder";
import PropTypes from 'prop-types';


class FunctionPanel extends Component {
    render() {
        return (
            <ExpandablePanel title={<strong>{this.props.name}</strong>} defaultState={this.props.defaultState} >
                <FunctionBuilder functionId={this.props.functionId}/>
            </ExpandablePanel>
        );
    }
}

function mapStateToProps(state, props) {
    const {functionId} = props;
    return {
        name: state.func.byId[functionId].name,
        functionId
    };
}


FunctionPanel.propTypes = {
    functionId: PropTypes.string.isRequired,
    defaultState: PropTypes.oneOf(["open","close"])
}

FunctionPanel.defaultProps = {
    defaultState: "close"
}

export default connect(
    mapStateToProps,
)(FunctionPanel);
