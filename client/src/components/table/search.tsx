export default function Search({
  setQuery,
}: {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div>
      <input
        type="text"
        placeholder="search"
        className="input input-bordered w-full max-w-xs"
        onChange={(e) => setQuery(e.currentTarget.value)}
      />
    </div>
  );
}
