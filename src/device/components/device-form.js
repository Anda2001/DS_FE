import React from 'react';
import validate from "./validators/device-validators";
import Button from "react-bootstrap/Button";
import * as API_USERS from "../../person/api/person-api.js";
import * as API_DEVICES from "../api/device-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import { Col, Row } from "reactstrap";
import { FormGroup, Input, Label } from 'reactstrap';

class DeviceForm extends React.Component {
    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {
            errorStatus: 0,
            error: null,
            formIsValid: false,
            selectedUserId: null, // New state to store selected user id
            formControls: {
                description: {
                    value: '',
                    placeholder: 'What type of device...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                maximumHourlyEnergyConsumption: {
                    value: '',
                    placeholder: 'Maximum Consumption...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true
                    }
                },
                address: {
                    value: '',
                    placeholder: 'Cluj, Zorilor, Str. Lalelelor 21...',
                    valid: false,
                    touched: false,
                },
                user: {
                    value: '',
                    placeholder: 'User...',
                    valid: false,
                    touched: false,
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // Fetch the list of users when the component mounts
        this.fetchUsers();
        //this.state.selectedUserId = this.state.users[0].id;
        //console.log("Selected user id:",this.state.users);
    }

    async fetchUsers() {
        try {
            await API_USERS.getPersons((result, status, err) => {
                if (result !== null && status === 200) {
                    this.setState({
                        users: result,
                        selectedUserId: result[0].id // Set the selected user id to the first user
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
        this.setState({ collapseForm: !this.state.collapseForm });
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
        console.log("Selected User bitch:",selectedUserId);
        this.setState({
            selectedUserId: selectedUserId,
            formControls: {
                ...this.state.formControls,
                user: {
                    ...this.state.formControls.user.id,
                    value: selectedUserId
                }
            }
        });
    };

    addDevice(device) {
        return API_DEVICES.postDevice(device, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted device with id: " + result);
                this.reloadHandler();
            } else {
                this.setState({
                    errorStatus: status,
                    error: error
                });
            }
        });
    }

    handleSubmit() {
        console.log(this.state.selectedUserId);
        console.log(this.state.formControls.user.value);
        let device = {
            description: this.state.formControls.description.value,
            maximumHourlyEnergyConsumption: this.state.formControls.maximumHourlyEnergyConsumption.value,
            address: this.state.formControls.address.value,
            user: this.state.selectedUserId // Use the selected user id
        };

        console.log(device);
        this.addDevice(device);
    }

    render() {
        return (
            <div>
                <FormGroup id='description'>
                    <Label for='description'> Name: </Label>
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

                <FormGroup id='maximumHourlyEnergyConsumption'>
                    <Label for='maximumHourlyEnergyConsumptionField'> Maximum hourly energy consumption: </Label>
                    <Input name='maximumHourlyEnergyConsumption' id='maximumHourlyEnergyConsumptionField' placeholder={this.state.formControls.maximumHourlyEnergyConsumption.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.maximumHourlyEnergyConsumption.value}
                           touched={this.state.formControls.maximumHourlyEnergyConsumption.touched ? 1 : 0}
                           valid={this.state.formControls.maximumHourlyEnergyConsumption.valid}
                           required
                    />
                    {this.state.formControls.maximumHourlyEnergyConsumption.touched && !this.state.formControls.maximumHourlyEnergyConsumption.valid &&
                        <div className={"error-message"}> * Maximum Consumption must have a valid format</div>}
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

                <FormGroup id='user'>
                    <Label for='userField'> User: </Label>
                    <Input name='user' id='user' type="select" onChange={this.handleUserSelect} value={this.state.selectedUserId}>
                        <option value='' disabled>Select user...</option>
                        {this.state.users && this.state.users.map(user =>
                            <option key={user.id} value={user.id}>{user.name}</option>
                        )}
                    </Input>
                </FormGroup>

                <Row>
                    <Col sm={{ size: '4', offset: 8 }}>
                        <Button type={"submit"} onClick={this.handleSubmit}> Submit </Button>
                    </Col>
                </Row>

                {
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error} />
                }
            </div>
        );
    }
}

export default DeviceForm;
