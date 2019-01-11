import React, {Component} from 'react';
import {connect} from 'react-redux';
import {actionUpdateBodyData} from "../../redux/body/bodyActions";
import {FiX} from "react-icons/fi";

class RequestBodyFile extends Component {

    handleFileRef = (ref)=>{
        this.fileref = ref;
    }

    onFile = (e)=>{
        const file = e.target.files[0];
        console.log(file);
        const {name, size} = file;
        const freader = new FileReader();
        freader.onloadend = (data)=>{
            this.props.updateBody({name, size, uri: freader.result});
        };
        freader.readAsDataURL(file);
    }

    removeBinaryFile = ()=>{
        this.props.updateBody(null)
    }

    handleButtonClick = (e)=>{
        this.fileref.click();
    }

    render() {
        const {data} = this.props;
        if(data && data.name){
           return (<div className={"flex rounded flex-row p-4 relative primary-border border items-center justify-center"}>
                <div className={"px-2"}>
                    <p>{data.name}</p>
                    <small>{data.size}</small>
                </div>
                <div>
                    <button className={"p-2 absolute pin-t pin-r"} onClick={this.removeBinaryFile}>
                        <FiX width={36} height={36} />
                    </button>
                </div>
            </div>)
        }
        return (
            <div className={"rounded flex flex-row items-center justify-center primary-border border p-4 border-dashed flex items-center"}>
                <button onClick={this.handleButtonClick}>Select file</button>
                <input type={"file"} onChange={this.onFile} className={"hidden"} ref={this.handleFileRef} />
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    const data = state.requests.byId[requestId].body.data || {}
    return {
        data: data
    };
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        updateBody:(data)=>dispatch(actionUpdateBodyData(requestId, data))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(RequestBodyFile);
