import React, {Component} from 'react';
import {connect} from 'react-redux';
import Label from "../components/Label";
import Input from "../components/Input";
import ClientOAuth2 from "./ClientOAuth2";
import {openOauthTab} from "../servicehandlers/ChromeWrapper";
import {actionUpdateRequest} from "../redux/requestActions";
import {actionCreateResponseHistory} from "../redux/history/historyActions";
import ExpandablePanel from "../components/ExpandablePanel";
import {FiPlay} from "react-icons/fi";

class BuildOAuth2 extends Component {

    /*
    state = {
        clientId: '4YK3YUMcHGsdcQ',
        clientSecret: 'OyvmGr-LFLG0Vd28IpQ1z43z3ko',
        accessTokenUri: 'https://www.reddit.com/api/v1/access_token',
        authorizationUri: 'https://www.reddit.com/api/v1/authorize',
        redirectUri: 'http://cbco.in:3000/callback',
        scopes: 'identity save',
        query:''
    }
    */

    saveToken = (result)=>{
        const {accessToken, refreshToken, expires, tokenType} = result;
        this.props.insertHistory({body : JSON.stringify(result.data), oauth:{accessToken, refreshToken, expires, tokenType}});
    }

    getQueryObject = (query, state)=>{
        let queryObj = {};
        if(query) {
            query.split("&").forEach((item) => {
                const parts = item.split("=");
                queryObj[parts[0]] = parts[1];
            })
        }
        console.log(query, state);
        if(state) queryObj['state'] = state;
        return queryObj;
    }

    launchAuthPopup = async ()=>{
        const {clientId, clientSecret, accessTokenUri, authorizationUri, redirectUri, scopes, query, authType, username, password, state} = this.props;
        if(!clientId){
            return;
        }

        this.oauth = new ClientOAuth2({
            clientId, clientSecret, accessTokenUri, authorizationUri, redirectUri,
            scopes: scopes ? scopes.split(",").map((item)=> { item.trim(); return item}).join(" ") : undefined,
        });

      //  try {
            switch (authType) {
                case "implicit": {
                    const uri = this.oauth.token.getUri({query: this.getQueryObject(query, state)});
                    await openOauthTab(uri, redirectUri)
                        .then((url) => {
                            if (url.error) {
                                throw new Error(url.error);
                            }
                            return this.oauth.token.getToken(url);
                        }).then(this.saveToken);
                    break;
                }
                case "clientCredentials": {
                    await  this.oauth.credentials.getToken().then(this.saveToken);
                    break;
                }
                case "ropc": {
                    await  this.oauth.owner.getToken(username, password)
                        .then(this.saveToken);
                    break;
                }
                case "code":
                default: {
                    const uri = this.oauth.code.getUri({query: this.getQueryObject(query, state)});
                    await  openOauthTab(uri, redirectUri)
                        .then((url) => {
                            if (url.error) {
                                throw new Error(url.error);
                            }
                            return this.oauth.code.getToken(url);
                        }).then(this.saveToken);
                    break;
                }
            }
       // }catch(e){
       //     console.log(e);
       // }

    }


    onInput = (statekey)=>(e)=>{
        this.props.updateOauthRequest({[statekey]: e.target.value});
    }

    handleSelectChange = (e)=>{
        this.props.updateOauthRequest({authType: e.target.value});
    }



    render() {
        const {clientId, clientSecret, redirectUri, authorizationUri, accessTokenUri, scopes, query, authType} = this.props
        return (
            <div className={"p-2"}>
                <div className={"flex flex-row items-center justify-between mb-2"}>
                <select value={authType} onChange={this.handleSelectChange}>
                    <option value={"code"}>Authorization Code</option>
                    <option value={"implicit"}>Implicit</option>
                    <option value={"clientCredentials"}>Client Credentials</option>
                    <option value={"ropc"}>Resource Owner Password Credentials</option>
                </select>
                    <button onClick={this.launchAuthPopup} className={"primary-button"}>
                        <FiPlay /> Authenticate
                    </button>
                </div>
                {!authType || authType === "code" ? <AuthorizationCode {...this.props} onInput={this.onInput}/> : null }
                {authType === "implicit" ? <ImplicitGrant {...this.props} onInput={this.onInput}/> : null }
                {authType === "clientCredentials" ? <ClientCredentials {...this.props} onInput={this.onInput}/> : null }
                {authType === "rops" ? <ResourceOwnerCreds {...this.props} onInput={this.onInput}/> : null }

            </div>
        );
    }
}

function ResourceOwnerCreds({username, password, accessTokenUri, clientId, clientSecret, scopes, onInput}){
    return <React.Fragment>
        <div className={"mb-2"}>
            <Label>Username</Label>
            <Input placeholder={"Client ID"} defaultValue={clientId} onBlur={onInput('username')} />
        </div>
        <div className={"mb-2"}>
            <Label>Password</Label>
            <Input placeholder={"Client Secret"} defaultValue={clientSecret} onBlur={onInput('password')} />
        </div>
        <div className={"mb-2"}>
            <Label>Client ID</Label>
            <Input placeholder={"Client ID"} defaultValue={clientId} onBlur={onInput('clientId')} />
        </div>
        <div className={"mb-2"}>
            <Label>Client Secret</Label>
            <Input placeholder={"Client Secret"} defaultValue={clientSecret} onBlur={onInput('clientSecret')} />
        </div>
        <div className={"mb-2"}>
            <Label>Access Token URI</Label>
            <Input placeholder={"Access Token URI"} defaultValue={accessTokenUri} onBlur={onInput('accessTokenUri')} />
        </div>
        <div className={"mb-2"}>
            <Label>Scopes</Label>
            <Input placeholder={"Scopes"} defaultValue={scopes} onBlur={onInput('scopes')} />
        </div>
    </React.Fragment>
}

function ClientCredentials({accessTokenUri, clientId, clientSecret, scopes, onInput}){
    return <React.Fragment>
        <div className={"mb-2"}>
            <Label>Client ID</Label>
            <Input placeholder={"Client ID"} defaultValue={clientId} onBlur={onInput('clientId')} />
        </div>
        <div className={"mb-2"}>
            <Label>Client Secret</Label>
            <Input placeholder={"Client Secret"} defaultValue={clientSecret} onBlur={onInput('clientSecret')} />
        </div>
        <div className={"mb-2"}>
            <Label>Access Token URI</Label>
            <Input placeholder={"Access Token URI"} defaultValue={accessTokenUri} onBlur={onInput('accessTokenUri')} />
        </div>
        <div className={"mb-2"}>
            <Label>Scopes</Label>
            <Input placeholder={"Scopes"} defaultValue={scopes} onBlur={onInput('scopes')} />
        </div>
    </React.Fragment>
}

function ImplicitGrant({clientId, authorizationUri, scopes,state, redirectUri,query, onInput}){
    return <React.Fragment>
        <div className={"mb-2"}>
            <Label>Client ID</Label>
            <Input placeholder={"Client ID"} defaultValue={clientId} onBlur={onInput('clientId')} />
        </div>
        <div className={"mb-2"}>
            <Label>Authorization URI</Label>
            <Input placeholder={"Authorization URI"} defaultValue={authorizationUri} onBlur={onInput('authorizationUri')} />
        </div>
        <div className={"mb-2"}>
            <Label>Redirect URI</Label>
            <Input placeholder={"Redirect URI"} defaultValue={redirectUri} onBlur={onInput('redirectUri')} />
        </div>
        <div className={"mb-2"}>
            <Label>Scopes</Label>
            <Input placeholder={"Scopes"} defaultValue={scopes} onBlur={onInput('scopes')} />
        </div>
        <ExpandablePanel title={"Advanced"} defaultState={"close"}>
            <div className={"mb-2"}>
                <Label>Query params (optional)</Label>
                <Input placeholder={"Query"} defaultValue={query} onBlur={onInput('query')} />
            </div>
            <div className={"mb-2"}>
                <Label>State</Label>
                <Input placeholder={"State"} defaultValue={state} onBlur={onInput('state')} />
            </div>
        </ExpandablePanel>

    </React.Fragment>
}


function AuthorizationCode({clientId, clientSecret, redirectUri, authorizationUri, accessTokenUri, scopes, state, query, onInput}){
    return <React.Fragment>
        <div className={"mb-2"}>
            <Label>Client ID</Label>
            <Input placeholder={"Client ID"} defaultValue={clientId} onBlur={onInput('clientId')} />
        </div>
        <div className={"mb-2"}>
            <Label>Client Secret</Label>
            <Input placeholder={"Client Secret"} defaultValue={clientSecret} onBlur={onInput('clientSecret')} />
        </div>
        <div className={"mb-2"}>
            <Label>Redirect URI</Label>
            <Input placeholder={"Redirect URI"} defaultValue={redirectUri} onBlur={onInput('redirectUri')} />
        </div>
        <div className={"mb-2"}>
            <Label>Authorization URI</Label>
            <Input placeholder={"Authorization URI"} defaultValue={authorizationUri} onBlur={onInput('authorizationUri')} />
        </div>
        <div className={"mb-2"}>
            <Label>Access Token URI</Label>
            <Input placeholder={"Access Token URI"} defaultValue={accessTokenUri} onBlur={onInput('accessTokenUri')} />
        </div>

            <div className={"mb-2"}>
                <Label>Scopes</Label>
                <Input placeholder={"Scopes"} defaultValue={scopes} onBlur={onInput('scopes')} />
            </div>
        <ExpandablePanel title={"Advanced"} defaultState={"close"}>
            <div className={"mb-2"}>
                <Label>Query params (optional)</Label>
                <Input placeholder={"Query"} defaultValue={query} onBlur={onInput('query')} />
            </div>
            <div className={"mb-2"}>
                <Label>State</Label>
                <Input placeholder={"State"} defaultValue={state} onBlur={onInput('state')} />
            </div>
        </ExpandablePanel>
    </React.Fragment>
}


function mapStateToProps(state, props) {
    const {requestId} = props;
    return {
        ...state.requests.byId[requestId]
    };
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        updateOauthRequest:(change)=>dispatch(actionUpdateRequest(requestId, change)),
        insertHistory:(history)=>dispatch(actionCreateResponseHistory(requestId, history))
    }

}

export default connect(
    mapStateToProps, mapDispatchToProps
)(BuildOAuth2);
