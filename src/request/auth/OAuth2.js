import React, {Component} from 'react';
import ClientOAuth2 from 'client-oauth2';
import Input from "../../components/Input";
import {openOauthTab} from "../../servicehandlers/ChromeWrapper";
import Label from "../../components/Label";

class OAuth2 extends Component {
    googleAuth;
    externalWindow;
    codeCheck;

    state = {
        clientId: '4YK3YUMcHGsdcQ',
        clientSecret: 'OyvmGr-LFLG0Vd28IpQ1z43z3ko',
        accessTokenUri: 'https://www.reddit.com/api/v1/access_token',
        authorizationUri: 'https://www.reddit.com/api/v1/authorize',
        redirectUri: 'http://cbco.in:3000/callback',
        scopes: 'identity save',
        query:''
    }

    launchAuthPopup = ()=>{
        const {clientId, clientSecret, accessTokenUri, authorizationUri, redirectUri, scopes, query} = this.state;
        this.googleAuth = new ClientOAuth2({
            clientId, clientSecret, accessTokenUri, authorizationUri, redirectUri, scopes
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
    onClose = () => {
        console.log('window closed');
    }

    onCode = (code,params) => {
        console.log(code, params);
    }
    componentWillUnmount() {
        if (this.externalWindow) {
            this.externalWindow.close();
        }
    }

    onInput = (statekey)=>(e)=>{
        this.setState({[statekey]:e.target.value});
    }


    render() {
        return (
            <div className={"p-2"}>
                <div className={"mb-2"}>
                    <Label>Client ID</Label>
                    <Input placeholder={"Client ID"} value={this.state.clientId} onChange={this.onInput('clientId')} />
                </div>
                <div className={"mb-2"}>
                    <Label>Client Secret</Label>
                    <Input placeholder={"Client Secret"} value={this.state.clientSecret} onChange={this.onInput('clientSecret')} />
                </div>
                <div className={"mb-2"}>
                    <Label>Redirect URI</Label>
                    <Input placeholder={"Redirect URI"} value={this.state.redirectUri} onChange={this.onInput('redirectUri')} />
                </div>
                <div className={"mb-2"}>
                    <Label>Authorization URI</Label>
                    <Input placeholder={"Authorization URI"} value={this.state.authorizationUri} onChange={this.onInput('authorizationUri')} />
                </div>
                <div className={"mb-2"}>
                    <Label>Access Token URI</Label>
                    <Input placeholder={"Access Token URI"} value={this.state.accessTokenUri} onChange={this.onInput('accessTokenUri')} />
                </div>
                <div className={"mb-2"}>
                    <Label>Scopes</Label>
                    <Input placeholder={"Scopes"} value={this.state.scopes} onChange={this.onInput('scopes')} />
                </div>
                <div className={"mb-2"}>
                    <Label>Query params (optional)</Label>
                    <Input placeholder={"Query"} value={this.state.query} onChange={this.onInput('query')} />
                </div>
                <button onClick={this.launchAuthPopup}>Test oAuth Popup</button>
            </div>
        );
    }
}

export default OAuth2;
