// Image file sequence
const pages = ["1.png", "2.png", "3.png", "4.png"];

// State Tracking
let currentPageIndex = 0;
let isAnimating = false;

// Mobile Touch Gesture Tracking
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
        
        // Reset transform instantly
        bookCard.style.transition = "none";
        bookCard.classList.remove("is-flipped");

        // Force browser repaint
        void bookCard.offsetWidth;

        // Restore animation transition
        bookCard.style.transition = "transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)";

        // Update state
        currentPageIndex = targetIndex;
        updateUI();
        isAnimating = false;
    }, 800);
}

// Navigation helpers
function nextPage() {
    const nextIndex = (currentPageIndex + 1) % pages.length;
    flipToPage(nextIndex);
}

function prevPage() {
    const prevIndex = (currentPageIndex - 1 + pages.length) % pages.length;
    flipToPage(prevIndex);
}

// Updates pagination indicators & counter
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

// Event Listeners
bookCard.addEventListener("click", nextPage);
nextBtn.addEventListener("click", (e) => { e.stopPropagation(); nextPage(); });
prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prevPage(); });

dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = parseInt(dot.getAttribute("data-index"), 10);
        flipToPage(index);
    });
});

// Mobile Swipe Touch Handler
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
        nextPage(); // Swipe left
    } else if (touchEndX > touchStartX + swipeThreshold) {
        prevPage(); // Swipe right
    }
}

// Download Button Action
downloadBtn.addEventListener("click", () => {
    const currentImgUrl = pages[currentPageIndex];
    const downloadLink = document.createElement("a");
    downloadLink.href = currentImgUrl;
    downloadLink.download = `DORSU_Souvenir_Program_Page_${currentPageIndex + 1}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});