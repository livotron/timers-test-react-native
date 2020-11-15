import React, { Component } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import { Link } from 'react-router-native';
import { signup } from '../services/auth';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: '',
      password: '',
    };
  }

  handleEmailChange(inputValue) {
    this.setState({
      email: inputValue
    });
  }

  handlePasswordChange(inputValue) {
    this.setState({
      password: inputValue
    });
  }

  async handleSubmit(event) {
    this.setState({ error: '' });
    try {
      await signup(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  
  render() {
    return (
      <View>
        <Text>Signup</Text>
        <TextInput
          style={{ height: 80, borderColor: 'gray', borderWidth: 1, padding: 0 }}
          onChangeText={(i) => this.handleEmailChange(i)}
          value={this.state.email}
        />
        <TextInput
          autoCompleteType="password"
          style={{ height: 80, borderColor: 'gray', borderWidth: 1, padding: 0 }}
          onChangeText={(i) => this.handlePasswordChange(i)}
          value={this.state.password}
        />
        <Button
          title="SIGNUP"
          onPress={() => this.handleSubmit()}
        />
        <Link to="/login"><Text>To login</Text></Link>
      </View>      // <div>
      //   <form onSubmit={this.handleSubmit}>
      //     <h1>
      //       Sign Up to
      //     <Link to="/">Chatty</Link>
      //     </h1>
      //     <p>Fill in the form below to create an account.</p>
      //     <div>
      //       <input placeholder="Email" name="email" type="email" onChange={this.handleChange} value={this.state.email}></input>
      //     </div>
      //     <div>
      //       <input placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} type="password"></input>
      //     </div>
      //     <div>
      //       {this.state.error ? <p>{this.state.error}</p> : null}
      //       <button type="submit">Sign up</button>
      //     </div>
      //     <hr></hr>
      //     <p>Already have an account? <Link to="/login">Login</Link></p>
      //   </form>
      // </div>
    )
  }
}