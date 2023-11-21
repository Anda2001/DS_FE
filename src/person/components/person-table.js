import React from "react";
import Table from "../../commons/tables/table";
import PersonForm from "./person-form";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import PersonPopup from "./person-popup";


const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },

    {
        Header: 'Email',
        accessor: 'email',
    },

    {
        Header: 'Address',
        accessor: 'address',
    }
];

const filters = [
    {
        accessor: 'name',
    }
];

class PersonTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: this.props.tableData,
            selectedPerson: null, // Track the selected person
        };
    }

    // Function to set the selected person when a row is clicked
    handleRowClick = (person) => {
        this.setState({ selectedPerson: person });  // Set the selected person
        this.state.selectedPerson = person;
        console.log(this.state.selectedPerson);
    }

    // Function to close the pop-up form
    closeDetailForm = () => {
        this.setState({ selectedPerson: null });
    }

    toggleForm() {
        this.setState({selected: !this.state.selected});
    }

    render() {
        return (
            <div>
                <Table
                    data={this.state.tableData}
                    columns={columns}
                    search={filters}
                    pageSize={5}
                    onRowClick={this.handleRowClick}
                />
                {/* Display the pop-up form if a person is selected */}
                {this.state.selectedPerson && ( // If a person is selected
                    <Modal isOpen={true}>
                        <ModalHeader toggle={this.closeDetailForm}>
                            Person Details
                        </ModalHeader>
                        <ModalBody>
                            <PersonPopup    // Pass the selected person to the pop-up form
                                person={this.state.selectedPerson}
                                reloadHandler={this.props.reloadHandler}
                                closeHandler={this.closeDetailForm}
                            />
                        </ModalBody>
                    </Modal>
                )}
            </div>
        )
    }
}

export default PersonTable;