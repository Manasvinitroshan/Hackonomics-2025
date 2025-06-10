// src/pages/Module.tsx
import { useParams } from "react-router-dom";
import { useState } from "react";

// Content for each module, keyed by module id
const moduleContent: Record<string, {
  title: string;
  videoUrl: string;
  quiz: { question: string; options: string[]; answer: string }[];
}> = {
  "1": {
    title: "Financial Modeling Basics",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_1", // TODO: replace with real link
    quiz: [
      {
        question: "What is a primary purpose of a financial model?",
        options: [
          "Evaluating executive performance",
          "Forecasting future cash flows",
          "Designing organizational charts",
          "Managing social media presence",
        ],
        answer: "Forecasting future cash flows",
      },
      {
        question: "Which statement is typically included in a 3-statement model?",
        options: [
          "Balance sheet",
          "Marketing plan",
          "Product roadmap",
          "Customer support script",
        ],
        answer: "Balance sheet",
      },
    ],
  },
  "2": {
    title: "Understanding Burn Rate",
    videoUrl: "https://www.youtube.com/embed/KfEp-9CBap8",
    quiz: [
      {
        question: "What is burn rate?",
        options: [
          "Revenue growth",
          "Cash spending",
          "Profit margin",
          "Customer churn",
        ],
        answer: "Cash spending",
      },
      {
        question: "Why is burn rate important for startups?",
        options: [
          "It shows investor demand",
          "It indicates product-market fit",
          "It determines runway",
          "It predicts valuation",
        ],
        answer: "It determines runway",
      },
    ],
  },
  "3": {
    title: "Cash Flow Management",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_3",
    quiz: [
      {
        question: "Which activity is part of operating cash flow?",
        options: ["Issuing new shares", "Sales revenue", "Purchasing equipment", "Paying dividends"],
        answer: "Sales revenue",
      },
      {
        question: "Free cash flow is calculated as operating cash flow minus what?",
        options: ["Debt repayments", "Capital expenditures", "Interest expense", "Marketing costs"],
        answer: "Capital expenditures",
      },
    ],
  },
  "4": {
    title: "Unit Economics",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_4",
    quiz: [
      {
        question: "What is a key unit economics metric?",
        options: ["Customer Acquisition Cost (CAC)", "Net income margin", "Return on equity", "EBITDA multiple"],
        answer: "Customer Acquisition Cost (CAC)",
      },
      {
        question: "LTV stands for what?",
        options: ["Lifetime Value", "Loan-to-Value", "Long-Term Viability", "Liquidity Threshold Value"],
        answer: "Lifetime Value",
      },
    ],
  },
  "5": {
    title: "Cap Table Management",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_5",
    quiz: [
      {
        question: "What does a cap table track?",
        options: ["Employee schedules", "Share ownership", "Product features", "Customer segments"],
        answer: "Share ownership",
      },
      {
        question: "Which event changes a cap table?",
        options: ["Product launch", "Fundraising round", "Office relocation", "Annual review"],
        answer: "Fundraising round",
      },
    ],
  },
  "6": {
    title: "Valuation Methods",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_6",
    quiz: [
      {
        question: "Which method uses comparables?",
        options: ["Discounted Cash Flow", "Comparable Company Analysis", "Replacement Cost", "Sum-of-the-Parts"],
        answer: "Comparable Company Analysis",
      },
      {
        question: "DCF stands for what?",
        options: ["Discounted Cash Flow", "Debt to Cash Flow", "Direct Capital Funding", "Defined Cost Forecast"],
        answer: "Discounted Cash Flow",
      },
    ],
  },
  "7": {
    title: "Debt vs Equity Financing",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_7",
    quiz: [
      {
        question: "Which financing does not dilute ownership?",
        options: ["Equity", "Debt", "Convertible note", "SAFE"],
        answer: "Debt",
      },
      {
        question: "Equity financing gives investors what?",
        options: ["Interest payments", "Ownership stake", "Fixed repayment schedule", "Nothing"],
        answer: "Ownership stake",
      },
    ],
  },
  "8": {
    title: "Budgeting and Forecasting",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_8",
    quiz: [
      {
        question: "What is zero-based budgeting?",
        options: ["No budget set", "Start from zero each period", "Use last year’s budget", "Ignore capital expenses"],
        answer: "Start from zero each period",
      },
      {
        question: "Forecast accuracy is measured by what?",
        options: ["Variance", "Profit margin", "EBITDA", "Gross revenue"],
        answer: "Variance",
      },
    ],
  },
  "9": {
    title: "Key Financial KPIs",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_9",
    quiz: [
      {
        question: "Which KPI measures monthly recurring revenue?",
        options: ["MRR", "ARR", "ROI", "ROE"],
        answer: "MRR",
      },
      {
        question: "Churn rate measures what?",
        options: ["Staff turnover", "Customer loss", "Revenue growth", "Profitability"],
        answer: "Customer loss",
      },
    ],
  },
  "10": {
    title: "Exit Strategies",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_10",
    quiz: [
      {
        question: "Which is a common exit strategy?",
        options: ["IPO", "Hiring spree", "Product pivot", "Rebranding"],
        answer: "IPO",
      },
      {
        question: "Acquisition is exit via what?",
        options: ["Sale to another company", "Public offering", "Debt financing", "Grant funding"],
        answer: "Sale to another company",
      },
    ],
  },
  "11": {
    title: "Fundraising Strategies",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_11",
    quiz: [
      {
        question: "Seed funding typically comes from?",
        options: ["Institutional investors", "Friends & family", "IPO", "Secondary sale"],
        answer: "Friends & family",
      },
      {
        question: "Series A often focuses on?",
        options: ["Product-market fit", "Breakeven", "Maturity stage", "Liquidation"],
        answer: "Product-market fit",
      },
    ],
  },
  "12": {
    title: "Scenario & Sensitivity Analysis",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_12",
    quiz: [
      {
        question: "What does sensitivity analysis vary?",
        options: ["Key assumptions", "Board members", "Office locations", "Brand colors"],
        answer: "Key assumptions",
      },
      {
        question: "Scenario analysis often shows?",
        options: ["Best/worst cases", "Employee performance", "Market branding", "Website traffic"],
        answer: "Best/worst cases",
      },
    ],
  },
};

export default function Module() {
  const { id } = useParams();
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const mod = moduleContent[id ?? ""];

  if (!mod) return <div className="p-6 text-center text-gray-600">Module not found</div>;

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = mod.quiz.reduce(
    (acc, q, i) => (answers[i] === q.answer ? acc + 1 : acc),
    0
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">{mod.title}</h1>
      <div className="mb-8 aspect-video">
        <iframe
          src={mod.videoUrl}
          className="w-full h-full rounded-lg shadow-md"
          title="Module Video"
          allowFullScreen
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Quiz</h2>
        {mod.quiz.map((q, idx) => (
          <div key={idx} className="mb-6">
            <p className="mb-2 font-medium">{q.question}</p>
            {q.options.map((opt) => (
              <label key={opt} className="block mb-1">
                <input
                  type="radio"
                  name={`q-${idx}`}
                  value={opt}
                  disabled={submitted}
                  checked={answers[idx] === opt}
                  onChange={() => {
                    const updated = [...answers];
                    updated[idx] = opt;
                    setAnswers(updated);
                  }}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
            {submitted && (
              <p className={`mt-1 text-sm ${answers[idx] === q.answer ? 'text-green-600' : 'text-red-600'}`}>
                {answers[idx] === q.answer ? "Correct" : `Incorrect. Answer: ${q.answer}`}
              </p>
            )}
          </div>
        ))}

        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
          >
            Submit Quiz
          </button>
        ) : (
          <div className="mt-4 text-lg font-bold text-green-700">
            Your score: {score}/{mod.quiz.length}
          </div>
        )}
      </div>
    </div>
  );
}
