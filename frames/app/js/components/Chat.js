import React from 'react/addons';
var Firebase = require("firebase");


var messagesHub = new Firebase("https://swu-ptien.firebaseio.com/chat");

var Chat = React.createClass({
    getInitialState: function() {
        return({
            messages:[],
            newMessage: ''
        })
    },
    componentDidMount : function() {
        var self = this;
        messagesHub.limitToLast(40).on("child_added", function(snapshot) {
            self.state.messages.push(snapshot.val());
            self.setState({
                messages: self.state.messages
            },function() {
                if(self.state.messages.length >= 40){
                    $('#chatBox').animate({scrollTop: document.getElementById('chatBox').scrollHeight})
                }
            })
        });
    },
    _updateMessage: function(e) {
        this.setState({
            newMessage: e.target.value
        })
        console.log(this.state.newMessage)
    },
    _sendMessage: function() {
        var self = this;
        messagesHub.push({
          user:self.props.user.name, message: self.state.newMessage
        },function(error){
            if(!error){
                self.setState({
                    newMessage: ''
                })
            }
        });
    },
    _enterPressed: function (e) {
      console.log(e.keyCode)
        if (e.keyCode == 13 && this.state.newMessage.length > 0){
            this._sendMessage();
        }
    },
    render: function() {
        var self = this;
        return (
            <div>
                <div style={{height: '50px', backgroundColor:'dodgerblue', fontSize:'20px', padding:'10px', color:'white', fontWeight:'100'}}>Chat</div>
                <div id='chatBox' style={{height: '375px', overflow: 'scroll', padding: '15px 15px 0px 15px'}}>
                    {self.state.messages.map( function (message, index){
                        if(message.user === self.props.user.name){
                            return(
                                <div style={{display: 'flex',justifyContent:'flex-end',alignItems: 'flex-start'}}>
                                  <div style={{marginTop:'10px', backgroundColor: 'aliceblue',borderRadius: '10px',padding: '10px', display: 'inline-block',maxWidth: '200px',wordWrap: 'break-word'}}>{message.message}</div>
                                  <div style={{display:'inline-block',margin:'10px'}}><img src={self.props.user.profilePicture} style={{borderRadius: '50%', width: '50px'}} /></div>
                                </div>
                            )
                        }else{
                            return(
                                <div style={{display: 'flex',alignItems: 'flex-start'}}>
                                  <div style={{display:'inline-block',margin:'10px'}}><img src={self.props.user.profilePicture} style={{borderRadius: '50%', width: '50px'}} /></div>
                                  <div style={{marginTop:'10px', backgroundColor: 'aliceblue',borderRadius: '10px',padding: '10px', display: 'inline-block',maxWidth: '200px',wordWrap: 'break-word'}}>{message.message}</div>
                                </div>
                            )
                        }

                    })}
                </div>

                <div style={{height: '75px', padding: '15px', display:'flex', justifyContent:'space-between',alignItems:'center', backgroundColor:'dodgerblue'}}>
                    <textarea style={{resize:'none',borderColor:'white', width:'80%',borderRadius: '5px'}} type='text' onKeyDown={this._enterPressed} value={this.state.newMessage} onChange={this._updateMessage}></textarea><div className='btn btn-primary btn-xs' onClick={this._sendMessage}>send</div>
                </div>
            </div>
        )
    }
});

export default Chat;