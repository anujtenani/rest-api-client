import React, {Component} from 'react';
import {connect} from 'react-redux';
import {actionDeleteEnvironment, actionUpdateEnvironment} from "../../../redux/env/envActions";
import Input from "../../../components/Input";
import {FiChevronDown, FiCopy, FiEdit, FiTrash} from "react-icons/fi";
import Popup from "../../../components/Popup";

class RenderEnvHeader extends Component {
    state = {
        editMode:false,
    }


    enterEditMode = ()=>{
        console.log('editing');
        this.setState({editMode:true})
    }
    onBlur = (e)=>{
        this.setState({editMode:false});
        this.props.updateEnvName({name: e.target.value});
    }

    handleRef = (popper)=>{
        this.popper = popper
    }

    deleteEnvironment = ()=>{
        this.props.deleteEnvironment();
        this.popper.hide();
    }

    render() {
        const name = this.props.name;
        return (
            <div className={"table-cell border-b primary-border border-t border-r p-1"} style={{minWidth:200}}>
                {this.state.editMode ?
                    <input className={"py-2"} onSubmit={this.onBlur} defaultValue={this.props.name} autoFocus={true} onBlur={this.onBlur}/>
                    :
                    <div onDoubleClick={this.enterEditMode}
                         className={"py-2 justify-between items-center flex flex-row"}>
                        <p className={"font-bold"}>{name}</p>
                        <Popup trigger={<FiChevronDown/>} placement={"bottom-start"} ref={this.handleRef}>
                                <button className={"p-2 text-right"} onClick={this.enterEditMode}><FiEdit />Rename</button>
                                <button className={"p-2 text-right"} onClick={this.deleteEnvironment}><FiTrash />Delete</button>
                                <button className={"p-2 text-right"}><FiCopy />Duplicate</button>
                        </Popup>
                    </div>
                }
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const {envId} = props;
    return {
        name: state.env.envById[envId].name
    };
}
function mapDispatchToProps(dispatch, props){
    const {envId} = props;
    return {
        updateEnvName: (change)=>dispatch(actionUpdateEnvironment(envId, change)),
        deleteEnvironment:()=>dispatch(actionDeleteEnvironment(envId))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(RenderEnvHeader);
