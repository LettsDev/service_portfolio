import React from "react";

export const themes = [
  "light",
  "dark",
  "dracula",
  "cyberpunk",
  "pastel",
  "cupcake",
  "nord",
];

export default function ThemePicker({
  setTheme,
}: {
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}) {
  function handleClick(
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    theme: string
  ) {
    ev.stopPropagation();
    setTheme(theme);
    localStorage.setItem("theme", theme);
  }

  return (
    <div className=" dropdown dropdown-end " title="change theme">
      <div role="button" tabIndex={0} className="btn btn-ghost">
        Theme
        <svg
          width="12px"
          height="12px"
          className="h-2 w-2 fill-current opacity-60 inline-block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <div
        id="theme-button"
        tabIndex={0}
        className="dropdown-content bg-base-200 text-base-content rounded-box top-px h-[28.6rem] max-h-[calc(100vh-10rem)] w-56 overflow-y-auto border border-white/5 shadow-2xl outline outline-1 outline-black/5 mt-20"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="p-3 flex flex-col gap-3">
          {themes.map((theme) => (
            <button
              className="outline-base-content text-start outline-offset-4 rounded-btn p-3 font-sans bg-base-100 text-base-content"
              data-set-theme={theme}
              onClick={(ev) => handleClick(ev, theme)}
              data-theme={theme}
              key={theme}
            >
              <span className="grid grid-cols-6">
                <span className="">{theme}</span>
                <span className="flex  gap-1 h-full shrink-0 col-start-6">
                  <span className="bg-primary w-2 rounded-badge"></span>
                  <span className="bg-secondary w-2 rounded-badge"></span>
                  <span className="bg-accent w-2 rounded-badge"></span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
