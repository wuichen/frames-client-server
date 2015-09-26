import React from 'react/addons';
import DocumentTitle from 'react-document-title';

// load multuiple classes on components
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';

// react bootstrap components
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';

// reflux components
import Reflux from 'reflux';

// application components
import AnalogClock from '../components/AnalogClock';
import Weather from '../components/Weather';
import Chat from '../components/Chat';
import DropzoneCustom from '../components/DropzoneCustom';
var Firebase = require("firebase");

// cherry fbid 902979603092846

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var styles = {
    container: {
        marginTop: '30px'
    }
}

var HomePage = React.createClass({
    displayName: 'HomePage',

    getInitialState() {
        return({
            timezone: 'Seattle',
            loggedIn: null
        })
    },

    setTimeZone(timezone) {
        this.setState({
            timezone: timezone
        })
    },
    componentDidMount () {
        var ref = new Firebase("https://swu-ptien.firebaseio.com");
        var self = this;
        ref.authWithOAuthPopup("facebook", function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            // the access token will allow us to make Open Graph API calls
                console.log(authData);
                var user = {
                    name: authData.facebook.displayName,
                    profilePicture: authData.facebook.profileImageURL
                }
                self.setState({
                    loggedIn: user
                })
          }
        }, {
          remember: "sessionOnly"
        });
    },

    render() {

        if(this.state.loggedIn){
            return(
            <div className='container-fluid' style={styles.container}>
                <div className='row'>
                    <div className={classNames('col-md-3')}>
                        <div className={classNames('panel','card')} >profile</div>
                    </div>
                    <div className={classNames('col-md-3')}>
                        <div className={classNames('panel','card')} >
                            <Weather />
                        </div>
                    </div>
                    <div className={classNames('col-md-3')}>
                        <div className={classNames('panel','card')}>
                            <Button onClick={this.setTimeZone.bind(this,'Seattle')}>Seattle</Button>
                            <Button onClick={this.setTimeZone.bind(this,'Taipei')}>Taipei</Button>
                            <AnalogClock timezone={this.state.timezone}/>
                        </div>
                    </div>
                    <div className={classNames('col-md-3')}>
                        <div className={classNames('panel','card')} >drawing</div>
                    </div>
                </div>
                <div className='row'>
                    <div className={classNames('col-md-3')}>
                        <div className={classNames('panel','bigCard')} >
                            map
                        </div>
                    </div>
                    <div className={classNames('col-md-6')}>
                        <div className={classNames('panel','bigCard')} >
                            <DropzoneCustom />
                        </div>
                    </div>
                    <div className={classNames('col-md-3')}>
                        <div className={classNames('panel','bigCard')} >
                            <Chat user={this.state.loggedIn}/>
                        </div>
                    </div>
                </div>
            </div>
            )
        }else{
            return (
                <div></div>
            )
        }

    }


});

export default HomePage;
