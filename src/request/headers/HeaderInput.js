import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FiLink, FiMenu, FiStar, FiX} from "react-icons/fi";
import Textarea from "react-textarea-autosize";
import Input from "../../components/Input";
import {actionDeleteHeaderItem, actionUpdateHeaderItem} from "../../redux/headers/headerActions";
import Autocomplete from 'react-autocomplete'
import headerNames from '../../helpers/autocomplete/headers-name';

class HeaderInput extends Component {
    state = {
        description:'',
        autoval:undefined,
        docVisible:false
    }

    onInputChange = (key)=>(e)=>{
        this.setState({[key]:e.target.value})
    }
    onInputBlur = (key)=>(e)=>{
        this.props.updateHeader({[key]: e.target.value})
    }

    toggleDoc = (e)=>{
        this.setState({docVisible: !this.state.docVisible});
    }


    deleteItem = (e)=>{
        this.props.deleteHeader();
    }
    render() {
        const {name, value} = this.props;
        const {docVisible, autoval} = this.state;
        return (
            <div className={"my-2"}>
                <div className="flex flex-row items-center">
                    <Autocomplete
                        getItemValue={(item) => item}
                        items={headerNames}
                        shouldItemRender={(item, value) => item.toLowerCase().indexOf(value.toLowerCase()) > -1}
                        renderItem={(item, isHighlighted) =>
                            <p className={isHighlighted ? 'p-2 secondary-bg primary-text' : 'p-2 primary-bg primary-text'}>
                                {item}
                            </p>
                        }
                        inputProps={{
                            autofocus:true,
                            placeholder:"name",
                            defaultValue:name,
                            onBlur:this.onInputBlur('name'),
                            className:"w-full py-2 border-b primary-border primary-bg primary-text"}}
                        wrapperProps={{className:'flex-1'}}
                        value={autoval !== undefined ? autoval : name}
                        onChange={(e) => this.setState({autoval:e.target.value})}
                        onSelect={(val) => this.setState({autoval:val})}
                    />
                    <Input placeholder={"value"} defaultValue={value} onChange={this.onInputChange('value')} onBlur={this.onInputBlur('value')}/>
                    <button className={"p-2 primary-text"} onClick={this.deleteItem}><FiX/></button>
                    <button className={"p-2 primary-text"} onClick={this.toggleDoc}><FiMenu/></button>
                </div>

                {docVisible ?
                <div className={"my-2 flex flex-row items-center block"}>
                    <Textarea placeholder={"Description"} onBlur={this.onInputBlur('comment')} defaultValue={this.props.comment} class={"flex-1 py-2 border-b  bg-transparent primary-border primary-text"}/>
                </div> : null }
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const {headerId, requestId} = props;
    return {
        ...state.requests.byId[requestId].headers.byId[headerId]
    };
}

function mapDispatchToProps(dispatch, props){
    const {headerId, requestId} = props;
    return {
        updateHeader:(change)=>dispatch(actionUpdateHeaderItem(requestId, headerId, change)),
        deleteHeader:()=>dispatch(actionDeleteHeaderItem(requestId, headerId))
    }
}

export default connect(
    mapStateToProps,mapDispatchToProps
)(HeaderInput);
