<template>
  <section id="error" class="error" style="margin-bottom: 240px">
    <h1 id="error-title">403</h1>
    <h2 id="error-descr">Not this time, access forbidden!</h2>
    <NuxtLink to="/">Go back</NuxtLink>
  </section>
</template>

<script>
export default {
  props: ['error'],
  layout: 'blog' // you can set a custom layout for the error page
}
</script>

<style>
#error {
  margin-top: 100px;
  text-align: center;
}

#error-title {
  margin-bottom: 20px;
  color: #3498db;
  font-size: 90px;
  font-weight: 800;
}

#error-descr {
  color: #455d7a;
  font-size: 30px;
  text-transform: uppercase;
}

.error .nuxt-link-active {
  margin-top: 40px;
  font-size: 30px;
  text-decoration: none;
}

</style>