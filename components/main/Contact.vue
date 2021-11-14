<template>
    <!-- ======= Contact Section ======= -->
    <section id="contact" class="contact">
      <div class="container">

        <div class="section-title" data-aos="fade-up">
          <h2>Upload properties</h2>
          <!--<vue-metamask @onComplete="loadMetaMask">
          </vue-metamask>-->
        </div>

        <div class="row">

          <div class="col-lg-6 col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div class="contact-about">
              <div>
                <p>Your current address is</p>
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
                <button type="submit">Upload</button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
    <!-- End Contact Section -->
</template>
<script>
// import VueMketamask from '/node_modules/vue-metamask/src/VueMetamask.vue';
import { Dapp } from '../../dapp';
// import { ui } from '../../ui';
export default {

  // components: {
  //   VueMetamask
  // },
  data(){
    return {}
  },
  // head(){},
  methods: {  
    async start(){
      await Dapp.init();
    },
    // Load MetaMask and save the address
    // loadMetaMask(data){
    //   console.log("MetaMask info: ", data);
    //   Dapp.init();
    //   // console.log(Dapp.account);
    // },
    // loadData() {
    //   const propertyForm = document.querySelector("#propertyForm");
    //   document.addEventListener("DOMContentLoaded", async() => {
    //       await Dapp.init();
    //   })
    //   propertyForm.addEventListener("submit", e => {
    //     e.preventDefault();

    //     console.log(propertyForm["city"].value, propertyForm["price"].value)

    //     Dapp.uploadProperty(propertyForm["city"].value, propertyForm["price"].value);
    //   });
    // }
  },
  beforeMount(){
    this.start()
  }
}
</script>