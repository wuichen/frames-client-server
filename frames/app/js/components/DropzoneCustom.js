import React from 'react/addons';
var Firebase = require("firebase");
var Dropzone = require('react-dropzone');
var PackeryMixin = require('react-packery-mixin');
var InfiniteScroll = require('react-infinite-scroll')(React);

var pictureHub = new Firebase("https://swu-ptien.firebaseio.com/picture");
var packeryOptions = {};

var DropzoneCustom = React.createClass({

    mixin:[PackeryMixin('packeryContainer', packeryOptions)],

    getInitialState: function () {
        return {
          files: [],
        };
    },

    onDrop: function (files) {
        for (var i = files.length - 1; i >= 0; i--) {
            this.uploadToFirebase(files[i]);
        };
        // this.setState({
        //     files: files
        // });
    },

    uploadToFirebase: function (file) {
        var reader = new FileReader();
        reader.onloadend = function(){
            var dataURL = reader.result;
            pictureHub.push(dataURL);
        };
        reader.readAsDataURL(file);
    },

    componentDidMount: function () {
        var self = this;
        pictureHub.on("child_added", function(snapshot) {
            self.state.files.push(snapshot.val())
            self.setState({
                files: self.state.files
            })
            console.log(snapshot.val())
        });
    },

    onOpenClick: function () {
      this.refs.dropzone.open();
    },

    render: function () {

        return (
            <div>
                <div style={{height: '50px', backgroundColor:'hotpink', fontSize:'20px', padding:'10px', color:'white', fontWeight:'100'}}>Pictures</div>
                <div style={{overflow:'scroll',height:'400px',justifyContent:'space-between', padding:'15px', display:'flex',flexWrap: 'wrap'}}>
                        <div>
                            <Dropzone style={{margin:'5px',border:'2px #eee solid', display: 'inline-block', width: '120px', height: '120px', display:'flex', justifyContent:'center', alignItems:'center'}} activeStyle={{margin:'5px',height:'120px',width:'120px',border: '3px hotpink solid',display: 'inline-block'}} ref="dropzone" onDrop={this.onDrop}>
                                <div style={{fontSize:'90px', color:'hotpink', marginBottom:'20px'}}>+</div>
                            </Dropzone>
                        </div>
                                {this.state.files.map(function(file) {
                                  return (
                                        <div style={{margin:'5px',width:'120px',height:'120px',background: 'url('+file+') 50% 50% no-repeat', backgroundSize:'cover',display:'inline-block'}}>
                                            <a>
                                            </a>
                                        </div>
                                    );
                                }.bind(this))}
                </div>
            </div>
        );
    }
});

export default DropzoneCustom;