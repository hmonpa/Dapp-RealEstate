<template>
    <!-- ======= Access Section ======= -->
    <section v-if="!userLogged" id="access" class="access">
      <div class="container" style="margin-top: 100px; margin-bottom: 290px">
        <div class="section-title" data-aos="fade-up" style="margin-top:50px">
          <h2>Sign up</h2>
        </div>
        <div class="row">
          <div class="col-lg-3 col-md-12"></div>
          <div class="col-lg-6 col-md-12" data-aos="fade-up" data-aos-delay="300">
            <form id="createForm" class="php-email-form">
              <div class="form-group">
                <span>Full name:</span>
                <input type="text" v-model="name" class="form-control" name="name" id="name" placeholder="Héctor Montesinos Parra" required>
              </div>
              <div class="form-group">
                <span>ID Card:</span>
                <input type="text" v-model="vatid" class="form-control" name="vatid" id="vatid" placeholder="01234567P" maxlength="9" required>
              </div>
              <div class="form-group">
                <span>Email:</span>
                <input type="email" v-model="email" class="form-control" name="email" id="email" placeholder="example@testing.eth" required>
              </div>
              <div class="form-group">
                <span>Password:</span>
                <input type="password" v-model="password" class="form-control" name="password" id="password" placeholder="********" required>
              </div>
              <div class="form-group">
                <span>Upload image:</span>
                <input type="file" id="input-image" @change="onImgSelected" name="input-image" class="form-control" accept="image/*" required />
              </div>
              <div class="text-center" style="margin-top:50px">
                <button type="submit" @click="signUp">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    <section v-else>
      <MainError />
    </section>
    <!-- End Access Section -->
</template>
<script>
import { AuthController } from '@/src/controllers/auth';
import { Web3Controller } from '@/src/controllers/web3';
import { uploadToIPFS } from '@/src/services/ipfs';
import auth from '@/src/services/auth';

import swal from 'sweetalert';
import Swal from 'sweetalert2';

export default {
  beforeMount(){
    this.start();
  },
  computed: {
    userLogged() {
      return auth.getUserLogged();
    }
  },
  data: () => ({
    name: "",
    email: "",
    password: "",
    vatid: "",
    ipfsImage: ''
  }),

  methods: {
    // Load the contracts
    async start(){
      await Web3Controller.init();
    },
    async signUp() {
      createForm.addEventListener("submit", e => {
          e.preventDefault();
      });
      const account = await Web3Controller.currentAccount();

      // Check if MetaMask is connected with account
      if(!account){
        Swal.fire({
          title: "Error!",
          text: "Please connect your MetaMask wallet",
          icon: "error"
        });
      } else { 
        let exists = await AuthController.checkExists(account);

        if (exists) {
          Swal.fire({
              title: "Error!",
              text: "An account already exists with this address",
              icon: "error"
            })
        } else {
          await AuthController.signUp(account, createForm["name"].value, createForm["email"].value, createForm["password"].value, createForm["vatid"].value, this.ipfsImage);
          
          Swal.fire({
            title: "Welcome " + createForm["name"].value + "!",
            text: "User created successfully",
            icon: "success"
          }).then(function() {
            window.location.href = "/access";
          });
        }
      }
    },
    // ----------------------- Upload images functions -----------------------
    async onImgSelected(event)
    {
      event.preventDefault();
      event.stopPropagation();
      this.image = event.target.files[0];
      this.uploadToIPFS(this.image);
      this.ipfsImage = await uploadToIPFS(this.image);
    }
  }
}
</script>