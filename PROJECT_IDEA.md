# MindSense AI - Project Idea Document

## 1. প্রজেক্টের সারসংক্ষেপ

MindSense AI একটি AI-powered mental wellness assessment platform। এর লক্ষ্য হলো ব্যবহারকারীর বিভিন্ন ধরনের signal বিশ্লেষণ করে তার মানসিক সুস্থতা সম্পর্কে একটি সহজবোধ্য wellness snapshot তৈরি করা।

এই সিস্টেমটি diagnosis বা medical treatment দেওয়ার জন্য নয়। এটি ব্যবহারকারীকে নিজের mood, stress, sleep, focus, voice pattern, facial expression এবং conversation pattern সম্পর্কে awareness দিতে সাহায্য করবে। প্রয়োজনে ব্যবহারকারী যাতে দ্রুত support নিতে পারে, সেটিও এই প্রজেক্টের একটি গুরুত্বপূর্ণ উদ্দেশ্য।

## 2. মূল সমস্যা

মানসিক স্বাস্থ্য বা wellness বোঝা কঠিন, কারণ এটি শুধু একটি questionnaire বা একটি conversation দিয়ে পুরোপুরি ধরা যায় না। একজন মানুষের sleep, behaviour, tone, voice, facial expression এবং কথোপকথনের ধরণ মিলিয়ে অনেক বেশি বাস্তবসম্মত insight পাওয়া সম্ভব।

বর্তমানে অনেক wellness app শুধু mood tracking বা journaling করে। MindSense AI এর পার্থক্য হলো এটি multimodal AI ব্যবহার করে একাধিক source থেকে signal নিয়ে একটি unified concern score তৈরি করার ধারণা দেয়।

## 3. সমাধানের ধারণা

MindSense AI চার ধরনের input signal ব্যবহার করে:

1. Behavioural Insights  
   ব্যবহারকারী sleep, mood, stress, energy, focus এবং daily habit সম্পর্কিত প্রশ্নের উত্তর দেবে।

2. Text & Conversation Analysis  
   ব্যবহারকারী AI companion/chatbot এর সাথে কথা বলবে। AI conversation থেকে sentiment, emotional tone এবং stress-related pattern বিশ্লেষণ করবে।

3. Facial Emotion Analysis  
   ব্যবহারকারীর অনুমতি নিয়ে camera input থেকে facial-expression pattern বিশ্লেষণ করা হবে।

4. Voice Emotion Analysis  
   short voice sample থেকে tone, pitch, jitter, vocal fatigue বা stress marker বিশ্লেষণ করা হবে।

এই চারটি signal একটি Multimodal Fusion Engine-এ যুক্ত হয়ে final wellness concern score তৈরি করবে।

## 4. Key Output

সিস্টেম ব্যবহারকারীকে কয়েকটি clear output দেখাবে:

- 0-100 Wellness Concern Score
- Concern Level: Low, Moderate, High Concern বা Critical
- Overall AI Confidence
- প্রতিটি modality-এর আলাদা score এবং confidence
- কোন signal final score-এ বেশি প্রভাব ফেলেছে
- wellness trend over time
- personalized next action, যেমন breathing exercise, reflection journal বা rest suggestion
- downloadable/reportable assessment history

## 5. Target Users

MindSense AI মূলত নিচের ব্যবহারকারীদের জন্য:

- যারা নিজের mental wellness নিয়মিত track করতে চায়
- students বা professionals যারা stress, focus এবং fatigue monitor করতে চায়
- wellness coaches বা support teams যারা non-clinical wellness insight দেখতে চায়
- admin/operator যারা user activity, assessment trends এবং AI module health monitor করতে চায়

## 6. User Flow

সাধারণ user journey:

1. User account তৈরি করবে বা Google দিয়ে login করবে।
2. User dashboard-এ যাবে।
3. নতুন assessment শুরু করবে।
4. Questionnaire, chat/text, face এবং voice signal provide করবে।
5. AI প্রতিটি signal আলাদাভাবে score করবে।
6. Fusion engine final concern score এবং concern level তৈরি করবে।
7. Dashboard-এ score, trend, insights, recommendations এবং next actions দেখাবে।
8. User চাইলে report download বা previous assessments compare করতে পারবে।

## 7. Admin Flow

Admin panel-এর উদ্দেশ্য হলো platform monitoring এবং operational control।

বর্তমান UI অনুযায়ী admin অংশে আছে:

- Platform overview
- Total users, active users এবং total assessments metric
- Assessment completion funnel
- Concern level distribution
- System এবং AI model health monitoring
- Users management
- Assessment monitoring
- AI modules monitoring
- Reports, logs, recommendations এবং settings-এর planned sections

## 8. Core Features

### User Side

- Landing page with project explanation
- Email/password registration এবং login
- Google OAuth login support
- Personal dashboard
- Wellness score overview
- Multimodal signal breakdown
- Wellness trend chart
- AI insight card
- Daily wellness task list
- Recent assessment history
- Quick actions: new assessment, AI chat, view plan, download report

### Admin Side

- Admin overview dashboard
- User list from connected database
- Search, filter, pagination এবং CSV export UI
- User profile drawer
- Assessment monitoring table
- AI module health cards
- Database connection status endpoint

### Backend/API

- FastAPI backend
- PostgreSQL database connection
- SQLAlchemy async models
- JWT-based authentication
- Password hashing
- Password reset OTP flow
- Google login token verification
- User and assessment database models
- Admin user list API
- Health check endpoint

## 9. Data Model Overview

প্রজেক্টে প্রধান database entities:

- User: account, email, password hash, Google ID, profile picture, status
- Assessment: user-specific assessment result, modality scores, final score, confidence, risk level
- QuestionnaireSession: behavioural questionnaire answers and score
- ChatSession: assessment-related chat session
- ChatMessage: user/AI messages, detected emotion, score
- FacialAnalysis: facial emotion result and confidence
- VoiceAnalysis: voice emotion result and confidence
- PasswordResetOTP: password reset OTP hash and expiry

## 10. System Architecture

High-level architecture:

- Frontend: React, Vite, React Router, Tailwind CSS, Framer Motion, Lucide icons
- Backend: FastAPI, SQLAlchemy, Pydantic, JWT auth
- Database: PostgreSQL
- AI/ML dependencies planned: scikit-learn, PyTorch, Transformers, OpenCV, Librosa

প্রস্তাবিত AI pipeline:

1. Input collection from questionnaire, text, face and voice.
2. Separate modality-specific model inference.
3. Score normalization to 0-100 scale.
4. Confidence calculation per modality.
5. Multimodal fusion to final score.
6. Concern level classification.
7. Dashboard insight and recommendation generation.

## 11. Current Implementation Status

বর্তমান কোডবেসে যা আছে:

- React/Vite frontend structure তৈরি আছে।
- Landing page project idea ব্যাখ্যা করে।
- User dashboard UI তৈরি আছে, বেশিরভাগ data এখন mock/demo।
- Admin dashboard UI তৈরি আছে।
- Admin users page backend থেকে user list fetch করতে পারে।
- FastAPI backend আছে।
- Auth API আছে: register, login, current user, forgot password, verify OTP, reset password, Google auth।
- Database models আছে user, assessment, chat, facial analysis, voice analysis ইত্যাদির জন্য।
- Admin API আছে user list এবং database status-এর জন্য।

এখনো যেগুলো পূর্ণভাবে implement করা বাকি:

- Real assessment submission flow
- Questionnaire scoring API
- Text emotion/sentiment model integration
- Facial analysis inference endpoint
- Voice analysis inference endpoint
- Multimodal fusion engine implementation
- Real dashboard data binding
- Report generation
- Admin role protection
- Production-grade privacy, consent এবং safety flow

## 12. Privacy and Safety Considerations

এই প্রজেক্টে sensitive mental wellness, face এবং voice data থাকতে পারে। তাই production-ready করার আগে নিচের বিষয়গুলো অবশ্যই দরকার:

- Clear user consent before camera বা microphone use
- Data minimization: যত কম raw media রাখা যায় তত ভালো
- Encryption for sensitive data
- Role-based admin access
- Audit logs for admin actions
- Clear disclaimer: এটি diagnosis tool নয়
- Crisis guidance: high-risk signal detect হলে emergency/contact-support guidance দেখানো
- Secure environment variables and secret management
- Strong retention policy for face/voice data

## 13. MVP Scope

প্রথম usable MVP-এর জন্য recommended scope:

1. Account signup/login
2. Questionnaire-based behavioural assessment
3. AI chat-based text sentiment analysis
4. Basic final concern score
5. User dashboard with real stored assessment history
6. Admin user and assessment monitoring
7. Simple recommendation engine
8. PDF or downloadable report

Face এবং voice analysis MVP-এর পরে phase 2 হিসেবে রাখা যেতে পারে, কারণ এগুলোর privacy, consent, model accuracy এবং infrastructure complexity বেশি।

## 14. Future Roadmap

Phase 1 - Foundation:

- Backend assessment APIs
- Real questionnaire flow
- Real dashboard data
- Admin access control
- Report export

Phase 2 - AI Expansion:

- NLP/text analysis model
- Voice feature extraction with Librosa
- Facial emotion analysis with OpenCV/model inference
- Multimodal fusion scoring

Phase 3 - Wellness Support:

- Personalized daily wellness plans
- Guided breathing/mindfulness sessions
- Resource recommendations
- Trend-based alerts
- Weekly summary reports

Phase 4 - Production Readiness:

- Privacy controls
- Data retention policy
- Observability and logs
- Security review
- Model performance monitoring
- Bias and fairness evaluation

## 15. One-line Pitch

MindSense AI is a multimodal AI platform that combines behaviour, conversation, facial-expression and voice signals to help users understand their mental wellness patterns and take practical next steps.

## 16. Short Bangla Pitch

MindSense AI এমন একটি AI-based mental wellness platform, যেখানে questionnaire, chat, face এবং voice signal বিশ্লেষণ করে ব্যবহারকারীর wellness concern score, trend, insight এবং personalized action plan দেখানো হয়।
