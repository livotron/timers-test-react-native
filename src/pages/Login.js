import React, { Component } from "react";
import { View, Text, TextInput, Button } from 'react-native';
import { Link } from "react-router-native";
import { signin, signInWithGoogle, signInWithGitHub } from "../services/auth";
// import style from './Login.module.scss'
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: "",
      password: ""
    };
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
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
    console.log('submitting')
    // event.preventDefault();
    this.setState({ error: "" });
    try {
      console.log("tray to sign", this.state.email, this.state.password)

      await signin(this.state.email, this.state.password).then(res => console.log(res))
      console.log("tray to sign")
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    return (
      <View>
        <Text>Login</Text>
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
          title="LOGIN"
          onPress={() => this.handleSubmit()}
        />
        <Link to="/signup"><Text>To signup</Text></Link>
      </View>
      // <div className={style.background}>
      //   <form
      //     className={style.form}
      //     autoComplete="off"
      //     onSubmit={this.handleSubmit}
      //   >
      //     <h1 className={style.header}>
      //       Login
      //     </h1>
      //     <div className={style.inputBlock}>
      //       <span className={style.label}>Email</span>
      //       <input className={style.inputField}
      //         name="email"
      //         type="email"
      //         onChange={this.handleChange}
      //         value={this.state.email}
      //       />
      //     </div>
      //     <div>
      //       <input
      //         placeholder="Password"
      //         name="password"
      //         onChange={this.handleChange}
      //         value={this.state.password}
      //         type="password"
      //       />
      //     </div>
      //     <div>
      //       {this.state.error ? (
      //         <p>{this.state.error}</p>
      //       ) : null}
      //       <button type="submit">Login</button>
      //     </div>
      //     <hr />
      //     <p>
      //       Don't have an account? <Link to="/signup">Sign up</Link>
      //     </p>
      //   </form>
      // </div>
    );
  }
}
