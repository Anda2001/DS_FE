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
import {Link} from "react-router-dom";

const textStyle = {
    color: 'white',
    textDecoration: 'none'
};

const NavBar = () => (
    <div>
        <Navbar color="dark" light expand="md">
            <NavbarBrand href="/">
                <img src={logo} width={"50"}
                     height={"50"}/>
            </NavbarBrand>
            <Nav className="mr-auto" navbar>
                <NavItem style={{margin:"5px"}}>
                    <Link to="/client" style={textStyle}>Devices</Link>
                </NavItem>
                <NavItem style={{margin:"5px"}}>
                    <Link to="/chat" style={textStyle}>Chat</Link>
                </NavItem>
            </Nav>
        </Navbar>
    </div>
);

export default NavBar
