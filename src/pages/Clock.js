import React, { Component } from "react";
import { View, Text } from 'react-native';
import { auth, db } from "../services/firebase";

export default class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      chats: [],
      content: '',
      readError: null,
      writeError: null,
      mobileTimer: {
        seconds: 0,
        minutes: 0,
        isOnline: false
      },
      webTimer: {
        seconds: 0,
        minutes: 0,
        isOnline: false
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  timer;
  interval = 1000;
  expected = Date.now() + this.interval;

  async componentDidMount() {
    try {
      db.ref("/statusMobile/" + this.state.user.uid).on('value', snapshot => {
        if (!snapshot.val()) {
          return;
        }

        console.log("From mobile clock ")
        console.log(snapshot.val())
        this.setState({
          mobileTimer: {
            seconds: Math.floor(snapshot.val().total_time / 1000) % 60,
            minutes: Math.floor(snapshot.val().total_time / 1000 / 60) % 60,
            isOnline: snapshot.val().isOnline
          }
        });
      });

    } catch (error) {
      this.setState({ readError: error.message });
    }
    try {
      db.ref("/statusWeb/" + this.state.user.uid).on('value', snapshot => {
        if (!snapshot.val()) {
          return;
        }
        let recountedTotal = snapshot.val().total_time + (snapshot.val().isOnline ?
          +Date.now() - snapshot.val().last_entry :
          snapshot.val().last_leave - snapshot.val().last_entry);
        console.log("From Web clock ")
        console.log(snapshot.val())
        this.setState({
          webTimer: {
            seconds: Math.floor(recountedTotal / 1000) % 60,
            minutes: Math.floor(recountedTotal / 1000 / 60) % 60,
            isOnline: snapshot.val().isOnline
          }
        });
      });

    } catch (error) {
      this.setState({ readError: error.message });
    }

    this.timer = setTimeout(this.updateTimer, this.interval);
  }
  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  updateTimer =() => {

    let dt = Date.now() - this.expected; // the drift (positive for overshooting)

    let newState = {};
    if (this.state.mobileTimer.isOnline) {
      if (this.state.mobileTimer.seconds === 59) {
        newState.mobileTimer = {
          minutes: this.state.mobileTimer.minutes + 1,
          seconds: 0,
          isOnline: this.state.mobileTimer.isOnline
        }
      } else {
        newState.mobileTimer = {
          seconds: this.state.mobileTimer.seconds + 1,
          minutes: this.state.mobileTimer.minutes,
          isOnline: this.state.mobileTimer.isOnline
        }
      }
    }
    if (this.state.webTimer.isOnline) {
      if (this.state.webTimer.seconds === 59) {
        newState.webTimer = {
          minutes: this.state.webTimer.minutes + 1,
          seconds: 0,
          isOnline: this.state.webTimer.isOnline
        }
      } else {
        newState.webTimer = {
          seconds: this.state.webTimer.seconds + 1,
          minutes: this.state.webTimer.minutes,
          isOnline: this.state.webTimer.isOnline
        }
      }
    }
    this.setState(newState)

    this.expected += this.interval;
    this.timer = setTimeout(this.updateTimer, Math.max(0, this.interval - dt)); // take into account drift
  }



  handleChange(event) {
    this.setState({
      content: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ writeError: null });
    try {
      await db.ref("chats").push({
        content: this.state.content,
        timestamp: Date.now(),
        uid: this.state.user.uid
      }).then(function (docRef) {
        console.log("Document written with ID: ", docRef.id)
      });
      this.setState({ content: '' });
    } catch (error) {
      this.setState({ writeError: error.message });
    }
  }


  render() {
    return (
      <>
        <View>
          <Text>{"Mobile: " + this.state.mobileTimer.minutes + " : " + this.state.mobileTimer.seconds}</Text>
        </View>
        <View>
          <Text>{"Web: " + this.state.webTimer.minutes + " : " + this.state.webTimer.seconds}</Text>
        </View>
      </>

      // <div>
      //   <div className="chats">
      //     {this.state.chats.map(chat => {
      //       return <p key={chat.timestamp}>{chat.content}</p>
      //     })}
      //   </div><h1>{this.state.minutes + " : " + this.state.seconds}</h1>
      //   <form onSubmit={this.handleSubmit}>
      //     <input onChange={this.handleChange} value={this.state.content}></input>
      //     {this.state.error ? <p>{this.state.writeError}</p> : null}
      //     <button type="submit">Send</button>
      //   </form>
      //   <div>
      //     Login in as: <strong>{this.state.user.email}</strong>
      //   </div>
      // </div>
    );
  }
}
