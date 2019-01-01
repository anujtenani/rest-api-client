import React, {Component} from 'react';
import {FiChevronDown, FiChevronRight} from "react-icons/fi";

class ExpandablePanel extends Component {
    state = {
        collapsed:false,
    }

    constructor(props){
        super(props);
        if(props.defaultCollapsed) {
            this.state.collapsed = props.defaultCollapsed
        }
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

export default ExpandablePanel;
