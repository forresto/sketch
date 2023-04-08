function popupateFormInputsFromLocation() {
  var searchParams = new URLSearchParams(window.location.search);
  document.querySelectorAll("input").forEach(function (input) {
    var name = input.getAttribute("name");
    var value = searchParams.get(name);
    if (value) {
      input.value = value;
    }
  });
}
document.addEventListener("DOMContentLoaded", popupateFormInputsFromLocation);
