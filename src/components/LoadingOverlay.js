import React from 'react';
import Spinner from "./spinner";

export default function LoadingOverlay(){
    return <div className={"fixed pin bg-white opacity-50 flex flex-row items-center justify-center z-50"}>
        <span className={"text-5xl"}>Loading</span>
        <Spinner/>
    </div>
}
