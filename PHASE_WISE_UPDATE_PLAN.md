# MindSense AI Phase-Wise Update Plan

This plan converts the current project gaps into practical development phases. Each phase is designed to make the system more complete, reliable, and product-ready.

## Phase 1: Authentication and User Session Foundation

### Goal
Make login, registration, and user sessions work properly for real users.

### Updates
- Connect frontend email/password login with the backend `/api/auth/login` endpoint.
- Store JWT access token after successful login.
- Add Authorization header support in frontend API requests.
- Fetch current user from `/api/auth/me`.
- Redirect unauthenticated users away from dashboard and admin pages.
- Add logout functionality.

### Why This Matters
Without real login and token handling, the app cannot safely connect assessments, dashboards, or admin actions to actual users.

### Expected Output
- Users can register, log in, stay logged in, and log out.
- Dashboard can identify the logged-in user.
- Backend-protected APIs can be called securely from frontend.

## Phase 2: Assessment Save and History

### Goal
Save completed assessment results in the database.

### Updates
- Add backend assessment create endpoint.
- Save behavioral risk result, facial emotion result, final score, confidence, risk level, and modalities used.
- Link each assessment to the logged-in user.
- Add endpoint to list current user's assessment history.
- Add endpoint to read a single assessment detail.
- Save assessment automatically after final result generation or through a clear Save button.

### Why This Matters
Currently the system can generate a result, but it does not remember it. Saving assessments is the foundation for trends, reports, dashboards, and admin analytics.

### Expected Output
- Every completed assessment can be stored.
- Users can view previous assessments.
- Admin can count real assessments per user.

## Phase 3: Real Dashboard Data

### Goal
Replace mock dashboard content with real user data.

### Updates
- Show latest assessment score and level.
- Show real mental risk and facial emotion breakdown.
- Show recent assessment table from database.
- Build 7-day and 30-day trend charts from saved assessments.
- Show total assessments and latest update time.
- Hide or mark unavailable modules like text and voice until implemented.

### Why This Matters
The dashboard currently looks complete but uses mostly static data. Real dashboard data will make the product feel functional and trustworthy.

### Expected Output
- User dashboard reflects actual assessment history.
- Recent assessments table becomes real.
- Trend chart shows real score movement over time.

## Phase 4: Admin Route Protection and Role-Based Access

### Goal
Secure admin APIs and admin pages.

### Updates
- Add admin dependency in backend using `is_superuser`.
- Protect `/api/admin/users` and `/api/admin/database-status`.
- Send JWT token from frontend admin API calls.
- Prevent non-admin users from opening admin pages.
- Add clear unauthorized and forbidden states.

### Why This Matters
Admin APIs currently expose sensitive user information without proper role protection. This is one of the most important security fixes.

### Expected Output
- Only superusers can access admin APIs.
- Admin panel is no longer available through simple frontend-only checks.
- User data is protected.

## Phase 5: Report Export

### Goal
Allow users to download assessment summaries.

### Updates
- Add report view for a single assessment.
- Generate downloadable PDF or printable report.
- Include final score, level, confidence, modality breakdown, timestamp, and recommendation.
- Add report download button in result page and history table.
- Add disclaimer that the report is not a medical diagnosis.

### Why This Matters
Reports make the assessment useful beyond one screen. Users can track progress and keep personal records.

### Expected Output
- Users can download or print a wellness assessment report.
- Reports use real saved assessment data.

## Phase 6: Privacy, Consent, and Safety Layer

### Goal
Make the platform safer and more responsible for sensitive wellness data.

### Updates
- Add clear consent step before camera access.
- Explain what data is processed and whether raw images are stored.
- Add non-diagnostic disclaimer on assessment and report pages.
- Add data deletion option for assessment history.
- Add environment-based strong secret key requirement.
- Replace simulated OTP logging with real email delivery or disable password reset until configured.
- Add supportive high-attention guidance without presenting the app as a medical tool.

### Why This Matters
The app handles sensitive wellness and facial data. Privacy and safety messaging must be explicit before the project is production-ready.

### Expected Output
- User consent is clear.
- Sensitive data handling is more transparent.
- The app avoids clinical overclaiming.

## Phase 7: Text and Voice AI Modules

### Goal
Extend MindSense AI from two signals to a fuller multimodal system.

### Updates
- Add text sentiment or emotion analysis endpoint.
- Add optional journal or chat-style text input.
- Add voice recording consent and upload flow.
- Add voice feature extraction and emotion/stress prediction.
- Update final fusion logic to support behavioral, facial, text, and voice signals.
- Add modality availability checks so missing signals do not break final scoring.
- Update dashboard and reports to show all implemented modalities.

### Why This Matters
Text and voice are part of the full MindSense AI vision, but they should be added after the core user, assessment, dashboard, and security flows are reliable.

### Expected Output
- The product supports more than behavioral and facial analysis.
- Final assessment becomes truly multimodal.
- Dashboard and reports can compare signal categories.

## Recommended Release Sequence

### Version 0.2
- Real login and JWT handling.
- Save assessment results.
- User assessment history.

### Version 0.3
- Real dashboard data.
- Admin route protection.
- Role-based access.

### Version 0.4
- Report export.
- Consent and privacy improvements.
- Better safety disclaimers.

### Version 0.5
- Text analysis.
- Voice analysis.
- Improved multimodal fusion.

## Highest Priority Next Step

Start with Phase 1 and Phase 2 together:

1. Fix frontend login.
2. Add authenticated API helper.
3. Add assessment save endpoint.
4. Save final assessment result.
5. Show saved history in dashboard.

These changes will turn the project from a working demo into a real user-based application.
