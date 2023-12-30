// Function to toggle between login and recover forms
function toggleForms(...formIds) {
  const forms = formIds.map((id) => document.getElementById(id));
  forms.forEach((form) => {
    form.style.display = form.style.display === "none" ? "block" : "none";
  });
}
if (window.location.hash === "#passkey") {
  toggleForms("passwordFormHere", "subsribeFormHere");
}
if (window.location.hash === "#recover") {
  toggleForms("recoverAccount", "recoverForm");
}
// product filter
Shopify.queryParams = {};
const searchParams = new URLSearchParams(location.search);
searchParams.forEach((value, key) => {
  Shopify.queryParams[decodeURIComponent(key)] = decodeURIComponent(value);
});
document.querySelector("#sort-by").addEventListener("change", function (e) {
  const value = e.target.value;
  Shopify.queryParams.sort_by = value;
  location.search = new URLSearchParams(Shopify.queryParams).toString();
});
