<template>
    <!-- ======= Contact Section ======= -->
    <section id="contact" class="contact">
      <div class="container">

        <div class="section-title" data-aos="fade-up">
          <h2>Upload new property to the platform</h2>
          <vue-metamask @onComplete="loadMetaMask">
          </vue-metamask>
        </div>

        <div class="row">

          <div class="col-lg-6 col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div class="contact-about">
              <div>
                <p>Your current address is</p>
                <p>{{ account }}</p>
              </div>
              <!--<div class="social-links">
                <a href="#" class="twitter"><i class="bi bi-twitter"></i></a>
                <a href="#" class="facebook"><i class="bi bi-facebook"></i></a>
                <a href="#" class="instagram"><i class="bi bi-instagram"></i></a>
                <a href="#" class="linkedin"><i class="bi bi-linkedin"></i></a>
              </div>-->
            </div>
          </div>

          <!--<div class="col-lg-3 col-md-6 mt-4 mt-md-0" data-aos="fade-up" data-aos-delay="200">
            <div class="info">
              <div>
                <i class="ri-map-pin-line"></i>
                <p>A108 Adam Street<br>New York, NY 535022</p>
              </div>

              <div>
                <i class="ri-mail-send-line"></i>
                <p>info@example.com</p>
              </div>

              <div>
                <i class="ri-phone-line"></i>
                <p>+1 5589 55488 55s</p>
              </div>

            </div>
          </div>-->

          <div class="col-lg-6 col-md-12" data-aos="fade-up" data-aos-delay="300">
            <form id="propertyForm" class="php-email-form">
              <div class="form-group">
                <input type="text" name="city" class="form-control" id="city" placeholder="Enter the city..." required>
              </div>
              <div class="form-group">
                <input type="number" class="form-control" name="price" id="price" placeholder="Enter the price..." required>
              </div>
              <!--<div class="form-group">
                <input type="text" class="form-control" name="subject" id="subject" placeholder="Subject" required>
              </div>
              <div class="form-group">
                <textarea class="form-control" name="message" rows="5" placeholder="Message" required></textarea>
              </div>-->
              <!--<div class="my-3">
                <div class="loading">Loading</div>
                <div class="error-message"></div>
                <div class="sent-message">Your message has been sent. Thank you!</div>
              </div>-->
              <div class="text-center">
                <button type="submit" @click="load">Upload</button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
    <!-- End Contact Section -->
</template>
<script>
import VueMetamask from 'vue-metamask';
export default {
  components: {
    VueMetamask
  },
  data(){
    return {
      Dapp: [],
      contracts: [],
      account: null
    }
  },
  // head(){},
  methods: {
    // Load MetaMask and save the address
    loadMetaMask(data){
      console.log(data);
      (async () => {
        const account = await this.myAccount();
        console.log(account);
      })()
      this.init();
    },
    init(){
      console.log("Dapp loaded");
      (async () => {
        await this.loadEthereum();
        // await this.checkAccount(),
      // await Dapp.loadContracts()
      // Dapp.render()
      // await Dapp.renderProperties()
      // await Dapp.uploadProperty()
      // await Dapp.isSelled()
      })()
      
    },
    // Save form information
    load(){
      const propertyForm = document.querySelector("#propertyForm");

      propertyForm.addEventListener("submit", e => {
        e.preventDefault();

        console.log(propertyForm["city"].value, propertyForm["price"].value)

        // uploadProperty(propertyForm["city"].value, propertyForm["price"].value);
      });
      // document.addEventListener("DOMContentLoaded", () => {
      //     this.init();
      // })
    },
    async loadEthereum() {
        if (window.ethereum){
            const web3Provider = window.ethereum
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        // } else if (window.web3) {
        //     web3 = new Web3(window.web3.currentProvider)
        // }
        } else {
            console.log('No ethereum browser is installed. Try it installing MetaMask')
        }
    },
    // Save the first account from Ganache
    async myAccount() {
        return await window.ethereum.request({ method: 'eth_requestAccounts' });
    },
    async loadContracts() {
        const res = await fetch("Properties.json");
        const propertiesJSON = await res.json();
        console.log(propertiesJSON);
        // Dapp.contracts.Properties = await TruffleContract(propertiesJSON);
        // Dapp.contracts.Properties.setProvider(Dapp.web3Provider);
        
        // // Properties is deployed...
        // Properties = await Dapp.contracts.Properties.deployed();
        // console.log(Dapp.Properties)
    },
      // render: () => {
      //     document.getElementById('account').innerText = Dapp.account;
      // },
      // renderProperties: async() => {
      //     const propertyCounter = await Dapp.Properties.propertyCounter();
      //     const propertyCtrNum = propertyCounter.toNumber();

      //     let html = '';

      //     for(let i = 1; i <= propertyCounter; i++){
      //         const property = await Dapp.Properties.properties(i);
      //         const id = property[0];
      //         const city = property[1];
      //         const price = property[2].toNumber();
      //         const isSelled = property[3];

      //         const dateUploading = property[4];

      //         let propertyElement = `
      //         <div>
      //             <br>
      //             <span>Location: ${city}</span>
      //             <br>
      //             <span>Price: ${price}</span>
      //             <br>
      //             <span>Upload date: ${new Date(dateUploading*1000).toLocaleString()}</span>
      //             <br>
      //             <input data-id="${id}" type="checkbox" 
      //                 ${isSelled && "checked"} onchange="Dapp.removeProperty(this)"/>
      //             <br><br>
      //         </div>
      //         `
      //         html += propertyElement;
      //     }
      //     document.querySelector('#propertyList').innerHTML = html;
      // },
      // uploadProperty: async(city, price) => {
      //     const res = await Dapp.Properties.uploadProperty(city, price, {
      //         from: Dapp.account
      //     })
      //     // console.log(res.logs[0].args)
      //     window.location.reload()
      // },
      // removeProperty: async(element) => {
      //     const propertyId = element.dataset.id;
      //     await Dapp.Properties.removeProperty(propertyId, {
      //         from: Dapp.account
      //     })

      //     window.location.reload()
      // }
    // }
  }
}
</script>