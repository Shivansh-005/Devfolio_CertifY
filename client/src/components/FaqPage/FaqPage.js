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
var author='';
var currAdd='';
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


    }
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3(); //PASS AS PROP
      //
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log("verify page",accounts[0]);
      currAdd=accounts[0];
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
  console.log("Address=", currAdd);
    if (this.state.accountHistory === null) {
      return (<p>Loading past interactions...</p>)
    } else if (this.state.accountHistory.length === 0  ) {
      return (<p>Nothing to show yet!</p>)
    }

    const interactions = this.state.accountHistory.map( (interaction, key) => {
    //   if(interaction.returnValues.author!="0xe92CE746B773b37690df2B8095c32162DBF0CF41"){
    //     console.log("IF HUI");
    //   return (<p></p>)
    // }
      console.log("--> ", interaction)
      let myFileHash, iconImage, transactionID;
      myFileHash = interaction.returnValues.fileHash.substring(0, 30) + '...'
      transactionID = interaction.transactionHash.substring(0, 15) + '...'
      let dateStamp = new Date(interaction.returnValues.timestamp * 1000)
      if (!extensions[interaction.returnValues.fileExtension]) {
        iconImage = extensions.file
      } else {
        iconImage = extensions[interaction.returnValues.fileExtension]
      }
      if(interaction.returnValues.fileExtension==currAdd){
    return (
        <Card className={"listItemTx"}  key={key}>
          <CardBody>
            <div className={"cardBodyCont"}>
              <div>
                <img src={iconImage} className={"historyTxFileIcon"} />
              </div>
              <div className={"historyTxDataPointsCont"}>
                <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">⌚️</span> Date: <b>{dateStamp.toUTCString()}</b></p>
                <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">📦</span> File Size: <b>{interaction.returnValues.fileSize/1024}KB</b></p>
                <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">🔐</span> Digital Signature: <b>{myFileHash}</b></p>
                <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">📒</span> Blockchain Transaction ID:<b>{transactionID}</b></p>
                <div>
                  <Button onClick={() => this.toggleTxModal(key)} className={"getFileCertificate"}>Get Full Information</Button>
                </div>
            </div>
            </div>

          </CardBody>
        </Card>
    )
  }
    })
    return (
      <div className={"pastInteractionBox"}>
        {interactions}
      </div>
    )
  }
  timestampToDateStr(timestamp) {
    let theDate = new Date(timestamp * 1000)
    return theDate.toUTCString()
  }
  toggleTxModal(keyElement) {
    let { isTxModalOpen } = this.state
    if (isTxModalOpen === false) {
      isTxModalOpen = true
      this.setState({
        isTxModalOpen,
        modalContent: this.state.accountHistory[keyElement]
      })
    } else {
      isTxModalOpen = false
      this.setState({
        isTxModalOpen,
        modalContent: null
      })
    }
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

  render() {

    return (
      <>
      <div className={"globalCont"} justify="center">

      <div className={"pastInterContainer"}>
      {this.outputHistory()}

        <p> Certificate issue portal TIET</p>

      </div>
    </div>

      { this.generateModalContent() }
    </>
    )
  }
}

export default FileCertificatorPage
