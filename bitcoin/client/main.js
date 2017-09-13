import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from 'meteor/mongo';

import './main.html';



//몽고디비 설정
Address = new Mongo.Collection('address');

    //블록체인 테스트넷 설정
    var TestNetClient = new CoinStack('c7dbfacbdf1510889b38c01b8440b1', '10e88e9904f29c98356fd2d12b26de');
    TestNetClient.endpoint = "testchain.blocko.io";
    TestNetClient.protocol = "http://";

//나의 주소와 키값
var userAddress;
var userPrivateKey;
//선택된 자의 주소
var currentAddress;
//아무것도 안함 헤더
Template.header.helpers({
});

Template.leaderboard.helpers({
  counter() {
    return Template.instance().counter.get();   //이벤트 인스턴스의 값
  },
 firstName: function() {
   return Meteor.user().username;
 },
 friends: function(){

  return Address.find();
 }
});

Template.leaderboard.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.leaderboard.events({  //이벤트객체

  "click button[name=send]"(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
    console.log(this.name); //브라우저 콘솔에서 보일것임
    name=this.name;
    Meteor.call("getAddress",{name},function(error, obj){
      console.log("친구주소");
      console.log(obj.address);
      currentAddress=obj.address;
      var qrcodesvg = new Qrcodesvg(obj.address,"qrcode",250);
      qrcodesvg.draw();
    });
  },
  "click button[name=sendbitcoin]"(event, instance){
    console.log("subitcoin");
    console.log(currentAddress);

    Meteor.call("sendbitcoin",{userAddress,userPrivateKey,currentAddress},function(){});
    //거래전송
    
  //   var txBuilder = TestNetClient.createTransactionBuilder();
  //   txBuilder.addOutput(currentAddress, CoinStack.Math.toSatoshi("0.0001"));
  //   txBuilder.setInput(userAddress);
  //   txBuilder.setFee(CoinStack.Math.toSatoshi("0.0001"));
    
  //   txBuilder.buildTransaction(function(err, tx) {
  //     console.log("mainjs.71line");
  //     console.log(userPrivateKey);
  //     tx.sign(userPrivateKey);
  //     var rawSignedTx = tx.serialize();
  //     console.log(rawSignedTx);
  //     // send tx
  //     coinstackclient.sendTransaction(rawSignedTx, function(err) {
  //       if (null != err) {
  //           console.log("failed to send tx");
  //       }
  //     });//send tx끝
  // });//빌드 트랜잭션 끝


}//click button 끝
});

Template.leaderboard.rendered = function () {
//var myAddress = "1NFxgVFC87KEuiC5PUsLxuoR2pyYSLBv2c";
  var name = Meteor.user().username;
  console.log(name);
  
//로그인한사람
  Meteor.call("getAddress",{name},function(error, obj){
    console.log(obj.address);
    var qrcodesvg = new Qrcodesvg(obj.address,"qrcode",250);
    userAddress=obj.address;
    userPrivateKey=obj.privateKey;
  });

  // var qrcodesvg = new Qrcodesvg(myAddress,"qrcode",250);
  // qrcodesvg.draw();
}