import React from "react";
import Table from "../../commons/tables/table";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import { w3cwebsocket as W3CWebSocket } from 'websocket';
//import { ToastContainer, toast } from "react-toastify";
//import "react-toastify/dist/ReactToastify.css";

const SERVER_WS_URL = 'ws://localhost:8040';

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
        this.client = new W3CWebSocket(SERVER_WS_URL);
    }

    componentDidMount() {
        this.client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        console.log(this.state.tableData);

        this.client.onmessage = (message) => {
            const notificationData = JSON.parse(message.data);

            // Check if the notification type indicates a device exceeding maximum value
            if (notificationData.type === 'exceededMaximumValue') {
                const { deviceId } = notificationData;
                //this.displayNotification(`Device with ID ${deviceId} exceeded hourly energy consumption`);
            }
        };
    }
    componentWillUnmount() {
        this.client.close();
    }

    // displayNotification(message) {
    //     toast(message);
    // }

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