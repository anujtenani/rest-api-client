import React, {Component} from 'react';
import RequestBodyText from "./RequestBodyText";
import RequestBodyForm from "./RequestBodyForm";
import {connect} from 'react-redux';
import {actionChangeBodyType} from "../../redux/body/bodyActions";
import Loadable from 'react-loadable';
import Spinner from "../../components/spinner";
import Modal from 'react-modal';
import ModalContainer from "../../components/ModalContainer";
Modal.setAppElement('#root');

const RequestBodyJson = Loadable({
    loader: () => import('./RequestBodyJson'), //why ?  because JSHINT for JSONLinting is a huge dependency
    loading: ()=><Spinner/>,
});

const RequestBodyGraphQL = Loadable({
    loader : ()=>import('./RequestBodyGraphql'),
    loading: ()=><Spinner/>
})

class BodyComponent extends Component{

    state = {
        modalIsOpen: false
    }

    onChangeBodyType = (e)=>{
        //TODO ideally confirm if we want to change the body type;
        this.props.updateBodyType(e.target.value);
        this.setState({modalIsOpen:true});
    }

    openModal = ()=> {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal = ()=> {
        // references are now sync'd and can be accessed.
       // this.subtitle.style.color = '#f00';
    }

    closeModal = ()=> {
        this.setState({modalIsOpen: false});
    }

    render(){
        const {bodyType, requestId} = this.props;
        return <div className={"p-2"}>
            <select onChange={this.onChangeBodyType}
                    value={bodyType}
                    className={"mb-2"}>
                <option value={"nobody"}>No Body</option>
                <option value={"form"}>Form URL-Encoded</option>
                <option value={"multipart"}>Multipart Form Data</option>
                <option value={"text"}>Text</option>
                <option value={"json"}>JSON</option>
                <option value={"binary"}>Binary / File</option>
                <option value={"graphql"}>GraphQL</option>

            </select>
            <div>
                {bodyType === "json" ? <RequestBodyJson requestId={requestId}/> : null }
                {bodyType === "form" ? <RequestBodyForm requestId={requestId}/> : null }
                {bodyType === "file" ? <RequestBodyForm requestId={requestId}/> : null }
                {bodyType === "text" ? <RequestBodyText requestId={requestId}/> : null }
                {bodyType === "multipart" ? <RequestBodyForm requestId={requestId} /> : null }
                {bodyType === "graphql" ? <RequestBodyGraphQL requestId={requestId}/> : null }
            </div>
            <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                style={{content: {
                        border: '0',
                        borderRadius: '4px',
                        bottom: 'auto',
                        minHeight: '10rem',
                        left: '50%',
                        padding: '2rem',
                        position: 'fixed',
                        right: 'auto',
                        top: '50%',
                        background:'transparent',
                        transform: 'translate(-50%,-50%)',
                        minWidth: '20rem',
                        width: 'auto',
                        maxWidth: '60rem',
                    }, overlay:{
                        zIndex:2000
                    }
                }}
                onRequestClose={this.closeModal}
                contentLabel="Change body type ?">
                <ModalContainer onRequestClose={this.closeModal}>
                    <h4 className={"mb-4"}>Change Body Type</h4>
                    <p className={"mb-4"}>Changing the body type will override the current body data</p>
                    <div className={"flex flex-row justify-end items-center"}>
                        <button className={"px-4 py-2 text-red-dark"} onClick={this.closeModal}>Change</button>
                        <button className={"px-4 py-2"} onClick={this.closeModal}>Cancel</button>
                    </div>
                </ModalContainer>
            </Modal>
        </div>
    }
}



function mapStateToProps(state, props){
    const {requestId} = props
    return {
        requestId,
        bodyType: state.requests.byId[requestId].body.bodyType
    }
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        updateBodyType:(bodyType)=>dispatch(actionChangeBodyType(requestId, bodyType))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BodyComponent)
