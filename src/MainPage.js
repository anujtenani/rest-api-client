import React, {Component} from 'react';
import shortId from 'shortid';
import {getItem, setItem} from "./servicehandlers";
import DocumentTitle from 'react-document-title';

/**
 * Shows the option to open existing project/import a project/create a new project
 * with a side list of recent projects
 */
class MainPage extends Component {

    state = {
        projects:[]
    }

    createProject = ()=>{
        // The ID of the extension we want to talk to.
        // Make a simple request:
        const id = shortId.generate();
        getItem('projects').then((e)=>{
            if(!e) e = [];
            else e = JSON.parse(e);
            e.push({id, name:'My Project'});
            setItem('projects', e);
            document.location = `/p/${id}`;
        });
    }

    componentDidMount(){
        getItem('projects').then((res)=>{
            if(res) this.setState({projects: JSON.parse(res)})
        })
    }


    render() {
        return (
            <div className={"main flex secondary-bg h-screen w-full flex-row justify-center items-center"}>
                <DocumentTitle title={"My Projects"}>
                    <div>
                        <div className={"flex primary-bg p-4 shadow-md rounded overflow-hidden"}>
                            <div className={"overflow-scroll w-64 flex-1 border-r primary-border"}>
                            {this.state.projects.map((project, index)=>{
                                return <ProjectItem {...project} key={index} />
                            })}
                            </div>
                            <div className={"flex-1 w-64 flex p-2 items-center flex-col justify-center"}>
                                    <button className={"primary-button mb-2 mt-2"} onClick={this.createProject}>Create a new project</button>

                                    <p className={"text-lg"}>OR</p>
                                    <div className={"mb-2 mt-2 text-center flex flex-col items-center"}>
                                        <button className={"primary-button"}>Open existing project</button>
                                    </div>
                            </div>
                        </div>
                        <p className={"block text-center text-xs mt-2 opacity-50 secondary-text leading-tight "}>supports HAR, RestApe, Postman, Insomnia and Swagger</p>
                    </div>
                </DocumentTitle>
            </div>
        );
    }
}

function ProjectItem({id, name}){
    return  <a  href={`/p/${id}`} tabIndex={1} className={"list-item block p-2  no-underline appearance-none"}>{name}</a>
}


export default MainPage;
