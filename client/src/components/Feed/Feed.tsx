import { useState, useEffect } from 'react';
import { Post as PostInterface } from '../../interfaces/Post';
import { getPosts, createPost, wait } from '../../lib/api';
import { Post } from '../Post/Post';
import { Loader } from '../Loader';
import { CreatePostModal } from '../CreatePostModal/CreatePostModal';
import { Searchbar } from '../Searchbar/Searchbar';

export default function Feed() {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  const handleCreatePost = async (title: string, text: string, image: File | null) => {
    try {
      const newPost = await createPost({ title, text, image });
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.error('Error creating post:', error);
      setHasError(true);
    }
  };

  const handleSearchPosts = (posts: PostInterface[]) => {
    setIsLoadingData(true);
    setTimeout(() => {
      setPosts(posts);
      setIsLoadingData(false);
    }, 100);
  };

  return (
    <>
      <h1 className="title">Feed Page</h1>

      <div className="is-flex is-justify-content-space-between">
        <button className="button is-primary mb-4" onClick={() => setIsModalOpen(true)}>
          Create Post
        </button>
        <Searchbar onSearch={handleSearchPosts} />
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreatePost} />

      <div className="box block table-container p-6 is-flex is-flex-direction-column is-justify-content-space-between">
        <div className="columns is-quarter is-desktop is-centred">
          <div className="column">
            <div>
              {isLoadingData ? (
                <Loader />
              ) : hasError ? (
                <p>Error loading posts.</p>
              ) : !posts.length ? (
                <p>No posts here</p>
              ) : (
                posts.map((post) => <Post key={post.id} post={post} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
