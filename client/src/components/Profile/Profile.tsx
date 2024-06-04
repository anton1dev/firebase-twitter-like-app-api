import { MouseEventHandler, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Post as PostInterface } from '../../interfaces/Post';
import { deletePostById, getPostsByUser } from '../../lib/posts';
import { Post } from '../Post/Post';
import { Loader } from '../Loader';
import { deleteUser } from '../../lib/user';
import { useNavigate } from 'react-router-dom';
import { actions as userActions } from '../../features/user/userSlice';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { updateUserPhoto } from '../../lib/user';

export const Profile = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { user, isLoading } = useAppSelector((state) => state.user);

  const [userPosts, setUserPosts] = useState<PostInterface[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpdatePhoto = async () => {
    if (!selectedFile || !user) {
      return;
    }

    dispatch(userActions.setLoading(true));

    try {
      const fileRef = ref(storage, `users/${user.id}/${selectedFile.name}`);
      await uploadBytes(fileRef, selectedFile);
      const photoURL = await getDownloadURL(fileRef);

      await updateUserPhoto(user.id, { photo: photoURL });
      dispatch(userActions.setUserPhoto(photoURL));
    } catch (error) {
      console.error('Error updating photo:', error);
    } finally {
      dispatch(userActions.setLoading(false));
      setSelectedFile(null);
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
          <div className="wrapper is-flex is-flex-direction-row is-justify-content-flex-start">
            <div className="field is-fullwidth is-flex is-flex-direction-row mb-0">
              <div className="file is-info mb-4 mr-4">
                <label className="file-label">
                  <input className="button file-input" type="file" onChange={handleFileChange} />
                  <span className="file-cta is-fullwidth">
                    <span className="file-label">Upload Your New Photo</span>
                  </span>
                </label>
              </div>
              {selectedFile && (
                <button type="button" onClick={handleUpdatePhoto} className="button is-info mb-4 mr-4">
                  Update Photo
                </button>
              )}
            </div>

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
