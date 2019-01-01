import React from 'react';

export default function (props){
    return <label {...props} className={"primary-text font-bold text-xs"}>{props.children}</label>
}
