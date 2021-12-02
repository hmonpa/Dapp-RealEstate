<template>
    <!-- ======= Publish Section ======= -->
    <section v-if="userLogged" id="publish" class="publish">
      <div class="container" style="margin-top:100px;margin-bottom:290px">

        <div class="section-title" data-aos="fade-up">
          <h2>Upload properties</h2>
        </div>

        <div class="row">

          <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="100">
          </div>
          <div class="col-lg-6 col-md-12" data-aos="fade-up" data-aos-delay="300">
            <form id="propertyForm" class="php-email-form">
              <div class="form-group">
                <input type="text" name="city" class="form-control" id="city" placeholder="Enter the city..." required>
              </div>
              <div class="form-group">
                <input type="number" class="form-control" name="price" id="price" placeholder="Enter the price..." required>
              </div>
              <div class="form-group text-center">
                <div class="toggle-container">
                  <div id="toggle" class="switch-toggle well">
                    <input id="sell" @click="function1" name="term" type="radio" value="sell">
                    <label for="sell" >Sell</label>
                    <input id="rent" @click="function2" name="term" type="radio" value="rent">
                    <label for="rent" >Rent</label>
                    <a class="btn btn-primary"></a>
                  </div>
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
import $ from 'jquery';
import { Dapp } from '@/dapp';
import auth from '@/src/auth';
const IPFS = require('ipfs-core');

export default {
  computed: {
    userLogged() {
      return auth.getUserLogged();
    }
  },
  data(){
    return {}
  },
  methods: {  
    function1() {
      var sol = document.getElementById("sell").checked = true;
      var sol2 = document.getElementById("rent").checked = false;
      console.log("SELL: ", sol);
    },
    function2(){
      var sol = document.getElementById("rent").checked = true;
      var sol2 = document.getElementById("sell").checked = false;
      console.log("RENT: ", sol, " and SELL ", sol2);
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

    // Upload data from the upload properties form
    async uploadData() {
      const propertyForm = document.querySelector("#propertyForm");
      const account = document.getElementById("account").innerText;
      console.log(account);
      propertyForm.addEventListener("submit", e => {
        e.preventDefault(); 

        console.log(account, propertyForm["city"].value, propertyForm["price"].value)

      });
      
      await Dapp.uploadProperty(account, propertyForm["city"].value, propertyForm["price"].value);
      window.location.href = "/#properties";
    },
  },
  beforeMount(){
    // Call to JS
    this.start();
  }
}
</script>

<style>

.toggle-container {
  border: 1px solid #cecece;
  padding: 3px 3px 3px 3px;
  border-radius: 30px;
  margin-bottom: 30px;
}

.toggle-container .btn-primary {
  background: #046CA7;
  background: -webkit-linear-gradient(-150deg, rgb(2, 179, 226), rgb(4, 108, 167));
  background: linear-gradient(-150deg, rgb(2, 179, 226), rgb(4, 108, 167));
}

.switch-toggle a {
  display: none;
}

@media only screen {
  /* Radio Switch
 */
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
    outline-color: Highlight;
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
    font-size: 20px;
    text-transform: uppercase;
    font-weight: 500;
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
  /* Bugfix for older Webkit, including mobile Webkit. Adapted from
 * https://css-tricks.com/webkit-sibling-bug/
 */
  @media only screen and (-webkit-max-device-pixel-ratio: 2) and (max-device-width: 80em) {
    .switch-light,
    .switch-toggle {
      -webkit-animation: webkitSiblingBugfix infinite 1s;
    }
  }
  @-webkit-keyframes webkitSiblingBugfix {
    from {
      -webkit-transform: translate3d(0, 0, 0);
    }
    to {
      -webkit-transform: translate3d(0, 0, 0);
    }
  }
}
 
</style>