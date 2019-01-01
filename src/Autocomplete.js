import React, {Component} from 'react';

export default class Autocomplete extends Component{

    state = {
        value:'hello'
    }

    handleKeyDown = ()=>{
        //check for key up or down
    }

    handleInput = (e)=>{
        console.log(e.target.innerHTML);
    }

    render(){
        const {value} = this.state;
        return <div contentEditable onInput={this.handleInput} onKeyDown={this.handleKeyDown}>
            {value}
        </div>
    }
}
