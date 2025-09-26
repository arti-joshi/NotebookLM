import { useState, useEffect } from 'react';
import { Search, Book, ChevronRight, ChevronDown } from 'lucide-react';

const TOC_STRUCTURE = [
  {
    title: 'Preface',
    page: 1,
    sections: [
      { title: 'What is PostgreSQL?', page: 2 },
      { title: 'A Brief History of PostgreSQL', page: 3 },
      { title: 'Conventions', page: 4 },
      { title: 'Further Information', page: 5 },
      { title: 'Bug Reporting Guidelines', page: 6 }
    ]
  },
  {
    title: 'Tutorial',
    page: 7,
    sections: [
      { title: 'Getting Started', page: 8 },
      { title: 'The SQL Language', page: 15 },
      { title: 'Advanced Features', page: 25 }
    ]
  },
  {
    title: 'SQL Language',
    page: 35,
    sections: [
      { title: 'SQL Syntax', page: 36 },
      { title: 'Data Definition', page: 45 },
      { title: 'Data Manipulation', page: 60 }
    ]
  },
  {
    title: 'Server Administration',
    page: 80,
    sections: [
      { title: 'Installation', page: 81 },
      { title: 'Server Configuration', page: 90 },
      { title: 'Client Authentication', page: 105 }
    ]
  }
];

function PostgresTableOfContents({ onNavigate, currentPage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChapters, setExpandedChapters] = useState({});
  const [filteredTOC, setFilteredTOC] = useState(TOC_STRUCTURE);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredTOC(TOC_STRUCTURE);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = TOC_STRUCTURE.reduce((acc, chapter) => {
      const matchingSections = chapter.sections.filter(
        section => section.title.toLowerCase().includes(searchLower)
      );

      if (matchingSections.length > 0 || chapter.title.toLowerCase().includes(searchLower)) {
        acc.push({
          ...chapter,
          sections: matchingSections
        });
      }
      return acc;
    }, []);

    setFilteredTOC(filtered);
  }, [searchTerm]);

  const toggleChapter = (title) => {
    setExpandedChapters(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table of Contents */}
      <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
        {filteredTOC.map((chapter) => (
          <div key={chapter.title} className="space-y-2">
            <button
              onClick={() => toggleChapter(chapter.title)}
              className="w-full flex items-center justify-between text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center space-x-2">
                <Book className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-medium">{chapter.title}</span>
              </div>
              {expandedChapters[chapter.title] ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            
            {expandedChapters[chapter.title] && (
              <div className="ml-6 space-y-1">
                {chapter.sections.map((section) => (
                  <button
                    key={section.title}
                    onClick={() => onNavigate(section.page)}
                    className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      currentPage === section.page
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {section.title}
                    <span className="text-xs text-gray-400 ml-2">p.{section.page}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostgresTableOfContents;