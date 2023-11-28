export default function Stat({ label, info }: { label: string; info: string }) {
  return (
    <div className="flex flex-col cursor-default">
      <p className="text-xs md:text-base opacity-70">{label}</p>
      <p className="text-xs md:text-base">{info}</p>
    </div>
  );
}
