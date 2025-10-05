import React from 'react';
import PropTypes from 'prop-types';

export const CitationBadge = ({ source, section, page }) => {
  const isPostgres = typeof source === 'string' && /postgres/i.test(source);
  const baseLabel = isPostgres ? 'PostgreSQL docs' : (typeof source === 'string' ? source.replace(/^.*[\\/]/, '') : 'Source');
  const metadata = [
    section && `${section}`,
    page !== undefined && `p.${page}`,
  ].filter(Boolean).join(' • ');

  return (
    <span
      className={`citation-badge ${isPostgres ? 'postgres' : 'user'}`}
      title={metadata ? `${baseLabel} • ${metadata}` : baseLabel}
    >
      {baseLabel}{metadata ? ` — ${metadata}` : ''}
    </span>
  );
};

CitationBadge.propTypes = {
  source: PropTypes.string.isRequired,
  section: PropTypes.string,
  page: PropTypes.number
};

export const CitationList = ({ citations }) => {
  if (!citations?.length) return null;

  return (
    <div className="citations">
      {citations.map((citation, index) => (
        <CitationBadge key={index} {...citation} />
      ))}
    </div>
  );
};

CitationList.propTypes = {
  citations: PropTypes.arrayOf(
    PropTypes.shape({
      source: PropTypes.string.isRequired,
      section: PropTypes.string,
      page: PropTypes.number
    })
  )
};