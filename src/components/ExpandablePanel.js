import React, {Component} from 'react';
import {FiChevronDown, FiChevronRight} from "react-icons/fi";
import PropTypes from 'prop-types';

class ExpandablePanel extends Component {
    state = {
        collapsed:false,
    }

    constructor(props){
        super(props);
        this.state.collapsed = props.defaultState === "close"
    }

    toggleCollapsed = ()=>{
        this.setState({collapsed: !this.state.collapsed})
    }


    render() {
        const {collapsed} = this.state;
        const {children, title} = this.props
        return (
            <div className={"m-2"}>
                <button onClick={this.toggleCollapsed} className={"w-full py-2 px-1 primary-text flex items-center flex-row"}>
                    {collapsed ?
                        <FiChevronRight/> :
                        <FiChevronDown/>
                    }
                    <div>{title}</div>
                </button>
                {!collapsed ?
                    <div className={"ml-2 border-dashed border-b "}>
                        {children}
                    </div>
                    : null
                }
            </div>
        );
    }
}

ExpandablePanel.propTypes = {
    title: PropTypes.any.isRequired,
    defaultState: PropTypes.oneOf(["open", "close"])
}

ExpandablePanel.defaultProps = {
    defaultState: "open"
}

export default ExpandablePanel;
