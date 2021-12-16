<template>
  <!-- ======= Logos Section ======= -->
  <section id="logos" class="logos logos">
    <div class="px-5 container">
      <div class="row align-items-center">
        <div class="col-md-4 col-6"></div>
        <div class="col-md-2 col-6" style="margin-left:100px">
          <img 
            src="https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg" 
            class="img-fluid" 
            alt="" 
          />
          
          <p v-if="loaded" class="btn-get-started scrollto">
            <span>Current Ether price {{ this.Ether }}€</span>
          </p>
        </div>
      </div>
    </div>
  </section>
  <!-- End Logos Section -->
</template>

<script>
  import { Dapp } from '@/dapp';

  export default {
    data() {
      return {
        Ether: '',
        loaded: false
      }
    },
    async beforeMount() {
      var accountInterval = setInterval(async() => {
        this.Ether = await Dapp.getEtherPrice();
        this.loaded = true;
      }, 1000);
    }
  }
</script>