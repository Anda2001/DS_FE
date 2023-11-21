import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    person: '/person'
};

function getPersons(callback) {
    let request = new Request(HOST.backend_person_api + endpoint.person, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getPersonById(params, callback){
    let request = new Request(HOST.backend_person_api + endpoint.person +"/"+ params.id, {
       method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postPerson(user, callback){
    let request = new Request(HOST.backend_person_api + endpoint.person , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function putPerson(user, params, callback){
    let request = new Request(HOST.backend_person_api + endpoint.person + "/" + params.id, {
        method: 'PUT',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
    }

function deletePerson(params, callback){
    let request = new Request(HOST.backend_person_api + endpoint.person + "/" + params.id, {
        method: 'DELETE'
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
    }

function login(user, callback){
    let request = new Request(HOST.backend_person_api + endpoint.person + "/login", {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
    }


export {
    getPersons,
    getPersonById,
    postPerson,
    putPerson,
    deletePerson,
    login
};
