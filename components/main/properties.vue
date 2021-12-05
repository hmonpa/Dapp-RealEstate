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
            <div
              class="icon-box" 
              data-aos="fade-up" 
              data-aos-delay="100"
              data-bs-toggle="modal"
              :data-bs-target="'#property_' + index"
              style="cursor: pointer"
            >
              <div class="col-md-12 type-property">
                <b v-if="prop.sellOrRent == 1">FOR SALE</b>
                <b v-else>FOR RENT</b>
              </div>
              <div class="icon" style="background:url('/img/favicon.png') center;">
                <i class="bx bxl-dribbble"></i>
              </div>
              <h4 class="title">
                <a href="">
                  {{ prop.city }}
                </a>
              </h4>
              <div v-if="prop.soldOn != 0  && prop.rentalEndDate == 0" class="col-md-12" style="left:0;right:0;width:100%">
                <p class="description">SOLD!</p>
              </div>
              <div v-if="prop.soldOn != 0 && prop.rentalEndDate != 0" class="col-md-12" style="left:0;right:0;width:100%">
                <p class="description">RENTED!</p>
              </div>
              <div v-else-if="prop.soldOn == 0">
                <p class="description">{{ weiToEur(prop.price) }}€ ({{ weiToEth(prop.price) }} ETH)</p>
                <br>
                <p class="description">{{ getStringDate(prop.createdAt) }}</p>  
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
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
              <span class="line"></span>
              <h6>Owner: {{ prop.owner }}</h6>
              <p>Published on: {{ getStringDate(prop.createdAt) }}</p> 
              <p>Price: {{ weiToEur(prop.price) }}€ ({{ weiToEth(prop.price) }}ETH)</p>
              <p>Rooms: {{ prop.rooms }}</p>
              <p>Bathrooms: {{ prop.bathrooms}}</p>
              <p>Area: {{ prop.area }}m²</p>
              <!-- !! PENDING: Only visible for users logged -->
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
                <p>Rental end date: {{ getStringDate(prop.rentalEndDate) }}</p>
                <p>Available tokens: {{ prop.tokens }}</p>
                <p>Price per token: {{ (weiToEur(prop.price) / prop.tokens).toFixed(2) }}€ ({{ (weiToEth(prop.price) / prop.tokens).toFixed(2) }} ETH)</p>

                <span>Number of tokens:</span>
                <div class="container-rooms">
                  <label id="minus" @click="decrement()">-</label>
                  <input id="input-tokens" name="input-tokens" type="number" min="1" value="1" readonly>
                  <label id="plus" @click="increment(prop.tokens)">+</label>
                </div>
                
                <button
                  type="button"
                  class="buy-property"
                  @click="buyTokens(prop.id, tokens, (prop.price/prop.tokens)*tokens)"
                >
                Buy tokens
                </button>
              </div> 
              <!-- #################### DIFFERENT CASES OF LIQUIDATED PROPERTY #################### -->
              <!-- Button for notice of sold -->
              <button
                v-else-if="prop.soldOn != 0 && prop.rentalEndDate == 0"
                type="button"
                class="property-sold"
                style="cursor:text"
              >
              Sold on {{ getStringDate(prop.soldOn) }}
              </button>
              <!-- Button for notice of rented -->
              <button
                v-else-if="prop.soldOn != 0 && prop.rentalEndDate != 0"
                type="button"
                class="property-sold"
                style="cursor:text"
              >
              Rented on {{ getStringDate(prop.soldOn) }}
              </button>
            </div>
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
    </section>
  <!-- End Properties Section -->
</template>
<script>
import { Dapp } from '@/dapp';

export default {
  // Load the contracts
  beforeMount(){
    this.start();
  },
  data(){
    return {
      properties: [],
      fade: "modal fade",
      autoplay: true,
      tokens: 1
      // PENDING: Show this until having the oracle / API:
      // fakeEth: 3500
    }
  },
  methods: {  
    // Starts the dApp 
    async start(){
      await Dapp.init();
      await this.renderProperties();
    },

    // Catch the current created properties
    async renderProperties(){
      try {
        this.properties = [];
        const invalidAddr = 0x0000000000000000000000000000000000000000;
        let existingProp = true;
        let i = 0;
        while (existingProp)
        {
          let prop = await Dapp.Properties.properties(i);
          let owner = prop.owner;
          if (owner != invalidAddr)
            this.properties.push(prop);
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
    async buyProperty(id, price){
      let from = await Dapp.loadEthereum();
      await Dapp.buyProperty(from, id.toNumber(), price);

      // Update the status of properties
      await this.renderProperties();
    },

    // Rent property
    async rentProperty(id, price, rentalEndDate){
      let from = await Dapp.loadEthereum();
      await Dapp.rentProperty(from, id.toNumber(), rentalEndDate, price);

      // Update the status of properties
      await this.renderProperties();
    },

    // Buy tokens
    async buyTokens(id, tokens, priceToPay){
      let from = await Dapp.loadEthereum();
      await Dapp.buyTokens(from, id.toNumber(), tokens, priceToPay);

      // Update the status of properties
      await this.renderProperties();
    },

    // Get dates in human format
    getStringDate(date){
      return new Date(date*1000).toLocaleString();
    },

    // Currencies conversion
    weiToEur(price){
      return price/243739092347530;
    },

    weiToEth(price){
      return (price/(10**18)).toFixed(2);
    },

    // Select number of tokens


    pause() {
      const iframes = document.querySelectorAll("#modal iframe");
      iframes.forEach(element => {
        const srcArray = element.src.split("");
        srcArray[srcArray.length - 1] = "0";
        const newSrc = srcArray.join("");
        element.src = newSrc;
      });
    },

    // ----------------------- Buttons functions -----------------------
    increment(maxTokens) {
      var inputTokens = document.getElementById('input-tokens');
      var value = inputTokens.value;
      if(value < maxTokens) value++;
      inputTokens.value = value;
      this.tokens = value;
    },
    decrement() {
      var inputTokens = document.getElementById('input-tokens');
      var value = inputTokens.value;
      if(value > 1) value--;
      inputTokens.value = value;
      this.tokens = value;
  }
  }
}
</script>

<style scoped>
  .properties .container-rooms {
    display: flex;
    border-radius: 45px;
    border: 1px solid #cecece;
    width: 40.5%;
    margin-left: 220px;
  }

  .properties .container-rooms #input-tokens {
    text-align: center;
    font-size: 14px;
    border: none;
    outline: none;
    color: #202030;
  }

  .properties .container-rooms label {
    color: #3498db;
    font-size: 13px;
    font-weight: 20px;
    border: none;
    background-color: #ffffff;
    cursor: pointer;
    outline: none;
  }
</style>