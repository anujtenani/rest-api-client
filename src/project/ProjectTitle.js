import {FiSettings} from "react-icons/fi";
import React from "react";
import {Link} from 'react-router-dom';
import EnvironmentSwitcher from "./EnvironmentSwitcher";

export default function ProjectTitle({projectId}){
    return <div><div className={"h-12 p-2 flex flex-row border-b primary-border bg-grey-lighter"}>
        <h2 className={"flex-1"}>Cipher Chat</h2>
        <Link className={"px-2"} to={`/p/${projectId}/settings`}>
            <FiSettings className={"w-6 h-6"} /></Link>
        </div>
        <div>
            <Link to={`/p/${projectId}/functions`}>Functions</Link>
            <Link to={`/p/${projectId}/environment`}>Environments</Link>
        </div>
        <EnvironmentSwitcher />
    </div>
}
