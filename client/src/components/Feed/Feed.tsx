import { useState, useEffect } from 'react';
import { PostType } from '../../types/PostType';
import { getPosts, getUsers } from '../../api';
import { Post } from '../Post/Post';
import { Loader } from '../Loader';
import { UserType } from '../../types/UserType';

export default function Feed() {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);

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

    getUsers()
      .then((data) => {
        setUsers(data);
        setIsLoadingData(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setHasError(true);
        setIsLoadingData(false);
      });
  }, []);

  return (
    <>
      <h1 className="title">Posts Page</h1>

      <div className="block">
        <div className="columns is-desktop is-centred">
          {/* <div className="column is-7-tablet is-narrow-desktop">{!isLoadingData && <PeopleFilters />}</div> */}
          <div>
            {isLoadingData && <Loader />}
            {hasError && <p>Error loading posts.</p>}

            {!isLoadingData && !hasError && posts.map((post) => <Post post={post} />)}
          </div>
          <div className="column"></div>
        </div>
      </div>
    </>
  );
}
