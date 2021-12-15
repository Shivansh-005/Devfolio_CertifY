// //CORE DEPENDENCIES
// import React, { Component } from "react";
// import Particles from 'react-particles-js';
// import { BrowserRouter as Router, Link, Route } from "react-router-dom";
// import AuthenticityContract from "../../contracts/Authenticity.json";
// import getWeb3 from "../../utils/getWeb3";
// import CryptoJS from "crypto-js";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// //UI COMPONENTS
// import { faChevronDown, faInfoCircle, faUpload, faStamp, faHourglassHalf, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
// //import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {ListGroup, ListGroupItem, Card, CardBody, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'shards-react';
// import extensions from '../../assets/fileIcons/';
// import particlesConfig from '../../assets/backgrParticlesConfig.json';
// import "./FileCertificatorPage.css";
//
//
// const IPFS = require('ipfs-api');
// const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
//
// // export default ipfs;
// // assets & style
//
//
// //import certificateTemplateJpg from '../../utils/1_Thapar_Student_Residencies.jpg';
// //import certificateTemplateJpg from '/Users/shivansh/Downloads/1_Thapar_Student_Residencies.jpg';
//
// class FileCertificatorPage extends Component {
//
//   constructor() {
//     super()
//     this.state = {
//       accountHistory: null,
//       web3: null,
//       accounts: null,
//       contract: null,
//       fileHash: null,
//       fileSize: null,
//        buffer: null,
//       fileExtension: null,
//       clickAnimation: 'shadow-pop-tr',
//       clickAnimation2: '',
//       fadeInAnimation: 'fade-in',
//       errorBanner: true,
//       isTxModalOpen: false,
//       modalContent: null
//     };
//   }
//
//
//   componentDidMount = async () => {
//     try {
//       // Get network provider and web3 instance.
//       const web3 = await getWeb3(); //PASS AS PROP
//       //
//       // Use web3 to get the user's accounts.
//       const accounts = await web3.eth.getAccounts();
//           console.log("verify page",accounts[0]);
//       // // Get the contract instance.
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = AuthenticityContract.networks[networkId];
//       const instance = new web3.eth.Contract(
//         AuthenticityContract.abi,
//         deployedNetwork && deployedNetwork.address,
//       );
//
//       // Set web3, accounts, and contract to the state, and then proceed with an
//       // example of interacting with the contract's methods.
//       this.setState({ web3, accounts, contract: instance }, this.getAcctHistory);
//
//     } catch (error) {
//       // Catch any errors for any of the above operations.
//       console.error("[WEB3 ERROR]",error);
//       this.setState({web3: null, errorBanner: true}, this.forceUpdate)
//       return (<h1>connection error</h1>);
//     }
//   };
//
// //   certifyFile = async () => {
// //     const { accounts, contract } = this.state;
// //     const dataToWrite = {
// //       fileSize: this.state.fileSize,
// //       fileHash: this.state.fileHash,
// //       fileExtension: this.state.fileExtension
// //     }
// //     //triggers UI animation
// // //    this.clickAnimation2()
// //     // Stores the file info into the blockchain
// //     await contract.methods.certifyFile(dataToWrite.fileSize, dataToWrite.fileHash, dataToWrite.fileExtension).send({ from: accounts[0] });
// //
// //     //alert user that everything went ok
// //     alert('The file signature has been sent to the blockchain! It might take some time for the transaction to be mined and included in the blockchain. Check back later!')
// //
// //     // // Get the value from the contract to prove it worked.
// //     this.getAcctHistory();
// //   };
//
//   getAcctHistory = async () => {
//
//     const { accounts, contract } = this.state;
//     //call the get method of the contract
//     console.log("INSIDE HISTORY");
//     console.log("accounts ",accounts[0],accounts[1])
//     let response
//     try {
//       response = await contract.getPastEvents("FileCertified", {
//         // filter: {author: accounts[0] },
//         fromBlock: 0,
//         toBlock: 'latest'
//       });
//       // response=contract.filters.Transfer(accounts[0]);
//     } catch (e) {
//       console.error("[GETACCTHISTORY ERROR]", e);
//       this.setState({web3: null, errorBanner: true}, this.forceUpdate)
//       // return
//     }
//     //debug
//
//     console.log(">>>>>>>>>", response, "getAcctHistory EVENTS>-----")
//     this.setState({accountHistory: response, errorBanner: false})
//
//     console.log("test", contract);
//   }
//
//   arrayBufferToWordArray = (ab) => {
//   var i8a = new Uint8Array(ab);
//   var a = [];
//   for (var i = 0; i < i8a.length; i += 4) {
//     a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
//   }
//   return CryptoJS.lib.WordArray.create(a, i8a.length);
//   }
//   addtoBchain = (hashValue,uplFileSize,uplFileExtension) => {
//     console.log("SETTING");
//     this.setState({fileHash: hashValue, fileSize: uplFileSize, fileExtension: uplFileExtension}, () => {console.log("STATE >>", this.state)})
//     this.getAcctHistory();
//   }
//
//   toggleTxModal(keyElement) {
//     let { isTxModalOpen } = this.state
//     if (isTxModalOpen === false) {
//       isTxModalOpen = true
//       this.setState({
//         isTxModalOpen,
//         modalContent: this.state.accountHistory[keyElement]
//       })
//     } else {
//       isTxModalOpen = false
//       this.setState({
//         isTxModalOpen,
//         modalContent: null
//       })
//     }
//   }
//
//   timestampToDateStr(timestamp) {
//     let theDate = new Date(timestamp * 1000)
//     return theDate.toUTCString()
//   }
//
//   // UI RENDER FX
//
//
//
//   outputHistory = () => {
//
//     if (this.state.accountHistory === null) {
//       return (<p>Loading past interactions...</p>)
//     } else if (this.state.accountHistory.length === 0  ) {
//       return (<p>You haven't yet certified a file with this metamask address.</p>)
//     }
//
//     const interactions = this.state.accountHistory.map( (interaction, key) => {
//       if(interaction.returnValues.author!="0xe92CE746B773b37690df2B8095c32162DBF0CF41"){
//         console.log("IF HUI");
//       return (<p></p>)
//     }
//       console.log("--> ", interaction)
//       let myFileHash, iconImage, transactionID;
//       myFileHash = interaction.returnValues.fileHash.substring(0, 30) + '...'
//       transactionID = interaction.transactionHash.substring(0, 15) + '...'
//       let dateStamp = new Date(interaction.returnValues.timestamp * 1000)
//       if (!extensions[interaction.returnValues.fileExtension]) {
//         iconImage = extensions.file
//       } else {
//         iconImage = extensions[interaction.returnValues.fileExtension]
//       }
//
//     //   return (
//     //     // <p> IPFS hash: <b>{myFileHash}</b></p>
//     //       <Card   key={key}>
//     //         <CardBody>
//     //           <div>
//     //             <div >
//     //             <p><span role="img" aria-label="asd"></span> IPFS hash: <b>{myFileHash}</b></p>
//     //               <p ><span role="img" aria-label="asd"></span> Date: <b>{dateStamp.toUTCString()}</b></p>
//     //               <p ><span role="img" aria-label="asd"></span> File Size: <b>{interaction.returnValues.fileSize} bytes</b></p>
//     //               <p ><span role="img" aria-label="asd"></span> Blockchain Transaction ID: <a target={"_blank"} href={`https://ropsten.etherscan.io/tx/${interaction.transactionHash}`}><b>{transactionID}</b></a>  /></p>
//     //           </div>
//     //           </div>
//     //
//     //         </CardBody>
//     //       </Card>
//     //
//     //   )
//     // })
//     return (
//         <Card className={"listItemTx"}  key={key}>
//           <CardBody>
//             <div className={"cardBodyCont"}>
//               <div>
//                 <img src={iconImage} className={"historyTxFileIcon"} />
//               </div>
//               <div className={"historyTxDataPointsCont"}>
//                 <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">⌚️</span> Date: <b>{dateStamp.toUTCString()}</b></p>
//                 <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">📦</span> File Size: <b>{interaction.returnValues.fileSize} bytes</b></p>
//                 <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">🔐</span> Digital Signature: <b>{myFileHash}</b></p>
//                 <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">📒</span> Blockchain Transaction ID:<b>{transactionID}</b></p>
//                 <div>
//                   <Button onClick={() => this.toggleTxModal(key)} className={"getFileCertificate"}>Get Full Information</Button>
//                 </div>
//             </div>
//             </div>
//
//           </CardBody>
//         </Card>
//     )
//     })
//     return (
//       <div className={"pastInteractionBox"}>
//         {interactions}
//       </div>
//     )
//   }
//
//   renderCertifyBtn() {
//     if (!this.state.fileHash) {
//       return (
//         null
//       )
//     }
//
//     return (
//       <div >
//         <p >Timestamp the metadata into the blockchain</p>
//          <Button className={`${this.state.fadeInAnimation} ${this.state.clickAnimation2} certifyFileFinalBtn`} theme="success" onClick={() => this.certifyFile()} disabled={!this.state.fileHash} style={{padding: '20px'}}><FontAwesomeIcon icon={faStamp} ></FontAwesomeIcon>CERTIFY FILE</Button>
//       </div>
//     )
//   }
//
//   generateModalContent() {
//     const { modalContent } = this.state
//
//     if (modalContent === null) {
//       return null
//     }
//
//     console.log("MODALCONTENTTT", modalContent);
//
//     return (
//       <Modal animation={true} open={this.state.isTxModalOpen} toggle={() => this.toggleTxModal()}>
//         <ModalHeader closeAriaLabel={"clusetubbon"}>
//           File Details
//         </ModalHeader>
//         <ModalBody className={"modalBodyClass"}>
//
//           <p><b>Submission Date:</b></p>
//           <p>{this.timestampToDateStr(modalContent.returnValues.timestamp)}</p>
//           <p><b>IPFS File Hash:</b></p>
//           <pre className={"modelHashData"}>{modalContent.returnValues.fileHash}</pre>
//           <p><b>File Size:</b></p>
//           <p>{modalContent.returnValues.fileSize}</p>
//           <p><b>File Extension:</b></p>
//           <p>{modalContent.returnValues.fileExtension}</p>
//           <p><b>Blockchain Transaction:</b></p>
//
//         </ModalBody>
//         <ModalFooter>
//
//           <Button theme={"danger"} onClick={() => this.toggleTxModal()}>Close</Button>
//         </ModalFooter>
//       </Modal>
//     )
//   }
//
//
//   render() {
//
//     //load a loading screen on first load and errors
//     if (!this.state.web3 || this.state.errorBanner === true) {
//       return (
//         <div className={"globalErrCont"}>
//           <p>Loading Web3, accounts, and contract...</p>
//
//         </div>
//       );
//     }
//
//
//     return (
//       <>
//
//       <div className={"globalCont"} justify="center">
//         <section>
//           <div id={"heroTitles"}>
//             <h1 >Decentralized Certificate Authentication</h1>
//             <h2 >Certify the Authenticity of any file</h2>
//             <p >By writing a timestamped digital signature of your file into the ethereum blockchain, you can mathematically prove its existence and its integrity over time.</p>
//
//           </div>
//           <div id="fileUplCont">
//             <div className={"stepsContainer"}>
//               <Button size={'lg'} className={`certifyBtn ${this.state.clickAnimation}`}><label htmlFor="fileCert"> <FontAwesomeIcon id={"uploadIcon"} icon={faUpload} />CHOOSE FILE</label></Button>
//             <p className={"tutorialParags"}>Select the file that you want to upload to IPFS and insert into blockchain</p>
//             </div>
//
//             <input id="fileCert" name="fileCert" type="file" onChange={(e) => this.uploadFile(e)} />
//
//
//             {this.outputFileHash()}
//             {this.renderCertifyBtn()}
//
//           </div>
//       </section>
//
//       <div className={"pastInterContainer"}>
//           {this.outputHistory()}
//       </div>
//
//     </div>
//
//       { this.generateModalContent() }
//     </>
//     )
//   }
// }
//
<p> verify portal</p>
export default verification
