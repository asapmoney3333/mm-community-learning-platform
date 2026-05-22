import Callout from "./Callout"
import { Glossary, GlossaryItem } from "./Glossary"
import { ExternalImage, YouTubeEmbed } from "./Media"
import { StatCard, StatGrid } from "./StatGrid"

function createHeading(tagName, className) {
  return function Heading({ children }) {
    const Tag = tagName
    return <Tag className={className}>{children}</Tag>
  }
}

function Paragraph({ children }) {
  return <p className="mt-4 text-base leading-8 text-slate-300">{children}</p>
}

function UnorderedList({ children }) {
  return <ul className="mt-4 list-disc space-y-3 pl-6 text-slate-300">{children}</ul>
}

function OrderedList({ children }) {
  return <ol className="mt-4 list-decimal space-y-3 pl-6 text-slate-300">{children}</ol>
}

function ListItem({ children }) {
  return <li className="pl-1 leading-7">{children}</li>
}

function Strong({ children }) {
  return <strong className="font-semibold text-white">{children}</strong>
}

function InlineCode({ children }) {
  return (
    <code className="rounded-md border border-white/10 bg-white/8 px-1.5 py-0.5 text-sm text-cyan-100">
      {children}
    </code>
  )
}

function HorizontalRule() {
  return <hr className="my-8 border-white/10" />
}

export const mdxComponents = {
  h1: createHeading("h1", "text-3xl font-black tracking-tight text-white"),
  h2: createHeading("h2", "mt-10 text-2xl font-bold text-white"),
  h3: createHeading("h3", "mt-8 text-xl font-semibold text-white"),
  p: Paragraph,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  strong: Strong,
  code: InlineCode,
  hr: HorizontalRule,
  Callout,
  ExternalImage,
  Glossary,
  GlossaryItem,
  StatGrid,
  StatCard,
  YouTubeEmbed,
}
