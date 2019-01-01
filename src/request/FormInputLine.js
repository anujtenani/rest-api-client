import React, {Component} from 'react';
import {FiLink, FiMenu, FiX} from "react-icons/fi";
import Textarea from "react-textarea-autosize";
import {connect} from 'react-redux';

class FormInputLine extends Component{

    render(){
        return <div>
            <div className="flex flex-row">
                <input placeholder={"name"} className="flex-1"/>
                <input placeholder={"value"} className={"flex-1"}/>
                <FiMenu/>
            </div>
            <div className={"flex flex-row items-center"}>
                <div className="flex-1 flex flex-row items-center">
                    <p>String</p>
                    <p>*</p>
                    <p><FiLink/></p>
                </div>
                <Textarea placeholder={"Description"} class={"flex-1"}/>
                <FiX/>
            </div>
        </div>
    }
}



export default connect()(FormInputLine)
