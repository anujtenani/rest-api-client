import React, {Component} from 'react';
import TabGeneral from "./info/TabGeneral";
import TabHeaders from "./info/TabResponseHeaders";
import TabRequestHeaders from "./info/TabRequestHeaders";
import TabResponse from "./info/TabResponse";

class ResponseSuccess extends Component {
    state = {
        showPanel:"response",
    }

    render() {
        const {showPanel} = this.state;
        const {historyId, requestId} = this.props;
        return (
            <div>
                <ResponsePanelHeading onChange={(val)=>this.setState({showPanel:val})}/>
                {showPanel === "info" ?
                    <div>
                        <TabGeneral requestId={requestId} historyId={historyId}/>
                        <TabHeaders requestId={requestId} historyId={historyId}/>
                        <TabRequestHeaders requestId={requestId} historyId={historyId} />
                    </div> :
                    <TabResponse requestId={requestId} historyId={historyId}/>
                }
            </div>
        );
    }
}

/*
function TabResponseTiming(){
    return <TabResponseTiming requestId={requestId} historyId={historyId} />
}
*/

function ResponsePanelHeading({onChange}){
    return <ul className="list-reset flex flex-row justify-around items-center">
        <OptionItem title={"Response"} requestId={"1"} onClick={()=>onChange('response')}/>
        <OptionItem title={"Info"} requestId={"1"}  onClick={()=>onChange('info')}/>
    </ul>
}

function OptionItem({title, onClick}){
    return <li className={"flex-1"}>
        <button onClick={onClick} className={'w-full text-center font-sm py-2 primary-button'}>{title}</button></li>
}


export default ResponseSuccess;
