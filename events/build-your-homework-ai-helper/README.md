# 🎓 AI Homework Helper for Kids

A safe, fun, and educational Flask web app where kids (ages 11-13) can ask homework questions and get answers from AI helpers with different personalities!

## ✨ Features

- **5 Fun Personas**: Choose from Calm Teacher, Hype Coach, Funny Helper, Science Nerd, or Gamer Explainer
- **Image-Button Selection**: Click persona avatars to switch helpers
- **Dynamic Theming**: UI theme changes instantly when you select a persona
- **Safe AI Responses**: Built-in safety filters and age-appropriate content
- **Mock Mode**: Works without OpenAI API key for testing
- **Mobile-Friendly**: Responsive design works on all devices
- **No Database**: Simple, stateless application
- **No User Accounts**: Privacy-focused, no login required

## 📁 Project Structure

```txt
build-your-homework-ai-helper/
├── app.py                      # Flask backend
├── config.py                   # Configuration (API key here!)
├── requirements.txt            # Python dependencies
├── personas.json               # Persona configurations
├── README.md                   # This file
├── templates/
│   └── index.html             # Main HTML page
└── static/
    ├── style.css              # Styles with CSS variables
    ├── app.js                 # Frontend JavaScript
    └── personas/              # Persona avatar images
        ├── calm-teacher.svg
        ├── hype-coach.svg
        ├── funny-helper.svg
        ├── science-nerd.svg
        └── gamer-explainer.svg
```

## 🚀 Local Setup (Run on Your Computer)

### Prerequisites

- Python 3.10 or higher
- pip (Python package manager)

### Installation Steps

1. **Navigate to project folder**

   ```bash
   cd build-your-homework-ai-helper
   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the app**

   ```bash
   python app.py
   ```

4. **Open in browser**
   - Go to: `http://localhost:5000`
   - The app will run in **MOCK MODE** (safe test responses)

### 🔑 Enable Real AI (Optional)

To use OpenAI's GPT instead of mock responses:

1. Get an OpenAI API key from: <https://platform.openai.com/api-keys>

2. Edit `config.py` and add your API key:

   ```python
   OPENAI_API_KEY = "sk-proj-your-api-key-here"
   ```

3. Run the app again:

   ```bash
   python app.py
   ```

The app will automatically detect the API key and switch to REAL AI MODE.

**Note**: PythonAnywhere free plan doesn't support environment variables, so we use `config.py` instead!

## 🌐 Deploy to PythonAnywhere

### Step 1: Upload Files

1. Create a free account at: <https://www.pythonanywhere.com>
2. Go to **Files** tab
3. Upload all project files to `/home/yourusername/homework-helper/`

### Step 2: Install Dependencies

1. Go to **Consoles** tab
2. Start a **Bash console**
3. Run:

   ```bash
   cd homework-helper
   pip install --user -r requirements.txt
   ```

### Step 3: Configure Web App

1. Go to **Web** tab
2. Click **Add a new web app**
3. Choose **Manual configuration**
4. Select **Python 3.10**
5. In **Code** section, set:
   - **Source code**: `/home/yourusername/homework-helper`
   - **Working directory**: `/home/yourusername/homework-helper`

### Step 4: Configure API Key (Optional)

1. In **Files** tab, open `config.py`
2. Edit the line:

   ```python
   OPENAI_API_KEY = "sk-proj-your-api-key-here"  # Add your key
   ```

3. Save the file
4. Leave as `None` to run in MOCK MODE

### Step 5: Edit WSGI File

1. Click on **WSGI configuration file** link
2. Replace contents with:

```python
import sys

# Add project directory to path
project_home = '/home/yourusername/homework-helper'
if project_home not in sys.path:
    sys.path = [project_home] + sys.path

# Import Flask app
from app import app as application
```

1. Replace `yourusername` with your actual PythonAnywhere username
2. Save the file

### Step 6: Configure Static Files

1. In **Web** tab, scroll to **Static files** section
2. Add entry:
   - **URL**: `/static/`
   - **Directory**: `/home/yourusername/homework-helper/static/`

### Step 7: Reload and Test

1. Click green **Reload** button
2. Visit: `https://yourusername.pythonanywhere.com`
3. Your app is live! 🎉

## 🎨 Customizing Personas

### For Kids: How to Add Your Own Persona

Want to create your own homework helper? Here's how!

#### 1. Edit `personas.json`

Add a new persona object to the array:

```json
{
  "id": "my-helper",
  "label": "🌟 My Helper",
  "image": "/static/personas/my-helper.svg",
  "system_prompt": "You are a helpful assistant who talks like... [describe personality]",
  "theme": {
    "bg": "#f0f0f0",
    "card": "#ffffff",
    "text": "#333333",
    "accent": "#ff6b6b",
    "muted": "#999999",
    "radius": "12px",
    "font": "'Arial', sans-serif"
  }
}
```

#### 2. Create an Avatar Image

- Create a new SVG file in `static/personas/my-helper.svg`
- Or use a PNG/JPG image (80x80 pixels recommended)
- Make sure the filename matches the `image` field in JSON

#### 3. Customize the Theme

Change these colors to match your persona:

- **bg**: Background color
- **card**: Card/box color
- **text**: Text color
- **accent**: Highlight color (buttons, borders)
- **muted**: Secondary text color

#### 4. Test Your Persona

Reload the page and your new persona should appear!

## 🛡️ Safety Features

- **No Cheating**: AI guides students, doesn't solve tests
- **Age-Appropriate**: Content filtered for ages 11-13
- **No Harmful Content**: Blocks violence, drugs, inappropriate topics
- **Privacy-First**: No user accounts, no data storage
- **Stateless**: Each question is independent

## 🔧 Technical Details

### API Endpoints

- `GET /` - Main page
- `GET /api/personas` - Get persona list (without system prompts)
- `POST /api/ask` - Submit question

  ```json
  {
    "question": "What is photosynthesis?",
    "persona_id": "science-nerd"
  }
  ```

### Mock Mode vs Real AI

**Mock Mode** (no API key):

- Returns safe, pre-written responses
- Shows persona behavior clearly
- Perfect for testing and demos
- No API costs

**Real AI Mode** (with API key):

- Uses OpenAI GPT-3.5-turbo
- Dynamic, personalized responses
- Safety rules enforced in system prompt
- Requires API key and credits

## 📝 License

This project is designed for educational purposes. Feel free to modify and use it for teaching kids!

## 🤝 Contributing

Kids can contribute by:

- Creating new persona designs
- Adding new avatar images
- Suggesting new persona personalities
- Testing and reporting bugs

## 💡 Tips for Teachers

- Start with Mock Mode to show how it works
- Let kids customize one persona as a learning activity
- Discuss AI safety and responsible use
- Encourage critical thinking about AI responses

## 🐛 Troubleshooting

**Problem**: Personas don't load

- **Solution**: Check that `personas.json` is valid JSON
- Use a JSON validator: <https://jsonlint.com>

**Problem**: Images don't show

- **Solution**: Verify image paths in `personas.json` match actual files

**Problem**: Theme doesn't change

- **Solution**: Check browser console for JavaScript errors
- Make sure `app.js` is loaded correctly

**Problem**: API errors in Real AI mode

- **Solution**: Verify OPENAI_API_KEY is set correctly
- Check API key has credits: <https://platform.openai.com/usage>

## 📧 Support

For questions or issues:

1. Check this README first
2. Review the code comments (heavily documented!)
3. Test in Mock Mode before Real AI Mode

---

**Made with ❤️ for young learners!**

🎓 Learn • 🤖 Explore • 🚀 Grow
