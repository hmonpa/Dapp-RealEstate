import { Web3Controller } from '@/src/controllers/web3';
import { CurrenciesController } from './currencies';

export const PropertiesController = {

    propertyExists: async(id) => {
        console.log("hola")
        let res = await Web3Controller.Properties.getPropertyById(id);
        return res;
    },

    uploadPropertyData: async(owner, rooms, area, bathrooms) => {
        await Web3Controller.Properties.addPropertyData(rooms, area, bathrooms, {
            from: owner
        });
    },

    uploadProperty: async(id, owner, city, addr, price, sellOrRent, tokens, rentalEndDate, cid) => {
        let priceInWei = await CurrenciesController.convertEurToWei(price);

        await Web3Controller.Properties.uploadProperty(id, owner, city, addr, priceInWei, sellOrRent, tokens, rentalEndDate, cid, {
            from: owner
        });
    },

    buyProperty: async(from, id, value) => {
        try
        {
            return await Web3Controller.Properties.buyProperty(from, id, {
                from: from, 
                value: value
            });

        } catch (err) {
            return await web3.eth.getBalance(from);
        }
    },

    rentProperty: async(from, id, rentalEndDate, value) => {
        try
        {
            return await Web3Controller.Properties.rentProperty(from, id, rentalEndDate, {
                from: from, 
                value: value
            });

        } catch (err) {
            return await web3.eth.getBalance(from);
        }
    },

    buyTokens: async(from, id, tokensToBuy, priceToPay) => {
        try
        {
            return await Web3Controller.Properties.buyTokens(from, tokensToBuy, id, {
                from: from,
                value: priceToPay
            })
        } catch (err) {
            console.log(err);
        }
    },

    removeProperty: async(from, id) => {
        try {
            await Web3Controller.Properties.removeProperty(id, {
                from: from
            });
        } catch (err){
            console.log(err);
        }
    }



}