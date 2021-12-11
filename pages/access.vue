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
    <section v-else>
      <MainError />
    </section>
    <!-- End Access Section -->
</template>
<script>
import Vue from 'vue';
import { Dapp } from '@/dapp';
import auth from '@/src/auth';
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
              let user = await Dapp.getUserData(account);
              auth.setUserLogged(Object.values(user));

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

<style scoped>
.access .php-email-form .error-message {
  display: none;
  color: #fff;
  background: #ed3c0d;
  text-align: left;
  padding: 15px;
  font-weight: 600;
}

.access .php-email-form {
  text-align: center;
}

.access .php-email-form p {
  display: inline;
  font-size: 20px;
}

.access #account {
  font-weight: bold;
}

.access .php-email-form .error-message br + br {
  margin-top: 25px;
}

.access .php-email-form .sent-message {
  display: none;
  color: #fff;
  background: #18d26e;
  text-align: center;
  padding: 15px;
  font-weight: 600;
}

.access .php-email-form .loading {
  display: none;
  background: #fff;
  text-align: center;
  padding: 15px;
}

.access .php-email-form .loading:before {
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

.access .php-email-form .form-group {
  margin: 20px 0 20px 0;
}

.access .php-email-form input, .access .php-email-form textarea {
  border-radius: 0;
  box-shadow: none;
  font-size: 14px;
  padding: 10px 15px;
}

.access .php-email-form input:focus, .access .php-email-form textarea:focus {
  border-color: #3498db;
}

.access .php-email-form button[type=submit] {
  background: #3498db;
  border: 0;
  padding: 10px 24px;
  color: #fff;
  transition: 0.4s;
  border-radius: 50px;
}

.access .php-email-form button[type=submit]:hover {
  background: #2383c4;
}
</style>
