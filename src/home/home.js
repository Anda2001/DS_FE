import React, { Component } from 'react';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import NavBar from "../nav-bar";
import { withRouter } from 'react-router-dom';
import * as API_USERS from "../person/api/person-api";

const backgroundStyle = {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: "100%",
    height: "250px",
    backgroundImage: `url(https://www.npcindia.gov.in/NPC/Images/Competencies/EnergyManagement/banner.png)`
};

const formStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    padding: '20px',
    borderRadius: '5px',
};

class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            user: null
        };
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleUsernameChange = (e) => {
        this.setState({ username: e.target.value });
    }

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value });
    }

    handleLogin = () => {
        //check credentials
        //take credentials email and password, send to login endpoint

        //if success, redirect to home page
        //else display error message
        const userLogin = {
            email: this.state.username,
            password: this.state.password
        }

        API_USERS.login(userLogin, (result, status, err) => {
            if (result !== null && status === 200) {
                console.log("Login successful");
                this.setState({user:result })

                this.props.setUser(result);

                console.log(this.state);
                const role = result.role; // Assuming the role is stored in 'role' field

                // Redirect based on user role
                if (role === "admin") {
                    this.props.history.push('/person');
                } else if (role === "client") {
                    this.props.history.push('/client');
                }
            } else {
                this.setState({
                    errorStatus: status,
                    error: err,
                });
            }
        } );

    }

    render() {
        return (
            <div>
                <NavBar/>
                <div style={backgroundStyle}></div>
                <Container style={{ paddingTop: '100px' }}>
                    <div style={formStyle}>
                        <h1 className="display-4">Energy Management System Login</h1>
                        <Form>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input
                                    type="text"
                                    id="username"
                                    placeholder="Enter your username"
                                    value={this.state.username}
                                    onChange={this.handleUsernameChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={this.state.password}
                                    onChange={this.handlePasswordChange}
                                />
                            </FormGroup>
                            <Button color="primary" onClick={this.handleLogin}>Login</Button>
                        </Form>
                    </div>
                </Container>
            </div>
        );
    }
}

export default withRouter(Login);
