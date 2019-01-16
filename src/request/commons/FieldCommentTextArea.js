import Textarea from "react-textarea-autosize";
import React from "react";

export default function ({onBlur, defaultValue}){
    return <div className={"mb-2 flex flex-row items-center block secondary-bg"}>
        <Textarea placeholder={"Description"} onBlur={onBlur} defaultValue={defaultValue} className={"flex-1 py-2 border-b  bg-transparent primary-border primary-text"}/>
    </div>
}
