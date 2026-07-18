const SectionDivider = ({ label }) => (
  <div className="flex items-center justify-center gap-4 my-2">
    <span className="hairline flex-1" />
    {label && <span className="text-xs uppercase tracking-widest text-gold whitespace-nowrap">{label}</span>}
    <span className="hairline flex-1" />
  </div>
);

export default SectionDivider;
