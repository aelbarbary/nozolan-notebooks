"""
AI Homework Helper for Kids - Flask Backend
============================================
A safe, simple homework helper with fun AI personas.
Kids can ask questions and get answers in different styles.

SAFETY FEATURES:
- No database (stateless)
- No user accounts
- Mock mode if no API key
- Age-appropriate content filtering
"""

import json
from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import config
import os

# ============================================
# CONFIGURATION
# ============================================

app = Flask(__name__)

# Toggle between mock AI (safe testing) and real OpenAI API
USE_MOCK_AI = config.OPENAI_API_KEY is None

# Load OpenAI client if API key exists
openai_client = None
if not USE_MOCK_AI:
    openai_client = OpenAI(api_key=config.OPENAI_API_KEY)

# Load personas from JSON file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PERSONAS_FILE = os.path.join(BASE_DIR, 'personas.json')

def load_personas():
    """Load persona data from JSON file"""
    try:
        with open(PERSONAS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"ERROR: {PERSONAS_FILE} not found!")
        return []

PERSONAS = load_personas()

# ============================================
# AI RESPONSE LOGIC
# ============================================

def get_ai_answer(question, persona):
    """
    Get AI answer for homework question in persona's style.
    
    Args:
        question (str): Student's homework question
        persona (dict): Persona object with system_prompt
    
    Returns:
        str: AI-generated answer in persona's style
    """
    
    # MOCK MODE: Return safe test responses
    if USE_MOCK_AI:
        mock_responses = {
            'calm-teacher': f"🧠 Let me help you understand this calmly. Your question about '{question[:50]}...' is interesting. Think about breaking it into smaller steps. What do you already know about this topic?",
            'hype-coach': f"⚡ YESSS! Great question! '{question[:50]}...' - Let's CRUSH this together! You're gonna NAIL this homework! Here's the energy: Start with the basics and BUILD UP! You got this, champ!",
            'funny-helper': f"😂 Haha, okay okay! So you're asking about '{question[:50]}...'? That's actually pretty cool! Here's the deal (and I promise not to make too many dad jokes): Let me break this down in a fun way...",
            'science-nerd': f"🧪 Fascinating question! '{question[:50]}...' touches on some really cool scientific concepts. Let me explain the methodology here. First, we need to understand the fundamental principles...",
            'gamer-explainer': f"🎮 Alright player, you just unlocked a new quest! '{question[:50]}...' is like a level you need to beat. Here's the strategy guide: Think of it like game mechanics - you need to understand the rules first..."
        }
        return mock_responses.get(persona['id'], f"Here's help with: {question}")
    
    # REAL AI MODE: Use OpenAI API
    try:
        # Safety rules embedded in system prompt
        safety_rules = """
        
SAFETY RULES (CRITICAL):
- Guide students, don't solve exams or tests for them
- Encourage learning and understanding
- No violence, sexual content, drugs, self-harm, or illegal advice
- Be respectful and age-appropriate (ages 11-13)
- If question seems inappropriate, politely redirect to homework help
"""
        
        full_system_prompt = persona['system_prompt'] + safety_rules
        
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": full_system_prompt},
                {"role": "user", "content": question}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return "Oops! I had trouble thinking of an answer. Can you try asking again?"

# ============================================
# ROUTES
# ============================================

@app.route('/')
def index():
    """Render main page"""
    return render_template('index.html')

@app.route('/api/personas')
def get_personas():
    """
    Return persona metadata (safe for client).
    Excludes system_prompt to keep it server-side only.
    """
    # Strip out system_prompt for security
    safe_personas = []
    for p in PERSONAS:
        safe_personas.append({
            'id': p['id'],
            'label': p['label'],
            'image': p['image'],
            'theme': p['theme']
        })
    
    return jsonify(safe_personas)

@app.route('/api/ask', methods=['POST'])
def ask_question():
    """
    Handle homework question submission.
    
    Expected JSON:
        {
            "question": "What is photosynthesis?",
            "persona_id": "science-nerd"
        }
    
    Returns:
        {
            "answer": "AI-generated answer...",
            "persona": "science-nerd"
        }
    """
    try:
        data = request.get_json()
        
        # Validate input
        question = data.get('question', '').strip()
        persona_id = data.get('persona_id', '')
        
        # Check question length
        if not question:
            return jsonify({'error': 'Please ask a question!'}), 400
        
        if len(question) > 500:
            return jsonify({'error': 'Question too long! Keep it under 500 characters.'}), 400
        
        # Find persona
        persona = next((p for p in PERSONAS if p['id'] == persona_id), None)
        if not persona:
            return jsonify({'error': 'Invalid persona selected'}), 400
        
        # Get AI answer
        answer = get_ai_answer(question, persona)
        
        return jsonify({
            'answer': answer,
            'persona': persona_id
        })
        
    except Exception as e:
        print(f"Error in /api/ask: {e}")
        return jsonify({'error': 'Something went wrong. Please try again.'}), 500

# ============================================
# RUN APP
# ============================================

if __name__ == '__main__':
    # Show mode on startup
    mode = "MOCK AI MODE (no API key)" if USE_MOCK_AI else "REAL AI MODE (OpenAI API)"
    print(f"\n{'='*50}")
    print(f"🎓 AI Homework Helper Starting...")
    print(f"Mode: {mode}")
    print(f"Personas loaded: {len(PERSONAS)}")
    print(f"{'='*50}\n")
    
    app.run(debug=config.DEBUG, host=config.HOST, port=config.PORT)
