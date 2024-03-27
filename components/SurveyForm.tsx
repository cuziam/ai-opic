interface SurveyData {
  question: string;
  options: string[];
}

export default function SurveyForm({ question, options }: SurveyData) {
  return (
    <div>
      <p className="mb-6 font-bold">{question}</p>
      <div>
        {options.map((option, index) => (
          <label key={option} className="block mb-4 text-xs">
            <input
              type="checkbox"
              name={question}
              value={option}
              className="mr-2 "
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
