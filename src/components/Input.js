import React, {Component} from 'react';
import Mousetrap from 'mousetrap';

class Input extends Component {
    componentDidMount(){

    }

    componentWillUnmount(){
        if(this.props.onTab) {
            Mousetrap(this.ref).unbind('tab', this.props.onTab);
        }
    }

    handleRef = (ref)=>{
        this.ref = ref;
        if(this.props.onTab){
            Mousetrap(this.ref).bind('tab', this.props.onTab)
        }
    }

    render() {
        return (
            <input ref={this.handleRef} {...this.props} className={"font-mono flex-1 w-full bg-transparent py-2  border-b primary-border primary-text"}/>
        );
    }
}

export default Input;
