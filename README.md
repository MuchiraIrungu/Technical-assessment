# Interactive Q&A System

An intelligent AI-powered question-and-answer system that enables users to interact with an AI assistant in real-time. Built with modern web technologies and powered by Google's Gemini AI model, this system provides a seamless conversational experience with persistent chat history and user authentication.

[![Python](https://img.shields.io/badge/python-v3.8+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.68+-green.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-12+-black.svg)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Overview

This full-stack application demonstrates modern web development practices by combining a robust FastAPI backend with a responsive Next.js frontend. The system leverages Google's Gemini AI model to provide intelligent responses while maintaining user context through persistent conversation history.

## Features

### Core Functionality
- ** AI-Powered Conversations**: Leverage Google Gemini's free-tier for intelligent responses
- ** Secure Authentication**: JWT-based user authentication system
- ** Real-time Chat Interface**: Interactive chat with immediate AI responses
- ** Conversation History**: Persistent storage and retrieval of chat history per user
- ** Paginated History View**: Efficient browsing of past conversations
- ** User Management**: Complete user registration and login system

### Technical Features
- ** RESTful API**: Well-structured API endpoints with FastAPI
- ** Database Integration**: PostgreSQL with SQLAlchemy ORM
- ** Modern Frontend**: TypeScript-based React components with Next.js
- ** Environment Security**: Secure environment variable management
- ** Responsive Design**: Mobile-friendly interface

## 🛠️ Technology Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - Database ORM for Python
- **PostgreSQL** - Robust relational database
- **JWT** - Secure authentication tokens
- **python-dotenv** - Environment variable management
- **Uvicorn** - ASGI server for FastAPI

### Frontend
- **Next.js** - React framework for production
- **TypeScript** - Type-safe JavaScript development
- **React** - Component-based UI library

### AI & External Services
- **Google Gemini Free-Tier** - Generative AI language model

## 📁 Project Structure

```
Interactive-QA-System/
├── backend/
│   ├── Chat/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── models.py            # Chat data models
│   │   ├── database.py          # Database configuration
│   │   ├── crud.py              # Database operations
│   │   └── routes.py            # Chat API endpoints
│   ├── Authentication/
│   │   ├── __init__.py
│   │   ├── models.py            # User data models
│   │   ├── database.py          # Auth database config
│   │   ├── auth.py              # Authentication logic
│   │   └── routes.py            # Auth API endpoints
│   ├── requirements.txt         # Python dependencies
│   └── .env.example            # Environment variables template
├── frontend/
│   ├── pages/
│   │   ├── index.js            # Home page
│   │   ├── login.js            # Login page
│   │   └── chat.js             # Chat interface
│   ├── components/
│   │   ├── ChatInterface.tsx    # Main chat component
│   │   ├── MessageBubble.tsx    # Individual message display
│   │   └── AuthForm.tsx         # Authentication forms
│   ├── styles/                  # CSS styles
│   ├── utils/                   # Utility functions
│   ├── package.json            # Node.js dependencies
│   └── next.config.js          # Next.js configuration
├── README.md                   # Project documentation
├── .gitignore                  # Git ignore rules
└── LICENSE                     # Project license
```

## ⚙️ Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 14+** ([Download](https://nodejs.org/))
- **PostgreSQL** ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

### Step 1: Clone the Repository

```bash
git clone https://github.com/MuchiraIrungu/Technical-assessment.git
cd Technical-assessment
```

### Step 2: Backend Setup

1. **Create and activate a virtual environment:**
   ```bash
   python -m venv the_env
   
   # On Linux/macOS
   source the_env/bin/activate
   
   # On Windows
   the_env\Scripts\activate
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` and `.config.py` file with your configuration:
   ```ini
   # Database Configuration
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/qa_system
   
   # JWT Configuration
   JWT_SECRET_KEY=your_super_secret_jwt_key_here
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
   
   # AI Configuration
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Server Configuration
   DEBUG=True
   HOST=0.0.0.0
   PORT=8001
   ```

4. **Set up the database:**
   ```bash
   # Create database (make sure PostgreSQL is running)
   createdb qa_system
   
   # Initialize database tables
   python -m Chat.database
   ```

5. **Start the backend server:**
   ```bash
   uvicorn Chat.main:app --reload --host 0.0.0.0 --port 8001
   ```

### Step 3: Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Create frontend environment file:**
   ```bash
   # Create .env.local
   echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8001" > .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

### Step 4: Obtain API Keys

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new project or select an existing one
3. Generate an API key
4. Add the key to your `.env` file

## 🔧 Usage

### Getting Started

1. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001
   - API Documentation: http://localhost:8001/docs

2. **Create an account:**
   - Navigate to the signup page
   - Provide required information
   - Verify your account (if email verification is implemented)

3. **Start chatting:**
   - Log in to your account
   - Navigate to the chat interface
   - Type your question and press Enter
   - View AI responses in real-time

4. **Manage conversations:**
   - Access chat history from the sidebar
   - Use pagination to browse older conversations
   - Search through previous chats

### API Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

#### Chat
- `POST /chat/ask` - Send a question to AI
- `GET /chat/history` - Get user's chat history
- `GET /chat/conversation/{id}` - Get specific conversation
- `DELETE /chat/conversation/{id}` - Delete conversation

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests
cd frontend
npm test

# Run tests with coverage
pytest --cov=Chat tests/
npm run test:coverage
```

### Manual Testing
1. Test user registration and login
2. Verify JWT token functionality
3. Test AI response generation
4. Check conversation history persistence
5. Validate error handling

##  Security Considerations

### Authentication & Authorization
- JWT tokens with expiration
- Password hashing using bcrypt
- Protected API endpoints
- CORS configuration for frontend

### Environment Security
- Sensitive data stored in environment variables
- `.env` files excluded from version control
- API key protection and rotation

### Database Security
- SQL injection prevention with SQLAlchemy
- Database connection encryption
- User data privacy compliance

##  Known Limitations & Considerations

### API Rate Limits
- **Gemini Free Tier**: Limited to 60 requests per minute
- **Daily Quota**: 1000 requests per day
- **Response Length**: Maximum 2048 tokens per response

### Performance Notes
- Database queries optimized with indexing
- Frontend implements lazy loading for chat history
- Rate limiting implemented on backend

##  Future Enhancements

### Planned Features
- [ ] **File Upload Support** - Allow users to upload documents for context
- [ ] **Voice Integration** - Speech-to-text and text-to-speech capabilities
- [ ] **Multi-language Support** - Internationalization (i18n)
- [ ] **Chat Export** - Download conversations as PDF/JSON
- [ ] **Admin Dashboard** - User management and system analytics

### Technical Improvements
- [ ] **Redis Caching** - Improve response times
- [ ] **WebSocket Support** - Real-time messaging
- [ ] **Docker Containerization** - Simplified deployment
- [ ] **CI/CD Pipeline** - Automated testing and deployment
- [ ] **Monitoring & Logging** - Application performance monitoring

##  Troubleshooting

### Common Issues

**1. Database Connection Error**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Verify database exists
psql -U postgres -l
```

**2. Gemini API Key Issues**
- Verify API key is correct in `.env`
- Check quota limits in Google Cloud Console
- Ensure billing is enabled (if required)

**3. Frontend Build Errors**
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**4. CORS Issues**
- Check FastAPI CORS middleware configuration
- Verify frontend URL in allowed origins

##  Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow PEP 8 for Python code
- Use TypeScript for frontend development
- Write comprehensive tests for new features
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact & Support

**Developer**: Muchira Irungu  
**GitHub**: [@MuchiraIrungu](https://github.com/MuchiraIrungu)  
**Email**: [Your Email]  
**LinkedIn**: [Your LinkedIn Profile]

### Getting Help
- 🐛 **Bug Reports**: Create an issue with the bug template
- 💡 **Feature Requests**: Use the feature request template
- ❓ **Questions**: Check existing issues or create a new discussion

---

**⭐ If you found this project helpful, please consider giving it a star!**

*Last updated: [Current Date]*
