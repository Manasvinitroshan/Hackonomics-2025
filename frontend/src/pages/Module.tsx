// src/pages/Module.tsx
import { useParams } from "react-router-dom";
import { useState } from "react";

const moduleContent: Record<string, {
  title: string;
  videoUrl: string;
  quiz: { question: string; options: string[]; answer: string }[];
}> = {
  "1": {
    title: "Understanding Burn Rate",
    videoUrl: "https://www.youtube.com/embed/KfEp-9CBap8",
    quiz: [
      {
        question: "What is burn rate?",
        options: ["Revenue growth", "Cash spending", "Profit margin", "Customer churn"],
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
