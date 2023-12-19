import React from 'react';
import validate from "./validators/person-validators";
import Button from "react-bootstrap/Button";
import * as API_DEVICES from "../../device/api/device-api.js";
import * as API_USERS from "../api/person-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';



class PersonPopup extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;
        //this.reload = this.reload.bind(this);

        this.state = {
            personId: props.person.id,

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                name: {
                    value: props.person.name,
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                email: {
                    value: props.person.email,
                    valid: false,
                    touched: false,
                    validationRules: {
                        emailValidator: true
                    }
                },
                age: {
                    value: props.person.age,
                    valid: false,
                    touched: false,
                },
                address: {
                    value: props.person.address,
                    valid: false,
                    touched: false,
                },
                //dropdown for role with User/Admin
                role: {
                    value: props.person.role,
                    valid: false,
                    touched: false,
                },
                password: {
                    value: props.person.password,
                    valid: false,
                    touched: false,
                }
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        console.log("STATE", this.state);
    }

    toggleForm() {
        this.setState({collapseForm: !this.state.collapseForm});
    }


    handleChange = event => {
        console.log(event.target);
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

    reload(){
        window.location.reload();
    }

    updatePerson(person) {
        return API_USERS.putPerson(person, {id: person.id},(result, status, error) => {
            if (result !== null && status === 200) {
                console.log("Successfully updated person with id: " + result.id);
                //this.reloadHandler();
                //this.reload();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    deletePerson(personId) {
        // Create a Promise to handle the asynchronous operation
        return new Promise((resolve, reject) => {
            // First, delete from API_USERS
            API_USERS.deletePerson({ id: personId }, (result, status, error) => {
                if (result !== null && status === 200) {
                    console.log("Successfully deleted person with id: " + result);

                    // Once the user is successfully deleted, delete from API_DEVICES
                    API_DEVICES.deletePerson({ id: personId }, (result, status, error) => {
                        if (result !== null && status === 200) {
                            console.log("Successfully deleted device person with id: " + result);

                            // Reload data or perform other actions if needed
                            this.reloadHandler();

                            // Resolve the Promise indicating successful deletion
                            resolve(result);
                        } else {
                            // Reject the Promise if the deletion from API_DEVICES fails
                            reject({ status, error });
                        }
                    });
                } else {
                    // Reject the Promise if the deletion from API_USERS fails
                    reject({ status, error });
                }
            });
        });
    }

    handleEdit() {
        let person = {
            id: this.state.personId,
            name: this.state.formControls.name.value,
            email: this.state.formControls.email.value,
            age: this.state.formControls.age.value,
            address: this.state.formControls.address.value,
            role: this.state.formControls.role.value,
            password: this.state.formControls.password.value
        };
        console.log(person);
        this.updatePerson(person);
        this.reloadHandler();
        console.log("reloaded");
    }

    handleDelete() {
        const personId = this.state.personId;
        console.log(personId);
        this.deletePerson(personId);
    }

    render() {
        return (
            <div>

                <FormGroup id='name'>
                    <Label for='nameField'> Name: </Label>
                    <Input name='name' id='nameField' placeholder={this.state.formControls.name.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.name.value}
                           touched={this.state.formControls.name.touched? 1 : 0}
                           valid={this.state.formControls.name.valid}
                           required
                    />
                    {this.state.formControls.name.touched && !this.state.formControls.name.valid &&
                        <div className={"error-message row"}> * Name must have at least 3 characters </div>}
                </FormGroup>

                <FormGroup id='email'>
                    <Label for='emailField'> Email: </Label>
                    <Input name='email' id='emailField' placeholder={this.state.formControls.email.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.email.value}
                           touched={this.state.formControls.email.touched? 1 : 0}
                           valid={this.state.formControls.email.valid}
                           required
                    />
                    {this.state.formControls.email.touched && !this.state.formControls.email.valid &&
                        <div className={"error-message"}> * Email must have a valid format</div>}
                </FormGroup>

                <FormGroup id='address'>
                    <Label for='addressField'> Address: </Label>
                    <Input name='address' id='addressField' placeholder={this.state.formControls.address.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.address.value}
                           touched={this.state.formControls.address.touched? 1 : 0}
                           valid={this.state.formControls.address.valid}
                           required
                    />
                </FormGroup>

                <FormGroup id='age'>
                    <Label for='ageField'> Age: </Label>
                    <Input name='age' id='ageField' placeholder={this.state.formControls.age.placeholder}
                           min={0} max={100} type="number"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.age.value}
                           touched={this.state.formControls.age.touched? 1 : 0}
                           valid={this.state.formControls.age.valid}
                           required
                    />
                </FormGroup>

                <FormGroup id='role'>
                    <Label for='roleField'> Role: </Label>
                    <Input name='role' id='roleField' placeholder={this.state.formControls.role.placeholder}
                           type="select"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.role.value}
                           touched={this.state.formControls.role.touched? 1 : 0}
                           valid={this.state.formControls.role.valid}
                           required>
                        <option value="client">client</option>
                        <option value="admin">admin</option>
                    </Input>
                </FormGroup>

                <FormGroup id='password'>
                    <Label for='passwordField'> Password: </Label>
                    <Input name='password' id='passwordField' type="password" placeholder={this.state.formControls.password.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.password.value}
                           touched={this.state.formControls.password.touched? 1 : 0}
                           valid={this.state.formControls.password.valid}
                           required
                    />
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
        ) ;
    }
}

export default PersonPopup;
