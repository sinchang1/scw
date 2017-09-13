import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

var myAddress = "1NFxgVFC87KEuiC5PUsLxuoR2pyYSLBv2c";
var privateKey = "L1c3ugm7qNduXvrZr5e6vjBH2ygKAQGS8eM3u5VL8Fyh2SBWrwDn";
var TestNetClient = new CoinStack('c7dbfacbdf1510889b38c01b8440b1', '10e88e9904f29c98356fd2d12b26de');
TestNetClient.endpoint = "testchain.blocko.io";
TestNetClient.protocol = "http://";

Address = new Mongo.Collection('address');

//첫번째 db에 데잍터 삽입
// Address.insert({
//   address:"1NFxgVFC87KEuiC5PUsLxuoR2pyYSLBv2c",
//   name : "myaddress"
// });

// Address.insert({
//   address:"183YnjZZ7TCCf4LvsDWjuUKBy4QTerL44",
//   name : "dambi"
// });

// Address.insert({
//   address:"12Bxv4SUJdn3DarcXJSoFxCxxirh4Ug3zZ",
//   name : "teacher"
// });

//두번째


Meteor.startup(() => {
  // code to run on server at startup
console.log(TestNetClient);
TestNetClient.getBlockchainStatus(function(err, status) {
    console.log(status);
});

// server
var balance = CoinStack.Math.toBitcoin(TestNetClient.getBalanceSync(myAddress));
console.log('my Wallet: ' + balance);
});


// // server
// var txBuilder = TestNetClient.createTransactionBuilder();
// txBuilder.addOutput("183YnjZZ7TCCf4LvsDWjuUKBy4QTerL44", CoinStack.Math.toSatoshi("0.000001"));
// txBuilder.setInput(myAddress);
// txBuilder.setFee(CoinStack.Math.toSatoshi("0.00001"));

// var tx = TestNetClient.buildTransactionSync(txBuilder);
// tx.sign(privateKey);
// var rawSignedTx = tx.serialize();
// console.log(rawSignedTx)

// // server
// try {
//   // send tx
//   TestNetClient.sendTransactionSync(rawSignedTx);
// } catch (e) {
//   console.log("failed to send tx");
// }


Meteor.methods({
  getAddress: function (obj) {

    var data = Address.find({name:obj.name}).fetch();
    if(data.length>0)
      {
        console.log("기존회원")
      }
    else{
      var privateKey = CoinStack.ECKey.createKey();
      var address = CoinStack.ECKey.deriveAddress(privateKey);
      Address.insert({
           address: address,
           privateKey:privateKey,
           name : obj.name
         });
         console.log("신규생성")
    }
    obj= Address.findOne({name:obj.name});
    return obj;
    // obj.myAddress= Address.findOne({name:obj.name}).address;
    // console.log(obj.myAddress);
    // return obj.myAddress;
},
  sendbitcoin:function(obj){
    var txBuilder = TestNetClient.createTransactionBuilder();
    txBuilder.addOutput(obj.currentAddress, CoinStack.Math.toSatoshi("0.000001"));
    txBuilder.setInput(obj.userAddress);
    txBuilder.setFee(CoinStack.Math.toSatoshi("0.00001"));
    
    var tx = TestNetClient.buildTransactionSync(txBuilder);
    tx.sign(obj.userPrivateKey);
    var rawSignedTx = tx.serialize();
    console.log(rawSignedTx)
    
    // server
    try {
      // send tx
      TestNetClient.sendTransactionSync(rawSignedTx);
    } catch (e) {
      console.log("failed to send tx");
    }
  }
}
);
  