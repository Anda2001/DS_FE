import React from "react";
import Table from "../../commons/tables/table";
import {Modal, ModalBody, ModalHeader} from "reactstrap";

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

class DeviceClientTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: this.props.tableData,
        };
        console.log(this.props);
    }

    componentDidMount() {
        console.log(this.state.tableData);
    }

    reload() {
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
                />

            </div>
        )
    }
}

export default DeviceClientTable;