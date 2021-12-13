<template>
    <!-- ======= Properties Section ======= -->
    <section id="properties" class="properties" style="margin-top:100px">
      <div class="container">

        <div class="section-title" data-aos="fade-up">
          <h2>Properties</h2>
          <p>Check out the current properties uploaded to the platform!</p>
        </div>
        <div class="row">
          <div v-for="(prop, index) in properties"
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
                <!--<i class="bx bxl-dribbble"></i>-->
                <img :src="`https://ipfs.io/ipfs/${getCidFromImg(index)}`">
              </div>
              <h4 class="title">
                <a href="">
                  {{ prop.city }}
                </a>
              </h4>
              <div v-if="prop.soldOn != 0  && prop.rentalEndDate == 0" class="col-md-12" style="left:0;right:0;width:100%">
                <p class="description">Sold on {{ getStringDate(prop.soldOn) }}</p>
              </div>
              <div v-if="prop.soldOn != 0 && prop.rentalEndDate != 0" class="col-md-12" style="left:0;right:0;width:100%">
                <p class="description">Rented on {{ getStringDate(prop.soldOn) }}</p>
              </div>
              <div v-else-if="prop.soldOn == 0">
                <p class="description">{{ weiToEur(prop.price) }}€ ({{ weiToEth(prop.price) }} ETH)</p>
                <p class="description">{{ getStringDate(prop.createdAt) }}</p>  
              </div>
            </div>
            <!-- ################## END OF CARD ################## -->
          </div>
        </div>
      </div>

      <!-- ################## MODAL ################## -->
      <div
        v-for="(prop, index) in properties"
        :id="'property_' + index"
        :key="index"
        :class="fade"
      >
        <div
          class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h6 style="text-align:center">{{ prop.physicalAddr }} ({{ prop.city }})</h6>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="pause"
              ></button>
            </div>

            <div class="modal-body" style="padding: 40px;text-align:center">
              <div v-if="prop.sellOrRent == 0 && prop.tokens > 0" style="background-color:yellow;width:100%">
                <p class="description">TOKENIZED PROPERTY</p>
              </div>
              <div v-if="properties">
                <div v-if="isOwner(prop.owner) && userLogged">
                  <button class="remove-property" @click="removeProperty(prop.owner, prop.id)">
                    <img src="/img/icons/trash.png">
                  </button>
                </div>
                <img class="images" :src="`https://ipfs.io/ipfs/${getCidFromImg(index)}`">
              </div>
              <span class="line"></span>
              <h6 style="margin-top:20px">Owner: {{ prop.owner }}</h6>
              <p>Published on: {{ getStringDate(prop.createdAt) }}</p> 
              <p>Price: {{ weiToEur(prop.price) }}€ ({{ weiToEth(prop.price) }}ETH)</p>
              <p>Rooms: {{ prop.rooms }}</p>
              <p>Bathrooms: {{ prop.bathrooms }}</p>
              <p>Area: {{ prop.area }}m²</p>

              <!-- #################### DIFFERENT BUTTONS AND CASES #################### -->
              <!-- For selling -->
              <button
                v-if="prop.sellOrRent == 1 
                  && prop.soldOn == 0 
                  && !isOwner(prop.owner)"
                type="button"
                class="buy-property"
                @click="sendTransaction("buy", prop, 0)"
              >
              <!--OLD CLICK: @click="buyProperty(index, prop.id, prop.price, prop.owner)"-->
                Buy property
              </button>

              <!-- For renting -->
              <div 
                v-if="prop.sellOrRent == 0 
                && prop.soldOn == 0 
                && prop.tokens == 0
                && !isOwner(prop.owner)"
              >
                <p>Rental end date: {{ getStringDate(prop.rentalEndDate) }}</p>
                <button
                  type="button"
                  class="buy-property"
                  @click="sendTransaction("rent", prop, 0)"
                >
                  Rent property
                </button>
              </div>

              <!-- For renting a tokenized property -->
              <div v-if="prop.sellOrRent == 0 && prop.tokens > 0 && prop.soldOn == 0">
                <p v-if="propertiesTokens[index]">Initial tokens: {{ getNumOfTokens(index) }}</p>
                <p>Rental end date: {{ getStringDate(prop.rentalEndDate) }}</p>
                <p>Available tokens: {{ prop.tokens }}</p>
                <p v-if="propertiesTokens[index]">Price per token: {{ (weiToEur(prop.price) / getNumOfTokens(index)).toFixed(2) }}€ ({{ (weiToEth(prop.price) / prop.tokens).toFixed(2) }} ETH)</p>

                <div v-if="userLogged && !isOwner(prop.owner)">
                  <span>Number of tokens:</span>
                  <div class="container-rooms">
                    <label id="minus" @click="decrement(index)">-</label>
                    <input :id="'input-tokens-' + index" name="input-tokens" class="input-tokens" type="number" min="1" value="1" readonly>
                    <label id="plus" @click="increment(prop.tokens, index)">+</label>
                  </div>
                </div> 
                
                <button
                  v-if="userLogged && prop.id && !isOwner(prop.owner)"
                  type="button"
                  class="buy-property"
                  @click="sendTransaction('buy-token', prop, tokens)"
                >
                <!-- OLD CLICK: @click="buyTokens(prop.id, tokens, (prop.price/prop.tokens)*tokens), prop.owner"-->
                  Buy tokens
                </button>
              </div>
              <!-- #################### END OF DIFFERENT BUTTONS AND CASES #################### -->

              <!-- #################### DIFFERENT CASES OF LIQUIDATED PROPERTY #################### -->
              <!-- Button for notice of sold -->
              <button
                v-else-if="userLogged && prop.soldOn != 0 && prop.rentalEndDate == 0"
                type="button"
                class="property-sold"
                style="cursor:text"
              >
                Sold on {{ getStringDate(prop.soldOn) }}
              </button>
              <!-- Button for notice of rented -->
              <button
                v-else-if="userLogged && prop.soldOn != 0 && prop.rentalEndDate != 0"
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
import auth from '@/src/auth';
import * as IPFS from 'ipfs';
import { saveAs } from 'file-saver';

import swal from 'sweetalert';
import Swal from 'sweetalert2';

export default {

  // ----- VUE LIFE-CYCLE -----
  // BeforeCreate:  Vue has not loaded the component, we cannot yet access the component's options, methods or data.
  // Created:       In this point Vue has loaded the component and the sections data and methods already exists.
  // BeforeMount
  // Mounted:       We have access to the DOM and the computed is executed inmediatly after it
  // BeforeUpdate
  // Updated:       Is executed when produced changes in the component, uses "computed" and "watchers" properties.
  // Destroyed:     Is executed when one component is removed. Example: Uses of v-if or v-show.

  data(){
    return {
      properties: [],
      propertiesTokens: [],
      fade: "modal fade",
      autoplay: true,
      tokens: 1,
      
      // PENDING: Show this until having the oracle / API:
      // fakeEth: 3500
    } 
  },

  methods: {  
    // Starts the dApp 
    async start1(){
      await Dapp.init();
    },
    async start2(){
      await this.renderProperties();
    },

    // Catch the current created properties
    async renderProperties(){
      try {
        this.properties = [];
        this.propertiesTokens = [];
        this.propertiesImages = [];
        const invalidAddr = 0x0000000000000000000000000000000000000000;
        let numProperties = await Dapp.Properties.propertyCounter();
        for (let i = 0; i < numProperties; i++)
        {
          let prop = await Dapp.Properties.properties(i);
          let owner = prop.owner;
          if (owner != invalidAddr)
          {
            this.properties.push(prop);

            let tokensProp  = await Dapp.Properties.startedTokens(prop.id);
            let imageProp   = await Dapp.Properties.propertyImg(prop.id);
            
            this.propertiesTokens.push(tokensProp);
            this.propertiesImages.push(imageProp);
          }          
        }
      }
      catch (err) {
        console.log(err);
      }
    },

    async generateContract(prop)
    {
      var content   = await this.contractTemplate(prop);
      // any kind of extension (.txt,.cpp,.cs,.bat)
      var filename  = "Contract " + prop.id;

      var blob = new Blob([content], {
        type: "text/plain;charset=utf-8;charset=ANSI"
      });

      const node  = await IPFS.create({ silent: true });
      let cid     = await node.add(blob);
      console.log("Node add: ", cid.path);
      // OPTION FOR DOWNLOAD THE CONTRACT IN FILE VERSION:
      // saveAs(blob, filename);
    },

    async contractTemplate(prop)
    {
      const buyerAddr = await Dapp.currentAddr();

      const buyer     = await Dapp.getUserData(buyerAddr);
      const seller    = await Dapp.getUserData(prop.owner);
      const date      = new Date().toLocaleString();

      return (
        '<p style="text-align:center"><b>' 
          + "Contrato de compra venta del inmueble " + prop.id + '</b></p><p style="margin: 20px;text-align:justify"><b>'
          + "De un lado, la parte compradora:" + '</b><br>' + "D/Dª" + buyer[1] + " con DNI " + "------PENDING!!!" + ", y direccion de clave publica " 
          + buyer[0] + "." + '</p><p style="margin: 20px;text-align:justify"><b>' + "De otro, la parte vendedora:"
          + '</b><br>' + "D/Dª " + seller[1] + " con DNI " + "------PENDING!!!" + ", y direccion de clave publica " + seller[0] + "." 
          + '</p><p style="text-align:center"><b>' + "EXPONEN" + '</b></p><p style="margin: 20px;text-align:justify"><b>'
          + "PRIMERO.-" + '</b>' + "Que la parte vendedora es duena de pleno dominio de la siguiente finca: " + '<br><ul><li>'
          + "Catastro:" + prop.id + '</li><li>' + "Direccion: " + prop.physicalAddr + '</li><li>' + "Poblacion: " + prop.city + '</li></ul></p>'
          + '<p style="margin: 20px;text-align:justify"><b>' + "SEGUNDO.-" + '</b>' + "Que la parte compradora abonara el siguiente importe a la parte vendedora: " + '<br>'
          + '<ul><li>' + this.weiToEur(prop.price) + "EUR ( " + this.weiToEth(prop.price) + "ETH ) " + '</li></ul><b>' + "TERCERO.-" + '</b>' + "Para que quede constancia y hacer valer el contrato, ambas partes han firmado digitalmente la transaccion mediante la wallet MetaMask." 
          + '<br>' + "La parte vendedora en el momento de publicar la propiedad, y la parte compradora en el momento de abonar el importe, el " + date 
          + '<br></p><p style="text-align:center"><b>' + "Transaccion realizada desde la aplicacion descentralizada en la red de Ethereum" + '</b><br>'
          + "Impulsado por:" + '</p><img style="margin: 10px 0px 0px 250px" src="https://ipfs.io/ipfs/QmQNw5BUgkP9YHbsLUW8gnXoHVeqomsv3j8scnjm6YcFBP">'
      )
    },

    // Old functions for doing transactions...
    
    // // Buy property
    // async buyProperty(prop, tokens)
    // {
    //   this.sendTransaction("buy", prop, tokens);

    //   // await this.generateContract(prop);

    //   // // Update the status of properties
    //   // await this.renderProperties();
    // },

    // // ----------------------- Rent property -----------------------
    // async rentProperty(prop, tokens)
    // {
    //   this.sendTransaction("rent", prop, tokens);
    //   // await this.renderProperties();
    // },

    // // ----------------------- Buy tokens -----------------------
    // async buyTokens(prop, tokens)
    // {
    //   this.sendTransaction("buy-token", prop, tokens);
    // },

    // ----------------------- Create custom sweet alert -----------------------
    async sendTransaction(type, prop, tokens)
    {
      Swal.fire({
        title: 'Are you sure you want to make the transaction?',
        text: "If you accept, the payment of " + this.weiToEth(prop.price) + "ETH will be made at this moment",
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
          Swal.fire(
            'Done!',
            'You have sent the payment of ' + this.weiToEth(prop.price) + 'ETH to ' + prop.owner + '.',
            'success'
          ).then(async() => {
            // PENDING: MOVE CALLS BEFORE SWAL, TO ADD THE IPFS CONTRACT TO THE 2ND SWAL
            if (type == "buy-token") await Dapp.buyTokens(from, prop.id.toNumber(), tokens, prop.price);
            if (type == "rent") await Dapp.rentProperty(from, prop.id.toNumber(), prop.rentalEndDate, prop.price);
            if (type == "buy")
            {
              await Dapp.buyProperty(from, prop.id.toNumber(), prop.price);
              await this.generateContract(prop);
            }
            // window.location.reload();
          });
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
            'The property with id ' + id + ' has been deleted.',
            'success'
          ).then(function() {
            window.location.reload();
          });
        }
      })
    },

    // ----------------------- Get dates in human format -----------------------
    getStringDate(date)
    {
      return new Date(date*1000).toLocaleString();
    },

    // ----------------------- Get initial number of tokens -----------------------
    getNumOfTokens(index)
    {
      return this.propertiesTokens[index]["tokens"];
    },

    // ----------------------- Get CID of the image from mapping -----------------------
    getCidFromImg(index)
    {
      if(this.propertiesImages[index]) return this.propertiesImages[index]["ipfsImage"];
    },

    // ----------------------- Check if current address is the owner -----------------------
    isOwner(propOwner)
    {
      let currentAddr = window.ethereum.selectedAddress;
      return propOwner.toLowerCase() == currentAddr.toLowerCase();
    },

    // ----------------------- Currencies conversion ----------------------- 
    weiToEur(price)
    {
      return price/243739092347530;
    },
    weiToEth(price)
    {
      return (price/(10**18)).toFixed(2);
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
  },

  async beforeMount(){
    // Load the contracts
    await this.start1();
    await this.start2();
  },

  computed: {
    userLogged() {
      return auth.getUserLogged();
    }
  }
}
</script>

<style scoped>
/* Properties */
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

.properties .images {
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
  margin-left: 640px;
  background-color: #fff;
}
.properties .remove-property img {
  max-width: 50px;
  max-height: 50px;
}
</style>