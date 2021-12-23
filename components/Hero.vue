<template>
    <!-- ======= Hero Section ======= -->
    <section id="hero" class="d-flex align-items-center">
      <div class="container">
          <div class="row">
          <div class="col-lg-6 pt-5 pt-lg-0 order-2 order-lg-1 d-flex flex-column justify-content-center">
              <h1 data-aos="fade-up">DAPP <br /> Real Estate</h1>
              <h2 data-aos="fade-up" data-aos-delay="400">Welcome to decentralized finance</h2>
          </div>
          <div class="col-lg-6 order-1 order-lg-2 hero-img" data-aos="fade-left" data-aos-delay="200">
              <img src="/img/hero-img.png" class="img-fluid animated" alt="">
          </div>
          </div>
      </div>
    </section>
    <!-- End Hero -->
</template>

<style scoped>
#hero {
  width: 100%;
  height: 70vh;
  margin-top: 70px;
}

#hero h1 {
  margin: 0 0 10px 0;
  font-size: 48px;
  font-weight: 700;
  line-height: 56px;
  color: black;
}

#hero h2 {
  color: #484848;
  margin-bottom: 50px;
  font-size: 24px;
}

#hero .btn-get-started {
  font-family: "Raleway", sans-serif;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 1px;
  display: inline-block;
  padding: 10px 30px;
  border-radius: 50px;
  transition: 0.5s;
  color: #3498db;
  border: 2px solid #3498db;
}

#hero .btn-get-started:hover {
  background: #3498db;
  color: #fff;
}

#hero .animated {
  animation: up-down 2s ease-in-out infinite alternate-reverse both;
}

@media (min-width: 1024px) {
  #hero {
    background-attachment: fixed;
  }
}

@media (max-width: 991px) {
  #hero {
    height: 100vh;
  }

  #hero .animated {
    -webkit-animation: none;
    animation: none;
  }

  #hero .hero-img {
    text-align: center;
  }

  #hero .hero-img img {
    width: 50%;
  }
}

@media (max-width: 768px) {
  #hero {
    margin-top: 20px;
  }
  #hero h1 {
    font-size: 28px;
    line-height: 36px;
  }
  #hero h2 {
    font-size: 18px;
    line-height: 24px;
    margin-bottom: 30px;
  }
  #hero .hero-img img {
    width: 70%;
  }
}

@media (max-width: 575px) {
  #hero .hero-img img {
    width: 80%;
  }
}

@-webkit-keyframes up-down {
  0% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(-10px);
  }
}

@keyframes up-down {
  0% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(-10px);
  }
}
</style>