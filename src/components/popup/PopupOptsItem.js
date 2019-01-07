import Popup from "../Popup";
import React from "react";

export default function(){
    return <button className={"p-2"} onClick={this.props.onClick}>{this.props.children}</button>
}
