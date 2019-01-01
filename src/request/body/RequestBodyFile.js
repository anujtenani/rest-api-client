import React, {Component} from 'react';
import {connect} from 'react-redux';
import Spinner from "../../components/spinner";
const axios = require('axios');

class RequestBodyFile extends Component {

    state = {
        uploading:false,
        fileId:11,
        originalname:"IMG_20170514_075423.jpg",
        size:361983,
        mimetype:"image/jpg"
    }

    handleFileRef = (ref)=>{
        this.fileRef = ref;
    }

    onUploadClick = ()=>{
        this.fileRef.click();
    }


    onChange = (e)=>{
        if(e.target.files.length > 0) {
            this.setState({uploading:true});
            var formData = new FormData();
            formData.append("file", e.target.files[0]);
            if (this.state.fileId) {
                this.onDelete();
            }
            axios.post('http://localhost:8090/helper/file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(({data}) => {
                const {fileId, originalname, size, mimetype} = data;
                console.log(data);
                this.setState({fileId, originalname, size, mimetype})
            }).finally((e) => {
                this.setState({uploading: false});
            })
        }
    }

    onDelete = (e)=>{
        const {fileId} = this.state
        this.setState({uploading:true});
        axios.delete(`http://localhost:8090/helper/file/${fileId}`)
            .then(({data})=>{
                this.setState({fileId:undefined, originalname: undefined, size: undefined, mimetype: undefined})
            }).finally(()=>{
            this.setState({uploading:false});
        });
    }


    render() {
        const {fileId, uploading, originalname, size, mimetype} = this.state;
        return (
            <div className={"w-full p-2"}>
                {uploading ? <Spinner/> : null }
                {fileId ?
                <FileDetails originalname={originalname} mimetype={mimetype} filesize={size}/>
                    : <div className={"text-center"}>
                        <p>Add a file as binary body</p>
                    </div>
                }
                <input type={"file"} ref={this.handleFileRef} className="hidden" onChange={this.onChange}  />
                <div className={"flex flex-row items-center justify-center mt-4"}>
                    <button className="primary-text mx-2 p-2" onClick={this.onDelete}>Remove file</button>
                    <button className="primary-text mx-2 p-2 rounded bg-grey-darker" onClick={this.onUploadClick}>Choose file</button>
                </div>

            </div>
        );
    }
}

function FileDetails({originalname, mimetype, filesize}){
    return <div className={"flex flex-col"}>
        <div className={"flex flex-row p-2 border-b primary-border"}>
            <p className={"flex-1"}>File name</p>
            <p className={"flex-1"}>{originalname}</p>
        </div>
        <div className={"flex flex-row  p-2 border-b primary-border"}>
            <p className={"flex-1"}>File size</p>
            <p className={"flex-1"}>{filesize} bytes</p>
        </div>
        <div className={"flex flex-row p-2 border-b primary-border"}>
            <p className={"flex-1"}>Mime Type</p>
            <p className={"flex-1"}>{mimetype}</p>
        </div>
    </div>
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
)(RequestBodyFile);
