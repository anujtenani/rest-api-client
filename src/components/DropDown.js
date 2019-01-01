import React, {Component} from 'react';
import onClickOutside from "react-onclickoutside";

class DropDown extends Component {

    handleClickOutside = evt => {
        this.props.onClickOutside();
    };
    render() {
        const {children} = this.props;
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }
}

export default onClickOutside(DropDown);
