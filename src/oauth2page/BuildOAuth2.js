import React, {Component} from 'react';
import {connect} from 'react-redux';
import Label from "../components/Label";
import Input from "../components/Input";
import ClientOAuth2 from "client-oauth2";
import {openOauthTab} from "../servicehandlers/ChromeWrapper";
import {actionUpdateRequest} from "../redux/requestActions";
import {actionCreateResponseHistory} from "../redux/history/historyActions";

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

    launchAuthPopup = ()=>{
        const {clientId, clientSecret, accessTokenUri, authorizationUri, redirectUri, scopes, query} = this.props;
        this.googleAuth = new ClientOAuth2({
            clientId, clientSecret, accessTokenUri, authorizationUri, redirectUri, scopes: scopes.split(",").map((item)=> { item.trim(); return item}).join(" ")
        });
        const queryObj ={};
        query.split("&").forEach((item)=>{
            const parts = item.split("=");
            queryObj[parts[0]] = parts[1];
        })
        const uri =  this.googleAuth.code.getUri({query:queryObj});
        openOauthTab(uri, redirectUri)
            .then((url)=>{
                if(url.error){
                    throw new Error(url.error);
                }
                return this.googleAuth.code.getToken(url);
            }).then((result)=>{
                const {accessToken, refreshToken, expires, tokenType} = result;
                this.props.insertHistory({body : JSON.stringify(result.data), oauth:{accessToken, refreshToken, expires, tokenType}});
            console.log('result', result);
        }).catch((e)=>{
            console.log('got error', e);
        });


        /*
        const googleQuery = {
            access_type: 'offline',
            approval_prompt: "force",
        };
        */
        //window.location = this.googleAuth.token.getUri();
        /*
        this.externalWindow = window.open(uri, `width=400,height=600`);
        this.externalWindow.onbeforeunload = () => {
            this.onClose();
            clearInterval(this.codeCheck);
        };
        this.codeCheck = setInterval(async () => {
            try {
                console.log(this.externalWindow);
                if(this.externalWindow.closed){
                    clearInterval(this.codeCheck);
                    return;
                }
                console.log(this.externalWindow.location);
                const params = new URL(this.externalWindow.location.href).searchParams;
                const token = await this.googleAuth.code.getToken(this.externalWindow.location.href);
                if(!token) return;
                clearInterval(this.codeCheck);
                this.onCode(token, params);
                this.externalWindow.close();
            }
            catch (e) {
                console.log(e);
            }
        }, 200);
        */

    }


    onInput = (statekey)=>(e)=>{
        this.props.updateOauthRequest({[statekey]: e.target.value});
    }


    render() {
        const {clientId, clientSecret, redirectUri, authorizationUri, accessTokenUri, scopes, query} = this.props
        return (
            <div className={"p-2"}>
                <div className={"mb-2"}>
                    <Label>Client ID</Label>
                    <Input placeholder={"Client ID"} defaultValue={clientId} onBlur={this.onInput('clientId')} />
                </div>
                <div className={"mb-2"}>
                    <Label>Client Secret</Label>
                    <Input placeholder={"Client Secret"} defaultValue={clientSecret} onBlur={this.onInput('clientSecret')} />
                </div>
                <div className={"mb-2"}>
                    <Label>Redirect URI</Label>
                    <Input placeholder={"Redirect URI"} defaultValue={redirectUri} onBlur={this.onInput('redirectUri')} />
                </div>
                <div className={"mb-2"}>
                    <Label>Authorization URI</Label>
                    <Input placeholder={"Authorization URI"} defaultValue={authorizationUri} onBlur={this.onInput('authorizationUri')} />
                </div>
                <div className={"mb-2"}>
                    <Label>Access Token URI</Label>
                    <Input placeholder={"Access Token URI"} defaultValue={accessTokenUri} onBlur={this.onInput('accessTokenUri')} />
                </div>
                <div className={"mb-2"}>
                    <Label>Scopes</Label>
                    <Input placeholder={"Scopes"} defaultValue={scopes} onBlur={this.onInput('scopes')} />
                </div>
                <div className={"mb-2"}>
                    <Label>Query params (optional)</Label>
                    <Input placeholder={"Query"} defaultValue={query} onBlur={this.onInput('query')} />
                </div>

                <button onClick={this.launchAuthPopup}>Test oAuth Popup</button>
            </div>
        );
    }
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
