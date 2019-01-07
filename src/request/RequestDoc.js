import React, {Component} from 'react';
import {connect} from 'react-redux';

class RequestDoc extends Component {
    render() {
        return (
            <div className={"p-2"}>
                <p>Endpoint</p>
                <p>GET /user/username/gilded</p>

                <OptionsTitle title={"URL"}/>
                <OptionItem name={"username"} comment={"username of the user"}/>

                <OptionsTitle title={"Query"}/>
                <OptionItem name={"username"} comment={"username of the user"}/>
                <OptionItem name={"username"} comment={"username of the user"}/>
                <OptionItem name={"username"} comment={"username of the user"}/>
                <OptionItem name={"username"} comment={"username of the user"}/>
                <OptionItem name={"username"} comment={"username of the user"}/>
                <OptionItem name={"username"} comment={"username of the user"}/>

                    <OptionsTitle title={"Header"}/>
                    <OptionItem name={"username"} comment={"username of the user"}/>
                    <OptionItem name={"username"} comment={"username of the user"}/>
                    <OptionItem name={"username"} comment={"username of the user"}/>
                    <OptionItem name={"username"} comment={"username of the user"}/>
                    <OptionItem name={"username"} comment={"username of the user"}/>
                    <OptionItem name={"username"} comment={"username of the user"}/>
                <OptionsTitle title={"Body"}/>
                <OptionItem name={"username"} comment={"username of the user"}/>
                <OptionItem name={"username"} comment={"username of the user"}/>
                <OptionItem name={"username"} comment={"username of the user"}/>
                <OptionItem name={"username"} comment={"username of the user"}/>
                <OptionItem name={"username"} comment={"username of the user"}/>
                <OptionItem name={"username"} comment={"username of the user"}/>

            </div>
        );
    }
}


function OptionsTitle({title}){
    return <h4>{title}</h4>
}
function OptionItem({name, comment}){
    return <div className={"flex flex-row p-2 border-b primary-border secondary-bg"}>
        <div className={"flex-1"}>
            {name}
        </div>
        <div className={"flex-1"}>
            {comment}
        </div>
    </div>
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    return {
        ... state.requests.byId[requestId]
    };
}

export default connect(
    mapStateToProps,
)(RequestDoc);
