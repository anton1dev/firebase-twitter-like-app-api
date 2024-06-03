import { MouseEventHandler, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Post as PostInterface } from '../../interfaces/Post';
import { deletePostById, getPostsByUser } from '../../lib/api';
import { Post } from '../Post/Post';
import { Loader } from '../Loader';
import { deleteUser } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';
import { actions as userActions } from '../../features/user/userSlice';

export const Profile = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { user, isLoading } = useAppSelector((state) => state.user);

  const [userPosts, setUserPosts] = useState<PostInterface[]>([]);

  useEffect(() => {
    if (user) {
      dispatch(userActions.setLoading(true));

      getPostsByUser(user.id)
        .then((data) => {
          setUserPosts(data);
          dispatch(userActions.setLoading(false));
        })
        .catch((error) => {
          console.error('Error fetching posts:', error);
          dispatch(userActions.setLoading(false));
        });
    }
  }, [user]);

  const handleDeleteAccount: MouseEventHandler<HTMLButtonElement> = async () => {
    dispatch(userActions.setLoading(true));

    await deleteUser();
    dispatch(userActions.clear());
    dispatch(userActions.setLoading(false));

    navigate('/');
  };

  const handleDeletePost = async (postId: string) => {
    try {
      setUserPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      await deletePostById(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      {user ? (
        <div className="is-flex is-flex-direction-column">
          <p>
            Welcome, our dear <span className="has-text-black has-text-weight-semibold">{user.nickname}</span>
          </p>{' '}
          <br />
          <div className="wrapper is-flex">
            <p>
              <button type="button" className="button is-info mb-4 mr-4">
                Upload Your New Photo
              </button>
            </p>
            <button type="button" className="button is-warning mb-4 mr-4">
              Change Your profile data
            </button>
            <button type="button" className="button is-danger mb-4" onClick={handleDeleteAccount}>
              Delete Your profile
            </button>
          </div>
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
          {!!userPosts.length ? (
            <div>
              {isLoading ? (
                <Loader />
              ) : (
                userPosts.map((post) => <Post key={post.id} post={post} onDelete={handleDeletePost} />)
              )}
            </div>
          ) : (
            <p>There are no posts from you. Let's make a first one!</p>
          )}
        </div>
      ) : (
        <div>
          <p>No user logged in</p>
        </div>
      )}
    </div>
  );
};
