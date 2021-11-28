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
                <input type="text" name="city" class="form-control" id="city" placeholder="Enter the city..." required>
              </div>
              <div class="form-group">
                <input type="number" class="form-control" name="price" id="price" placeholder="Enter the price..." required>
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
  computed: {
    userLogged() {
      return auth.getUserLogged();
    }
  },
  data(){
    return {}
  },
  methods: {  
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
    uploadData() {
      const propertyForm = document.querySelector("#propertyForm");
      const account = document.getElementById("account").innerText;
      
      propertyForm.addEventListener("submit", e => {
        e.preventDefault();

        console.log(account, propertyForm["city"].value, propertyForm["price"].value)

        Dapp.uploadProperty(account, propertyForm["city"].value, propertyForm["price"].value);
      });
    },
  },
  beforeMount(){
    // Call to JS
    this.start();
  }
}
</script>