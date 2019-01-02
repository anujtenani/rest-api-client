import React, {Component} from 'react';


/**
 * Shows the option to open existing project/import a project/create a new project
 * with a side list of recent projects
 */
class MainPage extends Component {

    sendMessage = ()=>{
        // The ID of the extension we want to talk to.

// Make a simple request:


    }

    componentDidMount(){

    }


    render() {
        return (
            <div className={"flex max-w-md border border-grey-light"}>
                <div className={"overflow-scroll max-h-md flex-1 border-r border-grey-light"}>
                    <ProjectItem />
                    <ProjectItem />
                    <ProjectItem />
                    <ProjectItem />
                </div>
                <div className={"flex-1 flex p-2 items-center justify-center"}>
                    <div>
                        <button className={"block primary-button mb-4 mt-4"} onClick={this.sendMessage}>Create a new project</button>
                        <button className={"block primary-button"}>Open existing project</button>
                    </div>
                </div>
            </div>
        );
    }
}

function ProjectItem(){
    return <div className={"p-2"}>
        <p>Cipher Chat</p>
        <p className={"text-xs"}>28 requests</p>
    </div>
}


export default MainPage;
