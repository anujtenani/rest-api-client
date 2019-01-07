import React, {Component} from 'react';
import onClickOutside from "react-onclickoutside";

class OutsideWrapper extends Component {

    handleClickOutside = evt => {
        console.log('outside clicked');
        this.props.onClickOutside();
    };

    render() {
        return (
           <React.Fragment>
               {this.props.children}
           </React.Fragment>
        );
    }
}

export default onClickOutside(OutsideWrapper);
