import React from 'react';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import {
    Button,
    Card,
    CardHeader,
    Col,
    Modal,
    ModalBody,
    ModalHeader,
    Row
} from 'reactstrap';

import NavBar from "../nav-bar";
import DeviceClientTable from "./components/device-table";
import * as API_DEVICES from "../device/api/device-api";
import * as API_USERS from "../person/api/person-api";
import SockJsClient from 'react-stomp';

const SOCKET_URL = 'http://localhost:8080/ws-message';

class ClientContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: false,
            collapseForm: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            user: this.props.user
        };
    }

    componentDidMount() {
        //check if user role is admin and if it is not, redirect to home
        const currentUser = this.state.user;
        this.props.setUser(currentUser);
        console.log(currentUser);
        // if (currentUser === null ||currentUser.role !== "client") {
        //     this.props.history.push('/');
        // }else {
            this.fetchDevices();
        //}
    }

    async fetchUserById(userId) {
        return new Promise((resolve, reject) => {
            API_USERS.getPersonById({id:userId}, (result, status, err) => {
                if (result !== null && status === 200) {
                    resolve(result);
                } else {
                    this.setState({
                        errorStatus: status,
                        error: err,
                    });
                    reject(err);
                }
            });
        });
    }
    async fetchDevices() {
        try {
            await API_DEVICES.getDevices((result, status, err) => {
                if (result !== null && status === 200) {
                    // Create an array of promises for fetching user details
                    const userPromises = result.map(device => this.fetchUserById(device.user));

                    // Wait for all userPromises to resolve
                    Promise.all(userPromises)
                        .then(users => {
                            // Map the user names to the corresponding devices
                            const updatedResult = result.map((device, index) => ({
                                ...device,
                                user: users[index] ? {id: users[index].id, name: users[index].name} : {id: null, name: 'Unknown'}
                            }));

                            const filterredResult = updatedResult.filter(device => device.user.id === this.state.user.id);

                            // Update the state
                            this.setState({
                                tableData: filterredResult,
                                isLoaded: true
                            });
                        })
                        .catch(error => {
                            console.error('Error fetching user details:', error);
                            this.setState({
                                errorStatus: 500,  // Update with appropriate status code
                                error: 'Error fetching user details'
                            });
                        });
                } else {
                    this.setState({
                        errorStatus: status,
                        error: err
                    });
                }
            });
        } catch (error) {
            console.error('Error fetching devices:', error);
            this.setState({
                errorStatus: 500,  // Update with appropriate status code
                error: 'Error fetching devices'
            });
        }
    }


    render() {
        return (
            <div>
                <NavBar/>
                <CardHeader>
                    <strong> Client Devices </strong>
                </CardHeader>
                <Card>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            {this.state.isLoaded && <DeviceClientTable tableData = {this.state.tableData}
                                                                 reloadHandler={this.reload}/>}
                            {this.state.errorStatus > 0 && <APIResponseErrorMessage
                                errorStatus={this.state.errorStatus}
                                error={this.state.error}
                            />   }
                        </Col>
                    </Row>
                </Card>


            </div>
        )

    }
}


export default ClientContainer;
