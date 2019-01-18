import React, {Component} from 'react';
import Mousetrap from 'mousetrap';
import PropTypes from 'prop-types';
class Input extends Component {
    componentDidMount(){

    }

    componentWillUnmount(){
        if(this.props.onTab) {
            Mousetrap(this.ref).unbind('tab', this.props.onTab);
        }
        const input = document.activeElement;
        console.log('component unmounting, got input', input);
        if (input) {
            input.blur()
            console.log('input', input);
        }
        /*
       if(this.props.bluronenter){
           Mousetrap(this.ref).unbind('enter', this.props.bluronenter)
       }
       */
   }

   handleRef = (ref)=>{
        if(!ref)  return;
       this.ref = ref;
       if(this.props.onTab){
           Mousetrap(this.ref).bind('tab', this.props.onTab)
       }
       this.ref.addEventListener('focusout', ()=>{
           console.log('gocus out', this.ref.blur());
       })
       /*
       if(this.props.bluronenter){
           Mousetrap(this.ref).bind('enter', this.props.bluronenter)
       }
       */
    }

    handleBlur = (e)=>{
        if(e.target.value !== this.props.defaultValue){
            this.props.onBlur(e);
        }
    }

    handleSubmit = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        document.activeElement.blur();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className={"flex-1 w-full"}>
                <input ref={this.handleRef} {...this.props} onBlur={this.handleBlur} className={"w-full font-mono bg-transparent py-2 border-b primary-border primary-text"}/>
            </form>
        );
    }
}

Input.propTypes = {
//    bluronenter: PropTypes.bool,
    onTab: PropTypes.func,
}

Input.defaultProps = {
 //   bluronenter: false,
}

export default Input;
