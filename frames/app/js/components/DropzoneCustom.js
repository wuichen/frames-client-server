import React from 'react/addons';
var Firebase = require("firebase");
var Dropzone = require('react-dropzone');
var PackeryMixin = require('react-packery-mixin');
var InfiniteScroll = require('react-infinite-scroll')(React);
var ImageCard = require('../components/ImageCard');
var pictureHub = new Firebase("https://swu-ptien.firebaseio.com/picture");
var packeryOptions = {};
import classNames from 'classnames';

var Parse = require('parse');
var Modal = require('react-modal');
Parse.initialize("t9IyfcPpqJwi2ii4SVgcJVoAHqkUMPBzNBFUM98b", "VAN5bcmccyLVP2ITnD4A2UO7jCDhQG08NlPozGbl");
var DropzoneCustom = React.createClass({

    mixin:[PackeryMixin('packeryContainer', packeryOptions)],

    getInitialState: function () {
        return {
          images: [],
          modalIsOpen: false,
          modalIndex: 0
        };
    },
    openModal: function(index) {
        this.setState({modalIndex: index,modalIsOpen: true});
      },
     
      closeModal: function() {
        this.setState({modalIsOpen: false});
      },

    onDrop: function (files) {
        for (var i = files.length - 1; i >= 0; i--) {
            this.upload(files[i]);
        };
        // this.setState({
        //     files: files
        // });
    },

    upload: function (file) {
        // var reader = new FileReader();
        // reader.onloadend = function(){
        //     var dataURL = reader.result;
        //     pictureHub.push(dataURL);
        // };
        // reader.readAsDataURL(file);
        console.log(file);
        var fileName = file.name;
        var parseFile = new Parse.File(fileName, file);
        parseFile.save().then(function() {
            var image = new Parse.Object("image");
            image.set('image',parseFile);
            image.save();
        });

    },

    componentDidMount: function () {
  $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
  });
          
        var self = this;
        // pictureHub.limitToLast(3).on("child_added", function(snapshot) {
        //     self.state.files.push(snapshot.val())
        //     self.setState({
        //         files: self.state.files
        //     })
        //     console.log(snapshot.val())
        // });
        var image = Parse.Object.extend("image");
        var queryObject = new Parse.Query(image);
        var self = this;

        queryObject.find().then(function(results){
                for (var i = 0; i < results.length; i++) {
                    var photo = results[i].get('image');
                    var photoUrl = photo.url();
                    self.state.images.push({id:results[i].id,url:photoUrl,text:results[i].get('text')})
                    console.log(self.state.images);
                }            
                self.setState({
                    staffs: self.state.staffs
                })  

        })

    },

    onOpenClick: function () {
      this.refs.dropzone.open();
    },

    render: function () {
        let customStyles = {
          content : {
            top                   : '50%',
            left                  : '50%',
            right                 : 'auto',
            bottom                : 'auto',
            marginRight           : '-50%',
            transform             : 'translate(-50%, -50%)'
          }
        };


        return (
            <div style={{height: '90vh'}}>
                <div style={{height: '10vh', backgroundColor:'#e91e63', fontSize:'20px', padding:'10px', color:'white', fontWeight:'100'}}>Pictures</div>
                <div style={{overflow:'scroll',height:'100%',justifyContent:'space-between', padding:'15px', display:'flex',flexWrap: 'wrap'}}>
                        <div>
                            <Dropzone style={{margin:'5px',border:'2px #eee solid', width: '120px', height: '120px', display:'flex', justifyContent:'center', alignItems:'center'}} activeStyle={{margin:'5px',height:'120px',width:'120px',color: 'red',border: '3px hotpink solid',display:'flex', justifyContent:'center', alignItems:'center'}} ref="dropzone" onDrop={this.onDrop}>
                                <div style={{fontSize:'90px', color:'hotpink', marginBottom:'20px'}}>+</div>
                            </Dropzone>
                        </div>
                                {this.state.images.map(function(image,index) {
                                  return (
                                        <ImageCard index={index} image={image} openModal={this.openModal}/>
                                    );
                                }.bind(this))}
                </div>
                <Modal
                  isOpen={this.state.modalIsOpen}
                  onRequestClose={this.closeModal}
                  style={customStyles} >
         
                  
                  <a className={classNames('btn', 'btn-primary' ,'btn-xs','right')} onClick={this.closeModal}>X</a>
                    <br/>
                    <img width='700px' src={this.state.images[this.state.modalIndex] && this.state.images[this.state.modalIndex].url} />
                    <p>{this.state.images[this.state.modalIndex] && this.state.images[this.state.modalIndex].text}</p>
                </Modal>

            </div>
        );
    }
});

export default DropzoneCustom;