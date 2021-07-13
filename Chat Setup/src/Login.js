import { Button } from '@material-ui/core';
import React from 'react';
import './Login.css';
import {auth,provider} from './firebase';
import { actionTypes } from './reducer';
import { useStateValue } from './StateProvider';
import db from './firebase';


function Login() {
    const [{},dispatch] = useStateValue();
    // Google authentication 
    const signIn = () => {
        auth
            .signInWithPopup(provider)
            .then((result) => {
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user,
                })
        })
        .catch((error) => alert(error.message));
    }
    return (
        <div className="login">
           <div className="login_container">
                <div className="login_text">
                    <h1 className= 'connect'>Connect</h1>
                </div>
                <Button type="submit" onClick={signIn}>Sign in With Google</Button>
           </div>
        </div>
    );
}

export default Login

