<template>
    <!-- ======= Properties Section ======= -->
    <section id="properties" class="properties" style="margin-top:100px">
      <div class="container">

        <div class="section-title" data-aos="fade-up">
          <h2>Properties</h2>
          <p>Check out the current properties uploaded to the platform!</p>
        </div>
        <div class="row filters">
          <select v-if="userLogged" name="filter" id="select" v-model="select">
            <option value="all" selected>All</option>
            <option value="mine">My properties</option>
          </select>
          <input type="text" v-model="search" placeholder="Search properties by city..." id="search" />
        </div>
        <div class="row">
          <div v-for="(prop, index) in filter"
            :key="index"
            class="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0"
            style="margin:10px 0 10px 0"
          >
          
            <!-- ################## CARD ################## -->
            <div
              class="icon-box" 
              data-aos="fade-up" 
              data-aos-delay="100"
              data-bs-toggle="modal"
              :data-bs-target="'#property_' + index"
              style="cursor: pointer"
            >
              <div class="col-md-12 type-property">
                <div v-if="prop.sellOrRent == 1 && prop.soldOn == 0">
                  <img src="/img/icons/for-sale.png">
                </div>
                <div v-if="prop.sellOrRent == 0 && prop.soldOn == 0">
                  <img src="/img/icons/rent.png">
                </div>
                <div v-else-if="prop.soldOn != 0">
                  <img src="/img/icons/sold.png">
                </div>
              </div>
              <div class="img-preview">
                <img :src="`https://ipfs.io/ipfs/${getCidFromImg(prop.id)}`">
              </div>
              <h4 class="title">
                <a href="">
                  {{ prop.city }}
                </a>
              </h4>
              <div v-if="prop.soldOn != 0  && rentalProperties[index] == 0" class="col-md-12" style="left:0;right:0;width:100%">
                <p class="description">Sold on {{ getStringDate(prop.soldOn) }}</p>
              </div>
              <div v-if="prop.soldOn != 0 && rentalProperties[index] != 0 && tokenizedProperties[index] == 0" class="col-md-12" style="left:0;right:0;width:100%">
                <p class="description">Rented on {{ getStringDate(prop.soldOn) }}</p>
              </div>
              <div v-else-if="prop.soldOn == 0">
                <p class="description">{{ currencyConversion(prop.price, 'EUR') }}€ <b>({{ currencyConversion(prop.price, 'ETH') }} ETH)</b></p>
                <p class="description">{{ getStringDate(prop.createdAt) }}</p>  
              </div>
            </div>
            <!-- ################## END OF CARD ################## -->
          </div>
        </div>
      </div>

      <!-- ################## MODAL ################## -->
       <div
        v-for="(prop, index) in filter"
        :id="'property_' + index"
        :key="index"
        :class="fade"
      >
        <div
          class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h6>{{ prop.id }} ({{ prop.city }})</h6>
              <div v-if="isOwner(prop.owner) && userLogged">
                <button class="remove-property" @click="removeProperty(prop.owner, prop.id)">
                  <img src="/img/icons/trash.png">
                </button>
              </div>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="pause"
              ></button>
            </div>

            <div class="modal-body" style="padding: 40px;text-align:center">
              <div v-if="prop.sellOrRent == 0 && tokenizedProperties[index] > 0" class="tokenized-div">
                <h6 class="description">TOKENIZED PROPERTY</h6>
              </div>
              <div>
                <img class="images" :src="`https://ipfs.io/ipfs/${getCidFromImg(prop.id)}`">
              </div>
              <div v-if="properties">
                <h6 style="margin-top:20px">Owner: <br><b>{{ prop.owner }}</b></h6>
                <h6>Contact: <br><b>{{ owners[index] }}</b></h6>
                <hr class="line">
                <h6 style="margin-top:20px">Address: <br><b>{{ prop.physicalAddr }}</b></h6>
                <h6>Published on: <br><b>{{ getStringDate(prop.createdAt) }}</b></h6> 
                <h6>Price: <br><b>{{ currencyConversion(prop.price, 'EUR') }}€ ({{ currencyConversion(prop.price, 'ETH') }} ETH)</b></h6>
                <h6>Rooms: <br><b>{{ getPropertyData(index, 'rooms') }}</b></h6>
                <h6>Bathrooms: <br><b>{{ getPropertyData(index, 'bathrooms') }}</b></h6>
                <h6>Area: <br><b>{{ getPropertyData(index, 'area') }}m²</b></h6>
              </div>
              <!-- #################### DIFFERENT BUTTONS AND CASES #################### -->
              <!-- For selling -->
              <button
                v-if="restrictionForBuy(prop)"
                type="button"
                class="buy-property"
                @click="sendTransaction('buy', prop, 0)"
              >
                Buy property
              </button>

              <!-- For renting -->
              <div
                v-if="restrictionForRenting(prop, index)" 
              >
                <h6>Rental end date: <br><b>{{ getStringDate(rentalProperties[index]) }}</b></h6>
                <button
                  type="button"
                  class="buy-property"
                  @click="sendTransaction('rent', prop, 0, rentalProperties[index])"
                >
                  Rent property
                </button>
              </div>

              <!-- For renting a tokenized property -->
               <div 
                v-if="restrictionForTokenization(prop,index)"
              >
                <h6 v-if="propertiesTokens[index]">Initial tokens: <br><b>{{ getNumOfTokens(index) }}</b></h6>
                <h6>Rental end date: <br><b>{{ getStringDate(tokenizedPropDates[index]) }}</b></h6>
                <h6>Available tokens: <br><b>{{ tokenizedProperties[index] }}</b></h6>
                <h6 v-if="propertiesTokens[index]">
                  Price per token: <br><b>{{ (currencyConversion(prop.price, 'EUR') / getNumOfTokens(index)).toFixed(2) }}€ ({{ (currencyConversion(prop.price, 'ETH') / getNumOfTokens(index)).toFixed(2) }} ETH)</b>
                </h6>

                <div v-if="userLogged && !isOwner(prop.owner)">
                  <br>
                  <h6>Number of tokens:</h6>
                  <div class="container-rooms">
                    <label id="minus" @click="decrement(index)">-</label>
                    <input :id="'input-tokens-' + index" name="input-tokens" class="input-tokens" type="number" min="1" value="1" readonly>
                    <label id="plus" @click="increment(tokenizedProperties[index], index)">+</label>
                  </div>
                </div> 
                
                <button
                  v-if="userLogged && prop.id && !isOwner(prop.owner)"
                  type="button"
                  class="buy-property"
                  @click="sendTransaction('buy-token', prop, tokens, index)"
                >
                  Buy tokens
                </button>
              </div>

              <!-- #################### END OF DIFFERENT BUTTONS AND CASES #################### -->

              <!-- #################### DIFFERENT CASES OF LIQUIDATED PROPERTY #################### -->
              <!-- Button for notice of sold -->
              <button
                v-else-if="userLogged && prop.soldOn != 0 && rentalProperties[index] == 0"
                type="button"
                class="property-sold"
                style="cursor:text"
              >
                Sold on {{ getStringDate(prop.soldOn) }}
              </button>
              
              <!-- Button for notice of rented -->
              <button
                v-else-if="userLogged && prop.soldOn != 0 && rentalProperties[index] != 0 && tokenizedProperties[index] == 0"
                type="button"
                class="property-sold"
                style="cursor:text"
              >
                Rented on {{ getStringDate(prop.soldOn) }}
              </button>
            </div>
            
            <!-- #################### END OF DIFFERENT CASES OF LIQUIDATED PROPERTY #################### -->
             <div class="modal-footer">
              <button
                type="button"
                class="buy-tickets"
                data-bs-dismiss="modal"
                @click="pause()"
              >
                Close
              </button>
              
            </div>
          </div>
        </div>
      </div>
      
      <!-- ################## END OF MODAL ################## -->

    </section>
  <!-- End Properties Section -->
</template>

<script>
import { Dapp } from '@/dapp';
import axios from 'axios';
import auth from '@/src/auth';
import * as IPFS from 'ipfs';
import { saveAs } from 'file-saver';

import swal from 'sweetalert';
import Swal from 'sweetalert2';

export default {
  data(){
    return {
      properties:           [],             // Property
      propertiesData:       [],             // Some data of property
      rentalProperties:     [],             // Rental end date of rental property
      tokenizedProperties:  [],             // Current available tokens of tokenized property
      tokenizedPropDates:   [],             // Rental end date of tokenized property
      propertiesTokens:     [],             // Initial tokens of a tokenized property
      propertiesImages:     [],

      fade: "modal fade",
      autoplay: true,
      tokens: 1,

      priceEthEur: '',
      cidContract: '',

      owners: [],

      search: '',
      select: 'all'
    } 
  },
  
  async beforeMount(){
    // Load the contracts
    await Dapp.init();
    this.priceEthEur = await Dapp.getEtherPrice();

    await this.renderProperties();
    
    for (let i=0;i<this.properties.length;i++)
    {
      this.owners.push(await this.getPropertyOwner(this.properties[i].owner));
    }
    
  },

  computed: {
    userLogged() {
      return auth.getUserLogged();
    },

    filter() {
      let tmpProps = this.properties;

      if(this.search != '' && this.search){
        tmpProps = tmpProps.filter((prop) => {
          if(prop.city.toLowerCase().includes(this.search.toLowerCase()))
            return prop
        })
      }

      if(this.select == 'mine')
      {
        tmpProps = tmpProps.filter((prop) => {
          if(prop.owner.toLowerCase() == window.ethereum.selectedAddress)
            return prop;
        })
      }

      return tmpProps;
    },

  },

  methods: {  
    // Catch the current created properties
    async renderProperties(){
      try {
        this.propertiesImages     = [];
        this.properties           = [];
        this.propertiesData       = [];
        this.rentalProperties     = [];
        this.tokenizedProperties  = [];
        this.tokenizedPropDates   = [];
        this.propertiesTokens     = [];

        const invalidAddr = 0x0000000000000000000000000000000000000000;

        let numProperties = await Dapp.Properties.cnt();

        for (let i = 0; i < numProperties.toNumber(); i++)
        {
          let prop        = await Dapp.Properties.properties(i);
          let propData    = await Dapp.Properties.propertiesData(i);
          let imageProp   = await Dapp.Properties.propertyImg(i);
     
          let owner = prop.owner;

          if (owner != invalidAddr)
          {
            // Add property image
            this.propertiesImages.push(imageProp);
            // Add property data
            this.properties.push(prop);
            this.propertiesData.push(propData);


            let propRental    = await Dapp.Properties.rentalProperties(i);
            let propTokenized = await Dapp.Properties.tokenizedProperties(i);
            
            // RENTAL PROPERTY: Add rental end date
            (propRental.idProperty) 
              ? this.rentalProperties.push(propRental[1].toNumber()) : this.rentalProperties.push(0);

            // RENTAL TOKENIZED PROPERTY: Add rental end date and number of available tokens
            if (propTokenized.idProperty != '')
            {
              this.tokenizedPropDates.push(propTokenized[1]);
              this.tokenizedProperties.push(propTokenized[2].toNumber());
              // Add initial tokens
              let tokensProp  = await Dapp.Properties.startedTokens(i);
              this.propertiesTokens.push(tokensProp[1].toNumber());
            } else {
              this.tokenizedPropDates.push(0);
              this.tokenizedProperties.push(0);
            }
          }
        }         
      } catch (err) {
        console.log(err);
      }
    },

    // ----------------------- Restrictions by type -----------------------
    restrictionForBuy(prop)
    {
      return (prop.sellOrRent == 1 && prop.soldOn == 0 && !this.isOwner(prop.owner) && this.userLogged) ? true : false;
    },
    
    restrictionForRenting(prop, index)
    {
      return (prop.sellOrRent == 0 && prop.soldOn == 0 && this.rentalProperties[index] != 0
          && this.tokenizedProperties[index] == 0 && !this.isOwner(prop.owner) && this.userLogged) ? true : false;
    },

    restrictionForTokenization(prop, index)
    {
      return (this.rentalProperties[index] == 0 && this.tokenizedProperties[index] != 0 && prop.soldOn == 0 && this.userLogged) ? true : false;
    },

    // ----------------------- Send transactions and create custom sweet alert -----------------------
    async sendTransaction(type, prop, tokens, arg)
    {
      let buyer       = this.userLogged;
      buyer           = buyer.split(",");
      let price       = '';

      // Getting the API ID of the property...
      const getPropertyId = await axios.get(
        'http://localhost:1337/api/properties/'   
        ).then(response => {
            const propsData = response.data.data;
            this.propertyVerified = propsData.filter(propData => propData.attributes.idproperty === prop.id);
            
            this.propId = this.propertyVerified[0].id;
        })
      
      if (type == 'buy-token'){
        let pricePerToken = prop.price / this.tokenizedProperties[arg];
        arg = tokens * pricePerToken;
        price = arg;
      } else if (type == 'buy' || type == 'rent')
        price = prop.price;

      Swal.fire({
        title: 'Are you sure you want to make the transaction?',
        text: "If you accept, the payment of " + this.currencyConversion(price, 'ETH') + "ETH will be made at this moment",
        imageUrl: 'https://cdn.dribbble.com/users/2574702/screenshots/6702374/metamask.gif',
        imageWidth: 400,
        imageHeight: 300,
        imageAlt: 'Metamask image',
        showCancelButton: true,
        confirmButtonColor: '#00F838',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, I\'m sure'

      }).then(async(result) => {
        if (result.isConfirmed) {
          let from = await Dapp.loadEthereum();
          let res = '';
          switch (type) {
            case "buy":
              res = await Dapp.buyProperty(from, prop.id, price);
              
              if (typeof(res) == 'object'){
                // Transaction doing successfully
                Swal.fire(
                  'Done!',
                  'You have sent the payment of ' + this.currencyConversion(price, 'ETH') + 'ETH to ' + prop.owner + '.',
                  'success'
                ).then(async() => {
                  await this.generateContract(prop, 'ipfs', 'buy');
                  
                  // Update name and idCard from property
                  await axios({
                    method: "PUT",
                    url: `http://localhost:1337/api/properties/${this.propId}`, 
                    data: {
                      "data": {
                        "owner": buyer[1],
                        "idowner": buyer[4]
                      }
                    }
                  });

                  // Option for download the IPFS contract
                  Swal.fire({
                    text: "Do you want to download the contract?",
                    imageUrl: 'https://docs.ipfs.io/images/ipfs-logo.svg',
                    imageWidth: 169,
                    imageHeight: 196,
                    imageAlt: 'IPFS image',
                    showCancelButton: true,
                    confirmButtonColor: '#00F838',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Download',
                    cancelButtonText: 'No',
                    footer: '<div class="row" style="text-align:center"><a target="_blank" style="display:inline" href="https://ipfs.io/ipfs/' + this.cidContract + '">Want to see the contract in IPFS?</a><p style="display:inline">Save the CID\n<b>' + this.cidContract + '</b>\nto access it forever!</p></div>',
                    
                    
                  }).then(async(res) => {
                    if(res.isConfirmed) {
                      await this.generateContract(prop, 'save', 'buy');
                    } else {
                      window.location.reload();
                    }
                  });
                });
                  

              } else {
                // Error, insufficient balance
                Swal.fire(
                  'Error!',
                  'Your balance is ' + this.currencyConversion(res, 'ETH') + 'ETH. It is insufficient to complete the transaction',
                  'error'
                );
              }
              
              break;

            case "rent":
              res = await Dapp.rentProperty(from, prop.id, arg, prop.price);

              if (typeof(res) == 'object'){
                // Transaction doing successfully
                Swal.fire(
                  'Done!',
                  'You have sent the payment of ' + this.currencyConversion(price, 'ETH') + 'ETH to ' + prop.owner + '.',
                  'success'
                ).then(async() => {
                  await this.generateContract(prop, 'ipfs', 'rent');

                  // Option for download the IPFS contract
                  Swal.fire({
                    text: "Do you want to download the contract?",
                    imageUrl: 'https://docs.ipfs.io/images/ipfs-logo.svg',
                    imageWidth: 169,
                    imageHeight: 196,
                    imageAlt: 'IPFS image',
                    showCancelButton: true,
                    confirmButtonColor: '#00F838',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Download',
                    cancelButtonText: 'No',
                    footer: '<div class="row" style="text-align:center"><a target="_blank" style="display:inline" href="https://ipfs.io/ipfs/' + this.cidContract + '">Want to see the contract in IPFS?</a><p style="display:inline">Save the CID\n<b>' + this.cidContract + '</b>\nto access it forever!</p></div>',
                    
                    
                  }).then(async(res) => {
                    if(res.isConfirmed) {
                      await this.generateContract(prop, 'save', 'rent');
                    } else {
                      window.location.reload();
                    }
                  });
                });
                  

              } else {
                // Error, insufficient balance
                Swal.fire(
                  'Error!',
                  'Your balance is ' + this.currencyConversion(res, 'ETH') + 'ETH. It is insufficient to complete the transaction',
                  'error'
                );
              }
              break;

            case "buy-token":
              await Dapp.buyTokens(from, prop.id, tokens, arg);
              break; 
          }

          
        
        }
      }).catch(Swal.fire.noop);
    },

    // ----------------------- Remove property -----------------------
    async removeProperty(owner, id)
    {
      Swal.fire({
        title: 'Are you sure you want to delete the property?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00F838',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async(result) => {
        if (result.isConfirmed) {
          await Dapp.removeProperty(owner, id);
          await this.renderProperties();

          Swal.fire(
            'Deleted!',
            'The property with reference ' + id + ' has been deleted.',
            'success'
          ).then(function() {
            window.location.reload();
          });
        }
      })
    },

    async generateContract(prop, action, type)
    {
      var content   = '';
      switch (type){
        case "buy":
          content = await this.salesContractTemplate(prop);
          break;

        case "rent":
          content = await this.rentContractTemplate(prop);
          break;   
      }

      // any kind of extension (.txt,.cpp,.cs,.bat)
      var filename  = "Contract " + prop.id;

      var blob = new Blob([content], {
        type: "text/html;charset=utf-8;charset=ANSI"
      });

      switch (action) {
        case "ipfs":
          const node  = await IPFS.create({ silent: true });
          let cid     = await node.add(blob);
          this.cidContract = cid.path;
          console.log("Contract added to: ", cid.path);
          break;
        case "save":
          saveAs(blob, filename);
          break;
      }

    },

    async salesContractTemplate(prop)
    {
      let buyer       = this.userLogged;
      buyer           = buyer.split(",");
      let seller      = await Dapp.getUserData(prop.owner);

      const date      = new Date().toLocaleString();

      return (
        '<div class="container"><div class="col-md-4></div><div class="col-md-4"><p style="text-align:center"><b>' 
          + "Contrato de compra venta del inmueble " + prop.id + '</b></p><p style="margin: 20px;text-align:justify"><b>'
          + "De un lado, la parte compradora:" + '</b><br>' + "D/Da " + buyer[1] + " con DNI " + buyer[4] + ", y direccion de clave publica " 
          + buyer[0] + "." + '</p><p style="margin: 20px;text-align:justify"><b>' + "De otro, la parte vendedora:"
          + '</b><br>' + "D/Da " + seller[1] + " con DNI " + seller[4] + ", y direccion de clave publica " + seller[0] + "." 
          + '</p><p style="text-align:center"><b>' + "EXPONEN" + '</b></p><p style="margin: 20px;text-align:justify"><b>'
          + "PRIMERO.-" + '</b>' + "Que la parte vendedora es duena de pleno dominio de la siguiente finca: " + '<br><ul><li>'
          + "Catastro: " + prop.id + '</li><li>' + "Direccion: " + prop.physicalAddr + '</li><li>' + "Poblacion: " + prop.city + '</li></ul></p>'
          + '<p style="margin: 20px;text-align:justify"><b>' + "SEGUNDO.-" + '</b>' + "Que la parte compradora abonara el siguiente importe a la parte vendedora: " + '<br>'
          + '<ul><li>' + this.currencyConversion(prop.price, 'EUR') + "EUR ( " + this.currencyConversion(prop.price, 'ETH') + "ETH ) " + '</li></ul><b>' + "TERCERO.-" + '</b>' + "Para que quede constancia y hacer valer el contrato, ambas partes han firmado digitalmente la transaccion mediante la wallet MetaMask." 
          + '<br>' + "La parte vendedora en el momento de publicar la propiedad, y la parte compradora en el momento de abonar el importe, el " + date 
          + '<br></p><p style="text-align:center"><b>' + "Transaccion realizada desde la aplicacion descentralizada en la red de Ethereum" + '</b><br><br>'
          + "Impulsado por:" + '</p><img style="margin: 10px 0px 0px 600px" src="https://ipfs.io/ipfs/QmQNw5BUgkP9YHbsLUW8gnXoHVeqomsv3j8scnjm6YcFBP"></div></div>'
      )
    },

    async rentContractTemplate(prop)
    {
      let buyer       = this.userLogged;
      buyer           = buyer.split(",");
      let seller      = await Dapp.getUserData(prop.owner);

      const date      = new Date().toLocaleString();

      return (
        '<div class="container"><div class="col-md-4></div><div class="col-md-4"><p style="text-align:center"><b>' 
          + "Contrato de alquiler del inmueble " + prop.id + '</b></p><p style="margin: 20px;text-align:justify"><b>'
          + "De un lado, como arrendatario:" + '</b><br>' + "D/Da " + buyer[1] + " con DNI " + buyer[4] + ", y direccion de clave publica " 
          + buyer[0] + "." + '</p><p style="margin: 20px;text-align:justify"><b>' + "De otro, como arrendador:"
          + '</b><br>' + "D/Da " + seller[1] + " con DNI " + seller[4] + ", y direccion de clave publica " + seller[0] + "." 
          + '</p><p style="text-align:center"><b>' + "EXPONEN" + '</b></p><p style="margin: 20px;text-align:justify"><b>'
          + "PRIMERO.-" + '</b>' + "Que la parte arrendadora es duena de pleno dominio de la siguiente finca: " + '<br><ul><li>'
          + "Catastro: " + prop.id + '</li><li>' + "Direccion: " + prop.physicalAddr + '</li><li>' + "Poblacion: " + prop.city + '</li></ul></p>'
          + '<p style="margin: 20px;text-align:justify"><b>' + "SEGUNDO.-" + '</b>' + "Que la parte arrendataria abonara el siguiente importe a la parte arrendadora: " + '<br>'
          + '<ul><li>' + this.currencyConversion(prop.price, 'EUR') + "EUR ( " + this.currencyConversion(prop.price, 'ETH') + "ETH ) " + '</li></ul><b>' + "TERCERO.-" + '</b>' + "Para que quede constancia y hacer valer el contrato, ambas partes han firmado digitalmente la transaccion mediante la wallet MetaMask." 
          + '<br>' + "La parte arrendadora en el momento de publicar la propiedad, y la parte arrendataria en el momento de abonar el importe, el " + date 
          + '<br></p><p style="text-align:center"><b>' + "Transaccion realizada desde la aplicacion descentralizada en la red de Ethereum" + '</b><br><br>'
          + "Impulsado por:" + '</p><img style="margin: 10px 0px 0px 600px" src="https://ipfs.io/ipfs/QmQNw5BUgkP9YHbsLUW8gnXoHVeqomsv3j8scnjm6YcFBP"></div></div>'
      )
    },

    // ----------------------- GETTERS -----------------------
    // ----------------------- Get dates in human format -----------------------
    getStringDate(date)
    {
      return new Date(date*1000).toLocaleString();
    },

    // ----------------------- Get initial number of tokens -----------------------
    getNumOfTokens(index)
    {
      return this.propertiesTokens[index];
    },

    // ----------------------- Get CID of the image from mapping -----------------------
    getCidFromImg(id)
    {
      for (let i = 0; i < this.propertiesImages.length; i++)
      {
        if(this.propertiesImages[i].id == id){
          return this.propertiesImages[i].ipfsImage;
        }
      }
    },

    // Get property data from array
    getPropertyData(index, type)
    {
      if(this.propertiesData[index])
      {
        switch (type) {
          case "rooms":
            return this.propertiesData[index].rooms;
            break;
          case "bathrooms":
            return this.propertiesData[index].bathrooms;
            break;
          case "area":
            return this.propertiesData[index].area;
            break;
        }
      }
    },

    async getPropertyOwner(addr)
    {
      let data = await Dapp.getUserData(addr);
      let owner = data[2];

      return owner;
    },

    // ----------------------- Check if current address is the owner -----------------------
    isOwner(propOwner)
    {
      let currentAddr = window.ethereum.selectedAddress;
      return (currentAddr) ? propOwner.toLowerCase() == currentAddr.toLowerCase() : false;
    },

    // ----------------------- Currencies conversions ----------------------- 
    currencyConversion(priceInWei, currency)
    {
      switch (currency) {
        case 'EUR':
          let ethers = priceInWei/1000000000000000000;
          return (ethers*this.priceEthEur).toFixed(2);
          break;
        case 'ETH':
          return (priceInWei/1000000000000000000).toFixed(2);
          break;
      }
    },
    
    async weiToEur(price)
    {
      this.priceInEur = await Dapp.convertWeiToEur(price);
      return this.priceInEur;
    },

    async weiToEth(price)
    {
      this.priceInEth = await Dapp.convertWeiToEth(price);
      return this.priceInEth;
    },

    // ----------------------- Modal close ----------------------- 
    pause() 
    {
      const iframes = document.querySelectorAll("#modal iframe");
      iframes.forEach(element => {
        const srcArray = element.src.split("");
        srcArray[srcArray.length - 1] = "0";
        const newSrc = srcArray.join("");
        element.src = newSrc;
      });
    },

    // ----------------------- Buttons functions -----------------------
    increment(currentTokens, index) 
    {
      var inputTokens = document.getElementById('input-tokens-' + index);
      var value = inputTokens.value;
      if(value < currentTokens) value++;
      inputTokens.value = value;
      this.tokens = value;
    },
    decrement(index) 
    {
      var inputTokens = document.getElementById('input-tokens-' + index);
      var value = inputTokens.value;
      if(value > 1) value--;
      inputTokens.value = value;
      this.tokens = value;
    },
  }
}
</script>

<style scoped>
  /* Properties */

  .filters {
    display: inline;
    background-color: #3498db;
    padding: 20px 0 20px 0;
    border-radius: 10px;
  }

  .filters select {
    width: 15%;
    margin-left: 35%;
    height: 30px; 
    border-radius: 10px;
    border: none;
    background-color: #fff;
  }

  .filters input {
    width: 20%;
    height: 30px; 
    margin-right: 30%;
    margin-left: 10px;
    border-radius: 10px;
    border: none;
  }

  /* Property Box */
  .properties .container {
    margin-bottom: 150px;
  }

  .properties .icon-box {
    padding: 30px;
    position: relative;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 0 29px 0 rgba(68, 88, 144, 0.12);
    transition: all 0.3s ease-in-out;
    border-radius: 8px;
    height: 100%;
    width: 100%;
    z-index: 1;
    margin-top: 40px;
  }

  .properties .icon-box::before {
    content: "";
    position: absolute;
    background: #e1f0fa;
    right: -60px;
    top: -40px;
    width: 100px;
    height: 100px;
    border-radius: 50px;
    transition: all 0.3s;
    z-index: -1;
    
  }

  .properties .icon-box:hover::before {
    background: #3498db;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 0px;
  }

  .properties .type-property {
    right: 0;
    margin: -25px 0 10px 200px;
  }

  .properties .icon {
    margin: 0 auto 20px auto;
    padding-top: 10px;
    display: inline-block;
    text-align: center;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    background: #3498db;
    transition: all 0.3s ease-in-out;
  }

  .properties .icon i {
    font-size: 36px;
    line-height: 1;
    color: #fff;
  }

  .properties .title {
    font-weight: 700;
    margin-bottom: 15px;
    font-size: 18px;
  }

  .properties .title a {
    color: #3498db;
    text-decoration: none;
  }

  .properties .description {
    font-size: 15px;
    line-height: 28px;
    margin-bottom: 0;
  }

  .properties .icon-box:hover .title a, .properties .icon-box:hover .description {
    color: #fff;
  }

  .properties .icon-box:hover .icon {
    background: #fff;
  }

  .properties .icon-box:hover .icon i {
    color: #3498db;
  }

  .properties .container-rooms {
    display: flex;
    border-radius: 45px;
    border: 1px solid #cecece;
    width: 40.5%;
    margin-left: 220px;
  }

  .properties .container-rooms [name="input-tokens"] {
    text-align: center;
    font-size: 13.5px;
    border: none;
    outline: none;
    color: #202030;
  }

  .properties .container-rooms label {
    color: #3498db;
    font-size: 14px;
    font-weight: 20px;
    border: none;
    background-color: #ffffff;
    cursor: pointer;
    outline: none;
  }

  .properties .line {
    width: 70%;
    margin-left:100px;
    border:0.5px black solid;
  }


  /* Sell or rent style */
  #plus {
    padding: 15px 25px 15px 5px;
    border-radius: 0 45px 45px 0;
  }

  #minus {
    padding: 15px 5px 15px 25px;
    border-radius: 45px 0 0 45px;
  }

  .properties .img-preview img {
    width: 100px;
    height: 100px;
    margin: 0 0 20px 60px;
    object-fit: cover;
    object-position: center center;
    border-radius: 60%;
  }

  .properties .tokenized-div {
    background-color: #3498db;
    color: #fff;
    margin-left: 102px;
    width: 500px;
    max-width: 700px;
    max-height: 700px;
  }

  .properties .images {
    width: 500px;
    max-width: 700px;
    max-height: 700px;
  }

  /* ------------- Buttons ------------- */

  /* Buy Property Class */
  .buy-property {
    color: #fff;
    background: #02ac0a;
    padding: 10px 30px;
    margin: 10px 0 10px 15px;
    border-radius: 50px;
    border: 2px solid #02ac0a;
    transition: 0.3s;
    font-weight: 500;
    line-height: 1;
    font-size: 13px;
  }

  .buy-property:hover {
    background-color: #1a9202;
    border: 2px solid #1a9202;
  }

  @media (max-width: 992px) {
    .buy-property {
      margin: 0 15px 0 0;
    }
  }

  /* Property Sold Class */
  .property-sold {
    color: #fff;
    background: #c40101;
    padding: 10px 30px;
    margin: 10px 0 10px 15px;
    border-radius: 50px;
    border: 2px solid #c40101;
    transition: 0.3s;
    font-weight: 500;
    line-height: 1;
    font-size: 13px;
  }

  .property-sold:hover {
    background-color: #c40101;
    border: 2px solid #c40101;
  }

  @media (max-width: 992px) {
    .buy-property {
      margin: 0 15px 0 0;
    }
  }

  /* Remove Property Class*/
  .properties .remove-property {
    border: none;
    margin-left: 450px;
    background-color: #fff;
  }
  .properties .remove-property img {
    max-width: 40px;
    max-height: 40px;
  }
</style>