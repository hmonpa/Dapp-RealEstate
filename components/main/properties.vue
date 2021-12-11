<template>
    <!-- ======= Properties Section ======= -->
    <section id="properties" class="properties">
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
                v-if="prop.sellOrRent == 1 && prop.soldOn == 0"
                type="button"
                class="buy-property"
                @click="buyProperty(prop.id, prop.price)"
              >
              Buy property
              </button>

              <!-- For renting -->
              <div v-if="prop.sellOrRent == 0 && prop.soldOn == 0 && prop.tokens == 0">
                <p>Rental end date: {{ getStringDate(prop.rentalEndDate) }}</p>
                <button
                  type="button"
                  class="buy-property"
                  @click="rentProperty(prop.id, prop.price, prop.rentalEndDate)"
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

                <div v-if="userLogged">
                  <span>Number of tokens:</span>
                  <div class="container-rooms">
                    <label id="minus" @click="decrement(index)">-</label>
                    <input :id="'input-tokens-' + index" name="input-tokens" class="input-tokens" type="number" min="1" value="1" readonly>
                    <label id="plus" @click="increment(prop.tokens, index)">+</label>
                  </div>
                </div> 
                
                <button
                  v-if="userLogged"
                  type="button"
                  class="buy-property"
                  @click="buyTokens(prop.id, tokens, (prop.price/prop.tokens)*tokens)"
                >
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
      tokens: 1
      
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
        let existingProp = true;
        let i = 0;
        while (existingProp)
        {
          let prop = await Dapp.Properties.properties(i);
          let owner = prop.owner;
          if (owner != invalidAddr){
            this.properties.push(prop);

            let tokensProp  = await Dapp.Properties.startedTokens(prop.id);
            let imageProp   = await Dapp.Properties.propertyImg(prop.id);
            
            this.propertiesTokens.push(tokensProp);
            this.propertiesImages.push(imageProp);
          }
          else
            existingProp = false;               
          
          i++;
        }

      }
      catch (err) {
        console.log(err);
      }
    },

    // Buy property
    async buyProperty(id, price)
    {
      let from = await Dapp.loadEthereum();
      await Dapp.buyProperty(from, id.toNumber(), price);

      // Update the status of properties
      await this.renderProperties();
    },

    // Rent property
    async rentProperty(id, price, rentalEndDate)
    {
      let from = await Dapp.loadEthereum();
      await Dapp.rentProperty(from, id.toNumber(), rentalEndDate, price);

      // Update the status of properties
      await this.renderProperties();
    },

    // Buy tokens
    async buyTokens(id, tokens, priceToPay)
    {
      let from = await Dapp.loadEthereum();
      await Dapp.buyTokens(from, id.toNumber(), tokens, priceToPay);

      window.location.reload();
    },

    // Get dates in human format
    getStringDate(date)
    {
      return new Date(date*1000).toLocaleString();
    },

    // Get initial number of tokens
    getNumOfTokens(index)
    {
      return this.propertiesTokens[index]["tokens"];
    },

    getCidFromImg(index)
    {
      if(this.propertiesImages[index]) return this.propertiesImages[index]["ipfsImage"];
    },

    // Currencies conversion
    weiToEur(price)
    {
      return price/243739092347530;
    },
    weiToEth(price)
    {
      return (price/(10**18)).toFixed(2);
    },

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
    }
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
  margin: -25px 0 10px -20px;
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

.properties .container-rooms .input-tokens {
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

/* Buy Tickets Class */
.buy-tickets {
  color: #fff;
  background: #3498db;
  padding: 7px 22px;
  margin: 0 0 0 15px;
  border-radius: 50px;
  border: 2px solid #3498db;
  transition: 0.3s;
  font-weight: 500;
  line-height: 1;
  font-size: 13px;
}

.buy-tickets:hover {
  background-color: #035d99;
  border: 2px solid #035d99;
}

.buy-tickets:focus {
  color: #fff;
}

@media (max-width: 992px) {
  .buy-tickets {
    margin: 0 15px 0 0;
  }
}

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
</style>