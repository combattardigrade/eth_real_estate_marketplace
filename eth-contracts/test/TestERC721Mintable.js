var ERC721MintableComplete = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({ from: account_one });
            // TODO: mint multiple tokens
            await this.contract.mint(account_one, 1, { from: account_one })
            await this.contract.mint(account_one, 2, { from: account_one })
            await this.contract.mint(account_two, 3, { from: account_one })           
        })

        it('should return total supply', async function () {
            const totalSupply = await this.contract.totalSupply()
            assert.equal(totalSupply, 3, "Invalid total supply")
        })

        it('should get token balance', async function () {
            const balance = await this.contract.balanceOf(account_one)
            assert.equal(balance, 2, "Invalid balance")
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            const tokenURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1'
            const uri_res = await this.contract.tokenURI(1)
            assert.equal(uri_res, tokenURI, "Invalid token URI")
        })

        it('should transfer token from one owner to another', async function () {
            await this.contract.transferFrom(account_one, account_two, 1)
            const account_two_balance = await this.contract.balanceOf(account_two)
            assert.equal(account_two_balance, 2, "Invalid token transfer")
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({ from: account_one });
        })

        it('should fail when minting when address is not contract owner', async function () {
            let failed = false
            
            try {
                await this.contract.mint(account_one, 1, { from: account_two })
            } catch(e) {
                failed = true
            }

            assert.equal(failed, true, "Minting did not fail from address different from owner")
        })

        it('should return contract owner', async function () {
            const owner = await this.contract.getOwner()
            assert.equal(owner, account_one, "Incorrect owner")
        })

    });
})