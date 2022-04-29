import { Web3Controller } from '@/src/controllers/web3';

export const AuthController = {
    signIn: async(address, password) => {
        // let gas = web3.eth.getGasPrice();
        
        await Web3Controller.Auth.signIn(address, password, {
            from: address
        });
    
        const user0 = await Web3Controller.Auth.usersByAddr(address);

        return user0.isLoggedIn;
    },

    signUp: async(address, name, email, password, vatid, image) => {
        await Web3Controller.Auth.signUp(address, name, email, password, vatid, image, {
            from: address
        });
    },

    tryToConnect: async(address, password) => {
       const user = await Web3Controller.Auth.usersByAddr(address);
       
       return user.password == password;
    },

    checkExists: async(address) => {
        const user = await Web3Controller.Auth.usersByAddr(address);
        return (user.email) ? 1 : 0;
    },

    getUserData: async(address) => {
        return await Web3Controller.Auth.getUser(address);
    }
}