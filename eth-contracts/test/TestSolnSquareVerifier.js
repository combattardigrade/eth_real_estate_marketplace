const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Verifier = artifacts.require('Verifier');

contract('SolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const proof = require('./proof.json')

    describe('SolnSquareVerifier', () => {
        beforeEach(async () => {
            this.verifier = await Verifier.new({ from: account_one })
            this.contract = await SolnSquareVerifier.new(this.verifier.address, { from: account_one })
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('Test if a new solution can be added for contract - SolnSquareVerifier', async () => {
            const { proof: { a, b, c }, inputs: inputs } = proof;
            let verifierKey = await this.contract.getVerifierKey(a, b, c, inputs);
            await this.contract.addSolution(1, account_one, verifierKey);
            const account = await this.contract.getUniqueSolution(verifierKey);
            assert.equal(account, account_one, "Solution not added");
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Test if an ERC721 token can be minted for contract - SolnSquareVerifier', async () => {
            const { proof: { a, b, c }, inputs: inputs } = proof;
            await this.contract.verifyAndMint(account_two, 5, a, b, c, inputs, {from: account_one});
            const balance = await this.contract.balanceOf(account_two);            
            assert.equal(balance, 1, "ERC721 token not minted");
        })
    })
})





