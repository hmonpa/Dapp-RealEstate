const Auth = artifacts.require('Auth');

contract('Auth', () => {
    before(async() => {
        this.Auth = await Auth.deployed();
    })

    it('Auth contract deployed successfully', async() => {
        const address = this.Auth.address;

        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");

    });

    it('get users list and individual', async() => {
        let signUp = await this.Auth.signUp("Example", "example@example.com", "pass12345");
        
        const userCounter = await this.Auth.usersCounter();
        assert.equal(userCounter.toNumber(), 2);

        const user = signUp.logs[0].args;

        assert.equal(user.name, "Example");
        assert.equal(user.email, "example@example.com");
        assert.equal(user.password, "pass12345");
    });

});