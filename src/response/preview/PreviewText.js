import React, {Component} from 'react';

export default class PreviewText extends Component {

    render() {
        return (
            <div>
                <pre>
                    {JSON.stringify(this.props.responseBody, null, 2)}
                </pre>
            </div>
        );
    }
}
