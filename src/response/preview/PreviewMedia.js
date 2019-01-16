import React, {Component} from 'react';
import {connect} from 'react-redux';
import prettyBytes from 'pretty-bytes';

class PreviewMedia extends Component {
    state = {
        width:0,
        height:0
    }

    showWidthAndHeight = (e)=>{
        this.setState({width:e.target.naturalWidth, height:e.target.naturalHeight});
    }


    render() {
        const {width, height} = this.state;
        const {contentLength} = this.props;
        return (
            <div>
                <p className={"mb-2 text-center text-sm secondary-bg"}>
                    {width}x{height} - {prettyBytes(Number(contentLength))}
                 </p>
                <img src={this.props.responseBody} onLoad={this.showWidthAndHeight} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
}

export default connect(
    mapStateToProps,
)(PreviewMedia);
