import React, {Component} from 'react';
import onClickOutside from "react-onclickoutside";
import { Manager, Reference, Popper } from 'react-popper';
import {FiCopy, FiEdit, FiInfo, FiTrash} from "react-icons/fi";
import Popup from "reactjs-popup";

class DropDown extends Component {

    state = {
        show:false,
        toggleDeleteConfirm:false
    }

    showDropDown = ()=>{
        this.setState({show:true});
    }

    handleClickOutside = evt => {
        this.setState({show:false});
    };
    render() {
        const {children} = this.props;
        const {show, toggleDeleteConfirm} = this.state;
        return (
            <Manager>
                <Reference>
                    {({ ref }) => (
                        <button type="button"  className={"block text-right px-2 opacity-50 hover:opacity-100"} ref={ref} onClick={this.showDropDown}>
                            <FiInfo />
                        </button>
                    )}
                </Reference>
                {this.state.show ?
                <Popper placement="right-start">
                    {({ ref, style, placement, arrowProps }) => (
                        <div ref={ref} style={style} data-placement={placement}>
                            <div ref={arrowProps.ref} style={arrowProps.style} />
                            <div className={"flex w-auto bg-white shadow-md rounded primary-border flex-col p-2 primary-text"}>
                                <button className={"text-right py-2 secondary-text"}>
                                    <span className={"mx-2"}>Rename</span>
                                    <FiEdit />
                                </button>
                                <button className={"text-right secondary-text py-2"}>
                                    <span className={"mx-2"}>Duplicate</span>
                                    <FiCopy />
                                </button>
                                {!this.state.toggleDeleteConfirm ?
                                    <button onClick={this.toggleDeleteConfirm} className={"text-right py-2 secondary-text"}>
                                        <span className={"mx-2"}>Delete</span>
                                        <FiTrash/>
                                    </button>
                                    :
                                    <ConfirmDelete onConfirmed={this.actuallyDeleteRequest} onCancel={this.toggleDeleteConfirm}/>
                                }
                            </div>
                        </div>
                    )}
                </Popper> : null
                }
            </Manager>
        );
    }
}


function ConfirmDelete({onCancel, onConfirmed}){
    return (<div className={"text-right py-2"}>
        <span>
        <span>Confirm Delete</span>
        <button className={"primary-text mx-2"} onClick={onCancel}>no</button>
            <span>/</span>
        <button className={"text-red mx-2"} onClick={onConfirmed}>yes</button>
        </span>
    </div>)
}


export default onClickOutside(DropDown);
