//CORE DEPENDENCIES
import React, { Component } from "react";
import Particles from 'react-particles-js';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import AuthenticityContract from "../../contracts/Authenticity.json";
import getWeb3 from "../../utils/getWeb3";
import CryptoJS from "crypto-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//UI COMPONENTS
import { faChevronDown, faInfoCircle, faUpload, faStamp, faHourglassHalf, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {ListGroup, ListGroupItem, Card, CardBody, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'shards-react';
import extensions from '../../assets/fileIcons/';
import particlesConfig from '../../assets/backgrParticlesConfig.json';
import "./FileCertificatorPage.css";


const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

// export default ipfs;
// assets & style


//import certificateTemplateJpg from '../../utils/1_Thapar_Student_Residencies.jpg';
//import certificateTemplateJpg from '/Users/shivansh/Downloads/1_Thapar_Student_Residencies.jpg';
var recep='recep_add';
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
      modalContent: null
    };
    this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
      this.setState({value: event.target.value});
        event.preventDefault();
    }

    handleSubmit(event) {
      recep=this.state.value;
      console.log("recep add= ",recep);
      event.preventDefault();
    }


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3(); //PASS AS PROP
      //
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
        console.log("THIS IS THE account:",accounts[0]);
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

  certifyFile = async () => {
    const { accounts, contract } = this.state;
    this.state.fileExtension=recep;
    const dataToWrite = {
      fileSize: this.state.fileSize,
      fileHash: this.state.fileHash,
      fileExtension: this.state.fileExtension
    }
    //triggers UI animation
//    this.clickAnimation2()
    // Stores the file info into the blockchain
    await contract.methods.certifyFile(dataToWrite.fileSize, dataToWrite.fileHash, dataToWrite.fileExtension).send({ from: accounts[0] });

    //alert user that everything went ok
    window.alert("File sent to address "+recep);

    // // Get the value from the contract to prove it worked.
    this.getAcctHistory();
  };

  getAcctHistory = async () => {

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
    this.setState({accountHistory: response, errorBanner: false})

    console.log("test", contract);
  }

  arrayBufferToWordArray = (ab) => {
  var i8a = new Uint8Array(ab);
  var a = [];
  for (var i = 0; i < i8a.length; i += 4) {
    a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length);
  }
  addtoBchain = (hashValue,uplFileSize,uplFileExtension) => {
    console.log("SETTING");
    console.log("ADDING RECEP TO BCHAIN: ",recep);
    this.setState({fileHash: hashValue, fileSize: uplFileSize, fileExtension: uplFileExtension}, () => {console.log("STATE >>", this.state)})
    this.getAcctHistory();
  }
  uploadtoipfs = (hashValue,uplFileSize,uplFileExtension) =>{
    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
          console.log("error in buffer");
        console.error(error)
        return
      }
      console.log('ifpsHash', result[0].hash);

  //     console.log('before');
  //     var start = new Date().getTime();
  //     var end = start;
  //     while(end < start + 7000) {
  //       end = new Date().getTime();
  //     } //7 seconds in milliseconds
  // console.log('after');
      hashValue=result[0].hash;
      if(hashValue!=null)
    {console.log("hash is not null "); uplFileExtension=recep; this.addtoBchain(hashValue,uplFileSize,uplFileExtension)}
      // this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
      //   return this.setState({ ipfsHash: result[0].hash })
      //   console.log('ifpsHash', this.state.ipfsHash)
      // })
    })
  }
  uploadFile = async (event) => {
    console.log("*******", event.target.files[0].name)
    const uplFile = event.target.files[0]
    const uplFileSize = uplFile.size
    const uplFileExtension = uplFile.name.split('.').pop()
    console.log(uplFile)
    // const reader = new FileReader();
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
      var hashValue =  null;
       this.buffer= null
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
      this.uploadtoipfs(hashValue,uplFileSize,uplFileExtension);
    }



       // outputFileHash()
    // reader.onload = (e) => {
    //   var arrayBuffer = e.target.result;
    //   // event.preventDefault()
    //
    //     // var hashValue = CryptoJS.SHA256(this.arrayBufferToWordArray(arrayBuffer)).toString(CryptoJS.enc.Hex);
    //   var hashValue =  this.state.ipfsHash;
    //     this.setState({fileHash: hashValue, fileSize: uplFileSize, fileExtension: uplFileExtension}, () => {console.log("STATE >>", this.state)})
    // }
    // reader.readAsArrayBuffer(uplFile);
   //  event.preventDefault()
   // const file = event.target.files[0]
   // const reader = new window.FileReader()
   // reader.readAsArrayBuffer(file)
   // reader.onloadend = () => {
   //   this.setState({ buffer: Buffer(reader.result) })
   //   console.log('buffer', this.state.buffer)
   // }
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

  timestampToDateStr(timestamp) {
    let theDate = new Date(timestamp * 1000)
    return theDate.toUTCString()
  }

  // UI RENDER FX

  outputFileHash = () => {
    if (this.state.fileHash === null) {
      return (null)
    }

    return (
      <div >
        <p className={"fileSize fade-in"}>Review the metadata</p>
        <div >
          <p className={"fileSize fade-in"}>
            <u>IPFS Hash:</u> </p>
            <p className={"fileSize2 fade-in"}><strong>{this.state.fileHash}</strong>
          </p>
          <p className={"fileSize fade-in"}>
          <form onSubmit={this.handleSubmit} >
                  <label>
                    Enter Recipient Wallet address:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                  </label>
                  <input type="button" onClick={this.handleSubmit} value="Confirm" />
                </form>
          </p>
          <p className={"fileSize fade-in"}><u>FILE SIZE (KB):</u></p>
          <p className={"fileSize2 fade-in"}><strong>{this.state.fileSize/1024}</strong></p>
        </div>
      </div>
    )

  }

  outputHistory = () => {

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
      // console.log("--> ", interaction)
      let myFileHash, iconImage, transactionID;
      myFileHash = interaction.returnValues.fileHash.substring(0, 30) + '...'
      transactionID = interaction.transactionHash.substring(0, 15) + '...'
      let dateStamp = new Date(interaction.returnValues.timestamp * 1000)
      if (!extensions[interaction.returnValues.fileExtension]) {
        iconImage = extensions.file
      } else {
        iconImage = extensions[interaction.returnValues.fileExtension]
      }

    //   return (
    //     // <p> IPFS hash: <b>{myFileHash}</b></p>
    //       <Card   key={key}>
    //         <CardBody>
    //           <div>
    //             <div >
    //             <p><span role="img" aria-label="asd"></span> IPFS hash: <b>{myFileHash}</b></p>
    //               <p ><span role="img" aria-label="asd"></span> Date: <b>{dateStamp.toUTCString()}</b></p>
    //               <p ><span role="img" aria-label="asd"></span> File Size: <b>{interaction.returnValues.fileSize} bytes</b></p>
    //               <p ><span role="img" aria-label="asd"></span> Blockchain Transaction ID: <a target={"_blank"} href={`https://ropsten.etherscan.io/tx/${interaction.transactionHash}`}><b>{transactionID}</b></a>  /></p>
    //           </div>
    //           </div>
    //
    //         </CardBody>
    //       </Card>
    //
    //   )
    // })
    return (
        <Card className={"listItemTx"}  key={key}>
          <CardBody>
            <div className={"cardBodyCont"}>
              <div>
                <img src={iconImage} className={"historyTxFileIcon"} />
              </div>
              <div className={"historyTxDataPointsCont"}>
                <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">⌚️</span> Date: <b>{dateStamp.toUTCString()}</b></p>
                <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">📦</span> File Size: <b>{interaction.returnValues.fileSize/1024} KB</b></p>
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
    })
    return (
      <div className={"pastInteractionBox"}>
        {interactions}
      </div>
    )
  }

  renderCertifyBtn() {
    if (!this.state.fileHash) {
      return (
        null
      )
    }

    return (
      <div >
        <p className={"fileSize fade-in"}>Timestamp the metadata into the blockchain</p>
        <div className={"stepsContainer"} >
         <Button className={`${this.state.fadeInAnimation} ${this.state.clickAnimation2} certifyFileFinalBtn`} theme="success" onClick={() => this.certifyFile()} disabled={!this.state.fileHash} style={{padding: '20px'}}><FontAwesomeIcon icon={faStamp} ></FontAwesomeIcon>CERTIFY FILE</Button>
          </div>
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
          <p><b>Recipient Address:</b></p>
          <p>{modalContent.returnValues.fileExtension}</p>


        </ModalBody>
        <ModalFooter>

          <Button theme={"danger"} onClick={() => this.toggleTxModal()}>Close</Button>
        </ModalFooter>
      </Modal>
    )
  }


  render() {

    //load a loading screen on first load and errors
    if (!this.state.web3 || this.state.errorBanner === true) {
      return (
        <div className={"globalErrCont"}>
          <p>Loading Web3, accounts, and contract...</p>

        </div>
      );
    }


    return (
      <>

      <div className={"globalCont"} justify="center">
        <section>
          <div id={"heroTitles"}>
            <h1 >Decentralized Certificate Authentication</h1>
            <h2 >Certify the Authenticity of any file</h2>
            <p >By writing a timestamped digital signature of your file into the ethereum blockchain, you can mathematically prove its existence and its integrity over time.</p>

          </div>
          <div id="fileUplCont">
            <div className={"stepsContainer"}>
              <Button size={'lg'} className={`certifyBtn ${this.state.clickAnimation}`}><label htmlFor="fileCert"> <FontAwesomeIcon id={"uploadIcon"} icon={faUpload} />CHOOSE FILE</label></Button>
            <p className={"tutorialParags"}>Select the file that you want to upload to IPFS and insert into blockchain</p>
            </div>

            <input id="fileCert" name="fileCert" type="file" onChange={(e) => this.uploadFile(e)} />


            {this.outputFileHash()}
            {this.renderCertifyBtn()}

          </div>
      </section>

      <div className={"pastInterContainer"}>
          {this.outputHistory()}
      </div>

    </div>

      { this.generateModalContent() }
    </>
    )
  }
}

export default FileCertificatorPage
