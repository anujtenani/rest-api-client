import React, {Component} from 'react';

class PreviewIFrame extends Component {

    handleRef = (ref)=>{
//        this.ref = ref;
      //  const iframe = ref.contentWindow || ( ref.contentDocument.document || ref.contentDocument);
       // iframe.document.open();
       // iframe.document.write(this.props.html);
       // iframe.document.close();
    }

    resizeOnLoad = (obj)=>{
        // console.log(obj);
        obj.target.style.height = obj.target.contentWindow.document.body.scrollHeight + 100+'px';
    }

    render() {
        return (
            <iframe frameBorder={"0"} sandbox={"allow-same-origin"} className={"bg-white w-full min-h-64"} scrolling={"no"} srcDoc={this.props.html} ref={this.handleRef} onLoad={this.resizeOnLoad}/>
        );
    }
}

export default PreviewIFrame;
