# MindSense AI Project Report

## 1. ভূমিকা

MindSense AI একটি AI-powered mental wellness assessment platform। এই সিস্টেমের মূল উদ্দেশ্য হলো ব্যবহারকারীর আচরণগত তথ্য, facial emotion signal এবং ভবিষ্যতে text/voice signal বিশ্লেষণ করে একটি সহজবোধ্য wellness snapshot তৈরি করা। এটি কোনো medical diagnosis system নয়; বরং ব্যবহারকারীকে নিজের stress, sleep, mood, activity এবং emotional pattern সম্পর্কে সচেতন করতে সহায়তা করে।

প্রজেক্টটিতে একটি React/Vite frontend, FastAPI backend, PostgreSQL database integration এবং machine learning based assessment module ব্যবহার করা হয়েছে। বর্তমান implementation-এ facial emotion recognition, behavioural mental risk prediction এবং final fusion assessment flow যুক্ত আছে।

## 2. প্রজেক্টের লক্ষ্য

MindSense AI-এর প্রধান লক্ষ্যগুলো হলো:

- ব্যবহারকারীর mental wellness সম্পর্কে একটি quick assessment প্রদান করা।
- behavioural data এবং facial emotion analysis একসাথে ব্যবহার করে final concern score তৈরি করা।
- ব্যবহারকারীকে Stable, Monitor অথবা High Attention level হিসেবে wellness status দেখানো।
- mental risk probability এবং facial emotion probability visual breakdown আকারে দেখানো।
- personal dashboard এবং admin dashboard-এর মাধ্যমে user activity ও system monitoring support করা।
- ভবিষ্যতে text emotion, voice emotion, report generation এবং trend tracking যুক্ত করার ভিত্তি তৈরি করা।

## 3. সমস্যা বিবৃতি

মানসিক সুস্থতা বোঝা অনেক সময় কঠিন, কারণ এটি শুধু একটি questionnaire বা একটি single symptom দিয়ে নির্ভরযোগ্যভাবে বোঝা যায় না। একজন মানুষের sleep, stress, activity, vital signs, facial expression, conversation pattern এবং voice tone মিলিয়ে বেশি বাস্তবসম্মত insight পাওয়া সম্ভব।

অনেক wellness app শুধু mood tracking বা journaling করে। MindSense AI-এর আলাদা দিক হলো এটি multimodal signal ব্যবহার করার ধারণা নিয়ে তৈরি, যেখানে একাধিক source থেকে পাওয়া result একত্র করে final wellness concern score তৈরি করা হয়।

## 4. প্রস্তাবিত সমাধান

MindSense AI ব্যবহারকারীর কাছ থেকে ধাপে ধাপে data নেয়:

1. Facial emotion capture: camera input থেকে face detect করে emotion prediction করা হয়।
2. Behavioural data input: age, gender, occupation, BMI, sleep duration, sleep quality, physical activity, stress level, heart rate, daily steps এবং blood pressure নেওয়া হয়।
3. Mental risk prediction: trained machine learning model behavioural data থেকে Low, Medium বা High risk class predict করে।
4. Fusion assessment: behavioural risk এবং facial emotion result weighted scoring-এর মাধ্যমে combine করে final score ও level তৈরি করা হয়।
5. Recommendation: final level অনুযায়ী ব্যবহারকারীকে short wellness recommendation দেখানো হয়।

## 5. Target Users

এই platform মূলত নিচের ব্যবহারকারীদের জন্য উপযোগী:

- যারা নিজের mental wellness নিয়মিত track করতে চায়।
- student বা professional, যারা stress, focus, sleep এবং fatigue monitor করতে চায়।
- wellness coach বা support team, যারা non-clinical wellness insight দেখতে চায়।
- admin/operator, যারা user activity, assessment trend এবং AI module status monitor করতে চায়।

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

MindSense AI একটি full-stack architecture অনুসরণ করে।

Frontend ব্যবহারকারীর interface provide করে। এখানে landing page, login/register page, assessment workspace, user dashboard এবং admin dashboard আছে।

Backend API authentication, admin data, database connection এবং ML prediction endpoint manage করে।

Machine learning layer trained model ব্যবহার করে behavioural risk এবং facial emotion predict করে।

Database layer user, assessment এবং analysis-related data store করার জন্য designed।

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

Landing page-এ project explanation, AI wellness support, privacy section, dashboard preview, how it works এবং call-to-action section রাখা হয়েছে। এটি user-কে platform-এর purpose ও workflow বুঝতে সাহায্য করে।

### 8.2 Authentication Module

Authentication module email/password registration, login, current user endpoint, password reset OTP flow এবং Google sign-in support করে। Password hash করে store করা হয় এবং successful login-এর পরে JWT access token generate করা হয়।

Implemented API examples:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-otp`
- `POST /api/auth/reset-password`
- `POST /api/auth/google`

### 8.3 Assessment Workspace

Assessment workspace হলো current primary user experience। এখানে user প্রথমে camera permission দিয়ে face capture করে। এরপর behavioural data form পূরণ করে mental risk analysis চালায়। শেষে final result page-এ mental risk, facial emotion, score, confidence, probability breakdown এবং recommendation দেখানো হয়।

### 8.4 Facial Emotion Recognition Module

Facial emotion module camera থেকে captured base64 image backend-এ পাঠায়। Backend OpenCV Haar cascade দিয়ে face detect করে এবং Keras model দিয়ে emotion predict করে।

Supported emotion classes:

- Angry
- Disgust
- Fear
- Happy
- Neutral
- Sad
- Surprise

Output includes:

- emotion label
- confidence
- probability distribution
- face detection status
- face box location

### 8.5 Behavioural Mental Risk Module

Behavioural risk module trained ML model ব্যবহার করে user-provided lifestyle and health metrics থেকে risk class predict করে।

Input features:

- gender
- age
- occupation
- BMI category
- sleep duration
- sleep quality
- physical activity
- stress level
- heart rate
- daily steps
- systolic blood pressure
- diastolic blood pressure

Output includes:

- risk label
- confidence
- class-wise probabilities

### 8.6 Fusion Assessment Module

Fusion module mental risk result এবং facial emotion result combine করে final wellness score তৈরি করে।

Current fusion logic:

- mental signal weight: 65%
- facial signal weight: 35%
- mental risk score mapping: Low = 25, Medium = 58, High = 82
- facial emotion score mapping: Happy/Neutral lower score, Sad/Fear/Angry/Disgust higher score

Final level:

- score below 45: Stable
- score 45 to 69: Monitor
- score 70 or higher: High Attention
- High mental risk plus negative facial emotion: High Attention

### 8.7 User Dashboard

User dashboard UI wellness overview, signal breakdown, trend view, AI insight card, daily task list, recent assessment history এবং quick action section দেখানোর জন্য তৈরি করা হয়েছে। বর্তমান data-এর বড় অংশ demo/mock based, কিন্তু UI future real data integration-এর জন্য ready।

### 8.8 Admin Dashboard

Admin section platform overview, user management, assessment monitoring, AI module health, settings এবং planned operational pages ধারণ করে।

Implemented admin API:

- `GET /api/admin/users`
- `GET /api/admin/database-status`

Admin users page database থেকে user list, provider, registration date, assessment count এবং active/inactive status দেখাতে পারে।

## 9. Database Design

Project-এর database modelগুলো future multimodal assessment support করার মতো করে design করা হয়েছে।

Main entities:

- User: user account, email, password hash, Google ID, profile picture, status
- Assessment: behavioural, text, facial, voice এবং final score store করার structure
- QuestionnaireSession: questionnaire answers and score
- ChatSession: assessment-related chat session
- ChatMessage: user/AI message, detected emotion and score
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

These endpoints connect frontend assessment flow with backend ML modules.

### Auth Endpoints

Authentication endpoints handle user registration, login, password reset and Google login.

### Admin Endpoints

Admin endpoints provide user list and database connection status.

## 11. User Flow

Typical user flow:

1. User application খুলবে।
2. Facial emotion capture করার জন্য camera enable করবে।
3. System face detect করে emotion prediction করবে।
4. User behavioural form পূরণ করবে।
5. Backend behavioural mental risk model run করবে।
6. Fusion engine mental risk এবং facial emotion combine করবে।
7. User final score, level, confidence, probability breakdown এবং recommendation দেখবে।

## 12. Current Implementation Status

বর্তমানে implemented:

- React/Vite frontend structure
- Assessment workspace as default route
- Landing page
- Email/password registration and login backend
- Google authentication backend support
- Password reset OTP backend flow
- FastAPI backend
- PostgreSQL database configuration
- SQLAlchemy models
- Admin users API
- Database status API
- Behavioural risk prediction endpoint
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

- Full-stack implementation আছে।
- Real ML model integration আছে, শুধু static UI নয়।
- Facial emotion এবং behavioural data combine করে multimodal assessment করা হয়েছে।
- Authentication, admin panel এবং database model future production growth-এর জন্য foundation তৈরি করে।
- UI structured and modern, assessment flow step-wise হওয়ায় ব্যবহার করা সহজ।
- Backend modular, ফলে নতুন ML modality add করা সহজ।

## 14. Limitations

- এটি medical diagnosis tool নয়।
- Current final score heuristic weighted fusion ব্যবহার করে; clinically validated নয়।
- Dashboard-এর অনেক data এখনো demo/mock।
- Facial emotion model lighting, face angle, camera quality এবং dataset bias দ্বারা প্রভাবিত হতে পারে।
- Voice এবং text analysis এখনো fully implemented নয়।
- Admin API-তে role-based protection production-ready নয়।
- Report generation ও assessment persistence সম্পূর্ণভাবে যুক্ত করা বাকি।

## 15. Privacy and Safety Considerations

এই project sensitive data handle করতে পারে, বিশেষ করে face image, wellness data এবং future voice/chat data। তাই production deployment-এর আগে নিচের বিষয়গুলো নিশ্চিত করা জরুরি:

- Camera/microphone ব্যবহারের আগে explicit consent নেওয়া।
- Raw image বা voice data যত কম সম্ভব store করা।
- Sensitive data encryption ব্যবহার করা।
- Strong JWT secret এবং secure environment variable management করা।
- Admin access role-based করা।
- High-risk result দেখালে emergency/support guidance দেখানো।
- Clear disclaimer দেওয়া যে এটি diagnosis বা medical treatment নয়।
- Audit log এবং data retention policy রাখা।

## 16. Future Scope

Future improvement plan:

- Assessment result database-এ save করা।
- User dashboard-এ real trend chart দেখানো।
- PDF/downloadable report generation।
- Text sentiment analysis and AI companion chat।
- Voice emotion analysis using audio feature extraction।
- More advanced multimodal fusion model।
- Personalized wellness plan and daily recommendation।
- Admin analytics dashboard with real assessment statistics।
- Model performance monitoring।
- Bias and fairness evaluation।
- Deployment with secure production configuration।

## 17. Conclusion

MindSense AI একটি meaningful AI-based mental wellness assessment project, যেখানে frontend, backend, database এবং ML model integration একসাথে কাজ করে। বর্তমান version-এ facial emotion recognition, behavioural risk prediction এবং final fusion result তৈরি করা যায়। যদিও systemটি medical diagnosis-এর জন্য নয়, এটি user awareness, self-monitoring এবং wellness support-এর জন্য একটি strong foundation তৈরি করে।

Future development-এ real assessment history, report generation, text/voice analysis, privacy controls এবং production security যোগ করলে MindSense AI আরও complete, reliable এবং practical platform হিসেবে ব্যবহারযোগ্য হবে।

## 18. One-line Pitch

MindSense AI combines behavioural data and facial emotion analysis to generate a simple AI-powered mental wellness snapshot with score, confidence and practical recommendation.
