/*
==============================================
AI Homework Helper - Main JavaScript
==============================================
Handles:
- Loading personas from API
- Rendering persona image buttons
- Switching active persona and updating theme
- Submitting questions and displaying answers
*/

// ============================================
// STATE MANAGEMENT
// ============================================

let personas = []; // All available personas
let activePersona = null; // Currently selected persona

// ============================================
// DOM ELEMENTS
// ============================================

const personaGrid = document.getElementById("persona-grid");
const questionInput = document.getElementById("question-input");
const charCount = document.getElementById("char-count");
const askButton = document.getElementById("ask-button");
const buttonText = document.getElementById("button-text");
const answerSection = document.getElementById("answer-section");
const answerText = document.getElementById("answer-text");
const loadingIndicator = document.getElementById("loading-indicator");
const answerPersonaImage = document.getElementById("answer-persona-image");
const answerPersonaLabel = document.getElementById("answer-persona-label");

// ============================================
// INITIALIZATION
// ============================================

// Load personas when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadPersonas();
  setupEventListeners();
});

// ============================================
// LOAD PERSONAS FROM API
// ============================================

async function loadPersonas() {
  try {
    const response = await fetch("/api/personas");

    if (!response.ok) {
      throw new Error("Failed to load personas");
    }

    personas = await response.json();
    renderPersonaButtons();

    // Auto-select first persona
    if (personas.length > 0) {
      selectPersona(personas[0].id);
    }
  } catch (error) {
    console.error("Error loading personas:", error);
    personaGrid.innerHTML =
      '<p class="loading-personas">Failed to load helpers. Please refresh the page.</p>';
  }
}

// ============================================
// RENDER PERSONA IMAGE BUTTONS
// ============================================

function renderPersonaButtons() {
  // Clear loading message
  personaGrid.innerHTML = "";

  // Create button for each persona
  personas.forEach((persona) => {
    const button = document.createElement("button");
    button.className = "persona-button";
    button.dataset.personaId = persona.id;

    // Persona Image
    const img = document.createElement("img");
    img.src = persona.image;
    img.alt = persona.label;
    img.className = "persona-image";

    // Persona Label
    const label = document.createElement("span");
    label.className = "persona-label";
    label.textContent = persona.label;

    // Add to button
    button.appendChild(img);
    button.appendChild(label);

    // Click handler
    button.addEventListener("click", () => {
      selectPersona(persona.id);
    });

    // Add to grid
    personaGrid.appendChild(button);
  });
}

// ============================================
// SELECT PERSONA (SWITCH ACTIVE)
// ============================================

function selectPersona(personaId) {
  // Find persona object
  const persona = personas.find((p) => p.id === personaId);
  if (!persona) return;

  // Update active persona
  activePersona = persona;

  // Update UI: Highlight active button
  document.querySelectorAll(".persona-button").forEach((btn) => {
    if (btn.dataset.personaId === personaId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Apply theme (update CSS variables)
  applyTheme(persona.theme);

  // Update button text
  buttonText.textContent = `Ask ${persona.label}`;

  // Enable ask button if question exists
  updateAskButton();
}

// ============================================
// APPLY THEME (UPDATE CSS VARIABLES)
// ============================================

function applyTheme(theme) {
  const root = document.documentElement;

  // Update all CSS variables
  root.style.setProperty("--bg", theme.bg);
  root.style.setProperty("--card", theme.card);
  root.style.setProperty("--text", theme.text);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--muted", theme.muted);
  root.style.setProperty("--radius", theme.radius);
  root.style.setProperty("--font", theme.font);

  // Theme changes are animated via CSS transitions!
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Character counter
  questionInput.addEventListener("input", () => {
    const length = questionInput.value.length;
    charCount.textContent = length;
    updateAskButton();
  });

  // Ask button click
  askButton.addEventListener("click", handleAskQuestion);

  // Enter key to submit (Shift+Enter for new line)
  questionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!askButton.disabled) {
        handleAskQuestion();
      }
    }
  });
}

// ============================================
// UPDATE ASK BUTTON STATE
// ============================================

function updateAskButton() {
  const hasQuestion = questionInput.value.trim().length > 0;
  const hasPersona = activePersona !== null;

  askButton.disabled = !(hasQuestion && hasPersona);
}

// ============================================
// HANDLE ASK QUESTION
// ============================================

async function handleAskQuestion() {
  const question = questionInput.value.trim();

  if (!question || !activePersona) return;

  // Show answer section
  answerSection.style.display = "block";

  // Show loading indicator
  loadingIndicator.style.display = "block";
  answerText.style.display = "none";

  // Update persona info in answer card
  answerPersonaImage.src = activePersona.image;
  answerPersonaLabel.textContent = activePersona.label;

  // Disable button during request
  askButton.disabled = true;
  buttonText.textContent = "Thinking...";

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        persona_id: activePersona.id,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get answer");
    }

    const data = await response.json();

    // Display answer
    displayAnswer(data.answer);
  } catch (error) {
    console.error("Error asking question:", error);
    displayAnswer("Oops! Something went wrong. Please try again. 😅");
  } finally {
    // Re-enable button
    askButton.disabled = false;
    buttonText.textContent = `Ask ${activePersona.label}`;
  }
}

// ============================================
// DISPLAY ANSWER
// ============================================

function displayAnswer(answer) {
  // Hide loading, show answer
  loadingIndicator.style.display = "none";
  answerText.style.display = "block";

  // Set answer text
  answerText.textContent = answer;

  // Scroll to answer
  answerSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Clear question input
function clearQuestion() {
  questionInput.value = "";
  charCount.textContent = "0";
  updateAskButton();
}

// Reset answer section
function resetAnswer() {
  answerSection.style.display = "none";
  answerText.textContent = "";
}
