export default function PageInfo({
  onClose,
  title,
  descriptions,
}: {
  onClose: () => void;
  title: string;
  descriptions: string[];
}) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-slate-900 bg-opacity-50"
      onClick={onClose}
    >
      <div className="info flex flex-col gap-4 w-3/4 bg-slate-100 p-4">
        <div className="font-bold">Guide</div>
        <ul className="block text-xs border-2 p-2">
          {descriptions.map((desc, index) => (
            <li key={index} className="pb-2">
              {desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
