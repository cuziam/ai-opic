export default function SurveyForm({
  question,
  options,
}: {
  question: string;
  options: string[];
}) {
  return (
    <div>
      <p className="mb-6 font-bold">{question}</p>
      <form>
        {options.map((option, index) => (
          <label key={index} className="block mb-4 text-xs">
            <input type="radio" name="field" className="mr-2 " />
            {option}
          </label>
        ))}
      </form>
    </div>
  );
}
