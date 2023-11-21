import React from 'react'
import logo from './commons/images/logo.png';

import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavLink,
    UncontrolledDropdown
} from 'reactstrap';
import {Route} from "react-router-dom";
import PersonContainer from "./person/person-container";

const textStyle = {
    color: 'white',
    textDecoration: 'none'
};

const NavigationBar = (props) => {

    return (
        <div>
        <Navbar color="dark" light expand="md">
            <NavbarBrand href="/">
                <img src={logo} width={"50"}
                     height={"50"}/>
            </NavbarBrand>
            <Nav className="mr-auto" navbar>

                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle style={textStyle} nav caret>
                        Menu
                    </DropdownToggle>
                    <DropdownMenu right>

                        <DropdownItem>
                            <NavLink href="/person">Persons</NavLink>
                            {/*<Route*/}
                            {/*    exact*/}
                            {/*    path='/person'*/}
                            {/*    render={(props) => <PersonContainer {...props} user={this.state.user} setUser={this.setUser}/>}*/}
                            {/*/>*/}
                        </DropdownItem>

                        <DropdownItem>
                            <NavLink href="/device">Devices</NavLink>
                        </DropdownItem>


                    </DropdownMenu>
                </UncontrolledDropdown>

            </Nav>
        </Navbar>
    </div>
)
};

export default NavigationBar
