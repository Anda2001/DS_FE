import React from 'react';
import validate from "./validators/device-validators";
import Button from "react-bootstrap/Button";
import * as API_DEVICES from "../../device/api/device-api.js";
import * as API_USERS from "../../person/api/person-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label } from 'reactstrap';

class DevicePopup extends React.Component {
    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {
            deviceId: props.device.id,
            errorStatus: 0,
            error: null,
            formIsValid: false,
            selectedUserId: props.device.user, // Set the initial selected user id
            users: [], // Array to store the list of users
            formControls: {
                description: {
                    value: props.device.description,
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                maximumHourlyEnergyConsumption: {
                    value: props.device.maximumHourlyEnergyConsumption,
                    valid: false,
                    touched: false,
                },
                address: {
                    value: props.device.address,
                    valid: false,
                    touched: false,
                },
                user: {
                    value: props.device.user,
                    valid: false,
                    touched: false,
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        console.log(props);
    }

    componentDidMount() {
        // Fetch the list of users when the component mounts
        this.fetchUsers();
    }

    async fetchUsers() {
        try {
            await API_USERS.getPersons((result, status, err) => {
                if (result !== null && status === 200) {
                    this.setState({
                        users: result,
                    });
                } else {
                    this.setState(({
                        errorStatus: status,
                        error: err
                    }));
                }
            });

        } catch (error) {
            console.error('Error fetching users:', error);
            this.setState({
                errorStatus: 500,  // Update with appropriate status code
                error: 'Error fetching users'
            });
        }
    }

    toggleForm() {
        this.setState({collapseForm: !this.state.collapseForm});
    }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.state.formControls;
        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });
    };

    handleUserSelect = event => {
        const selectedUserId = event.target.value;
        console.log("Selected user id: ", event.target);
        console.log(selectedUserId);
        this.setState({
            selectedUserId: selectedUserId,
            formControls: {
                ...this.state.formControls,
                user: {
                    ...this.state.formControls.user,
                    value: selectedUserId
                }
            }
        });
    };

    reload() {
        window.location.reload();
    }

    updateDevice(device) {
        return API_DEVICES.putDevice(device, {id: device.id}, (result, status, error) => {
            if (result !== null && status === 200) {
                console.log("Successfully updated device with id: " + result.id);
                this.reloadHandler();
            } else {
                this.setState({
                    errorStatus: status,
                    error: error
                });
            }
        });
    }

    deleteDevice(device) {
        return API_DEVICES.deleteDevice({id: device.id}, (result, status, error) => {
            if (result !== null && status === 200) {
                console.log("Successfully deleted device with id: " + result);
                this.reloadHandler();
            } else {
                this.setState({
                    errorStatus: status,
                    error: error
                });
            }
        });
    }

    handleEdit() {
        console.log(this.state.formControls.user);
        console.log(this.state.selectedUserId);
        let device = {
            id: this.state.deviceId,
            description: this.state.formControls.description.value,
            maximumHourlyEnergyConsumption: this.state.formControls.maximumHourlyEnergyConsumption.value,
            address: this.state.formControls.address.value,
            user: this.state.selectedUserId.id // Use the selected user id
        };
        console.log(device);
        this.updateDevice(device);
    }

    handleDelete() {
        const device = {
            id: this.state.deviceId
        };
        this.deleteDevice(device);
    }

    render() {
        return (
            <div>
                <FormGroup id='description'>
                    <Label for='descriptionField'> Description: </Label>
                    <Input name='description' id='descriptionField' placeholder={this.state.formControls.description.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.description.value}
                           touched={this.state.formControls.description.touched ? 1 : 0}
                           valid={this.state.formControls.description.valid}
                           required
                    />
                    {this.state.formControls.description.touched && !this.state.formControls.description.valid &&
                        <div className={"error-message row"}> * Description must have at least 3 characters </div>}
                </FormGroup>

                <FormGroup id='address'>
                    <Label for='addressField'> Address: </Label>
                    <Input name='address' id='addressField' placeholder={this.state.formControls.address.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.address.value}
                           touched={this.state.formControls.address.touched ? 1 : 0}
                           valid={this.state.formControls.address.valid}
                           required
                    />
                </FormGroup>

                <FormGroup id='maximumHourlyEnergyConsumption'>
                    <Label for='maximumHourlyEnergyConsumptionField'> Maximum Hourly Energy Consumption: </Label>
                    <Input name='maximumHourlyEnergyConsumption' id='maximumHourlyEnergyConsumptionField' placeholder={this.state.formControls.maximumHourlyEnergyConsumption.placeholder}
                           min={0} max={100} type="number"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.maximumHourlyEnergyConsumption.value}
                           touched={this.state.formControls.maximumHourlyEnergyConsumption.touched ? 1 : 0}
                           valid={this.state.formControls.maximumHourlyEnergyConsumption.valid}
                           required
                    />
                </FormGroup>

                <FormGroup id='user'>
                    <Label for='userField'> User: </Label>
                    <Input name='user' id='userField' type="select" onChange={this.handleUserSelect} value={this.state.selectedUserId}>
                        <option value='' disabled>Select user...</option>
                        {this.state.users && this.state.users.map(user =>
                            <option key={user.id} value={user.id}>{user.name}</option>
                        )}
                    </Input>
                </FormGroup>

                <Row>
                    <Col sm={{ size: '4', offset: 2 }}>
                        <Button onClick={this.handleEdit}>
                            Edit
                        </Button>
                    </Col>
                    <Col sm={{ size: '4' }}>
                        <Button onClick={this.handleDelete}>
                            Delete
                        </Button>
                    </Col>
                </Row>

                {this.state.errorStatus > 0 && (
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error} />
                )}
            </div>
        );
    }
}

export default DevicePopup;
