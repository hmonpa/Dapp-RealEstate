<template>
    <!-- ======= Access Section ======= -->
    <section v-if="!userLogged" id="access" class="access">
      <div class="container" style="margin-bottom: 135px">

        <div class="section-title" data-aos="fade-up" style="margin:100px 0 50px 0">
          <h2>Sign in</h2>
        </div>

        <div class="row">
            <div class="col-lg-3 col-md-12"></div>
          <div class="col-lg-6 col-md-12" data-aos="fade-up" data-aos-delay="300">
            <form id="loginForm" class="php-email-form">
              <div class="form-group">
                <input type="password" v-model="password" class="form-control" name="password" id="password" placeholder="Enter your password..." required>
              </div>
              <div class="text-center" style="margin-top:50px">
                <button type="submit" @click="signIn">Access</button>
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
import { Web3Controller } from '@/src/controllers/web3';
import { AuthController } from '@/src/controllers/auth';
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
    password: ""
  }),
  methods: {
    // Load the contracts
    async start(){
      await Web3Controller.init();
    },
    async signIn() {
        loginForm.addEventListener("submit", e => {
            e.preventDefault();
        });

        const account = await Web3Controller.loadEthereum();

        // Check if MetaMask is connected with account
        if(!account) {
          Swal.fire({
            title: "Error!",
            text: "Please connect your MetaMask wallet",
            icon: "error"
          });
        } else { 
          // Check if the account already exists
          const exists = await AuthController.checkExists(account);
          
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
            const correctPass = await AuthController.tryToConnect(account, this.password);

            if(!correctPass)
            {
              swal({
                  title: "Error!",
                  text: "Incorrect password!",
                  icon: "error"
              });
            } else {
              // Connection
              await AuthController.signIn(account, this.password);
              let user = await AuthController.getUserData(account);
              auth.setUserLogged(Object.values(user));

              window.location.href = "/";
            }
          }
        }
    }
  }
}
</script>