import { FormEvent, useState } from 'react';
import { Post as PostInterface } from '../../interfaces/Post';
import { getPostsPaginated, getPostsByQuery } from '../../lib/api';

interface SearchbarProps {
  onSearch: (searchedPosts: PostInterface[]) => void;
}

export const Searchbar: React.FC<SearchbarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchTerm.trim().length) {
      return;
    }

    try {
      const searchedPosts = await getPostsByQuery(searchTerm);

      onSearch(searchedPosts);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  const clearSearch = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setSearchTerm('');

    const allPosts = await getPostsPaginated();

    onSearch(allPosts);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="is-flex is-justify-content-space-between">
        <input
          type="text"
          className="input"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Enter your search term..."
        />
        <button type="submit" className="button ml-4">
          Search
        </button>

        <button type="button" className="button ml-4" onClick={clearSearch} disabled={!searchTerm.trim()}>
          Show All
        </button>
      </form>
    </div>
  );
};
