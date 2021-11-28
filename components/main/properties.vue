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
              v-if="!prop.isSelled"
              class="icon-box" 
              data-aos="fade-up" 
              data-aos-delay="100"
              data-bs-toggle="modal"
              :data-bs-target="'#property_' + index"
              style="cursor: pointer"
            >
              <div class="icon" style="background:url('/img/favicon.png') center;">
                <i class="bx bxl-dribbble" ></i>
              </div>
              <h4 class="title"><a href="">{{ prop.city }}</a></h4>
              <p class="description">{{ prop.price }}€</p>
              <br>
              <p class="description">{{ new Date(prop.createdAt*1000).toLocaleDateString() }}</p>  
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
              <p>Price: {{ prop.price }}</p>
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