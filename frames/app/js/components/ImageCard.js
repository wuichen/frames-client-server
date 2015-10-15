import React from 'react/addons';
import classNames from 'classnames';

var ImageCard = require('../components/ImageCard');

var Parse = require('parse');
Parse.initialize("t9IyfcPpqJwi2ii4SVgcJVoAHqkUMPBzNBFUM98b", "VAN5bcmccyLVP2ITnD4A2UO7jCDhQG08NlPozGbl");
var ImageCard = React.createClass({
    getInitialState: function() {
        return({
            editMode: false,
            text:this.props.image.text
        })
        
    },
    switchEditMode: function() {
        if(this.state.editMode){
            var image = new Parse.Object("image");
            image.set('objectId',this.props.image.id);
            image.set('text',this.state.text);
            image.save();
        }
        this.setState({
            editMode: !this.state.editMode
        })
    },
    editText: function(event) {
        console.log(event.target.value);
        this.setState({text: event.target.value});
    },
    callModal: function() {
        this.props.openModal(this.props.index);
    },
    render: function () {

        return (
            <div className='card' style={{width:'140px', height:'220px'}}>
                <div style={{margin:'5px',width:'130px',height:'130px',background: 'url('+this.props.image.url+') 50% 50% no-repeat', backgroundSize:'cover',display:'inline-block'}}>
                    <a style={{width:'130px',height:'130px',display:'inline-block'}} href='#' onClick={this.callModal}></a>
                </div>
                {this.state.editMode ? (<textarea onChange={this.editText} style={{fontSize:'10px',display:'block',marginLeft:'auto',marginRight:'auto',borderRadius:'2px',borderColor:'darkgray',width:'90%',resize:'none'}}>{this.state.text}</textarea>):(<p style={{margin:0,fontSize:'10px', textAlign:'center'}}>{this.state.text}</p>)}
                <a href='#'>
                    <i className={classNames('right',"material-icons")} onClick={this.switchEditMode}>mode_edit</i>
                </a>

            </div>
        );
    }
});

export default ImageCard;