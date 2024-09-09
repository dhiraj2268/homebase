// seller-dashboard.js

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("main > section");
    const navLinks = document.querySelectorAll("nav .nav-link");
    const reviewContainer = document.getElementById("review-container");
    const editForm = document.getElementById("edit-form");
    const reviews = [
      {
        title: "Great Location!",
        content:
          "The apartment is located in a great neighborhood with easy access to public transport.",
      },
      {
        title: "Spacious and Modern",
        content:
          "The villa is spacious and modern, with all the amenities you need.",
      },
      {
        title: "Value for Money",
        content:
          "Excellent value for money. The property is well-maintained and in a good location.",
      },
    ];
    let currentReviewIndex = 0;
  
    // Show a specific section
    const showSection = (id) => {
      sections.forEach((section) => {
        section.style.display = section.id === id ? "block" : "none";
      });
    };
  
    // Update active link
    const updateActiveLink = (targetId) => {
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href").substring(1) === targetId
        );
      });
    };
  
    // Event listener for sidebar navigation
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute("href").substring(1);
        showSection(targetId);
        updateActiveLink(targetId);
      });
    });
  
    // Load the current review
    const loadReview = () => {
      if (reviews.length > 0) {
        const review = reviews[currentReviewIndex];
        reviewContainer.innerHTML = `
                <div class="review-card">
                    <h3>${review.title}</h3>
                    <p>${review.content}</p>
                </div>
            `;
      }
    };
  
    // Event listener for the previous review button
    document.getElementById("prev-review").addEventListener("click", () => {
      if (currentReviewIndex > 0) {
        currentReviewIndex--;
        loadReview();
      }
    });
  
    // Event listener for the next review button
    document.getElementById("next-review").addEventListener("click", () => {
      if (currentReviewIndex < reviews.length - 1) {
        currentReviewIndex++;
        loadReview();
      }
    });
  
    // Initialize with the dashboard section and load the first review
    showSection("dashboard");
    updateActiveLink("dashboard");
    loadReview();
  });
  