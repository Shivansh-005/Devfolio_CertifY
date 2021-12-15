pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Authenticity.sol";

contract TestAuthenticity {

  function testItStoresAValue() public {
    Authenticity authenticity = Authenticity(DeployedAddresses.Authenticity());

    authenticity.set(89);

    uint expected = 89;

    Assert.equal(authenticity.get(), expected, "It should store the value 89.");
  }

}
