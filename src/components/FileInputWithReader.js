import React, {Component} from 'react';

class FileInputWithReader extends Component {

    readSingleFile =(evt)=> {
        //Retrieve the first (and only!) File from the FileList object
        var myFile = evt.target.files[0];
        var reader = new FileReader();
        reader.readAsText(myFile);
        reader.onload = ()=>{
            this.props.onFile(reader.result);
        }
    }

    render() {
        return (
            <div>
                <input type={"file"} onChange={this.readSingleFile} />
            </div>
        );
    }
}

export default FileInputWithReader;
