type HeadingProps = {
  title: string
  description: string
}

export default function Heading({ title, description }: HeadingProps) {
  return (
    <div>
      <h2 className="font-semibold">{title}</h2>
      <p className="text-foreground/40 text-sm">{description}</p>
    </div>
  )
}
