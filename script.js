// Image file sequence
const pages = ["1.png", "2.png", "3.png", "4.png"];

// State Tracking Variables
let currentPageIndex = 0;
let isAnimating = false;

// Mobile Touch Gesture Tracking Variables
let touchStartX = 0;
let touchEndX = 0;

// DOM References
const bookCard = document.getElementById("bookCard");
const frontImg = document.getElementById("frontImg");
const backImg = document.getElementById("backImg");
const dots = document.querySelectorAll(".dot");
const pageCounter = document.getElementById("pageCounter");
const downloadBtn = document.getElementById("downloadBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Page Flip Transition Handler
function flipToPage(targetIndex) {
    if (targetIndex === currentPageIndex || isAnimating) return;
    isAnimating = true;

    // Load target image on back face
    backImg.src = pages[targetIndex];

    // Trigger 3D CSS Rotation
    bookCard.classList.add("is-flipped");

    setTimeout(() => {
        // Swap front face image
        frontImg.src = pages[targetIndex];
        
        // Reset transform instantly without visual flickering
        bookCard.style.transition = "none";
        bookCard.classList.remove("is-flipped");

        // Force browser repaint
        void bookCard.offsetWidth;

        // Restore animation transition property
        bookCard.style.transition = "transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)";

        // Update active page index & UI
        currentPageIndex = targetIndex;
        updateUI();
        isAnimating = false;
    }, 800);
}

// Navigation Helpers
function nextPage() {
    const nextIndex = (currentPageIndex + 1) % pages.length;
    flipToPage(nextIndex);
}

function prevPage() {
    const prevIndex = (currentPageIndex - 1 + pages.length) % pages.length;
    flipToPage(prevIndex);
}

// Updates pagination indicators & page counter label
function updateUI() {
    dots.forEach((dot, idx) => {
        if (idx === currentPageIndex) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });

    pageCounter.textContent = `Page ${currentPageIndex + 1} of ${pages.length}`;
}

// Click Event Listeners
bookCard.addEventListener("click", nextPage);

if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        nextPage();
    });
}

if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        prevPage();
    });
}

dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = parseInt(dot.getAttribute("data-index"), 10);
        flipToPage(index);
    });
});

// Mobile Touch Swipe Gesture Handler
bookCard.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

bookCard.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 40;
    if (touchEndX < touchStartX - swipeThreshold) {
        nextPage(); // Swipe Left
    } else if (touchEndX > touchStartX + swipeThreshold) {
        prevPage(); // Swipe Right
    }
}

// Mobile & Desktop Compatible Download Handler
downloadBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const currentImgUrl = pages[currentPageIndex];
    const fileName = `DORSU_Program_Page_${currentPageIndex + 1}.png`;

    try {
        // Fetch image as Blob to bypass mobile browser download restrictions
        const response = await fetch(currentImgUrl);
        const blob = await response.blob();
        
        // Create temporary blob object URL
        const blobUrl = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = blobUrl;
        downloadLink.download = fileName;
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Clean up memory
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
        // Fallback for local files (file://) or iOS Safari direct links
        const fallbackLink = document.createElement("a");
        fallbackLink.href = currentImgUrl;
        fallbackLink.target = "_blank";
        fallbackLink.download = fileName;
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
    }
});
