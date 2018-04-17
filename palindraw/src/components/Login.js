
import React, { Component } from "react"
import base, { auth } from "../re-base.js"
import "../css/Login.css"

class Login extends Component {

    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            firstNameValue: "",
            lastNameValue: "",
            emailAddressValue: "",
            passwordValue: "",
            usernameValue: "",
            errorText: "",
        }
    }

    // On first name change
    changeFirstName = (event) => {
        this.setState({firstNameValue: event.target.value});
    }

    // On last name change
    changeLastName = (event) => {
        this.setState({lastNameValue: event.target.value});
    }

    // On email address change
    changeEmailAddress = (event) => {
        this.setState({emailAddressValue: event.target.value});
    }

    // On password change
    changePassword = (event) => {
        this.setState({passwordValue: event.target.value});
    }

    // On username change
    changeUsername = (event) => {
        this.setState({usernameValue: event.target.value})
    }

    // Checks to see if string is valid email address
    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Handle create account button clicked
    createAccount = (event) => {
        if (this.state.emailAddressValue === "" && this.validateEmail(this.state.emailAddressValue)) {
            this.setState({errorText: "Email address is poorly formatted"});
            return;
        }
        if (this.state.passwordValue === "") {
            this.setState({errorText: "Password is poorly formatted"});
            return;
        }
        auth.createUserWithEmailAndPassword(this.state.emailAddressValue, this.state.passwordValue)
        .then((user) => {
            const dataUser = {
                uid: user.uid,
                email: this.state.emailAddressValue
            }
            this.initializeUser(dataUser);
            this.props.setUser(dataUser);
            this.props.goToUrl("/");
        })
        .catch((error) => {
            this.setState({errorText: error.message});
        });
    }

    // Initializes user in firebase
    initializeUser = (user) => {
        base.post(`users/${user.uid}`, {
            data: user
        });
    }

    // Mandatory render method
    render() {
        return (
            <div>
                <input type="text" placeholder="Email address" 
                onChange={this.changeEmailAddress} value={this.emailAddressValue} />
                <input type="text" placeholder="Password" 
                onChange={this.changePassword} value={this.passwordValue} />
                <div>
                    <button onClick={this.createAccount}>Sign up</button>
                    <button>Log in</button>
                </div>
            </div>
        )
    }
}

export default Login