// Add event listener for the "Send" button
document.getElementById('send-btn').addEventListener('click', handleUserInput);

// Add support for the Enter key
document.getElementById('user-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleUserInput();
});

// Function to handle user input
async function handleUserInput() {
  const userInput = document.getElementById('user-input').value.trim();
  if (!userInput) return; // Do nothing if input is empty

  const chatBox = document.getElementById('chat-box');

  // Display user's message
  const userMessage = document.createElement('div');
  userMessage.className = 'message user';
  userMessage.textContent = userInput;
  chatBox.appendChild(userMessage);

  document.getElementById('user-input').value = ''; // Clear input field
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom

  // Display loading indicator
  const loadingMessage = document.createElement('div');
  loadingMessage.className = 'message assistant';
  loadingMessage.textContent = 'Typing...';
  chatBox.appendChild(loadingMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    // Send user input to the server
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: userInput }),
    });
    const data = await response.json();

    // Remove loading indicator
    chatBox.removeChild(loadingMessage);

    // Display assistant's response
    const assistantMessage = document.createElement('div');
    assistantMessage.className = 'message assistant';
    assistantMessage.textContent = data.response;
    chatBox.appendChild(assistantMessage);

    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
  } catch (error) {
    console.error('Error:', error);

    // Remove loading indicator
    chatBox.removeChild(loadingMessage);

    // Display fallback error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'message assistant';
    errorMessage.textContent = 'The counselor is currently unavailable. Please try again later.';
    chatBox.appendChild(errorMessage);

    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
  }
}

// Initialize Plyr
const player = new Plyr('#video-background', {
  controls: [], // No controls for the video
  autoplay: true,
  loop: true,
  muted: true,
});

// Header hide/show functionality
let lastScrollY = window.scrollY; // Track the last known scroll position
const header = document.getElementById('header'); // Get the header element

// Add scroll event listener
window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY) {
    // User is scrolling down
    header.classList.add('hidden');
  } else {
    // User is scrolling up
    header.classList.remove('hidden');
  }
  lastScrollY = window.scrollY; // Update last scroll position
});
