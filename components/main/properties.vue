<template>
    <!-- ======= Properties Section ======= -->
    <section id="properties" class="properties">
      <div class="container">

        <div class="section-title" data-aos="fade-up">
          <h2>Properties</h2>
          <p>Check the current properties uploaded at the platform!</p>
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
              <div v-if="prop.isSold" class="col-md-12" style="left:0;right:0;width:100%">
                <p class="description">SOLD!</p>
              </div>
              <div v-else>
                <p class="description">{{ weiToEur(prop.price) }}€ ({{ weiToEth(prop.price) }} ETH)</p>
                <br>
                <p class="description">{{ new Date(prop.createdAt*1000).toLocaleDateString() }}</p>  
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
              <h6 style="text-align:center">{{ prop.city }}</h6>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="pause"
              ></button>
            </div>
            <div class="modal-body" style="padding: 40px;text-align:center">
              <span class="line"></span>
              <h6>Published by: {{ prop.owner }}</h6>
              <p>Published on: {{ new Date(prop.createdAt*1000).toLocaleString() }}</p> 
              <p>Price: {{ weiToEur(prop.price) }} € </p>
              <p>Sold: {{ prop.isSold }}</p>
              <!-- !! Only visible for users logged -->
              <button
                v-if="!prop.isSold"
                type="button"
                class="buy-property"
                @click="buyProperty(prop.id, prop.price)"
              >
              Buy property
              </button>
              <button
                v-else
                type="button"
                class="property-sold"
              >
              Sold
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
      currentDate: Date.now(),

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

    async buyProperty(id, price){
      let from = await Dapp.loadEthereum();
      await Dapp.buyProperty(from, id.toNumber(), price);

      await this.renderProperties();
    },

    weiToEur(price){
      return price/243739092347530;
    },

    weiToEth(price){
      return (price/(10**18)).toFixed(2);
    },

    pause() {
      const iframes = document.querySelectorAll("#modal iframe");
      iframes.forEach(element => {
        const srcArray = element.src.split("");
        srcArray[srcArray.length - 1] = "0";
        const newSrc = srcArray.join("");
        element.src = newSrc;
      });
    }
  }
}
</script>