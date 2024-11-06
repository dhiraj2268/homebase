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
document.addEventListener("DOMContentLoaded", function () {
  const likeButton = document.querySelector(".like-btn");
  const likeCount = document.querySelector(".like-count");

  likeButton.addEventListener("click", async function () {
    const propertyId = this.dataset.propertyId; // Ensure this data attribute is set on the button
    const isLiked = this.classList.contains("liked"); // Check current like status

    try {
      const response = await fetch(`/properties/${propertyId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: !isLiked })
      });

      const data = await response.json();
      if (data.success) {
        likeCount.textContent = data.totalLikes;
        likeButton.classList.toggle("liked", data.liked);  // Toggle liked class
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});