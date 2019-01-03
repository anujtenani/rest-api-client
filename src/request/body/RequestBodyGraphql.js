import React, {Component} from 'react';
import {buildClientSchema, introspectionQuery} from 'graphql';
import CodeMirror from "react-codemirror";
import 'codemirror/lib/codemirror.css';
import 'codemirror/lib/codemirror';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/lint/lint';
import 'codemirror-graphql/hint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/info';
// import 'codemirror-graphql/jump';
import 'codemirror-graphql/mode';
// import 'codemirror-graphql/variables/lint';
// import 'codemirror-graphql/variables/mode';
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets';
import {connect} from 'react-redux';
import {actionUpdateBodyData, actionUpdateBodyItem} from "../../redux/body/bodyActions";
import {sendRequest} from "../../servicehandlers";
import {buildUrlFromRequestState} from "../../helpers/func";
import debounce from 'lodash.debounce';

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

    onFocusChange = (focused)=>{
        if(!focused){
            this.props.updateBody(this.state.value)
        }
    }

    handleRef = (ref)=>{
        this.cm = ref;
        this.cm.getCodeMirror().on('inputRead', function onChange(editor, input) {
            if (input.text[0] === ';' || input.text[0] === ' ') { return; }
            editor.execCommand('autocomplete');
        });
    }

    render() {
        const {myGraphQLSchema, value} = this.state;
            return (
                <CodeMirror  ref={this.handleRef} options={{
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
                }} value={value} onChange={this.onChange} onFocusChange={this.onFocusChange} defaultValue={this.props.value} /> )
    }
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    const {url, qs, method} = state.requests.byId[requestId];
    return {
        url: buildUrlFromRequestState(url, qs),
        method,
        value: state.requests.byId[requestId].body.data
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
