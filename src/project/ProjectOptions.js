import React from 'react';
import ImportPanel from "./ImportPanel";
import ExportPanel from "./ExportPanel";

export default function(){
    return  <div className={"md:w-1/2 w-full"}>
        <ImportPanel />
        <ExportPanel/>
    </div>
}
