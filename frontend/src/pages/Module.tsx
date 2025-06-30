// src/pages/Module.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/module.css';

interface QuizItem {
  question: string;
  options: string[];
  answer: string;
}

interface ModuleData {
  title: string;
  videoUrl: string;
  quiz: QuizItem[];
}

const moduleContent: Record<string, ModuleData> = {
  "1": {
    title: "Financial Modeling",
    videoUrl: "https://www.youtube.com/embed/Ye7VeofnBfc",
    quiz: [
      {
        question: "What is the primary purpose of a financial model for a startup?",
        options: [
          "To create a visually appealing presentation for investors.",
          "To track historical financial data for tax purposes.",
          "To forecast future performance and answer key questions about runway, hiring, and funding needs.",
          "To manage the company's daily cash flow and accounts payable.",
        ],
        answer: "To forecast future performance and answer key questions about runway, hiring, and funding needs.",
      },
      {
        question: "What is the core principle of a \"driver-based\" financial model?",
        options: [
          "It assumes revenue will grow by a fixed percentage each month.",
          "It views revenue as an effect caused by specific, controllable expenses like marketing.",
          "It focuses exclusively on organic growth and ignores paid acquisition.",
          "It uses the previous month's revenue to predict the next month's expenses.",
        ],
        answer: "It views revenue as an effect caused by specific, controllable expenses like marketing.",
      },
      {
        question: "In the video's recommended color-coding system, what do \"blue\" expenses, like marketing campaigns, represent?",
        options: [
          "Revenue",
          "Costs directly proportional to revenue (like manufacturing).",
          "Sales, General, & Administrative (SG&A) expenses that drive revenue.",
          "Capital Expenditures (CAPEX) on assets with monetary value.",
        ],
        answer: "Sales, General, & Administrative (SG&A) expenses that drive revenue.",
      },
      {
        question: "What is the one revenue driver that is not directly proportional to an expense, according to the video?",
        options: [
          "Sales team commissions.",
          "Paid advertising.",
          "Server costs.",
          "Organic traffic.",
        ],
        answer: "Organic traffic.",
      },
      {
        question: "For easy control and scenario analysis, where should all the inputs and assumptions of a financial model be located?",
        options: [
          "Spread across multiple worksheets, one for each month.",
          "Hard-coded directly into the formulas.",
          "On a single, dedicated \"projections\" or \"assumptions\" page.",
          "In a separate password-protected file.",
        ],
        answer: "On a single, dedicated \"projections\" or \"assumptions\" page.",
      },
    ],
  },
  "2": {
    title: "Understand Burn Rate",
    videoUrl: "https://www.youtube.com/embed/vIth01muczA",
    quiz: [
      {
        question: "How is \"burn rate\" defined in the video?",
        options: [
          "The rate at which a company gains new customers.",
          "The total profit a company makes each month.",
          "The amount of cash a company spends monthly.",
          "The speed at which a company's stock value increases.",
        ],
        answer: "The amount of cash a company spends monthly.",
      },
      {
        question: "A company's \"runway\" refers to...",
        options: [
          "The amount of office space the company rents.",
          "The amount of time, in months, that a company's cash will last.",
          "The physical path for airplanes at an airport.",
          "The total debt the company has accumulated.",
        ],
        answer: "The amount of time, in months, that a company's cash will last.",
      },
      {
        question: "If a company has $500,000 in cash and monthly expenses of $50,000, what is its runway?",
        options: [
          "5 months",
          "12 months",
          "20 months",
          "10 months.",
        ],
        answer: "10 months.",
      },
      {
        question: "Which of the following is a way to increase a company's runway?",
        options: [
          "Increasing operating expenses.",
          "Hiring more employees without a change in revenue.",
          "Reducing operating expenses or increasing revenue.",
          "Paying off long-term debt immediately.",
        ],
        answer: "Reducing operating expenses or increasing revenue.",
      },
      {
        question: "The video uses the analogy of a bonfire to explain burn rate. What does the \"wood\" in the bonfire represent?",
        options: [
          "The company's employees.",
          "The company's products.",
          "The company's cash reserves.",
          "The company's office furniture.",
        ],
        answer: "The company's cash reserves.",
      },
    ],
  },
  "3": {
    title: "Cashflow Management",
    videoUrl: "https://www.youtube.com/embed/0yPPHZ10w6A",
    quiz: [
      {
        question: "What is the primary goal of cash flow management?",
        options: [
          "To ensure that the company is always profitable on paper.",
          "To minimize the amount of tax the company has to pay.",
          "To monitor and optimize cash, ensuring incoming cash exceeds outgoing cash.",
          "To secure the largest possible amount of investor funding.",
        ],
        answer: "To monitor and optimize cash, ensuring incoming cash exceeds outgoing cash.",
      },
      {
        question: "Which of these is a unique cash flow challenge for startups mentioned in the video?",
        options: [
          "Having too much cash in the bank.",
          "Suppliers offering overly generous credit terms.",
          "Overestimating future growth based on hunches instead of research.",
          "Investors providing an unlimited supply of money.",
        ],
        answer: "Overestimating future growth based on hunches instead of research.",
      },
      {
        question: "What is the purpose of maintaining a \"rainy day account\"?",
        options: [
          "To pay for employee vacations.",
          "To build cash reserves for unexpected events and provide a buffer.",
          "To invest in high-risk stocks.",
          "To fund marketing campaigns during peak season.",
        ],
        answer: "To build cash reserves for unexpected events and provide a buffer.",
      },
      {
        question: "Why does the video suggest outsourcing money management?",
        options: [
          "Because it is an easy task that anyone can do.",
          "To give an external company control over all financial decisions.",
          "Because it is illegal for founders to manage their own company's money.",
          "Because it is a time-consuming task that can distract an entrepreneur.",
        ],
        answer: "Because it is a time-consuming task that can distract an entrepreneur.",
      },
      {
        question: "What strategy is recommended for managing receivables (money owed by clients)?",
        options: [
          "Waiting for clients to pay whenever they are ready.",
          "Implementing late payment policies and proactively chasing overdue payments.",
          "Offering a 50% discount to any client who pays late.",
          "Ignoring overdue payments to maintain good customer relationships.",
        ],
        answer: "Implementing late payment policies and proactively chasing overdue payments.",
      },
    ],
  },
  "4": {
    title: "Unit Economics",
    videoUrl: "https://www.youtube.com/embed/AMKgcBzK7cg",
    quiz: [
      {
        question: "Unit economics can best be described as:",
        options: [
          "The total revenue of the entire company.",
          "The financial breakdown of a company's relationship with a single customer.",
          "The cost of building one unit of a physical product.",
          "The number of units sold per month.",
        ],
        answer: "The financial breakdown of a company's relationship with a single customer.",
      },
      {
        question: "What does CLTV (or LTV) stand for?",
        options: [
          "Customer Lifetime Value, the total gross profit from a single customer over their lifetime.",
          "Company Lifetime Value, the total valuation of the company.",
          "Customer Location and Territory, a marketing metric.",
          "Cost of Long-Term Value, an accounting expense.",
        ],
        answer: "Customer Lifetime Value, the total gross profit from a single customer over their lifetime.",
      },
      {
        question: "In the B2C Software example, what is a good LTV to CAC ratio that successful software products aim for?",
        options: [
          "1 or less",
          "Around 1.5",
          "3 or better",
          "10 or better",
        ],
        answer: "3 or better",
      },
      {
        question: "How can a company that loses money on its initial hardware sale still be profitable?",
        options: [
          "By selling the hardware for an even greater loss.",
          "This business model is never profitable.",
          "By offsetting the initial loss with profitable, recurring software subscriptions.",
          "By relying on government subsidies.",
        ],
        answer: "By offsetting the initial loss with profitable, recurring software subscriptions.",
      },
      {
        question: "What is a more accurate way to analyze customer retention than using a generalized churn rate?",
        options: [
          "Guessing the retention rate.",
          "Asking customers if they plan to stay.",
          "Using customer retention cohorts.",
          "Only measuring the retention of the newest customers.",
        ],
        answer: "Using customer retention cohorts.",
      },
    ],
  },
  "5": {
    title: "Cap Table Management",
    videoUrl: "https://www.youtube.com/embed/wQ9KHm9A0R4",
    quiz: [
      {
        question: "When a startup raises a new funding round, what typically happens?",
        options: [
          "The founders sell their personal shares to the new investors.",
          "The company issues new shares for the new investors, diluting all existing shareholders.",
          "The number of shares stays the same, and the price per share is just divided.",
          "The first investors are required to sell their shares to make room.",
        ],
        answer: "The company issues new shares for the new investors, diluting all existing shareholders.",
      },
      {
        question: "Why do investors often request that a stock option pool be created before their investment?",
        options: [
          "To immediately give all the new shares to the employees.",
          "To ensure the new investors' ownership percentage is not immediately diluted by it.",
          "To decrease the company's overall valuation.",
          "So they can claim the employee shares for themselves.",
        ],
        answer: "To ensure the new investors' ownership percentage is not immediately diluted by it.",
      },
      {
        question: "What is the \"strike price\" of a stock option?",
        options: [
          "The price at which the company will be acquired.",
          "A random price set on the day the employee decides to sell.",
          "The predetermined price at which an employee has the right to buy a share.",
          "The highest price the stock has ever reached.",
        ],
        answer: "The predetermined price at which an employee has the right to buy a share.",
      },
      {
        question: "What is the ultimate source of truth for who owns what in a company?",
        options: [
          "A handshake agreement.",
          "The cap table spreadsheet.",
          "A verbal confirmation from the CEO.",
          "The signed legal agreements.",
        ],
        answer: "The signed legal agreements.",
      },
      {
        question: "What is the typical percentage of a company that investors in a given funding round aim to acquire?",
        options: [
          "Less than 1%",
          "Between 10% and 20%",
          "Exactly 50%",
          "More than 75%",
        ],
        answer: "Between 10% and 20%",
      },
    ],
  },
  "6": {
    title: "Valuation Methods",
    videoUrl: "https://www.youtube.com/embed/BXUIaOMVIqc",
    quiz: [
      {
        question: "What is a SAFE, and how does it differ from a convertible note?",
        options: [
          "A SAFE is a type of debt, while a convertible note is pure equity.",
          "A SAFE is a more founder-friendly security that is not debt and has no maturity date.",
          "A SAFE always has a higher interest rate than a convertible note.",
          "There is no difference; the terms are used interchangeably.",
        ],
        answer: "A SAFE is a more founder-friendly security that is not debt and has no maturity date.",
      },
      {
        question: "What is a \"valuation cap\" in a convertible note or SAFE?",
        options: [
          "The maximum amount of money a founder can personally take from the investment.",
          "A limit on how high the company's valuation can go in the future.",
          "The maximum valuation at which an investor's money will convert into equity.",        
          "The total number of investors allowed in a funding round.",
        ],
        answer: "The maximum valuation at which an investor's money will convert into equity.",
      },
      {
        question: "What is \"founder vesting\"?",
        options: [
          "A requirement for founders to personally invest more money over time.",
          "A process where founders earn their equity over a period (e.g., 3-4 years) to ensure commitment.",
          "A vacation period mandated for founders after a funding round.",
          "The ceremony where founders receive their stock certificates.",
        ],
        answer: "A process where founders earn their equity over a period (e.g., 3-4 years) to ensure commitment.",
      },
      {
        question: "How does valuation methodology typically change when a company moves to a Series A round?",
        options: [
          "It becomes less important.",
          "It becomes more mathematical, often based on revenue multiples.",
          "It is determined solely by the founders without investor input.",
          "It is based on the number of employees the company has.",
        ],
        answer: "It becomes more mathematical, often based on revenue multiples.",
      },
      {
        question: "What are \"liquidation preferences\"?",
        options: [
          "The founders' preference for which investors they want in the company.",
          "An investor's right to get their money back (often with a multiple) before other shareholders in an exit.",
          "A list of assets the company must sell if it goes bankrupt.",
          "The order in which employees get paid their salary.",
        ],
        answer: "An investor's right to get their money back (often with a multiple) before other shareholders in an exit.",
      },
    ],
  },
  "7": {
    title: "Debt vs Equity Financing",
    videoUrl: "https://www.youtube.com/embed/cg9RgzYzrK8",
    quiz: [
      {
        question: "What is the fundamental trade-off in equity financing?",
        options: [
          "You receive capital in exchange for selling a piece of your business ownership.",
          "You must repay the capital with interest over a fixed period.",
          "You must use a credit card with high interest rates.",
          "You retain full ownership but receive less capital.",
        ],
        answer: "You receive capital in exchange for selling a piece of your business ownership.",
      },
      {
        question: "For which type of business is debt financing most suitable?",
        options: [
          "A pre-revenue startup with a high-risk idea.",
          "A business with clear visibility into profitability and the ability to make repayments.",
          "A business that wants to give up ownership to an investor.",        
          "A business that never wants to repay the money it receives.",
        ],
        answer: "A business with clear visibility into profitability and the ability to make repayments.",
      },
      {
        question: "Which type of debt financing involves borrowing a lump sum upfront and repaying it in fixed installments?",
        options: [
          "Line of Credit",
          "Invoice Financing",
          "Term Loan",
          "Merchant Cash Advance",
        ],
        answer: "Term Loan",
      },
      {
        question: "What is a major drawback of a Merchant Cash Advance?",
        options: [
          "It has the lowest interest rates of all financing types.",
          "It can be very expensive and penalize a growing business by accelerating repayment.",
          "It is only available to businesses that do not accept credit cards.",
          "It requires giving up ownership of the company.",
        ],
        answer: "It can be very expensive and penalize a growing business by accelerating repayment.",
      },
      {
        question: "Invoice or Receivables Financing is designed to solve what specific problem?",
        options: [
          "The need for long-term capital to buy a building.",
          "Covering working capital gaps when large customers have delayed payment terms.",
          "The inability to secure a traditional bank loan.",
          "The desire to avoid paying any interest on borrowed money.",
        ],
        answer: "Covering working capital gaps when large customers have delayed payment terms.",
      },
    ],
  },
  "8": {
    title: "Budgeting and Forecasting",
    videoUrl: "https://www.youtube.com/embed/yJcL4et-ClY",
    quiz: [
      {
        question: "In the video's financial model, how are the budgeted expenses from different departments pulled into the main income statement?",
        options: [          "By manually copying and pasting the numbers each month.",          
          "By using the SUMIF formula to aggregate the data automatically.",          
          "By using the VLOOKUP formula on the department name.",          
          "By linking to an external web page.",        ],        answer: "By using the SUMIF formula to aggregate the data automatically.",      },      {        question: "What is customer \"churn rate\"?",        options: [          "The rate at which you acquire new customers.",          
          "The percentage of customers who cancel their subscription each month.",          
          "The average revenue you get from each customer.",          
          "The cost to support a customer after they have paid.",        ],        answer: "The percentage of customers who cancel their subscription each month.",      },      {        question: "Why is it important to have a dedicated \"assumptions\" section in a financial model?",        options: [          "It makes the model look more complicated and professional.",          
          "It allows you to easily change key inputs (like price or CAC) and see their impact on the entire model.",          
          "It is a legal requirement for all financial spreadsheets.",          
          "It hides the most important numbers from investors.",        ],        answer: "It allows you to easily change key inputs (like price or CAC) and see their impact on the entire model.",      },      {        question: "What is the recommended budgeting philosophy mentioned at the end of the video?",        options: [          "Departments should be able to spend as much as they want.",          
          "The budget should be based on the previous year's spending, plus 10%.",          
          "Companies should determine their potential gross profit before allocating budgets to departments.",          
          "The entire budget should be allocated to the marketing department.",        ],        answer: "Companies should determine their potential gross profit before allocating budgets to departments.",      },      {        question: "What does CAC stand for?",        options: [          "Company Asset Calculation",          
          "Customer Appreciation Cost",          
          "Customer Acquisition Cost",          
          "Corporate Accounting Cycle",        ],        answer: "Customer Acquisition Cost",      },    ],  },  "9": {    title: "Key Financial KPIs",    videoUrl: "https://www.youtube.com/embed/y_rxNuDNIcw",    quiz: [      {        question: "What is the Total Addressable Market (TAM)?",        options: [          "The share of the market your company currently has.",          
          "The total revenue opportunity available for a product or service if you achieved 100% market share.",          
          "The number of customers you acquired last month.",          
          "The address of your company's main market.",        ],        answer: "The total revenue opportunity available for a product or service if you achieved 100% market share.",      },      {        question: "Why should a startup be wary of \"customer concentration\"?",        options: [          "It means you have too many customers to manage.",          
          "It means your customers are all located in one city.",          
          "It means a large portion of your revenue comes from a very small number of customers.",          
          "It means your customers are not paying attention to your product.",        ],        answer: "It means a large portion of your revenue comes from a very small number of customers.",      },      {        question: "Which metric is used to gauge customer loyalty and their willingness to recommend your product?",        options: [          "Customer Acquisition Cost (CAC)",          
          "Churn Rate",          
          "Net Promoter Score (NPS)",          
          "Total Addressable Market (TAM)",        ],        answer: "Net Promoter Score (NPS)",      },      {        question: "Which of the following is NOT one of the six key areas for KPIs mentioned in the video?",        options: [          "Opportunity",          
          "Employee Satisfaction",          
          "Customer Acquisition",          
          "Funding Health",        ],        answer: "Employee Satisfaction",      },      {        question: "What is the difference between fixed and variable costs?",        options: [          "Fixed costs change with production; variable costs do not.",          
          "Fixed costs are paid annually; variable costs are paid monthly.",          
          "There is no difference; the terms are interchangeable.",          
          "Fixed costs remain constant regardless of output; variable costs change with production.",        ],        answer: "Fixed costs remain constant regardless of output; variable costs change with production.",      },    ],  },  "10": {    title: "Exit Strategies",    videoUrl: "https://www.youtube.com/embed/LBTKgvnTyYw",    quiz: [      {        question: "What is the main message of the \"Companies are Bought, Not Sold\" principle?",        options: [          "You should actively try to sell your company from day one.",          
          "You will get a much better deal if the acquirer actively pursues your company.",          
          "It is impossible to sell a startup company.",          
          "Only publicly traded companies can be bought.",        ],        answer: "You will get a much better deal if the acquirer actively pursues your company.",      },      {        question: "How does taking on more venture capital funding impact a startup's exit options?",        options: [          "It increases the number of available exit options.",          
          "It has no impact on exit options.",          
          "It decreases the number of exit options by raising the minimum acquisition price needed for a good return.",          
          "It guarantees the company will have an IPO.",        ],        answer: "It decreases the number of exit options by raising the minimum acquisition price needed for a good return.",      },      {        question: "What is an \"aqua-hire\"?",        options: [          "An acquisition where the primary goal is to acquire the company's team, not its product or revenue.",          
          "An acquisition of a company that sells bottled water.",          
          "A merger between two equal-sized companies.",          
          "An exit where the company is acquired for over a billion dollars.",        ],        answer: "An acquisition where the primary goal is to acquire the company's team, not its product or revenue.",      },      {        question: "Which of the following is a potential advantage of going public?",        options: [          "It is a simple and inexpensive process.",          
          "It reduces the amount of administrative and reporting work.",          
          "It provides liquidity for founders and investors and allows access to large pools of capital.",          
          "It allows the company to operate in complete secrecy.",        ],        answer: "It provides liquidity for founders and investors and allows access to large pools of capital.",      },      {        question: "What should be the primary focus for founders, according to the video's conclusion?",        options: [          "Designing the perfect exit strategy from day one.",          
          "Building a large, impactful company that dominates its market.",          
          "Networking with M&A advisors exclusively.",          
          "Keeping the company small to make it easier to sell.",        ],        answer: "Building a large, impactful company that dominates its market.",      },    ],  },  "11": {    title: "Fundraising Strategies",    videoUrl: "https://www.youtube.com/embed/78Zxx3o55PM",    quiz: [      {        question: "What is the primary motivation for a venture capital investor to fund an \"explosive growth\" startup?",        options: [          "To receive a steady, guaranteed dividend payment each year.",          
          "To help a small, local business succeed.",          
          "The potential for a massive return (e.g., 300x) if the company has a successful exit.",          
          "To gain a controlling majority in a stable, profitable business.",        ],        answer: "The potential for a massive return (e.g., 300x) if the company has a successful exit.",      },      {        question: "By the time a startup reaches a Series B funding round, what is a common scenario for the founders' ownership?",        options: [          "They typically own more than 90% of the company.",          
          "They often lose the controlling majority (own less than 50%).",          
          "Their ownership percentage increases with each round.",          
          "They are required to buy out all the early investors.",        ],        answer: "They often lose the controlling majority (own less than 50%).",      },      {        question: "What is the primary focus of a pitch deck for a pre-seed funding round?",        options: [          "Detailed financial projections for the next ten years.",          
          "A proven and repeatable customer acquisition strategy.",          
          "The team's capacity and expertise to build the proposed product.",          
          "A list of potential companies to acquire.",        ],        answer: "The team's capacity and expertise to build the proposed product.",      },      {        question: "How are valuations typically determined at the seed stage and beyond?",        options: [          "They are completely arbitrary and based on a guess.",          
          "They are based on the number of employees.",          
          "They are often based on a multiple of the company's annual revenue.",          
          "They are set by a government regulatory agency.",        ],        answer: "They are often based on a multiple of the company's annual revenue.",      },      {        question: "What is the trade-off that founders must consider when raising venture capital?",        options: [          "Giving up sleep in exchange for more work.",          
          "Giving up office space in exchange for remote work.",          
          "Giving up a higher salary in exchange for more vacation days.",          
          "Giving up ownership and some control in exchange for the capital needed for massive scale.",        ],        answer: "Giving up ownership and some control in exchange for the capital needed for massive scale.",      },    ],  },  "12": {    title: "Scenario & Sensitivity Analysis",    videoUrl: "https://www.youtube.com/embed/N924D6tGOG8",    quiz: [      {        question: "What is sensitivity analysis?",        options: [          "An analysis of how sensitive your employees are to feedback.",          
          "An analysis of how different combinations of assumptions or inputs affect a key result.",          
          "An analysis of the company's financial performance last year.",          
          "A method for formatting a spreadsheet to be more colorful.",        ],        answer: "An analysis of how different combinations of assumptions or inputs affect a key result.",      },      {        question: "In the Excel demonstration, where must the desired result (operating profit) be linked before running the analysis?",        options: [          "To the bottom right corner of the table.",          
          "To a separate worksheet.",          
          "To the top left corner of the sensitivity table.",          
          "It does not need to be linked to the table.",        ],        answer: "To the top left corner of the sensitivity table.",      },      {        question: "What feature in Excel is used to perform the sensitivity analysis in the video?",        options: [          "Pivot Table",          
          "Goal Seek",          
          "Data Table (under What-If Analysis)",          
          "AutoSum",        ],        answer: "Data Table (under What-If Analysis)",      },      {        question: "What do the \"row input cell\" and \"column input cell\" refer to in the Data Table dialog box?",        options: [          "The cells where the final results of the analysis will be displayed.",          
          "The original assumption cells in the financial model that the table's inputs correspond to.",          
          "The titles for the rows and columns of the table.",          
          "The cells that define the border style of the table.",        ],        answer: "The original assumption cells in the financial model that the table's inputs correspond to.",      },      {        question: "What is the primary benefit of using a sensitivity analysis table?",        options: [          "It automatically corrects any errors in your financial model.",          
          "It allows you to quickly see how a key metric (like profit) changes under many different scenarios.",          
          "It guarantees that your business will be profitable.",          
          "It creates a forecast that is 100% accurate.",        ],        answer: "It allows you to quickly see how a key metric (like profit) changes under many different scenarios.",      },    ],  },
};

export default function Module() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mod = moduleContent[id ?? ""];

  const [answers, setAnswers] = useState<string[]>(
    mod ? Array(mod.quiz.length).fill('') : []
  );
  const [submitted, setSubmitted] = useState(false);

  if (!mod) {
    return (
      <div className="module-page">
        <p className="not-found">Module not found</p>
      </div>
    );
  }

  const score = submitted
    ? mod.quiz.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0)
    : 0;

  return (
    <div className="module-page">
      <div className="module-container">
        <button className="back-button" style={{color:'white'}}  onClick={() => navigate('..')}>
          ← Back to Learn
        </button>

        <h1 style={{color:'white', textAlign:'center'}}>{mod.title}</h1>

        <div className="video-wrapper">
          <iframe
            src={mod.videoUrl}
            title={mod.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="quiz-container">
          <h2 className="quiz-heading">Quiz</h2>
          {mod.quiz.map((q, idx) => (
            <div key={idx} className="question-block">
              <p className="question-text">{q.question}</p>
              <div className="options">
                {q.options.map(opt => (
                  <label key={opt} className="option-label">
                    <input
                      type="radio"
                      name={`q-${idx}`}
                      value={opt}
                      disabled={submitted}
                      checked={answers[idx] === opt}
                      onChange={() => {
                        const copy = [...answers];
                        copy[idx] = opt;
                        setAnswers(copy);
                      }}
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {submitted && (     <p className={`feedback ${answers[idx] === q.answer ? 'correct' : 'incorrect'}`}>
                  {answers[idx] === q.answer
                    ? 'Correct!'
                    : `Incorrect. Answer: ${q.answer}`}
                </p>
              )}
            </div>
          ))}

          {!submitted ? (
            <button className="submit-button" onClick={() => setSubmitted(true)}>
              Submit Quiz
            </button>
          ) : (
            <p className="score-text">
              You scored {score} out of {mod.quiz.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
