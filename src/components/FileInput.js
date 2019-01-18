import React, {Component} from 'react';
import Spinner from "./spinner";
import PropTypes from 'prop-types';

class FileInput extends Component {

    state = {
        file:undefined,
        uploading:false,
        fileId:false,
        originalname:undefined,
        size:undefined,
        mimetype:undefined
    }


    handleFileRef = (ref)=>{
        this.fileRef = ref;
    }


    onUploadClick = ()=>{
        this.fileRef.click();
    }

    readFile = (evt)=>{
        var myFile = evt.target.files[0];
        console.log(myFile);
        const {name, size, type} = myFile;
        var reader = new FileReader();
        reader.readAsDataURL(myFile);
        this.setState({uploading:true});
        reader.onload = ()=> {
            const data = reader.result;
            this.setState({uploading:false});
            this.props.onChange({name, size, type, data});
//          this.props.onFile(reader.result);
        }
    }


    /*
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
        const {fileId} = this.state;
        this.setState({uploading:true});
        axios.delete(`http://localhost:8090/helper/file/${fileId}`)
            .then(({data})=>{
                this.setState({fileId:undefined, originalname: undefined, size: undefined, mimetype: undefined})
            }).finally(()=>{
                this.setState({uploading:false});
            });
    }
    */

    render() {
        const {uploading} = this.state;
        const {fileName} = this.props;
        return (
            <div className="flex flex-1">
                {uploading ? <Spinner/> : null }
                <button className="primary-text" onClick={this.onUploadClick}>
                    <span>{fileName ? fileName : 'Choose file'}</span>
                </button>
                <input type={"file"} ref={this.handleFileRef} className="hidden" onChange={this.readFile}  />
            </div>
        );
    }
}

export default FileInput;

FileInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    fileName: PropTypes.string
}
