export function MidHeader({ text }: { text: string }) {
  return <h2 className="text-2xl mt-3 mb-3 font-bold">{text}</h2>;
}
export function LowHeader({ text }: { text: string }) {
  return <h3 className="text-lg mt-2 mb-3  font-bold">{text}</h3>;
}

export function CodeBlock({ text }: { text: string }) {
  return <span className="bg-gray-300 min-w-full">{text}</span>;
}
