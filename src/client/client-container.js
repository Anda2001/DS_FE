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
import moment from 'moment';


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
            user: this.props.user,
            selectedDate: new Date(),
            selectedDateString: moment(new Date()).utc().format('YYYY-MM-DD'),
            chartData: null,
            selectedDeviceId: null,
            deviceIdsList: []
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
            //this.fetchDeviceHourlyConsumption();
        this.setState({selectedDate: new Date()});
        console.log("selectedDate",this.state.selectedDate);
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
                            const deviceIdList = filterredResult.map(device => device.id);
                            const firstDeviceId = deviceIdList[0];
                            // Update the state
                            this.setState({
                                tableData: filterredResult,
                                isLoaded: true,
                                deviceIdsList: deviceIdList,
                                selectedDeviceId: firstDeviceId
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

    async fetchDeviceHourlyConsumption() {
        try {
            await API_DEVICES.getHourlyEnergyConsumption( this.state.selectedDeviceId , this.state.selectedDateString , (result, status, err) => {
                if (result !== null && status === 200) {
                    // Create an array of promises for fetching user details
                    const chartData = result.map(item => ({
                        hour: new Date(item.hour).getHours(),
                        hourlyConsumption: item.hourlyConsumption
                    }));

                    this.setState({chartData});
                    console.log(result);
                } else {
                    this.setState({
                        errorStatus: status,
                        error: err
                    });
                }
            });
        }
        catch (error) {
            console.error('Error fetching devices:', error);
            this.setState({
                errorStatus: 500,  // Update with appropriate status code
                error: 'Error fetching devices'
            });
        }
    }

    handleDeviceChange = event => {
        this.setState({selectedDeviceId: event.target.value});
    };

    handleGetData = () => {
        // Fetch device data based on selectedDeviceId and selectedDateString
        this.fetchDeviceHourlyConsumption();
    };

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
                            />}
                            <select value={this.state.selectedDeviceId} onChange={this.handleDeviceChange}>
                                {this.state.deviceIdsList.map(deviceId => (
                                    <option key={deviceId} value={deviceId}>
                                        Device {deviceId}
                                    </option>
                                ))}
                            </select>
                            {/*<DatePicker*/}
                            {/*    selected={this.state.selectedDate}*/}
                            {/*    onChange={date => {*/}
                            {/*        const adjustedDate = moment(date).utc().format('YYYY-MM-DD');*/}
                            {/*        console.log("adjustedDate",adjustedDate);*/}
                            {/*        this.setState({ selectedDate: date }); // Store the Date object if needed*/}
                            {/*        this.setState({ selectedDateString: adjustedDate }); // Store the formatted string if needed elsewher*/}
                            {/*    }}*/}
                            {/*/>*/}

                            <input type="date" value={this.state.selectedDate} onChange={event => {
                                const adjustedDate = moment(event.target.value).utc().add(1, 'day').format('YYYY-MM-DD');
                                this.setState({selectedDate: event.target.value})
                                this.setState({selectedDateString: adjustedDate});
                            }}/>

                            <Button onClick={this.handleGetData}>Get Device Data</Button>

                        </Col>
                    </Row>
                </Card>
                {this.state.chartData && (
                    <BarChart width={500} height={300} data={this.state.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="hourlyConsumption" fill="#8884d8" />
                    </BarChart>
                )}
            </div>
        )
    }
}


export default ClientContainer;
