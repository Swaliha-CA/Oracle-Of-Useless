// --- Element References ---
const container = document.querySelector('.container');
const passwordInput = document.getElementById('passwordInput');
const feedbackDiv = document.getElementById('feedback');
const generateButton = document.getElementById('generateButton');
let judgmentTimeout;

// --- Pointless Judgments ---
const pointlessJudgments = [
    "Weak: Contains letters. A bit too obvious.",
    "Weak: Lacks a certain je ne sais quoi.",
    "Weak: This password has bad energy.",
    "Weak: My cat could type a better password.",
    "Weak: Not a palindrome. Lacks reflective quality.",
    "Weak: Passwords are not accepted after 6 PM in Kerala.",
    "Weak: Too symmetrical.",
    "Weak: Not enough chaos.",
    "Weak: I've seen this one before. Be original.",
    "Weak: This password is not gluten-free.",
    "Weak: Does not spark joy.",
    "Weak: It's Friday. This password has a very 'Monday' vibe."
];
const uselessWords = ['banana', 'wobble', 'fluff', 'potato', 'giggle', 'moist', 'yeet', 'shenanigans', '🦄', ' '];

// --- Functions ---

/**
 * A function to display text with a typewriter effect.
 * @param {HTMLElement} element - The HTML element to display the text in.
 * @param {string} text - The text to be typed out.
 */
function typeWriter(element, text) {
    element.innerHTML = ""; // Clear previous text
    let i = 0;
    const speed = 50; // Speed of typing in milliseconds

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

/**
 * A function to add a temporary screen shake effect.
 */
function triggerScreenShake() {
    document.body.style.animation = 'violent-shake 0.3s linear';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 300);
}


// --- Event Listeners ---

// Listen for input to provide judgment
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    
    clearTimeout(judgmentTimeout);
    
    if (password.length === 0) {
        feedbackDiv.innerHTML = '<p>Awaiting judgement...</p>';
        feedbackDiv.className = 'feedback';
        return;
    }

    feedbackDiv.innerHTML = '<p>Consulting the digital ether...</p>';
    feedbackDiv.className = 'feedback feedback-neutral';

    // Add a delay to make it more annoying
    judgmentTimeout = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * pointlessJudgments.length);
        const judgment = pointlessJudgments[randomIndex];
        
        feedbackDiv.className = 'feedback feedback-weak';
        typeWriter(feedbackDiv, judgment); // Use the new typewriter effect
        triggerScreenShake(); // Add a shake for emphasis

    }, 1200); // 1.2 second delay
});

// Listen for clicks on the chaotic generate button
generateButton.addEventListener('click', () => {
    const action = Math.floor(Math.random() * 5); // Now 5 possible actions

    switch (action) {
        case 0:
            const randomIndex = Math.floor(Math.random() * uselessWords.length);
            passwordInput.value = uselessWords[randomIndex];
            break;
        case 1:
            passwordInput.value = '';
            break;
        case 2:
            const currentText = passwordInput.value;
            passwordInput.value = currentText.length > 0 ? currentText[0] : '?';
            break;
        case 3:
            generateButton.disabled = true;
            generateButton.innerText = "Nope.";
            setTimeout(() => {
                generateButton.disabled = false;
                generateButton.innerText = "Generate \"Secure\" Password";
            }, 3000);
            break;
        case 4:
            // New Action: Invert the page colors for a moment
            document.body.style.filter = 'invert(1)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 500);
            break;
    }
    
    passwordInput.dispatchEvent(new Event('input'));
});

// --- Interactive 3D Tilt Effect ---
document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Calculate rotation values based on mouse position
    const halfW = innerWidth / 2;
    const halfH = innerHeight / 2;
    
    const rotX = ((clientY - halfH) / halfH) * -8; // Reduced rotation for subtlety
    const rotY = ((clientX - halfW) / halfW) * 8;

    // Apply the 3D transform to the container
    container.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
});

// Reset the tilt when the mouse leaves the window
document.addEventListener('mouseleave', () => {
    container.style.transform = `rotateX(0deg) rotateY(0deg)`;
});
