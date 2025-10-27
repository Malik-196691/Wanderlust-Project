(function () {
  'use strict'
  var forms = document.querySelectorAll('.needs-validation')
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
})()

 let taxToggle = document.getElementById("flexSwitchCheckDefault");
  taxToggle.addEventListener("change", () => {
    if (taxToggle.checked) {
      document.querySelectorAll(".listing .card-text").forEach((priceTag) => {
        let price = parseFloat(priceTag.innerText.split(" ")[0].substring(1));
        let taxedPrice = (price * 1.1).toFixed(2);
        priceTag.innerText = `$${taxedPrice} / night (tax included)`;
      });
    } else {
      document.querySelectorAll(".listing .card-text").forEach((priceTag) => {
        let priceWithTax = priceTag.innerText.split(" ")[0].substring(1);
        let originalPrice = (parseFloat(priceWithTax) / 1.1).toFixed(2);
        priceTag.innerText = `$${originalPrice} / night`;
      });
    }
  });