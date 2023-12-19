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
import DeviceForm from "./components/device-form";

import * as API_DEVICES from "./api/device-api"
import * as API_USERS from "../person/api/person-api"
import DeviceTable from "./components/device-table";
import NavigationBar from "../navigation-bar";



class DeviceContainer extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.openForm = this.openForm.bind(this);
        this.reload = this.reload.bind(this);
        this.state = {
            selected: false,
            collapseForm: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            getTrPropsFunction: props.getTrProps,
            user: this.props.user
        };
    }

    componentDidMount() {

//check if user role is admin and if it is not, redirect to home
        const currentUser = this.state.user;
        this.props.setUser(currentUser);
        console.log(currentUser);
        // if (currentUser === null || currentUser.role !== "admin") {
        //     this.props.history.push('/');
        // }else{
            this.fetchDevices();
        //}
        //this.fetchUsers();
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

                            // Update the state
                            this.setState({
                                tableData: updatedResult,
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


    //fetch user by id

    toggleForm() {
        if (this.state.selected === true) {
            this.setState({selected: !this.state.selected});
        }
    }

    openForm() {
        this.setState({selected: !this.state.selected});
    }


    reload() {
        this.setState({
            isLoaded: false
        });
        this.toggleForm();
        this.fetchDevices();
        //this.fetchUsers();
    }

    render() {
        return (
            <div>
                <NavigationBar user={this.state.user} setUser={this.props.setUser}/>
                <CardHeader>
                    <strong> Device Management </strong>
                </CardHeader>
                <Card>
                    <br/>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            <Button color="primary" onClick={this.openForm}>Add Device</Button>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            {this.state.isLoaded && <DeviceTable tableData = {this.state.tableData}
                                                                 reloadHandler={this.reload}/>}
                            {this.state.errorStatus > 0 && <APIResponseErrorMessage
                                errorStatus={this.state.errorStatus}
                                error={this.state.error}
                            />   }
                        </Col>
                    </Row>
                </Card>

                <Modal isOpen={this.state.selected} toggle={this.toggleForm}
                       className={this.props.className} size="lg">
                    <ModalHeader toggle={this.toggleForm}> Add Device: </ModalHeader>
                    <ModalBody>
                        <DeviceForm reloadHandler={this.reload}/>
                    </ModalBody>
                </Modal>

            </div>
        )

    }
}


export default DeviceContainer;
