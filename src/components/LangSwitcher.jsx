import { useLang } from "../context/LangContext"

const languages = [
  { code: "en", label: "English" },
  { code: "my", label: "Myanmar" },
  { code: "zh", label: "Chinese" },
]

export default function LangSwitcher() {
  const { lang, setLang } = useLang()

  return (
    <div className="inline-flex flex-wrap gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => setLang(language.code)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            lang === language.code
              ? "bg-white text-slate-950 shadow-lg"
              : "text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          {language.label}
        </button>
      ))}
    </div>
  )
}
