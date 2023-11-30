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
    <div className=" dropdown ">
      <label
        htmlFor="theme-button"
        tabIndex={0}
        className="btn btn-ghost rounded-btn"
      >
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
      </label>
      <ul
        id="theme-button"
        className="menu dropdown-content z-[1] p-2  bg-base-100 w-32 mt-4 gap-1"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {themes.map((theme) => (
          <li
            data-value={theme}
            key={theme}
            data-theme={theme}
            className="bg-transparent"
            onClick={(ev) => {
              ev.stopPropagation();
            }}
          >
            <button
              type="button"
              onClick={(ev) => handleClick(ev, theme)}
              className="cursor-pointer btn btn-sm btn-primary hover:btn-secondary"
            >
              {theme}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
