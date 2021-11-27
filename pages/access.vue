<template>
    <!-- ======= Access Section ======= -->
    <section id="access" class="access">
      <div class="container">

        <div class="section-title" data-aos="fade-up" style="margin:100px 0 50px 0">
          <h2>Sign in</h2>
        </div>

        <div class="row">
            <div class="col-lg-3 col-md-12"></div>
          <div class="col-lg-6 col-md-12" data-aos="fade-up" data-aos-delay="300">
            <form id="loginForm" class="php-email-form">
              <div class="form-group">
                <input type="password" v-model="password" class="form-control" name="password" id="password" placeholder="Password" required>
              </div>
              <div class="text-center" style="margin-top:50px">
                <button type="submit" @click="signIn">Access</button>
              </div>
              <div class="text-center" style="margin:30px 0 200px 0">
                <p>If you don't have an account <a href="/create">click here</a>!</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    <!-- End Access Section -->
</template>
<script>
import { Dapp } from '@/dapp';
import Vue from 'vue';
import auth from '@/src/auth';
import swal from 'sweetalert';
import Swal from 'sweetalert2';



export default {
  beforeMount(){
    this.start();
  },
  data: () => ({
    password: ""
  }),
  methods: {
    // Load the contracts
    async start(){
      await Dapp.init();
    },
    async signIn() {
        loginForm.addEventListener("submit", e => {
            e.preventDefault();
        });

        const account = document.getElementById("account").innerText;

        // Check if MetaMask is connected with account
        if(!account) {
          Swal.fire({
            title: "Error!",
            text: "Please connect your MetaMask wallet",
            icon: "error"
          });
        } else { 
          // Check if the account already exists
          const exists = await Dapp.checkExists(account);
          
          if (!exists)
          {
            Swal.fire({
              title: "Error!",
              text: "This account doesn't exists",
              icon: "error",
              footer: '<a href="create">Create an account</a>'
            });
          } else {
            // Try to connect
            const correctPass = await Dapp.tryToConnect(account, this.password);

            if(!correctPass)
            {
              swal({
                  title: "Error!",
                  text: "Incorrect password!",
                  icon: "error"
              });
            } else {
              // Connection
              await Dapp.signIn(account, this.password);
              let user = await Dapp.getName(account);
              auth.setUserLogged(user);

              Swal.fire({
                title: "Login successfully",
                icon: "success"
              }).then(function() {
                // SOLVE REDIRECT WITH ROUTES
                window.location.href = "/";
              });
            }
          }
        }
    }
  }
}
</script>