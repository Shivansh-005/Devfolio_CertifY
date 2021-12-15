import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

// UI COMPONENTS
import { faSearch, faInfoCircle, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormInput,
  Collapse
} from "shards-react";

// style
 import "./NavBar.css";

import iconimg from "../../assets/iconz.png"
import logoWeb from "../../assets/logo-web.png"

class NavBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      collapseOpen: false
    };
  }

  toggleDropdown() {
  this.setState({
      ...this.state,
      ...{
        dropdownOpen: !this.state.dropdownOpen
      }
    });
  }

  toggleNavbar() {
    this.setState({
      ...this.state,
      ...{
        collapseOpen: !this.state.collapseOpen
      }
    });
  }



  render() {

    return (
      <Navbar id={"appNavBar"} type="dark" expand="md">
          <NavbarBrand href="/">
            <img id={"logoNavBar"} src={logoWeb} /> <b>Certif<span>Y</span></b>
          </NavbarBrand>
          <NavbarToggler onClick={() => this.toggleNavbar()} />

          <Collapse open={this.state.collapseOpen} navbar>
            <Nav navbar>



              {/*<Dropdown
                open={this.state.dropdownOpen}
                toggle={() => this.toggleDropdown()}
              >
                <DropdownToggle nav caret>
                  About
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                      <a className={"navLink"} href="/purpose">
                        Purpose
                      </a>
                  </DropdownItem>
                  <DropdownItem>
                    <a className={"navLink"} href="/author">
                      Author
                    </a>
                  </DropdownItem>
                  <DropdownItem>
                    <a className={"navLink"} href="/thanks">
                      Thanks
                    </a>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown> */}

            </Nav>

                        <Nav navbar className="ml-auto">
{          <NavItem>

 <button type="button" ><a href="http://20.121.38.215:3000/faq">View Certificates</a></button>
              </NavItem> }
              <NavItem>
               <button type="button" ><a href="http://20.121.38.215:3000/about">Verification Portal</a></button>
              </NavItem>
            </Nav>
          </Collapse>
      </Navbar>
    )
  }
}

export default NavBar
