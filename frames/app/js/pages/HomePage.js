import React from 'react/addons';
import DocumentTitle from 'react-document-title';

// load multuiple classes on components
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';


// reflux components
import Reflux from 'reflux';

// application components
// import AnalogClock from '../components/AnalogClock';
import Weather from '../components/Weather';
import Chat from '../components/Chat';
import DropzoneCustom from '../components/DropzoneCustom';
var Firebase = require("firebase");
var Parse = require('parse');
var Modal = require('react-modal');
Parse.initialize("t9IyfcPpqJwi2ii4SVgcJVoAHqkUMPBzNBFUM98b", "VAN5bcmccyLVP2ITnD4A2UO7jCDhQG08NlPozGbl");

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
            loggedIn: null,
            profilePic: null
        })
    },

    setTimeZone(timezone) {
        this.setState({
            timezone: timezone
        })
    },
    componentDidMount () {
        var self = this;
        var image = Parse.Object.extend('image');
        var query = new Parse.Query(image);
        query.get('cqjsaRxBct').then(function(result){
            self.setState({
                profilePic: result.get('image').url()
            })
        })

        var ref = new Firebase("https://swu-ptien.firebaseio.com");
        
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

                <div className={classNames("myContainer","row")}>
                      <div className={classNames('col','s12','m3','l3')}>

                            <div className={classNames('card')} style={{height:'90vh'}}>
                                    <div className={classNames('card-image', 'waves-block', 'waves-light')}>
                                      <img className="activator" src={this.state.profilePic && this.state.profilePic} />
                                    </div>
                                    <div className="card-content">
                                      <span className={classNames("card-title", "activator", "grey-text" ,"text-darken-4")}>Steven<br/>&<br/>Cherry<i className={classNames("material-icons","right")}>more_vert</i></span>
                                      <p><a href="#">Happy Birthday BB!!</a></p>
                                    </div>
                                    <div className="card-reveal">
                                      <span className={classNames("card-title", "grey-text", "text-darken-4")}>Card Title<i className={classNames("material-icons","right")}>close</i></span>
                                      <p>Here is some more information about this product that is only revealed once clicked on.</p>
                                    </div>
                            </div>

                      </div>


                      <div className={classNames('col','s12','m6','l6')}>
                            <div className={classNames('card')} >
                                <DropzoneCustom />
                            </div>
                      </div>


                      <div className={classNames('col','s12','m3','l3')}>
                            <div className={classNames('card')} >
                                <Chat user={this.state.loggedIn}/>
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
