const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-9 h-9 border-[3px]', lg: 'w-14 h-14 border-4' };

  const spinner = (
    <div
      className={`${sizes[size]} rounded-full border-gold/25 border-t-gold animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;
