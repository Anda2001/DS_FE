import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    device: '/device',
    person: '/person',
    management: '/device/consumption/device',
    managementDevice: '/device'
};

function getDevices(callback) {
    let request = new Request(HOST.backend_device_api + endpoint.device, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getDeviceById(params, callback){
    let request = new Request(HOST.backend_device_api + endpoint.device + params.id, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function putDevice(device,params, callback){
    let request = new Request(HOST.backend_device_api + endpoint.device + "/" + params.id, {
        method: 'PUT',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device)
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function deleteDevice(params, callback){
    let request = new Request(HOST.backend_device_api + endpoint.device +"/"+ params.id, {
        method: 'DELETE',
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postDevice(device, callback){
    let request = new Request(HOST.backend_device_api + endpoint.device , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function postPerson(person, callback){
    let request = new Request(HOST.backend_device_api + endpoint.person, {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(person)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deletePerson(person, callback){
    let request = new Request(HOST.backend_device_api + endpoint.person +"/"+ person.id, {
        method: 'DELETE',
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getHourlyEnergyConsumption(deviceId, date, callback) {
    let request = new Request(HOST.backend_management_api+ endpoint.management +"/"+ deviceId + "?date=" + date, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function addManagementDevice(device, callback){
    let request = new Request(HOST.backend_management_api + endpoint.managementDevice , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

export {
    getDevices,
    getDeviceById,
    postDevice,
    putDevice,
    deleteDevice,
    postPerson,
    deletePerson,
    getHourlyEnergyConsumption,
    addManagementDevice
};
