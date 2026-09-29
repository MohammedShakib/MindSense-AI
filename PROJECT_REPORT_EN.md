# MindSense AI Project Report

## 1. Introduction

MindSense AI is an AI-powered mental wellness assessment platform. The main purpose of the system is to analyze user-provided behavioral information and facial emotion signals to generate a simple wellness snapshot. The platform is not designed to provide medical diagnosis or treatment. Instead, it helps users become more aware of stress, sleep, mood, activity, and emotional patterns.

The project includes a React/Vite frontend, a FastAPI backend, PostgreSQL database integration, and machine learning-based assessment modules. In the current implementation, facial emotion recognition, behavioral mental risk prediction, and a final fusion assessment flow are available.

## 2. Project Objectives

The main objectives of MindSense AI are:

- To provide a quick mental wellness assessment for users.
- To combine behavioral data and facial emotion analysis into a final concern score.
- To classify wellness status as Stable, Monitor, or High Attention.
- To display mental risk probability and facial emotion probability in a visual breakdown.
- To support user activity and system monitoring through user and admin dashboards.
- To create a foundation for future text emotion, voice emotion, report generation, and wellness trend tracking features.

## 3. Problem Statement

Understanding mental wellness can be difficult because it cannot be measured reliably through a single questionnaire or one symptom alone. A more practical insight can be produced by combining sleep, stress, activity, vital signs, facial expression, conversation patterns, and voice tone.

Many wellness applications focus only on mood tracking or journaling. MindSense AI is different because it is designed around a multimodal assessment idea, where multiple sources of signals are combined to generate a unified wellness concern score.

## 4. Proposed Solution

MindSense AI collects data from users in a step-by-step workflow:

1. Facial emotion capture: the system uses camera input to detect the user's face and predict emotional expression.
2. Behavioral data input: the user provides age, gender, occupation, BMI category, sleep duration, sleep quality, physical activity, stress level, heart rate, daily steps, and blood pressure.
3. Mental risk prediction: a trained machine learning model predicts Low, Medium, or High mental risk from behavioral data.
4. Fusion assessment: behavioral risk and facial emotion results are combined through weighted scoring.
5. Recommendation: the system displays a short wellness recommendation based on the final level.

## 5. Target Users

The platform is suitable for:

- Users who want to track their mental wellness regularly.
- Students and professionals who want to monitor stress, focus, sleep, and fatigue.
- Wellness coaches or support teams who need non-clinical wellness insights.
- Admins or operators who monitor user activity, assessment trends, and AI module status.

## 6. Technology Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Lucide React icons

### Backend

- FastAPI
- SQLAlchemy async ORM
- Pydantic
- PostgreSQL
- JWT authentication
- Google OAuth token verification

### Machine Learning

- Scikit-learn
- Joblib
- NumPy
- TensorFlow/Keras
- OpenCV
- Pillow

### Other Dependencies

- Passlib bcrypt for password hashing
- Python-Jose for JWT
- Asyncpg and psycopg2 for PostgreSQL
- Python multipart and requests

## 7. System Architecture

MindSense AI follows a full-stack architecture.

The frontend provides the user interface. It includes the landing page, login/register pages, assessment workspace, user dashboard, and admin dashboard.

The backend manages authentication, admin data, database connection, and ML prediction endpoints.

The machine learning layer uses trained models to predict behavioral risk and facial emotion.

The database layer is designed to store users, assessments, and analysis-related data.

High-level flow:

```text
User Interface
    -> React/Vite Frontend
        -> FastAPI Backend
            -> ML Prediction Modules
            -> PostgreSQL Database
        -> Final Result shown in Dashboard/Assessment UI
```

## 8. Main Modules

### 8.1 Landing Page

The landing page explains the project, AI wellness support, privacy features, dashboard preview, workflow, and call-to-action sections. It helps users understand the purpose and workflow of the platform.

### 8.2 Authentication Module

The authentication module supports email/password registration, login, current user retrieval, password reset OTP flow, and Google sign-in. Passwords are stored as hashes, and a JWT access token is generated after successful login.

Implemented API examples:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-otp`
- `POST /api/auth/reset-password`
- `POST /api/auth/google`

### 8.3 Assessment Workspace

The assessment workspace is the current primary user experience. The user first enables the camera and captures facial emotion. Then the user fills out the behavioral data form and runs mental risk analysis. The final result page shows mental risk, facial emotion, score, confidence, probability breakdown, and recommendation.

### 8.4 Facial Emotion Recognition Module

The facial emotion module sends the captured base64 image from the camera to the backend. The backend uses OpenCV Haar cascade for face detection and a Keras model for emotion prediction.

Supported emotion classes:

- Angry
- Disgust
- Fear
- Happy
- Neutral
- Sad
- Surprise

Output includes:

- Emotion label
- Confidence score
- Probability distribution
- Face detection status
- Face box location

### 8.5 Behavioral Mental Risk Module

The behavioral risk module uses a trained ML model to predict a risk class from user-provided lifestyle and health metrics.

Input features:

- Gender
- Age
- Occupation
- BMI category
- Sleep duration
- Sleep quality
- Physical activity
- Stress level
- Heart rate
- Daily steps
- Systolic blood pressure
- Diastolic blood pressure

Output includes:

- Risk label
- Confidence score
- Class-wise probabilities

### 8.6 Fusion Assessment Module

The fusion module combines the mental risk result and facial emotion result to generate a final wellness score.

Current fusion logic:

- Mental signal weight: 65%
- Facial signal weight: 35%
- Mental risk score mapping: Low = 25, Medium = 58, High = 82
- Facial emotion score mapping: Happy/Neutral produce lower concern scores, while Sad/Fear/Angry/Disgust produce higher concern scores

Final level:

- Score below 45: Stable
- Score from 45 to 69: Monitor
- Score 70 or higher: High Attention
- High mental risk plus negative facial emotion: High Attention

### 8.7 User Dashboard

The user dashboard UI is designed to show wellness overview, signal breakdown, trend view, AI insight card, daily task list, recent assessment history, and quick actions. Most dashboard data is currently demo/mock based, but the UI is ready for future real data integration.

### 8.8 Admin Dashboard

The admin section includes platform overview, user management, assessment monitoring, AI module health, settings, and planned operational pages.

Implemented admin API:

- `GET /api/admin/users`
- `GET /api/admin/database-status`

The admin users page can show user list, provider, registration date, assessment count, and active/inactive status from the database.

## 9. Database Design

The database models are designed to support future multimodal assessments.

Main entities:

- User: account information, email, password hash, Google ID, profile picture, and account status
- Assessment: behavioral, text, facial, voice, and final scores
- QuestionnaireSession: questionnaire answers and score
- ChatSession: assessment-related chat session
- ChatMessage: user/AI messages, detected emotion, and score
- FacialAnalysis: facial emotion result and confidence
- VoiceAnalysis: voice emotion result and confidence
- PasswordResetOTP: password reset code hash and expiry

## 10. API Overview

### Health Endpoint

- `GET /health`

Returns backend health status.

### ML Endpoints

- `GET /api/ml/mental-risk/options`
- `POST /api/ml/mental-risk`
- `POST /api/ml/facial-emotion`
- `POST /api/ml/final-assessment`

These endpoints connect the frontend assessment flow with backend ML modules.

### Auth Endpoints

Authentication endpoints handle user registration, login, password reset, and Google login.

### Admin Endpoints

Admin endpoints provide the user list and database connection status.

## 11. User Flow

Typical user flow:

1. The user opens the application.
2. The user enables the camera for facial emotion capture.
3. The system detects the face and predicts emotion.
4. The user fills out the behavioral form.
5. The backend runs the behavioral mental risk model.
6. The fusion engine combines mental risk and facial emotion.
7. The user sees the final score, level, confidence, probability breakdown, and recommendation.

## 12. Current Implementation Status

Currently implemented:

- React/Vite frontend structure
- Assessment workspace as the default route
- Landing page
- Email/password registration and login backend
- Google authentication backend support
- Password reset OTP backend flow
- FastAPI backend
- PostgreSQL database configuration
- SQLAlchemy models
- Admin users API
- Database status API
- Behavioral risk prediction endpoint
- Facial emotion prediction endpoint
- Final fusion assessment endpoint
- Dashboard and admin UI structure

Partially implemented or planned:

- Real assessment history save/load
- Real user dashboard data binding
- Text sentiment/conversation analysis
- Voice emotion analysis
- Report download/export
- Admin role-based access protection
- Production-grade consent and privacy controls
- Clinical safety escalation flow

## 13. Strengths of the Project

- The project has a full-stack implementation.
- It includes real ML model integration, not only static UI.
- It combines facial emotion and behavioral data for multimodal assessment.
- Authentication, admin panel, and database models create a strong foundation for future growth.
- The UI is structured and modern, and the step-wise assessment flow is easy to use.
- The backend is modular, so new ML modalities can be added more easily.

## 14. Limitations

- The system is not a medical diagnosis tool.
- The current final score uses heuristic weighted fusion and is not clinically validated.
- Much of the dashboard data is still demo/mock based.
- Facial emotion prediction can be affected by lighting, face angle, camera quality, and dataset bias.
- Voice and text analysis are not fully implemented yet.
- Admin APIs are not production-ready with role-based protection.
- Report generation and assessment persistence are still pending.

## 15. Privacy and Safety Considerations

The project may handle sensitive data such as face images, wellness data, and future voice/chat data. Before production deployment, the following concerns should be addressed:

- Explicit consent before camera or microphone use.
- Store as little raw image or voice data as possible.
- Use encryption for sensitive data.
- Use a strong JWT secret and secure environment variable management.
- Protect admin access with role-based authorization.
- Show emergency or support guidance for high-risk results.
- Display a clear disclaimer that the system is not a diagnosis or medical treatment tool.
- Maintain audit logs and a data retention policy.

## 16. Future Scope

Future improvement plan:

- Save assessment results in the database.
- Show real trend charts in the user dashboard.
- Generate PDF or downloadable reports.
- Add text sentiment analysis and AI companion chat.
- Add voice emotion analysis using audio feature extraction.
- Improve the multimodal fusion model.
- Provide personalized wellness plans and daily recommendations.
- Add admin analytics with real assessment statistics.
- Add model performance monitoring.
- Evaluate bias and fairness.
- Deploy with secure production configuration.

## 17. Conclusion

MindSense AI is a meaningful AI-based mental wellness assessment project where frontend, backend, database, and ML model integration work together. The current version supports facial emotion recognition, behavioral risk prediction, and final fusion result generation. Although the system is not intended for medical diagnosis, it provides a strong foundation for user awareness, self-monitoring, and wellness support.

With future improvements such as real assessment history, report generation, text/voice analysis, privacy controls, and production security, MindSense AI can become a more complete, reliable, and practical wellness platform.

## 18. One-line Pitch

MindSense AI combines behavioral data and facial emotion analysis to generate a simple AI-powered mental wellness snapshot with score, confidence, and practical recommendation.
