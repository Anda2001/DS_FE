import React from "react";
import Table from "../../commons/tables/table";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import DevicePopup from "./device-popup";


const columns = [
    {
        Header: 'Description',
        accessor: 'description',
    },
    {
        Header: 'Maximum Hourly Consumption',
        accessor: 'maximumHourlyEnergyConsumption',
    },
    {
        Header: 'Address',
        accessor: 'address',
    },
    {
        Header: 'User',
        accessor: 'user.name',
    }
];

const filters = [
    {
        accessor: 'description',
    }
];

class DeviceTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: this.props.tableData,
            selectedDevice: null,
        };
    }

    handleRowClick = (device) => {
        this.setState({ selectedDevice: device });
        this.state.selectedDevice = device;
        console.log(this.state.selectedDevice);
    }

    // Function to close the pop-up form
    closeDetailForm = () => {
        this.setState({ selectedDevice: null });
    }

    reload() {

        //reload on the devices page
        this.fetchDevices();
        this.props.reloadHandler();
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
                {/* Display the pop-up form if a device is selected */}
                {this.state.selectedDevice && (
                    <Modal isOpen={true}>
                        <ModalHeader toggle={this.closeDetailForm}>
                            Device Details
                        </ModalHeader>
                        <ModalBody>
                            <DevicePopup
                                device={this.state.selectedDevice}
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

export default DeviceTable;