const propertyForm = document.querySelector("#propertyForm");
document.addEventListener("DOMContentLoaded", async() => {
    await Dapp.init();
})
propertyForm.addEventListener("submit", e => {
    e.preventDefault();

    console.log(propertyForm["city"].value, propertyForm["price"].value)

    Dapp.uploadProperty(propertyForm["city"].value, propertyForm["price"].value);
});