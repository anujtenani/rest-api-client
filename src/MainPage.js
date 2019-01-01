import React, {Component} from 'react';

/**
 * Shows the option to open existing project/import a project/create a new project
 * with a side list of recent projects
 */
class MainPage extends Component {
    render() {
        return (
            <div>
                <button className={"primary-button"}>Create a new project</button>
                <button className={"primary-button"}>Open existing project</button>
            </div>
        );
    }
}

export default MainPage;
