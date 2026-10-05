import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  BarChart3,
  Brain,
  Camera,
  CheckCircle2,
  HeartPulse,
  Loader2,
  RefreshCw,
  ScanFace,
} from 'lucide-react';
import {
  buildFinalAssessment,
  createAssessment,
  fetchMentalOptions,
  getAuthToken,
  predictFacialEmotion,
  predictMentalRisk,
} from '../lib/api';
import BrandIcon from '../components/BrandIcon';

const defaultOptions = {
  genders: ['Female', 'Male'],
  occupations: ['Student', 'Software Engineer', 'Teacher', 'Doctor', 'Engineer'],
  bmi_categories: ['Healthy Weight', 'Overweight', 'Obese'],
};

const initialForm = {
  gender: 'Male',
  age: 25,
  occupation: 'Student',
  bmi_category: 'Healthy Weight',
  sleep_duration: 7,
  sleep_quality: 7,
  physical_activity: 30,
  stress_level: 5,
  heart_rate: 72,
  daily_steps: 5000,
  systolic_bp: 120,
  diastolic_bp: 80,
};

const levelStyles = {
  Stable: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Monitor: 'border-amber-200 bg-amber-50 text-amber-700',
  'High Attention': 'border-rose-200 bg-rose-50 text-rose-700',
};

const fieldGroups = [
  {
    title: 'Profile',
    fields: [
      { key: 'gender', label: 'Gender', type: 'select', optionKey: 'genders' },
      { key: 'age', label: 'Age', type: 'number', min: 1, max: 100 },
      { key: 'occupation', label: 'Occupation', type: 'select', optionKey: 'occupations' },
      { key: 'bmi_category', label: 'BMI', type: 'select', optionKey: 'bmi_categories' },
    ],
  },
  {
    title: 'Daily Metrics',
    fields: [
      { key: 'sleep_duration', label: 'Sleep Hours', type: 'number', min: 1, max: 15, step: 0.5 },
      { key: 'sleep_quality', label: 'Sleep Quality', type: 'number', min: 1, max: 10 },
      { key: 'physical_activity', label: 'Activity Min', type: 'number', min: 0, max: 240 },
      { key: 'stress_level', label: 'Stress', type: 'number', min: 1, max: 10 },
    ],
  },
  {
    title: 'Vitals',
    fields: [
      { key: 'heart_rate', label: 'Heart Rate', type: 'number', min: 40, max: 180 },
      { key: 'daily_steps', label: 'Daily Steps', type: 'number', min: 0, max: 50000 },
      { key: 'systolic_bp', label: 'Systolic BP', type: 'number', min: 80, max: 220 },
      { key: 'diastolic_bp', label: 'Diastolic BP', type: 'number', min: 40, max: 140 },
    ],
  },
];

function ResultPanel({ icon: Icon, label, value, confidence, tone = 'slate' }) {
  const colors = {
    slate: 'border-slate-200 bg-white text-slate-800',
    indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    cyan: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  };

  return (
    <div className={`rounded-lg border p-4 ${colors[tone]}`}>
      <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide opacity-80">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="mt-3 text-2xl font-semibold">{value || 'Pending'}</div>
      <div className="mt-2 text-sm font-normal opacity-70">
        Confidence {confidence ? `${confidence}%` : '0%'}
      </div>
    </div>
  );
}

function ProbabilityBars({ data }) {
  const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);

  if (!entries.length) {
    return <div className="text-sm font-normal text-slate-400">No prediction yet</div>;
  }

  return (
    <div className="space-y-3">
      {entries.map(([label, value]) => (
        <div key={label}>
          <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>{label}</span>
            <span>{value}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-slate-800" style={{ width: `${Math.min(value, 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AssessmentWorkspace() {
  const [form, setForm] = useState(initialForm);
  const [options, setOptions] = useState(defaultOptions);
  const [mentalResult, setMentalResult] = useState(null);
  const [faceResult, setFaceResult] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [savedAssessment, setSavedAssessment] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [step, setStep] = useState('face');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    fetchMentalOptions()
      .then((data) => {
        setOptions({ ...defaultOptions, ...data });
        setForm((current) => ({
          ...current,
          gender: data.genders?.[0] || current.gender,
          occupation: data.occupations?.includes(current.occupation)
            ? current.occupation
            : data.occupations?.[0] || current.occupation,
          bmi_category: data.bmi_categories?.[0] || current.bmi_category,
        }));
      })
      .catch(() => setOptions(defaultOptions));

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const finalStyle = useMemo(
    () => levelStyles[finalResult?.level] || 'border-slate-200 bg-white text-slate-700',
    [finalResult]
  );

  const updateField = (key, value, type) => {
    setForm((current) => ({
      ...current,
      [key]: type === 'number' ? Number(value) : value,
    }));
  };

  const refreshFusion = async (mental = mentalResult, face = faceResult) => {
    const result = await buildFinalAssessment({
      mental_label: mental?.label,
      mental_confidence: mental?.confidence,
      facial_label: face?.face_detected === false ? null : face?.label,
      facial_confidence: face?.confidence,
    });
    setFinalResult(result);
    return result;
  };

  const saveCompletedAssessment = async (mental, face, final) => {
    setSavedAssessment(null);

    if (!getAuthToken()) {
      setSaveStatus('Sign in to save this assessment to your history.');
      return;
    }

    setSaveStatus('Saving assessment...');
    try {
      const saved = await createAssessment({
        mental: mental
          ? {
              label: mental.label,
              confidence: mental.confidence,
              probabilities: mental.probabilities,
            }
          : null,
        facial: face?.face_detected === false
          ? null
          : {
              label: face?.label,
              confidence: face?.confidence,
              probabilities: face?.probabilities,
            },
        final_score: final.score,
        overall_confidence: final.confidence,
        risk_level: final.level,
        recommendation: final.recommendation,
        modalities_used: [
          mental ? 'behavioural' : null,
          face?.face_detected === false ? null : 'facial',
        ].filter(Boolean),
      });
      setSavedAssessment(saved);
      setSaveStatus('Assessment saved to your history.');
    } catch (err) {
      setSaveStatus(err.message || 'Assessment result generated, but saving failed.');
    }
  };

  const runMental = async () => {
    setBusy('mental');
    setError('');
    try {
      const result = await predictMentalRisk(form);
      setMentalResult(result);
      const final = await refreshFusion(result, faceResult);
      await saveCompletedAssessment(result, faceResult, final);
      setStep('results');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 960, height: 720, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
    } catch {
      setError('Camera permission is required for facial emotion capture.');
    }
  };

  const captureFace = async () => {
    if (!videoRef.current || !cameraReady) return;

    setBusy('face');
    setError('');
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL('image/jpeg', 0.88);
      const result = await predictFacialEmotion(image);
      setFaceResult(result);
      await refreshFusion(mentalResult, result);
      if (result.face_detected) {
        setStep('mental');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const resetAssessment = () => {
    setMentalResult(null);
    setFaceResult(null);
    setFinalResult(null);
    setSavedAssessment(null);
    setSaveStatus('');
    setError('');
    setStep('face');
  };

  const steps = [
    { id: 'face', label: 'Facial Emotion', icon: ScanFace },
    { id: 'mental', label: 'Behavioural Data', icon: Brain },
    { id: 'results', label: 'Final Result', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex((item) => item.id === step);

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <BrandIcon className="h-10 w-10 rounded-xl bg-white shadow-sm ring-1 ring-slate-100" imageClassName="object-contain p-1" />
            <div>
              <h1 className="text-xl font-semibold tracking-tight">MindSense AI</h1>
              <p className="text-sm font-normal text-slate-500">Step-wise local assessment</p>
            </div>
          </div>
          <button
            onClick={resetAssessment}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            <RefreshCw className="h-4 w-4" />
            Start Over
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-5">
        <section className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const active = item.id === step;
              const done = index < currentStepIndex;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    active
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : done
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/90 text-slate-900">
                    {done ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest opacity-70">Step {index + 1}</div>
                    <div className="text-sm font-semibold">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {step === 'face' && (
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-cyan-600">Start Here</div>
                  <h2 className="text-2xl font-semibold">Capture Facial Emotion</h2>
                  <p className="text-sm font-normal text-slate-500">
                    Camera on kore clear face capture koro. Erpor behavioural data form unlock hobe.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={startCamera}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <Camera className="h-4 w-4" />
                    Camera
                  </button>
                  <button
                    onClick={captureFace}
                    disabled={!cameraReady || busy === 'face'}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy === 'face' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanFace className="h-4 w-4" />}
                    Capture Face
                  </button>
                </div>
              </div>

              <div className="aspect-video overflow-hidden rounded-lg bg-slate-950">
                <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
              </div>
            </div>

            <aside className="space-y-5">
              <ResultPanel
                icon={ScanFace}
                label="Face Emotion"
                value={faceResult?.label}
                confidence={faceResult?.confidence}
                tone="cyan"
              />
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <BarChart3 className="h-4 w-4 text-cyan-600" />
                  Facial Emotion Probability
                </div>
                <ProbabilityBars data={faceResult?.probabilities} />
                {faceResult?.face_detected && (
                  <button
                    onClick={() => setStep('mental')}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    Continue to Behavioural Data
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </aside>
          </section>
        )}

        {step === 'mental' && (
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-600">Step Two</div>
                  <h2 className="text-2xl font-semibold">Add Behavioural Data</h2>
                  <p className="text-sm font-normal text-slate-500">
                    Face signal capture hoyeche. Ekhon sleep, stress, activity ar vitals data dao.
                  </p>
                </div>
                <Brain className="h-7 w-7 text-indigo-600" />
              </div>

              <div className="space-y-5">
                {fieldGroups.map((group) => (
                  <div key={group.title}>
                    <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">{group.title}</div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                      {group.fields.map((field) => (
                        <label key={field.key} className="block">
                          <span className="mb-1 block text-xs font-medium text-slate-500">{field.label}</span>
                          {field.type === 'select' ? (
                            <select
                              value={form[field.key]}
                              onChange={(event) => updateField(field.key, event.target.value, field.type)}
                              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            >
                              {(options[field.optionKey] || []).map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="number"
                              min={field.min}
                              max={field.max}
                              step={field.step || 1}
                              value={form[field.key]}
                              onChange={(event) => updateField(field.key, event.target.value, field.type)}
                              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setStep('face')}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retake Face
                </button>
                <button
                  onClick={runMental}
                  disabled={busy === 'mental'}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {busy === 'mental' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                  Analyze Behavioural Risk
                </button>
              </div>
            </div>

            <aside className="space-y-5">
              <ResultPanel
                icon={ScanFace}
                label="Captured Face"
                value={faceResult?.label}
                confidence={faceResult?.confidence}
                tone="cyan"
              />
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 text-sm font-semibold text-slate-700">Captured signal is ready</div>
                <p className="text-sm font-normal leading-6 text-slate-500">
                  Behavioural model run korle ei face emotion result-er sathe merge kore final assessment toiri hobe.
                </p>
              </div>
            </aside>
          </section>
        )}

        {step === 'results' && (
          <section className="space-y-5">
            {error && (
            <div className="flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              {error}
            </div>
            )}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <ResultPanel
                icon={Brain}
                label="Mental Risk"
                value={mentalResult?.label}
                confidence={mentalResult?.confidence}
                tone="indigo"
              />
              <ResultPanel
                icon={ScanFace}
                label="Face Emotion"
                value={faceResult?.label}
                confidence={faceResult?.confidence}
                tone="cyan"
              />
              <div className={`rounded-lg border p-4 ${finalStyle}`}>
                <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide opacity-80">
                  <CheckCircle2 className="h-4 w-4" />
                  Final Status
                </div>
                <div className="mt-3 text-2xl font-semibold">{finalResult?.level || 'Pending'}</div>
                <div className="mt-2 text-sm font-normal opacity-75">
                  Score {finalResult ? `${finalResult.score}/100` : '0/100'}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-slate-700" />
                <h2 className="text-lg font-semibold">Signal Breakdown</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <HeartPulse className="h-4 w-4 text-indigo-600" />
                    Mental Risk Probability
                  </div>
                  <ProbabilityBars data={mentalResult?.probabilities} />
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <ScanFace className="h-4 w-4 text-cyan-600" />
                    Facial Emotion Probability
                  </div>
                  <ProbabilityBars data={faceResult?.probabilities} />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-2 text-sm font-semibold uppercase tracking-widest text-slate-400">Recommendation</div>
              <p className="text-lg font-medium text-slate-800">
                {finalResult?.recommendation || 'Run the assessment to generate a local wellness snapshot.'}
              </p>
            </div>

            {saveStatus && (
              <div className={`rounded-lg border p-4 text-sm font-medium ${
                savedAssessment
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : saveStatus.startsWith('Saving')
                    ? 'border-slate-200 bg-white text-slate-600'
                    : 'border-amber-200 bg-amber-50 text-amber-700'
              }`}>
                {saveStatus}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
