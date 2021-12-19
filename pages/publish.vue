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
                <span>Cadastral reference:</span>
                <input type="text" name="id" class="form-control" id="id" placeholder="XX-XXXXX-XXXX-XX" required />
              </div>
              <div class="form-group">
                <span>City:</span>
                <input type="text" name="city" class="form-control" id="city" placeholder="Barcelona" required />
              </div>
              <div class="form-group">
                <span>Address:</span>
                <input type="text" id="pac-input" name="address" class="form-control" placeholder="Plaça Sant Jaume, 1" required />
              </div>
              <div class="form-group">
                  <span>Price in EUR:</span>
                  <input type="number" step="5000" min="0" class="form-control" name="price" id="price" placeholder="150000" required />
              </div>
              <div class="form-group">
                <span>Rooms:</span>
                <div class="container-rooms">
                  <label id="minus" @click="decrement(0)">-</label>
                  <input id="input-rooms" type="number" min="1" value="1" readonly required />
                  <label id="plus" @click="increment(0)">+</label>
                </div>
              </div>
              <div class="form-group">
                  <span>Area in m²:</span>
                  <input type="number" style="width:56.5%; border-radius:45px" min="40" class="form-control" name="area" id="area" placeholder="80" required />
              </div>
              <div class="form-group">
                <span>Bathrooms:</span>
                <div class="container-rooms">
                  <label id="minus" @click="decrement(1)">-</label>
                  <input id="input-bathrooms" type="number" min="1" value="1" readonly required />
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
                      <div id="toggleswitch"></div>
                    </div>
                  </div>
                  <div v-if="tokenized">
                    <span>Number of tokens:</span>
                    <div class="container-rooms">
                      <label id="minus" @click="decrement(2)">-</label>
                      <input id="input-tokens" name="input-tokens" type="number" min="2" value="2" readonly>
                      <label id="plus" @click="increment(2)">+</label>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <span>Rental end date:</span>
                  <input type="date" id="date-end" name="date-end" class="form-control" value="2022-08-08" required />
                </div>
              </div>
              <div class="form-group">
                <span>Upload image:</span>
                <input type="file" id="input-image" @change="onImgSelected" name="input-image" class="form-control" accept="image/*" required />
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
// import * as IPFS from 'ipfs-core';
import auth from '@/src/auth';
import { Dapp } from '@/dapp';
import moment from 'moment';
import * as IPFS from 'ipfs';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

export default {
  async beforeMount(){
    // Call to the contracts
    // this.start();
    await Dapp.init();
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
      tokens: 0,
      ipfsImage: ''
    }
  },
  methods: {  
    // ----------------------- Upload images functions -----------------------
    onImgSelected(event)
    {
      event.preventDefault();
      event.stopPropagation();
      this.image = event.target.files[0];
      this.uploadToIPFS(this.image);
    },

    async uploadToIPFS(img)
    {
      const options = {
        wrapWithDirectory: true
      }

      const node = await IPFS.create({ silent: true });
      console.log(node);
      let cid = await node.add(img);
      console.log("Node add: ", cid.path);
      this.ipfsImage = cid.path;
    },

    // ----------------------- Buttons functions -----------------------
    increment(i) {
      switch (i) {
        case 0: 
          // Rooms
          var inputrooms = document.getElementById('input-rooms');
          var value = inputrooms.value;
          if(value < 10) value++;
          inputrooms.value = value;
          this.rooms = value;
          break;
        case 1:
          // Bathrooms
          var inputBathrooms = document.getElementById('input-bathrooms');
          var value = inputBathrooms.value;
          if(value < 10) value++;
          inputBathrooms.value = value;
          this.bathrooms = value;
          break;
        case 2:
          // Tokens
          var inputTokens = document.getElementById('input-tokens');
          var value = inputTokens.value;
          if(value < this.rooms) value++;
          inputTokens.value = value;
          this.tokens = value;
          break;
      }
    },

    decrement(i){
      switch(i) {
        case 0:
          // Rooms
          var inputrooms = document.getElementById('input-rooms');
          var value = inputrooms.value;
          if(value > 1) value--;
          inputrooms.value = value;
          this.rooms = value;
          break;
        case 1:
          // Bathrooms
          var inputBathrooms = document.getElementById('input-bathrooms');
          var value = inputBathrooms.value;
          if(value > 2) value--;
          inputBathrooms.value = value;
          this.bathrooms = value;
          break;
        case 2:
          // Tokens
          var inputTokens = document.getElementById('input-tokens');
          var value = inputTokens.value;
          if(value > 2) value--;
          inputTokens.value = value;
          this.tokens = value;
          break;
      }
    },

    // Upload from the properties form
    async uploadData() {
      propertyForm.addEventListener("submit", e => {
        e.preventDefault(); 
      });

      const account = await Dapp.currentAddr();
      try {
        propertyForm["input-tokens"] == null ? 
          this.tokens = 0 : this.tokens = propertyForm["input-tokens"].value;

        const allowed = await this.isAllowedProperty(propertyForm["id"].value);

        if (allowed){
          Swal.fire({
            title: 'Are you sure you want to upload this property to the platform?',
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
              
              await Dapp.uploadPropertyData(account, this.rooms, propertyForm["area"].value, this.bathrooms);
              // console.log(propertyForm["id"].value, account, propertyForm["city"].value, propertyForm["address"].value, propertyForm["price"].value, this.rooms, propertyForm["area"].value, this.bathrooms, this.typeOfProperty, this.tokens, parseInt(moment(propertyForm["date-end"].value).unix()), this.ipfsImage);
              // Upload property depending if it's for sale or for rent
              this.typeOfProperty == 0 && this.rooms > 1 ? 
                await Dapp.uploadProperty(propertyForm["id"].value, account, propertyForm["city"].value, propertyForm["address"].value, propertyForm["price"].value, this.typeOfProperty, this.tokens, parseInt(moment(propertyForm["date-end"].value).unix()), this.ipfsImage) 
                : 
                await Dapp.uploadProperty(propertyForm["id"].value, account, propertyForm["city"].value, propertyForm["address"].value, propertyForm["price"].value, this.typeOfProperty, 0, 0, this.ipfsImage);

               Swal.fire(
                'Done!',
                'You have successfully uploaded property ' + propertyForm["id"].value + '.',
                'success'
              ).then(async() => {
                window.location.href = "/properties";
              });
            }
          });
        } else {
          Swal.fire(
            'This property already exists!',
            'The property with id ' + propertyForm["id"].value + ' already exists.',
            'error'
          );
        }
        
      } catch (err) {
        console.log(err);
      }
    }, 

    async isAllowedProperty(id)
      {
        const allowedProperty = 999999;
        const exists = await Dapp.propertyExists(id);

        return (exists == allowedProperty) ? true : false;
      }

  }
}
</script>

<style scoped>
.publish {
  margin-top:120px;
}

.publish .container {
  border:1px #2383c4 solid;
  border-radius:20px;
  width: 60%;
  padding:60px 0 60px 0;
  margin-top:50px;
  margin-bottom:175px;
}
.publish .publish-about h3 {
  font-size: 28px;
  margin: 0 0 10px 0;
  padding: 0;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 1px;
  color: #222222;
}
.publish .publish-about p {
  font-size: 14px;
  line-height: 24px;
  font-family: "Raleway", sans-serif;
  color: rgb(0, 0, 0);
}
.publish #account {
  font-weight: bold;
}
.publish .social-links {
  padding-bottom: 20px;
}
.publish .social-links a {
  font-size: 18px;
  display: inline-block;
  background: #fff;
  color: #3498db;
  line-height: 1;
  padding: 8px 0;
  margin-right: 4px;
  border-radius: 50%;
  text-align: center;
  width: 36px;
  height: 36px;
  transition: 0.3s;
  border: 1px solid #3498db;
}
.publish .social-links a:hover {
  background: #3498db;
  color: #fff;
}
.publish .info {
  color: #444444;
}
.publish .info i {
  font-size: 32px;
  color: #3498db;
  float: left;
  line-height: 1;
}
.publish .info p {
  padding: 0 0 10px 42px;
  line-height: 28px;
  font-size: 14px;
}

/* Rooms, bathrooms and tokens chooser buttons */
.publish .container-rooms {
	display: flex;
	border-radius: 45px;
  border: 1px solid #cecece;
  width: 56.5%;
  text-align: center;
}

.publish .container-rooms #input-rooms,
.publish .container-rooms #input-bathrooms,
.publish .container-rooms #input-tokens {
	text-align: center;
	font-size: 14px;
	border: none;
	outline: none;
	color: #202030;
}

.publish .container-rooms label {
  color: #3498db;
	font-size: 13px;
  font-weight: 30px;
	border: none;
	background-color: #ffffff;
	cursor: pointer;
	outline: none;
}

.publish .php-email-form .error-message {
  display: none;
  color: #fff;
  background: #ed3c0d;
  text-align: left;
  padding: 15px;
  font-weight: 600;
}
.publish .php-email-form .error-message br + br {
  margin-top: 25px;
}
.publish .php-email-form .sent-message {
  display: none;
  color: #fff;
  background: #18d26e;
  text-align: center;
  padding: 15px;
  font-weight: 600;
}
.publish .php-email-form .loading {
  display: none;
  background: #fff;
  text-align: center;
  padding: 15px;
}
.publish .php-email-form .loading:before {
  content: "";
  display: inline-block;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  margin: 0 10px -6px 0;
  border: 3px solid #18d26e;
  border-top-color: #eee;
  -webkit-animation: animate-loading 1s linear infinite;
  animation: animate-loading 1s linear infinite;
}
.publish .php-email-form .form-group {
  margin-bottom: 20px;
}
.publish .php-email-form input, .publish .php-email-form textarea {
  border-radius: 0;
  box-shadow: none;
  font-size: 14px;
  padding: 10px 15px;
}
.publish .php-email-form input:focus, .publish .php-email-form textarea:focus {
  border-color: #3498db;
}
.publish .php-email-form button[type=submit] {
  background: #3498db;
  border: 0;
  padding: 10px 24px;
  color: #fff;
  transition: 0.4s;
  border-radius: 50px;
}
.publish .php-email-form button[type=submit]:hover {
  background: #2383c4;
}
@-webkit-keyframes animate-loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes animate-loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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