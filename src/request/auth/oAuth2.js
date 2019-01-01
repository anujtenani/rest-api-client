import React, {Component} from 'react';
import ClientOAuth2 from 'client-oauth2';

class oAuth2 extends Component {
    googleAuth;
    externalWindow;
    codeCheck;


    launchAuthPopup = ()=>{
        const GoogleClientID = '451858572921-kkvj1a5b2pqrfq63rekdl1r0um90ugvt.apps.googleusercontent.com';
        const gauth = {
            clientId: GoogleClientID,
            clientSecret:'H7XiLUu_C5UxbxNvYrDaixvq',
            accessTokenUri:'https://www.googleapis.com/oauth2/v4/token',
            authorizationUri: 'https://accounts.google.com/o/oauth2/v2/auth',
            redirectUri: 'http://localhost:3000',
            scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
        };
        this.googleAuth = new ClientOAuth2(gauth);
        //window.location = this.googleAuth.token.getUri();
        this.externalWindow = window.open(
            this.googleAuth.code.getUri({query:{
                access_type: 'offline',
                approval_prompt: "force",
            }}),
            `width=400,height=600`
        );
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


    render() {
        return (
            <div>
                <button onClick={this.launchAuthPopup}>Test oAuth Popup</button>
            </div>
        );
    }
}

export default oAuth2;
