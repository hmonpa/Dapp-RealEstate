<template>
  <main id="main">
    <Hero />
    <!--<MainClients />
    <MainAbout />
    <MainCounts />
    <MainFeatures /> 
    <MainPortfolio /> 
    <MainTeam />
    <MainPricing />
    <MainFaq />
    <MainProperties />-->
  </main>
</template>

<script>
  // ----- VUE LIFE-CYCLE -----
  // BeforeCreate:  Vue has not loaded the component, we cannot yet access the component's options, methods or data.
  // Created:       In this point Vue has loaded the component and the sections data and methods already exists.
  // BeforeMount
  // Mounted:       We have access to the DOM and the computed is executed inmediatly after it
  // BeforeUpdate
  // Updated:       Is executed when produced changes in the component, uses "computed" and "watchers" properties.
  // Destroyed:     Is executed when one component is removed. Example: Uses of v-if or v-show.
</script>