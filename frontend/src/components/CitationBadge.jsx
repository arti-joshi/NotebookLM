import React from 'react';
import PropTypes from 'prop-types';

export const CitationBadge = ({ source, section, page }) => {
  const label = source === 'postgres-official' ? 'PostgreSQL docs' : 'User upload';
  const metadata = [
    section && `${section}`,
    page !== undefined && `p.${page}`,
  ].filter(Boolean).join(' • ');

  return (
    <span
      className={`citation-badge ${source === 'postgres-official' ? 'postgres' : 'user'}`}
      title={metadata ? `${label} • ${metadata}` : label}
    >
      {label}
    </span>
  );
};

CitationBadge.propTypes = {
  source: PropTypes.oneOf(['postgres-official', 'user-upload']).isRequired,
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
      source: PropTypes.oneOf(['postgres-official', 'user-upload']).isRequired,
      section: PropTypes.string,
      page: PropTypes.number
    })
  )
};