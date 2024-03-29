import React, { Component } from 'react';
import {TextField} from "@mui/material";
import CustomDialog from "./CustomDialog";
import {connection, addUser} from './Connection';
export class Home extends Component {
  static displayName = Home.name;
    
    constructor(props) {
        super(props);
        this.state = {username: String, usernameSubmitted: Boolean, user: String};
        this.setUsername = this.setUsername.bind(this);
        this.setUsernameSubmitted = this.setUsernameSubmitted.bind(this);
        this.getUser = this.getUser.bind(this);
    }

    componentDidMount() {
        this.setUsername('');
        this.setUsernameSubmitted(false);
    }
    
    setUsername(username) {
        this.setState({
            username: username
        });
    }

    setUsernameSubmitted(usernameSubmitted) {
        this.setState({
            usernameSubmitted: usernameSubmitted
        });
    }
    
    getUser() {
        
    }
  
  render() {
    return (
      <>
          <CustomDialog
              open={!this.state.usernameSubmitted} // leave open if username has not been selected
              title="Pick a username" // Title of dialog
              contentText="Please select a username" // content text of dialog
              handleContinue={() => { // fired when continue is clicked
                  if (!this.state.username) return; // if username hasn't been entered, do nothing

                  this.setUsernameSubmitted(true); // indicate that username has been submitted
              }}
          >
              <TextField // Input
                  autoFocus // automatically set focus on input (make it active).
                  margin="dense"
                  id="username"
                  label="Username"
                  name="username"
                  value={this.state.username}
                  required
                  onChange={(e) => this.setUsername(e.target.value)} // update username state with value
                  type="text"
                  fullWidth
                  variant="standard"
              />
          </CustomDialog>
        <h1>Hello, stranger!</h1>
        <p>This site is designed to provide its visitors with the best Konane experience they could ever have in their life!</p>
        <p>To help you get started, here are descriptions of navigation links:</p>
        <ul>
          <li><strong>Home</strong>. For example, click <em>Counter</em> then <em>Back</em> to return here.</li>
          <li><strong>Rules</strong>. In development mode, the development server from <code>create-react-app</code> runs in the background automatically, so your client-side resources are dynamically built on demand and the page refreshes when you modify any file.</li>
          <li><strong>Play</strong>. In production mode, development-time features are disabled, and your <code>dotnet publish</code> configuration produces minified, efficiently bundled JavaScript files.</li>
        </ul>
      </>
    );
  }
}
