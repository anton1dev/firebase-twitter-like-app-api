import { useState, useEffect } from 'react';
import { Post as PostInterface } from '../../interfaces/Post';
import { createPost, deletePostById, getAllPostsLength, getPostsPaginated } from '../../lib/api';
import { Post } from '../Post/Post';
import { Loader } from '../Loader';
import { CreatePostModal } from '../CreatePostModal/CreatePostModal';
import { Searchbar } from '../Searchbar/Searchbar';
import { useAppSelector } from '../../app/hooks';
import { POSTS_PER_PAGE } from '../../config/variables';
import PaginationBar from '../PaginationBar/PaginationBar';

export default function Feed() {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [_feedLength, setFeedLength] = useState(1);

  const { user } = useAppSelector((state) => state.user);

  const getPostsFromApi = async (currentPage: number) => {
    const lengthOfAllPosts = await getAllPostsLength();
    setFeedLength(lengthOfAllPosts);

    const postsToRender = await getPostsPaginated(currentPage, POSTS_PER_PAGE);
    setPosts(postsToRender);

    setTotalPages(Math.ceil(lengthOfAllPosts / POSTS_PER_PAGE));

    setIsLoadingData(false);
  };

  useEffect(() => {
    getPostsFromApi(currentPage);
  }, [currentPage]);

  const handleCreatePost = async (title: string, text: string, image: File | null) => {
    try {
      setIsLoadingData(true);
      const newPost = await createPost({ title, text, image });
      setPosts([...posts, newPost]);
      await getPostsFromApi(currentPage);
      setIsLoadingData(false);
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

      <div className="is-flex is-justify-content-space-between">
        {user && (
          <button className="button is-primary mb-4 mr-4" onClick={() => setIsModalOpen(true)}>
            Create Post
          </button>
        )}
        {!isLoadingData && (
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
              {isLoadingData ? (
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
