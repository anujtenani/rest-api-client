import React, {Component} from 'react';
import {Link, NavLink} from 'react-router-dom';
import BodyComponent from "./body";
import AuthComponent from "./auth";
import HeaderParent from "./headers/HeaderParent";
import QueryStringContainer from "./querystring/QueryStringContainer";
export default class RequestOptions extends Component{
    state = {
        activeOption: 'Body'
    }

    onChange = (option) => () =>{
        this.setState({activeOption:option})
    }

    render(){
        const {requestId} = this.props;
        const {activeOption} = this.state;
        return (
            <div className={"hidden"}>
                <ul className="list-reset flex flex-row justify-around items-center">
                    <OptionItem title={"Body"} requestId={requestId} activeOption={activeOption} onChange={this.onChange}/>
                    <OptionItem title={"Auth"} requestId={requestId} activeOption={activeOption} onChange={this.onChange}/>
                    <OptionItem title={"Headers"} requestId={requestId} activeOption={activeOption} onChange={this.onChange}/>
                    <OptionItem title={"Description"} requestId={requestId} activeOption={activeOption} onChange={this.onChange}/>
                    <OptionItem title={"Query"} requestId={requestId} activeOption={activeOption} onChange={this.onChange}/>
                </ul>
                <div>
                {activeOption === "Body" ? <BodyComponent requestId={requestId}/> : null }
                {activeOption === "Auth" ? <AuthComponent requestId={requestId}/> : null }
                {activeOption === "Headers" ? <HeaderParent requestId={requestId}/> : null }
                {activeOption === "Description" ? <BodyComponent requestId={requestId}/> : null }
                {activeOption === "Query" ? <QueryStringContainer requestId={requestId}/> : null }
                </div>
            </div>
        )
    }
}

function OptionItem({title, requestId, activeOption, onChange}){
    let cls = 'flex-1 w-full border-b-2 border-grey-darker block no-underline text-center py-2 primary-button';
    if(activeOption === title){
        cls += ' border-b-2 border-blue font-bold';
    }
    return <li className={"flex-1"}>
        <button onClick={onChange(title)}  className={cls}>{title}</button></li>
}
