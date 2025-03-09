type PaginationProps = {
  onNextPage: () => void;
  onPrevPage: () => void;
  disable: {
    left: boolean;
    right: boolean;
  };
  nav?: {
    current: number;
    total: number;
  };
};

export const Pagination = ({
  nav,
  disable,
  onNextPage,
  onPrevPage,
}: PaginationProps) => {
  const handleNextPage = () => {
    onNextPage();
  };

  const handlePrevPage = () => {
    onPrevPage();
  };

  return (
    <div>
      <button type="button" onClick={handlePrevPage} disabled={disable.left}>
        {'<'}
      </button>
      {nav && (
        <span>
          {nav.current} / {nav.total}
        </span>
      )}
      <button type="button" onClick={handleNextPage} disabled={disable.right}>
        {'>'}
      </button>
    </div>
  );
};
