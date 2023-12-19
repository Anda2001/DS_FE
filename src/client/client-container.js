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
            chartData: null,
            selectedDeviceId: null,
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

                            // Update the state
                            this.setState({
                                tableData: filterredResult,
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

    fetchChartData() {
        const data = [
            {
                "id": 43,
                "hour": "2023-12-19T18:00:00.000+00:00",
                "deviceId": 7,
                "hourlyConsumption": 166.358,
                "links": []
            },
            {
                "id": 44,
                "hour": "2023-12-19T19:00:00.000+00:00",
                "deviceId": 7,
                "hourlyConsumption": 172.358,
                "links": []
            },
            {
                "id": 45,
                "hour": "2023-12-19T20:00:00.000+00:00",
                "deviceId": 7,
                "hourlyConsumption": 180.358,
                "links": []
            },
            {
                "id": 46,
                "hour": "2023-12-19T21:00:00.000+00:00",
                "deviceId": 7,
                "hourlyConsumption": 190.358,
                "links": []
            },
            
            // Add more data points here
        ];
    
        const chartData = data.map(item => ({
            hour: new Date(item.hour).getHours(),
            hourlyConsumption: item.hourlyConsumption
        }));
    
        this.setState({chartData});
    }


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
                            <DatePicker
                                selected={this.state.selectedDate}
                                onChange={date => {
                                    this.setState({selectedDate: date});
                                    this.fetchChartData(date);
                                }}
                            />
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
