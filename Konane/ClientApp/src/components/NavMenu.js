import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import brand from "../assets/Brand.png";

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {collapsed: true};
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
        <>
          <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-black border-bottom box-shadow mb-3 texti" container light sx={{color: '#ffffff'}}>
              <NavbarBrand tag={Link} to="/">{<img className="brand" src={brand} alt=""/>} Konane</NavbarBrand>
              <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
              <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                <ul className="navbar-nav flex-grow">
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to='/'>Home</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/rules">Rules</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} className="text" to="/game-options">Play</NavLink>
                  </NavItem>
                </ul>
              </Collapse>
            </Navbar>
          </header>
        </>
    );
  }
}