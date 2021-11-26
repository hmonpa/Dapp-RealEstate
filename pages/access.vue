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
import auth from '@/src/auth';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

export default {
  data: () => ({
    password: ""
  }),
  methods: {
    async start(){
      await Dapp.init();
      // let account = await Dapp.checkAccount();
    },
    async signIn() {
        // const loginForm = document.querySelector("#loginForm");
        loginForm.addEventListener("submit", e => {
            e.preventDefault();
        });

        // Check if MetaMask is connected with account
        const account = document.getElementById("account").innerText;
        if(!account) {
          swal({
            title: "Error!",
            text: "Please connect your MetaMask wallet",
            icon: "error",
            dangerMode: true
          });
        } else { 
          // Check if the account already exists
          const exists = await Dapp.checkExists(account);
          
          // ADAPT TO TRY CATCH
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
              // Connect 
              await Dapp.signIn(account, this.password);
              let user = await Dapp.getName(account);
              auth.setUserLogged(user);

              swal({
                title: "Login successfully",
                icon: "success"
              }).then(function() {
                // SOLVE REDIRECT
                this.$router.push("/");
              });
            }
          }
        }
    }
  },
  beforeMount(){
    this.start();
  } 
}
</script>