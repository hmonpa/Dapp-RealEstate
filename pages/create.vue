<template>
    <!-- ======= Access Section ======= -->
    <section id="access" class="access">
      <div class="container">

        <div class="section-title" data-aos="fade-up" style="margin:100px 0 50px 0">
          <h2>Sign up</h2>
        </div>

        <div class="row">
          <div class="col-lg-3 col-md-12"></div>
          <div class="col-lg-6 col-md-12" data-aos="fade-up" data-aos-delay="300">
            <form id="createForm" class="php-email-form">
              <p>Welcome to the dApp!</p>
              <div class="form-group">
                <input type="text" v-model="name" class="form-control" name="name" id="name" placeholder="Enter your name..." required>
              </div>
              <div class="form-group">
                <input type="email" v-model="email" class="form-control" name="email" id="email" placeholder="Enter your email..." required>
              </div>
              <div class="form-group">
                <input type="password" v-model="password" class="form-control" name="password" id="password" placeholder="Create a password..." required>
              </div>
              <div class="text-center" style="margin:50px 0 270px 0">
                <button type="submit" @click="signUp">Access</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    <!-- End Access Section -->
</template>
<script>
import Vue from 'vue';
import { Dapp } from '@/dapp';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

export default {
  beforeMount(){
    this.start();
  },
  data: () => ({
    name: "",
    email: "",
    password: ""
  }),
  methods: {
    // Load the contracts
    async start(){
      await Dapp.init();
    },
    async signUp() {
      createForm.addEventListener("submit", e => {
          e.preventDefault();
      });
      const account = document.getElementById("account").innerText;

      if(!account){
        swal({
          title: "Error!",
          text: "Please connect your MetaMask wallet",
          icon: "error",
          dangerMode: true
        }).then(function() {
          window.location.reload();
        });
      } else { 
        let exists = await Dapp.checkExists(account);

        if (exists) {
          Swal.fire({
              title: "Error!",
              text: "An account already exists with this address",
              icon: "error"
            })
        } else {
          await Dapp.signUp(account, createForm["name"].value, createForm["email"].value, createForm["password"].value);
          
          Swal.fire({
            title: "User created successfully",
            icon: "success"
          }).then(function() {
            window.location.href = "/access";
          });
        }
      }
    }
  }
}
</script>