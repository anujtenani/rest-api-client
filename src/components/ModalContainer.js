import React, {Component} from 'react';
import {FiX} from "react-icons/fi";

class ModalContainer extends Component {
    render() {
        const {children} = this.props;
        return (
            <div className={"shadow-md bg-white p-4 relative"}>
                <button className={"absolute pin-t pin-r p-2"} onClick={this.props.onRequestClose}>
                   <FiX />
                </button>
                {children}
            </div>
        );
    }
}

export default ModalContainer;
