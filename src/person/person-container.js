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
import PersonForm from "./components/person-form";

import * as API_USERS from "./api/person-api"
import PersonTable from "./components/person-table";
import NavigationBar from "../navigation-bar";



class PersonContainer extends React.Component {

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
            user: this.props.user
        };
    }

    componentDidMount() {
        //check if user role is admin and if it is not, redirect to home
        const currentUser = this.state.user;
        this.props.setUser(currentUser);
        console.log(currentUser);
        // if (currentUser === null ||currentUser.role !== "admin") {
        //     this.props.history.push('/');
        // }else{
            this.fetchPersons();
        //}
    }

    fetchPersons() {
        return API_USERS.getPersons((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    tableData: result,
                    isLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });
    }

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
        this.fetchPersons();
    }

    render() {
        return (
            <div>
                <NavigationBar user={this.state.user} setUser={this.props.setUser}/>
                <CardHeader>
                    <strong> Client Management </strong>
                </CardHeader>
                <Card>
                    <br/>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            <Button color="primary" onClick={this.openForm}>Add Client </Button>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
                            {this.state.isLoaded && <PersonTable tableData = {this.state.tableData}
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
                    <ModalHeader toggle={this.toggleForm}> Add Client: </ModalHeader>
                    <ModalBody>
                        <PersonForm reloadHandler={this.reload}/>
                    </ModalBody>
                </Modal>

            </div>
        )

    }
}


export default PersonContainer;
