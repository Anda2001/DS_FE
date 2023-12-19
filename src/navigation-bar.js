import React from 'react'
import logo from './commons/images/logo.png';

import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand, NavItem,
    NavLink,
    UncontrolledDropdown
} from 'reactstrap';
import {Link, Route} from "react-router-dom";

const textStyle = {
    color: 'white',
    textDecoration: 'none'
};

const NavigationBar = () => (
    <div>
        <Navbar color="dark" light expand="md">
            <NavbarBrand href="/">
                <img src={logo} alt="Logo" width="50" height="50" />
            </NavbarBrand>
            <Nav className="mr-auto" navbar>
                <NavItem style={{margin:"5px"}}>
                    <Link to="/person" style={textStyle}>Persons</Link>
                </NavItem>
                <NavItem style={{margin:"5px"}}>
                    <Link to="/device" style={textStyle}>Devices</Link>
                </NavItem>
            </Nav>
        </Navbar>
    </div>
);

export default NavigationBar
