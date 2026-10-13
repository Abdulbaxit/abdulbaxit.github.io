export function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: React.ReactNode;
}) {
  return (
    <>
      <h2
        data-decode
        className="text-3xl leading-none font-bold text-strong md:text-4xl"
      >
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-lg">{subtitle}</p>}
      <div className="section-rule" />
    </>
  );
}
