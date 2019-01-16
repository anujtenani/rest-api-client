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
        /*
       if(this.props.bluronenter){
           Mousetrap(this.ref).unbind('enter', this.props.bluronenter)
       }
       */
   }

   handleRef = (ref)=>{
       this.ref = ref;
       if(this.props.onTab){
           Mousetrap(this.ref).bind('tab', this.props.onTab)
       }
       /*
       if(this.props.bluronenter){
           Mousetrap(this.ref).bind('enter', this.props.bluronenter)
       }
       */
    }

    render() {
        return (
            <input ref={this.handleRef} {...this.props} className={"font-mono flex-1 w-full bg-transparent py-2  border-b primary-border primary-text"}/>
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
