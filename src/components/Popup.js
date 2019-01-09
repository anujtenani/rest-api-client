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
        return (
            <Manager>
                <Reference>
                    {({ ref }) => (
                        <button ref={ref} onClick={this.show} className={"opacity-50 hover:opacity-100"}>
                            {this.props.trigger}
                        </button>
                    )}
                </Reference>
                {this.state.show ?
                    <Popper placement={this.props.placement} eventsEnabled={false} positionFixed={true}>
                        {({ ref, style, placement, arrowProps }) => (
                            <div ref={ref} style={style} className={"z-40"} data-placement={placement}>
                                <div ref={arrowProps.ref} style={arrowProps.style} />
                                <OutsideWrapper onClickOutside={this.hide}>
                                <div className={"flex bg-white shadow-md overflow-hidden rounded primary-border flex-col primary-text"}>
                                    {this.props.children}
                                </div>
                                </OutsideWrapper>
                            </div>
                        )}
                    </Popper> : null
                }
            </Manager>
        );
    }
}





Popup.propTypes = {
    placement: PropTypes.oneOf(["right","left","top","bottom","right-start","right-end","top-start","top-end","left-start","left-end","bottom-start","bottom-end"]),
    trigger: PropTypes.object.isRequired,
}

Popup.defaultProps = {
    placement:"bottom-end"
}


export default Popup;
