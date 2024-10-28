function showPropertyDetails(property) {
  // Get the modal element
  const modalElement = document.getElementById("propertyModal");

  // Set the image source and other details dynamically
  document.getElementById("modal-property-image").src = property.image;
  document.querySelector(".modal-title").textContent = property.title;
  document.querySelector(".modal-body p:nth-of-type(1)").textContent = `Location: ${property.location}`;
  document.querySelector(".modal-body p:nth-of-type(2)").textContent = `Price: ${property.price}/Month`;
  document.querySelector(".modal-body p:nth-of-type(3)").textContent = `Description: ${property.description}`;
  document.querySelector(".modal-body p:nth-of-type(4)").textContent = `Bedrooms: ${property.bedrooms}`;
  document.querySelector(".modal-body p:nth-of-type(5)").textContent = `Bathrooms: ${property.bathrooms}`;
  document.querySelector(".modal-body p:nth-of-type(6)").textContent = `Square Ft: ${property.squarefeet}`;

  // Show the modal using Bootstrap's modal function
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}


// for heart
document.getElementById("likeButton").addEventListener("click", function () {
  const heartIcon = document.getElementById("heartIcon");
  heartIcon.classList.toggle("heart-liked");
  const isLiked = heartIcon.classList.contains("heart-liked");
});

