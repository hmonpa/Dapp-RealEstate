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

    it('get users list', async() => {
        const usersCounter = await this.Auth.usersCounter();
        const user = await this.Auth.users()[0];

        assert.equal(user.name, "Héctor");
        assert.equal(user.password, "pass12345");
    });
});