const Authenticity = artifacts.require("./Authenticity.sol");

contract("Authenticity", accounts => {
  it("...should store the value 89.", async () => {
    const AuthenticityInstance = await Authenticity.deployed();

    // Set value of 89
    await AuthenticityInstance.set(89, { from: accounts[0] });

    // Get stored value
    const storedData = await AuthenticityInstance.get.call();

    assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});
