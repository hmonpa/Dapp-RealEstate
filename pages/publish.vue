<template>
    <!-- ======= Publish Section ======= -->
    <section v-if="userLogged" id="publish" class="publish">
      <div class="container">
        <div class="section-title" data-aos="fade-up">
          <h2>Upload properties</h2>
        </div>

        <div class="row">
          <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="100">
          </div>
          <div class="col-lg-6 col-md-12" data-aos="fade-up" data-aos-delay="300">
            <form id="propertyForm" class="php-email-form">
              <div class="form-group">
                <span>City:</span>
                <input type="text" name="city" class="form-control" id="city" placeholder="Barcelona">
              </div>
              <div class="form-group">
                <span>Address:</span>
                <input type="text" id="pac-input" name="address" class="form-control" placeholder="Plaça Sant Jaume, 1">
              </div>
              <div class="form-group">
                  <span>Price in EUR:</span>
                  <input type="number" step="5000" min="0" class="form-control" name="price" id="price" placeholder="150000">
              </div>
              <div class="form-group">
                <span>Rooms:</span>
                <div class="container-rooms">
                  <label id="minus" @click="decrement(0)">-</label>
                  <input id="input-rooms" type="number" min="1" value="1" readonly>
                  <label id="plus" @click="increment(0)">+</label>
                </div>
              </div>
              <div class="form-group">
                  <span>Area in m²:</span>
                  <input type="number" style="width:56.5%; border-radius:45px" min="40" class="form-control" name="area" id="area" placeholder="80">
              </div>
              <div class="form-group">
                <span>Bathrooms:</span>
                <div class="container-rooms">
                  <label id="minus" @click="decrement(1)">-</label>
                  <input id="input-bathrooms" type="number" min="1" value="1" readonly>
                  <label id="plus" @click="increment(1)">+</label>
                </div>
              </div>
              <div class="form-group text-center">
                <div class="toggle-container">
                  <div id="toggle" class="switch-toggle well">
                    <input id="sell" v-on:click="typeOfProperty = 1 && (tokenized = true)" name="term" type="radio" value="sell" checked>
                    <label for="sell" >Sell</label>
                    <input id="rent" v-on:click="typeOfProperty = 0 && (tokens == 1)" name="term" type="radio" value="rent">
                    <label for="rent" >Rent</label>
                    <a class="btn btn-primary"></a>
                  </div>
                </div>
              </div>
              <div v-if="typeOfProperty == 0">
                <div v-if="rooms > 1">
                  <div class="form-group">
                    <span>Is it tokenized?</span>
                    <div id="switch" class="hover" v-on:click="tokenized = !tokenized" onclick="this.classList.toggle('hover')">
                      <div id="toggleswitch" @click="calculateTokens"></div>
                    </div>
                  </div>
                  <div v-if="tokenized" class="num-tokenizations">
                    <span>Number of tokens:</span>
                    <div class="container-rooms">
                      <label id="minus" @click="decrement(2)">-</label>
                      <input id="input-tokens" type="number" min="1" value="1" readonly>
                      <label id="plus" @click="increment(2)">+</label>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <span>Rental end date:</span>
                  <input type="date" id="date-end" name="date-end" class="form-control" value="2022-08-08" required>
                </div>
              </div>
              <div class="text-center">
                <button type="submit" @click="uploadData">Publish</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    <!-- End Publish Section -->
</template>

<script>
import { Dapp } from '@/dapp';
import auth from '@/src/auth';
const IPFS = require('ipfs-core');

export default {
  async beforeMount(){
    // Call to the contracts
    this.start();
  },
  computed: {
    userLogged() {
      return auth.getUserLogged();
    }
  },
  data(){
    return {
      typeOfProperty: 1,
      tokenized: 1,
      rooms: 1,
      bathrooms: 1,
      tokens: 1
    }
  },
  methods: {  
    calculateTokens() {
      this.tokens >= 1 ? this.tokens = 0 : this.tokens = 1; 
    },
    // Starts the dApp 
    async start(){
      // Testing with InterPlanetary File System Protocol
      /* const ipfs = await IPFS.create();
      const { cid } = await ipfs.add('Prueba');
      const cidString = cid.toString();
      console.log(cidString);
      
      const stream = ipfs.cat(cidString);
      let data = '';

      for await (const chunk of stream){
        data += chunk.toString();
      } */

      await Dapp.init();
    },

    // ----------------------- Buttons functions -----------------------
    increment(i) {
      if (i == 0){
        // Rooms
        var inputrooms = document.getElementById('input-rooms');
        var value = inputrooms.value;
        if(value < 10) value++;
        inputrooms.value = value;
        this.rooms = value;
        console.log(this.rooms);
      } else if(i == 1){
        // Bathrooms
        var inputBathrooms = document.getElementById('input-bathrooms');
        var value = inputBathrooms.value;
        if(value < 10) value++;
        inputBathrooms.value = value;
        this.bathrooms = value;
      } else if (i == 2){
        // Tokens
        var inputTokens = document.getElementById('input-tokens');
        var value = inputTokens.value;
        if(value < this.rooms) value++;
        inputTokens.value = value;
        this.tokens = value;
      }
    },
    decrement(i){
      if(i == 0){
        // Rooms
        var inputrooms = document.getElementById('input-rooms');
        var value = inputrooms.value;
        if(value > 1) value--;
        inputrooms.value = value;
        this.rooms = value;
      } else if(i == 1) {
        // Bathrooms
        var inputBathrooms = document.getElementById('input-bathrooms');
        var value = inputBathrooms.value;
        if(value > 1) value--;
        inputBathrooms.value = value;
        this.bathrooms = value;
      } else if(i == 2) {
        // Tokens
        var inputTokens = document.getElementById('input-tokens');
        var value = inputTokens.value;
        if(value > 2) value--;
        inputTokens.value = value;
        this.tokens = value;
      }
    },

    // Upload data from the upload properties form
    async uploadData() {
      const account = await Dapp.checkStatus();

      propertyForm.addEventListener("submit", e => {
        e.preventDefault(); 
        console.log(this.tokens);
        console.log(propertyForm["date-end"].value);
      });

      // try {
      //   const propertyForm = document.querySelector("#propertyForm");
      //   this.typeOfProperty == 0 ? 
      //     await Dapp.uploadProperty(account, propertyForm["city"].value, propertyForm["address"].value, propertyForm["price"].value, this.rooms, propertyForm["area"].value, this.bathrooms, this.typeOfProperty, this.tokens, propertyForm["date-end"].value) 
      //     : 
      //     await Dapp.uploadProperty(account, propertyForm["city"].value, propertyForm["address"].value, propertyForm["price"].value, this.rooms, propertyForm["area"].value, this.bathrooms, this.typeOfProperty, 0, 0);
        
      //   window.location.href = "/#properties";
      // } catch (err) {
      //   console.log(err);
      // }
    },

  }
}
</script>

<style>
/* Sell or rent style */
#plus {
	padding: 15px 25px 15px 5px;
	border-radius: 0 45px 45px 0;
}

#minus {
	padding: 15px 5px 15px 25px;
	border-radius: 45px 0 0 45px;
}

.toggle-container {
  border: 1px solid #cecece;
  border-radius: 30px;
  margin: 50px 0 50px 50px;
  padding: 3px;
  width: 80%;
}

.toggle-container .btn-primary {
  background: #3498db;
}

.switch-toggle a {
  display: none;
}

@media only screen {
  /* Radio Switch */
  .switch-toggle {
    position: relative;
    display: block;
    padding: 0 !important;
  }
  .switch-toggle::after {
    clear: both;
    content: "";
    display: table;
  }
  .switch-toggle *,
  .switch-toggle *:before,
  .switch-toggle *:after {
    box-sizing: border-box;
    border-radius: 30px;
  }
  .switch-toggle a {
    display: block;
    -webkit-transition: all 0.2s ease-out;
    -moz-transition: all 0.2s ease-out;
    transition: all 0.2s ease-out;
  }
  .switch-toggle label,
  .switch-toggle > span {

    line-height: 2em;
    vertical-align: middle;
  }
  .switch-toggle input:focus ~ span a,
  .switch-toggle input:focus + label {
    outline-width: 2px;
    outline-style: solid;
    outline: none;
   }
  .switch-toggle input:checked + label {
    color:#fff;
  }
}

@media only screen and (-webkit-min-device-pixel-ratio: 0) {
  .switch-toggle input:focus ~ span a,
  .switch-toggle input:focus + label {
    outline-color: -webkit-focus-ring-color;
    outline-style: auto;
    outline: none;
  }
}

@media only screen {
  .switch-toggle input {
    position: absolute;
    left: 0;
    opacity: 0;
  }
  .switch-toggle input + label {
    position: relative;
    z-index: 2;
    display: block;
    float: left;
    padding: 5px;
    margin: 0;
    text-align: center;
    font-size: 18px;
    font-weight: 400;
  }
  .switch-toggle a {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0;
    z-index: 1;
    width: 10px;
    height: 100%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(4),
  .switch-toggle label:nth-child(2):nth-last-child(4) ~ label,
  .switch-toggle label:nth-child(2):nth-last-child(4) ~ a {
    width: 50%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(4) ~ input:checked:nth-child(3) + label ~ a {
    left: 50%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(6),
  .switch-toggle label:nth-child(2):nth-last-child(6) ~ label,
  .switch-toggle label:nth-child(2):nth-last-child(6) ~ a {
    width: 33.33%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(6) ~ input:checked:nth-child(3) + label ~ a {
    left: 33.33%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(6) ~ input:checked:nth-child(5) + label ~ a {
    left: 66.66%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(8),
  .switch-toggle label:nth-child(2):nth-last-child(8) ~ label,
  .switch-toggle label:nth-child(2):nth-last-child(8) ~ a {
    width: 25%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(8) ~ input:checked:nth-child(3) + label ~ a {
    left: 25%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(8) ~ input:checked:nth-child(5) + label ~ a {
    left: 50%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(8) ~ input:checked:nth-child(7) + label ~ a {
    left: 75%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(10),
  .switch-toggle label:nth-child(2):nth-last-child(10) ~ label,
  .switch-toggle label:nth-child(2):nth-last-child(10) ~ a {
    width: 20%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(10) ~ input:checked:nth-child(3) + label ~ a {
    left: 20%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(10) ~ input:checked:nth-child(5) + label ~ a {
    left: 40%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(10) ~ input:checked:nth-child(7) + label ~ a {
    left: 60%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(10) ~ input:checked:nth-child(9) + label ~ a {
    left: 80%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(12),
  .switch-toggle label:nth-child(2):nth-last-child(12) ~ label,
  .switch-toggle label:nth-child(2):nth-last-child(12) ~ a {
    width: 16.6%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(12) ~ input:checked:nth-child(3) + label ~ a {
    left: 16.6%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(12) ~ input:checked:nth-child(5) + label ~ a {
    left: 33.2%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(12) ~ input:checked:nth-child(7) + label ~ a {
    left: 49.8%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(12) ~ input:checked:nth-child(9) + label ~ a {
    left: 66.4%;
  }
  .switch-toggle label:nth-child(2):nth-last-child(12) ~ input:checked:nth-child(11) + label ~ a {
    left: 83%;
  }
}

/* Switch of tokenization */
#switch {
  width: 100px;
  padding: 5px;
  border: 2px solid #3498db;
  box-sizing: border-box;
  opacity: 0.5;
  -webkit-filter: grayscale(100%);
  -webkit-transition: all 03s;
  transition: all 0.3s;
  border-radius: 540px;
  cursor: pointer;
}

#toggleswitch {
  width: 40px;
  height: 40px;
  background: #3498db;
  border-radius: 100%;
  position: relative;
  transition: all 0.3s;
  left: 0;
  -webkit-transition: all 0.3s;
}

#switch.hover #toggleswitch {
  left: 45px;
}

#switch.hover {
  -webkit-filter: none;
  opacity:1
}
</style>