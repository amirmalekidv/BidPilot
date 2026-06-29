import { useState } from 'react'
import CopyButton from './components/CopyButton.jsx'
import {
  PROMPT_1_PROJECT_ANALYZER,
  PROMPT_2_BID_STRATEGY,
  PROMPT_3_PROPOSAL_WRITER,
  fillPrompt,
} from './config/prompts.js'
import { callAI } from './services/ai.js'
import { extractScore } from './utils/extractScore.js'
import './App.css'

const STEPS = {
  IDLE: 'idle',
  ANALYZING: 'analyzing',
  STRATEGIZING: 'strategizing',
  READY: 'ready',
  WRITING: 'writing',
  DONE: 'done',
}

function LoadingBlock({ message }) {
  return (
    <div className="loading-block">
      <div className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}

function ResultCard({ title, score, children, copyText, copyLabel }) {
  return (
    <section className="result-card">
      <div className="result-header">
        <h2>{title}</h2>
        {score != null && (
          <span className={`score-badge score-${Math.round(score)}`}>
            {score}/10
          </span>
        )}
        {copyText && <CopyButton text={copyText} label={copyLabel} />}
      </div>
      <pre className="result-body">{children}</pre>
    </section>
  )
}

export default function App() {
  const [jobDescription, setJobDescription] = useState('')
  const [step, setStep] = useState(STEPS.IDLE)
  const [error, setError] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [score, setScore] = useState(null)
  const [strategy, setStrategy] = useState('')
  const [proposal, setProposal] = useState('')
  const [showProposalPrompt, setShowProposalPrompt] = useState(false)

  const isBusy = [STEPS.ANALYZING, STEPS.STRATEGIZING, STEPS.WRITING].includes(step)
  const canStart = jobDescription.trim().length > 0 && !isBusy

  function reset() {
    setStep(STEPS.IDLE)
    setError('')
    setAnalysis('')
    setScore(null)
    setStrategy('')
    setProposal('')
    setShowProposalPrompt(false)
  }

  async function runAnalysis() {
    setError('')
    setAnalysis('')
    setScore(null)
    setStrategy('')
    setProposal('')
    setShowProposalPrompt(false)
    setStep(STEPS.ANALYZING)

    const prompt1 = fillPrompt(PROMPT_1_PROJECT_ANALYZER, {
      JOB_DESCRIPTION: jobDescription.trim(),
    })

    const analysisResult = await callAI(
      'You are a helpful assistant.',
      prompt1,
    )

    setAnalysis(analysisResult)
    setScore(extractScore(analysisResult))

    setStep(STEPS.STRATEGIZING)

    const prompt2 = fillPrompt(PROMPT_2_BID_STRATEGY, {
      JOB_DESCRIPTION: jobDescription.trim(),
      PROJECT_ANALYSIS: analysisResult,
    })

    const strategyResult = await callAI(
      'You are a helpful assistant.',
      prompt2,
    )

    setStrategy(strategyResult)
    setStep(STEPS.READY)
    setShowProposalPrompt(true)
  }

  async function handleStart() {
    if (!canStart) return
    try {
      await runAnalysis()
    } catch (err) {
      setError(err.message || 'خطای ناشناخته')
      setStep(STEPS.IDLE)
    }
  }

  async function handleWriteProposal(confirmed) {
    if (!confirmed) {
      setShowProposalPrompt(false)
      return
    }

    setError('')
    setStep(STEPS.WRITING)
    setShowProposalPrompt(false)

    try {
      const prompt3 = fillPrompt(PROMPT_3_PROPOSAL_WRITER, {
        JOB_DESCRIPTION: jobDescription.trim(),
        PROJECT_ANALYSIS: analysis,
        BID_STRATEGY: strategy,
      })

      const proposalResult = await callAI(
        'You are a helpful assistant.',
        prompt3,
      )

      setProposal(proposalResult)
      setStep(STEPS.DONE)
    } catch (err) {
      setError(err.message || 'خطای ناشناخته')
      setStep(STEPS.READY)
      setShowProposalPrompt(true)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>BidPilot</h1>
        <p className="subtitle">دستیار هوشمند بید Freelancer.com</p>
      </header>

      <main className="app-main">
        <section className="input-card">
          <label htmlFor="job-description">توضیحات پروژه</label>
          <textarea
            id="job-description"
            rows={10}
            placeholder="توضیحات پروژه را از Freelancer.com اینجا paste کنید..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isBusy}
          />
          <div className="actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleStart}
              disabled={!canStart}
            >
              {isBusy ? 'در حال پردازش...' : 'شروع تحلیل'}
            </button>
            {(analysis || strategy || proposal) && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={reset}
                disabled={isBusy}
              >
                شروع مجدد
              </button>
            )}
          </div>
        </section>

        {error && <div className="error-box">{error}</div>}

        {step === STEPS.ANALYZING && (
          <LoadingBlock message="در حال تحلیل پروژه..." />
        )}

        {analysis && (
          <ResultCard
            title="تحلیل پروژه"
            score={score}
            copyText={analysis}
            copyLabel="کپی تحلیل"
          >
            {analysis}
          </ResultCard>
        )}

        {step === STEPS.STRATEGIZING && (
          <LoadingBlock message="در حال تعیین استراتژی بید..." />
        )}

        {strategy && (
          <ResultCard
            title="استراتژی بید"
            copyText={strategy}
            copyLabel="کپی استراتژی"
          >
            {strategy}
          </ResultCard>
        )}

        {showProposalPrompt && (
          <section className="confirm-card">
            <p>آیا پروپوزال انگلیسی نوشته شود؟</p>
            <div className="actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleWriteProposal(true)}
              >
                بله، بنویس
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleWriteProposal(false)}
              >
                خیر
              </button>
            </div>
          </section>
        )}

        {step === STEPS.WRITING && (
          <LoadingBlock message="در حال نوشتن پروپوزال انگلیسی..." />
        )}

        {proposal && (
          <ResultCard
            title="پروپوزال انگلیسی"
            copyText={proposal}
            copyLabel="کپی پروپوزال"
          >
            <span className="english-text">{proposal}</span>
          </ResultCard>
        )}
      </main>

      <footer className="app-footer">
        <p>پرامپت‌ها در <code>src/config/prompts.js</code> قابل ویرایش هستند.</p>
      </footer>
    </div>
  )
}
