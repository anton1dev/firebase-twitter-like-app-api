import { useState, useEffect } from 'react';
import { Post as PostInterface } from '../../interfaces/Post';
import { createPost } from '../../lib/posts';
import { deletePostById, getAllPostsLength, getPostsPaginated } from '../../lib/posts';
import { Post } from '../Post/Post';
import { Loader } from '../Loader';
import { CreatePostModal } from '../CreatePostModal/CreatePostModal';
import { Searchbar } from '../Searchbar/Searchbar';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { POSTS_PER_PAGE } from '../../config/variables';
import PaginationBar from '../PaginationBar/PaginationBar';
import { actions as userActions } from '../../features/user/userSlice';

export default function Feed() {
  const dispatch = useAppDispatch();

  const [hasError, setHasError] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [_feedLength, setFeedLength] = useState(1);

  const { user, isLoading } = useAppSelector((state) => state.user);

  const getPostsFromApi = async (currentPage: number) => {
    dispatch(userActions.setLoading(true));

    const lengthOfAllPosts = await getAllPostsLength();
    setFeedLength(lengthOfAllPosts);

    const postsToRender = await getPostsPaginated(currentPage, POSTS_PER_PAGE);
    setPosts(postsToRender);

    setTotalPages(Math.ceil(lengthOfAllPosts / POSTS_PER_PAGE));

    dispatch(userActions.setLoading(false));
  };

  useEffect(() => {
    getPostsFromApi(currentPage);
  }, [currentPage]);

  const handleCreatePost = async (title: string, text: string, mediaUrl?: string) => {
    try {
      dispatch(userActions.setLoading(true));
      const newPost = await createPost({ title, text, mediaUrl });
      setPosts([...posts, newPost]);
      await getPostsFromApi(currentPage);
      dispatch(userActions.setLoading(false));
    } catch (error) {
      console.error('Error creating post:', error);
      setHasError(true);
    }
  };

  const handleSearchPosts = (posts: PostInterface[]) => {
    dispatch(userActions.setLoading(true));
    setTimeout(() => {
      setPosts(posts);
      dispatch(userActions.setLoading(false));
    }, 100);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      await deletePostById(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  return (
    <>
      <h1 className="title">Feed Page</h1>

      <div className="is-flex is-justify-content-space-between mb-4">
        {user && (
          <button className="button is-primary mr-4" onClick={() => setIsModalOpen(true)}>
            Create Post
          </button>
        )}
        {!isLoading && (
          <>
            <div className="wrapper mr-4">
              <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
        <div className="is-flex is-justify-content-flex-end">
          <Searchbar onSearch={handleSearchPosts} />
        </div>
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreatePost} />

      <div className="box block table-container p-6 is-flex is-flex-direction-column is-justify-content-space-between">
        <div className="columns is-quarter is-desktop is-centred">
          <div className="column">
            <div>
              {isLoading ? (
                <Loader />
              ) : hasError ? (
                <p>Error loading posts.</p>
              ) : !posts.length ? (
                <p>No posts here</p>
              ) : (
                posts.map((post) => <Post key={post.id} post={post} onDelete={handleDeletePost} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
