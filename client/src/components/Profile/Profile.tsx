import { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { Post as PostInterface } from '../../interfaces/Post';
import { getPostsByUser } from '../../lib/api';
import { Post } from '../Post/Post';
import { Loader } from '../Loader';

export const Profile = () => {
  const [userPosts, setUserPosts] = useState<PostInterface[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      getPostsByUser(user.id)
        .then((data) => {
          setUserPosts(data);
          setIsLoadingData(false);
        })
        .catch((error) => {
          console.error('Error fetching posts:', error);
        });
    }
  }, [user]);

  return (
    <div>
      {user ? (
        <div className="is-flex is-flex-direction-column">
          <p>
            Welcome, our dear <span className="has-text-black has-text-weight-semibold">{user.nickname}</span>
          </p>{' '}
          <br />
          {!user.photo && (
            <p>
              <button type="button" className="button is-info mb-4">
                Upload Your Photo
              </button>
            </p>
          )}
          <p>
            <span className="has-text-weight-semibold">Your Email:</span> {user.email}
          </p>{' '}
          <br />
          <p>
            <span className="has-text-weight-semibold">Your Name:</span> {user.name}
          </p>{' '}
          <br />
          <p>
            <span className="has-text-weight-semibold">Your Surname:</span> {user.surname}
          </p>{' '}
          <br />
          <p>
            <span className="has-text-weight-semibold">Your Nickname:</span> {user.nickname}
          </p>{' '}
          <br />
          <p>
            <span className="has-text-weight-semibold">Posts from You:</span>
          </p>{' '}
          <br />
          <div>{isLoadingData ? <Loader /> : userPosts.map((post) => <Post key={post.id} post={post} />)}</div>
        </div>
      ) : (
        <div>
          <p>No user logged in</p>
        </div>
      )}
    </div>
  );
};
