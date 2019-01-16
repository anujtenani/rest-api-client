import React, {Component} from 'react';
import onClickOutside from "react-onclickoutside";
import {Manager, Popper, Reference} from 'react-popper';
import PropTypes from 'prop-types';
import OutsideWrapper from "./popup/OutsideWrapper";

class Popup extends Component {

    state = {
        show:false,
    }

    show = ()=>{
        console.log("showing");
        this.setState({show:true});
    }

    hide = ()=>{
        console.log('hiding');
        this.setState({show:false});
    }


    render() {
        const {placement} = this.props;
        //console.log("placement", placement);
        return (
            <Manager>
                <Reference>
                    {({ ref }) => (
                        <button ref={ref} onClick={this.show} className={"primary-button"}>
                            {this.props.trigger}
                        </button>
                    )}
                </Reference>
                {this.state.show ?
                    <Popper placement={placement}>
                        {({ ref, style, placement, arrowProps }) => {
                            console.log("popper placement", placement);
                            return (
                            <div ref={ref} style={style} className={"z-40"} data-placement={placement}>
                                <div ref={arrowProps.ref} style={arrowProps.style} />
                                <OutsideWrapper onClickOutside={this.hide}>
                                <div className={"flex primary-bg shadow-md overflow-hidden rounded primary-border flex-col primary-text"}>
                                    {this.props.children}
                                </div>
                                </OutsideWrapper>
                            </div>
                        )}}
                    </Popper> : null
                }
            </Manager>
        );
    }
}





Popup.propTypes = {
    placement: PropTypes.oneOf(["auto","auto-end","right","left","top","bottom","right-start","right-end","top-start","top-end","left-start","left-end","bottom-start","bottom-end"]),
    trigger: PropTypes.object.isRequired,
}

Popup.defaultProps = {
    placement:"auto"
}


export default Popup;
