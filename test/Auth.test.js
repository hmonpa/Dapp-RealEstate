const Auth = artifacts.require('Auth');

contract('Auth', () => {
    before(async() => {
        this.Auth = await Auth.deployed();
    })

    it('Auth contract deployed successfully', async() => {
        const address = this.Auth.address;

        // @ de contrato válida
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");

    });

    it('get users list and individual', async() => {
        // Nuevo usuario
        let signUp = await this.Auth.signUp("Example", "example@example.com", "pass12345");
        
        // Número de usuarios total
        const userCounter = await this.Auth.usersCounter();
        assert.equal(userCounter.toNumber(), 2);            

        // Comprobación de datos
        const firstUser = await this.Auth.users(0);
        
        assert.equal(firstUser.name, "Héctor");
        assert.equal(firstUser.email, "hmonpa@gmail.com");
        assert.equal(firstUser.password, "pass123456");
        assert.equal(firstUser.isLoggedIn, false);

        // Segunda comprobación de datos
        const secondUser = signUp.logs[0].args;
        assert.equal(secondUser.name, "Example");
        assert.equal(secondUser.email, "example@example.com");
        assert.equal(secondUser.password, "pass12345");
        assert.equal(secondUser.isLoggedIn, false);
    });

    it('Users are logged successfully', async() => {
        let UserExample = await this.Auth.users(1);
        let UserAddr = UserExample.addr;
        let UserPwd = UserExample.password;

        let signIn = await this.Auth.signIn(UserAddr, UserPwd);
        assert.equal(UserAddr, "0x627306090abaB3A6e1400e9345bC60c78a8BEf57");
        assert.equal(UserPwd, "pass12345");

        let checkLoginByAddr = await this.Auth.checkIsUserLoggedByAddr(UserAddr);
        assert.equal(checkLoginByAddr, true);

        // let checkLogin = await this.Auth.checkIsUserLogged(1);
        // assert.equal(checkLogin, true);
    });

    it('find specific user', async() => {
        const usersCounter = await this.Auth.usersCounter();
        
        let newUser = await this.Auth.signUp("Another User", "anotheruser@example.com", "pass12345");
        newUser = newUser.logs[0].args;
        let newUserAddr = newUser.addr;

        let index = await this.Auth.findByAddr(newUserAddr);
        assert.equal(index, 0);
    });

});