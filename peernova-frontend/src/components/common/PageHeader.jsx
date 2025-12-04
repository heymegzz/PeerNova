function PageHeader({ title, description, actions }) {
  if (!title && !actions) return null;

  return (
    <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        {title && (
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-gray-400 text-sm md:text-base mt-1 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}

export default PageHeader;


