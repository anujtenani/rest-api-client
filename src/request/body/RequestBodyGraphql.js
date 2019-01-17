import React, {Component} from 'react';
import {buildClientSchema, introspectionQuery} from 'graphql';
import {UnControlled as CodeMirror} from "react-codemirror2";
import 'codemirror/lib/codemirror.css';
import 'codemirror/lib/codemirror';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/lint/lint';
import 'codemirror-graphql/hint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/info';
import 'codemirror-graphql/mode';
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets';
import {connect} from 'react-redux';
import {actionUpdateBodyData} from "../../redux/body/bodyActions";
import {sendRequest} from "../../servicehandlers";
import {basicUrlBuilder, buildUrlFromRequestState} from "../../helpers/func";

class RequestBodyGraphql extends Component {

    state = {
        value:undefined,
        myGraphQLSchema: undefined,
    }

    componentDidMount() {
        this.fetchSchema();
//        debounce(this.fetchSchema,  100)
    }

    fetchSchema = ()=>{
        sendRequest(this.props.url, 'POST', {
            'Content-Type': 'application/json',
        }, {
            bodyType:'graphql',
            data: JSON.stringify({query: introspectionQuery})
        }).then((response)=>{
            console.log('schema fetched, got response', response);
            if(response && response.body){
                try{
                    const schema = JSON.parse(response.body);
                    this.setState({myGraphQLSchema: buildClientSchema(schema.data)})
                }catch(e){
                    console.log(e);
                }
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.url !== this.props.url){
            console.log('cdm, calling fetch schema');
            this.fetchSchema()
           // debounce(this.fetchSchema, 2000)
        }
    }


    onChange = (value)=>{
        this.setState({value})
    }

    onFocusChange = (editor, event)=>{
        this.props.updateBody({value:editor.getValue()});
    }

    handleRef = (editor)=>{
        editor.on('inputRead', function onChange(editor, input) {
            if (input.text[0] === ';' || input.text[0] === ' ') { return; }
            editor.execCommand('autocomplete');
        });
    }

    render() {
        const {myGraphQLSchema, value} = this.state;
            return (
                <CodeMirror options={{
                    mode: 'graphql',
                    lint: {
                        schema: myGraphQLSchema
                    },
                    hintOptions: {
                        schema: myGraphQLSchema
                    },
                    extraKeys:{
                        "Ctrl-Space": "autocomplete"
                    },
                    matchBrackets:true,
                    autoRefresh: 2000,
                    lineWrapping:true,
                    lineNumbers:true,
                    autoCloseBrackets:true,
                    gutters: ["CodeMirror-lint-markers"],
                    styleActiveLine: true,
                    indentWithTabs: true,
                    showCursorWhenSelecting: false,
                    viewportMargin:Infinity
                }} editorDidMount={this.handleRef} value={this.props.value || ''} onBlur={this.onFocusChange} /> )
    }
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    const {method} = state.requests.byId[requestId];
    const data = state.requests.byId[requestId].body.data || {}
    return {
        url: basicUrlBuilder(state, requestId),
        method,
        value: data.value
    };
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        updateBody: (data)=> dispatch(actionUpdateBodyData(requestId, data))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(RequestBodyGraphql);
