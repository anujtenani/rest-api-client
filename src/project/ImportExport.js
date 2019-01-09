import React from 'react';
import ImportPanel from "./ImportPanel";
import ExportPanel from "./ExportPanel";

export default function(){
    return  <div className={"w-1/3"}>
        <ImportPanel />
        <ExportPanel/>
    </div>
}
