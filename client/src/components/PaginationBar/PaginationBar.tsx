function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: any;
}) {
  const pages = getVisiblePages(currentPage, totalPages);
  return (
    <nav className="pagination is-centered" role="navigation" aria-label="pagination">
      <button
        className="pagination-previous"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &#x25C0;
      </button>
      <button
        className="pagination-next"
        arial-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &#x25B6;
      </button>
      <ul className="pagination-list">
        {pages.map((page) => (
          <li key={page}>
            <PageButton page={page} currentPage={currentPage} onClick={() => onPageChange(page)} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function PageButton({ page, currentPage, onClick }: { page: any; currentPage: number; onClick: () => void }) {
  if (page === currentPage) {
    return (
      <button className="pagination-link is-current" aria-label={`Page ${page}`} aria-current="page">
        {page}
      </button>
    );
  }
  if (page === '<' || page === '>') {
    return <span className="pagination-ellipsis">&hellip;</span>;
  }
  return (
    <button className="pagination-link" aria-label={`Go to page ${page}`} onClick={onClick}>
      {page}
    </button>
  );
}

function getVisiblePages(current: number, total: number) {
  if (total <= 7) {
    return range(total);
  }
  if (current < 5) {
    return [...range(5), '>', total];
  }
  if (current > total - 4) {
    return [1, '<', ...range(5, total - 4)];
  }
  return [1, '<', current - 1, current, current + 1, '>', total];
}

function range(count: any, start = 1) {
  return Array.from(new Array(count), (_x, i) => i + start);
}

export default PaginationBar;
