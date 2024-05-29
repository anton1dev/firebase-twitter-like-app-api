import { useState, useEffect } from 'react';
import { PostType } from '../../types/PostType';
import { getPosts } from '../../lib/api';
import { Post } from '../Post/Post';
import { Loader } from '../Loader';

export default function Feed() {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    setIsLoadingData(true);
    getPosts()
      .then((data) => {
        setPosts(data);
        setIsLoadingData(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setHasError(true);
        setIsLoadingData(false);
      });
  }, []);

  return (
    <>
      <h1 className="title">Feed Page</h1>

      <div className="box block table-container p-6 is-flex is-flex-direction-column is-justify-content-space-between">
        <div className="columns is-quarter is-desktop is-centred ">
          {/* <div className="column is-7-tablet is-narrow-desktop">{!isLoadingData && <PeopleFilters />}</div> */}

          <div className="column">
            <div>
              {isLoadingData && <Loader />}
              {hasError && <p>Error loading posts.</p>}

              {!isLoadingData && !hasError && posts.map((post) => <Post post={post} />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
