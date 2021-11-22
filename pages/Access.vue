<template>
    <!-- ======= Access Section ======= -->
    <section id="access" class="access">
      <div class="container">

        <div class="section-title" data-aos="fade-up" style="margin:100px 0 50px 0">
          <h2>Sign in</h2>
          <p id="account"></p>
        </div>

        <div class="row">
            <div class="col-lg-3 col-md-12"></div>
          <div class="col-lg-6 col-md-12" data-aos="fade-up" data-aos-delay="300">
            <form id="loginForm" class="php-email-form">
              <div class="form-group">
                <input type="text" name="address" class="form-control" id="address" placeholder="Address" required>
              </div>
              <div class="form-group">
                <input type="password" class="form-control" name="password" id="password" placeholder="Password" required>
              </div>
              <div class="text-center" style="margin-top:50px">
                <button type="submit" @click="signIn">Access</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    <!-- End Access Section -->
</template>
<script>
import { Dapp } from '../dapp';

export default {
    data(){
        return {
            account: null
        }
    },
    methods: {
        async start(){
            await Dapp.init();
            let account = await Dapp.checkAccount();
        },
        async signIn() {
            const loginForm = document.querySelector("#loginForm");
            loginForm.addEventListener("submit", e => {
                e.preventDefault();
            });
            
            const res = await Dapp.signIn(loginForm["address"].value, loginForm["password"].value);
            
            if(res) window.location.href("/");
            else    console.log("Password incorrecta");
        }
    },
    beforeMount(){
        this.start();
    } 
}
</script>