import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import AuthenticityContract from "../../contracts/Authenticity.json";
import getWeb3 from "../../utils/getWeb3";
import {ListGroup, ListGroupItem, Card, CardBody, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'shards-react';
import extensions from '../../assets/fileIcons/';
import "./FileCertificatorPage.css";
//QmQrsMiXkwL9YyLtZ3bwr2eDkuaYDRntCRPCkuyf5jKYYp
var userHash = '';
var valid=0;
var total=10000;
var author='0x475A9091D9E6075e1Bb02B555A226889E760242D';
class FileCertificatorPage extends Component {
  constructor() {
    super()
    this.state = {
      accountHistory: null,
      web3: null,
      accounts: null,
      contract: null,
      fileHash: null,
      fileSize: null,
       buffer: null,
      fileExtension: null,
      clickAnimation: 'shadow-pop-tr',
      clickAnimation2: '',
      fadeInAnimation: 'fade-in',
      errorBanner: true,
      isTxModalOpen: false,
      modalContent: null,
      value: '',
      cnt:0
    };
    this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
      this.setState({value: event.target.value});
    }

    handleSubmit(event) {
      userHash=this.state.value;
      event.preventDefault();
      {this.outputHistory()}
      {this.checkAuth()}
    }
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3(); //PASS AS PROP
      //
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
          console.log("verify page",accounts[0]);
      // // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuthenticityContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuthenticityContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getAcctHistory);

    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error("[WEB3 ERROR]",error);
      this.setState({web3: null, errorBanner: true}, this.forceUpdate)
      return (<h1>connection error</h1>);
    }
  };
  getAcctHistory = async () => {
console.log(userHash);
    const { accounts, contract } = this.state;
    //call the get method of the contract
    console.log("INSIDE HISTORY");
    console.log("accounts ",accounts[0],accounts[1])
    let response
    try {
      response = await contract.getPastEvents("FileCertified", {
        // filter: {author: accounts[0] },
        fromBlock: 0,
        toBlock: 'latest'
      });
      // response=contract.filters.Transfer(accounts[0]);
    } catch (e) {
      console.error("[GETACCTHISTORY ERROR]", e);
      this.setState({web3: null, errorBanner: true}, this.forceUpdate)
      // return
    }
    //debug

    console.log(">>>>>>>>>", response, "getAcctHistory EVENTS>-----")
    console.log(response.length);
    total=response.length;
    this.setState({accountHistory: response, errorBanner: false})

    console.log("test", contract);
  }
  // UI RENDER FX



  outputHistory = () => {

    if (this.state.accountHistory === null) {
      return (<p></p>)
    } else if (this.state.accountHistory.length === 0  ) {
      return (window.alert("FAILED to verify"));
    }
    const interactions = this.state.accountHistory.map( (interaction, key) => {
      this.state.cnt=this.state.cnt+1;
      console.log("COUNt=",this.state.cnt);
      let myFileHash, iconImage, transactionID;
      myFileHash = interaction.returnValues.fileHash.substring(0, 30) + '...'
      transactionID = interaction.transactionHash.substring(0, 15) + '...'
      let dateStamp = new Date(interaction.returnValues.timestamp * 1000)
      if (!extensions[interaction.returnValues.fileExtension]) {
        iconImage = extensions.file
      } else {
        iconImage = extensions[interaction.returnValues.fileExtension]
      }
        console.log("checking with " ,interaction.returnValues.fileHash);
        if(interaction.returnValues.fileHash===userHash)
        {
          valid=1;
          var dwnurl="https://ipfs.infura.io/ipfs/"+userHash;
          // window.alert("The certificate is genuine and issued by TIET, it may be downloaded from "+dwnurl);
          console.log("CERTI OK");
          // return(<p>STATUS: Genuine</p>)
          if (window.confirm('The certificate is genuine and issued by TIET, click OK to download '))
            {
                window.location.href=dwnurl;
              }
            else{
                window.location.href='http://localhost:3000/about'; // change URL  
            };
        }

    })
    return (
      <div className={"pastInteractionBox"}>
        {interactions}
      </div>
    )
  }



  generateModalContent() {
    const { modalContent } = this.state

    if (modalContent === null) {
      return null
    }

    console.log("MODALCONTENTTT", modalContent);

    return (
      <Modal animation={true} open={this.state.isTxModalOpen} toggle={() => this.toggleTxModal()}>
        <ModalHeader closeAriaLabel={"clusetubbon"}>
          File Details
        </ModalHeader>
        <ModalBody className={"modalBodyClass"}>

          <p><b>Submission Date:</b></p>
          <p>{this.timestampToDateStr(modalContent.returnValues.timestamp)}</p>
          <p><b>IPFS File Hash:</b></p>
          <pre className={"modelHashData"}>{modalContent.returnValues.fileHash}</pre>
          <p><b>File Size:</b></p>
          <p>{modalContent.returnValues.fileSize}</p>
          <p><b>File Extension:</b></p>
          <p>{modalContent.returnValues.fileExtension}</p>
          <p><b>Blockchain Transaction:</b></p>

        </ModalBody>
        <ModalFooter>

          <Button theme={"danger"} onClick={() => this.toggleTxModal()}>Close</Button>
        </ModalFooter>
      </Modal>
    )
  }
checkAuth = () => {
  console.log("TOT= ",total);
  if(total===this.state.cnt && valid===0)
  {
    window.alert("FAILED TO VERIFY CERTIFICATE");
      return(<p>STATUS:VERIFICATION FAILED</p>);
  }
}
// data = document.getElementById('id').value;

  render() {

    return (
      <>
      <div className={"globalCont"} justify="center">

<form onSubmit={this.handleSubmit}>
        <label>
          Enter IPFS Hash
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Validate" />
      </form>
      <div className={"pastInterContainer"}>
        <p> Certificate verification portal TIET</p>
      </div>
    </div>

      { this.generateModalContent() }
    </>
    )
  }
}

export default FileCertificatorPage
