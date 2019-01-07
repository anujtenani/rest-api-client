import React, {Component} from 'react';
import ModalContainer from "./ModalContainer";
import Modal from "react-modal";

class ModalComponent extends Component{

    state = {
        modalIsOpen: true
    }

    openModal = ()=> {
        this.setState({modalIsOpen: true});
    }

    closeModal = ()=> {
        this.setState({modalIsOpen: false});
    }

    render(){
        return  <Modal
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
                    width: this.props.fullWidth ? '100%' : 'auto',
                }, overlay:{
                    zIndex:2000,
                    backgroundColor:'rgba(0,0,0,0.1)'
                }
            }}
            onRequestClose={this.closeModal}
            contentLabel="Change body type ?">
            <ModalContainer onRequestClose={this.closeModal}>
                {this.props.children}
            </ModalContainer>
        </Modal>
    }
}


ModalComponent.propTypes = {
    fullWidth:false
}


ModalComponent.defaultProps = {
    fullWidth:true
}

export default ModalComponent
