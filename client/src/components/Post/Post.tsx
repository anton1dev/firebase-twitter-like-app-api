import { useState } from 'react';
import { giveDislike, giveLike, updatePost } from '../../lib/posts';
import { Post as PostInterface } from '../../interfaces/Post';
import { useAppSelector } from '../../app/hooks';
import { STANDARD_AVATAR_LINK } from '../../config/variables';
import { addComment, getCommentsByPostId } from '../../lib/comments';
import { Comment } from '../../interfaces/Comment';

interface PostProps {
  post: PostInterface;
  onDelete: (postId: string) => Promise<void>;
}

export const Post = ({ post, onDelete }: PostProps) => {
  const { user } = useAppSelector((state) => state.user);

  const [currentPost, setCurrentPost] = useState(post);
  const { text, title, authorNickname, commentsScore, likesScore, likes, dislikes, id, authorId, mediaUrl } =
    currentPost;
  const [likesCount, setLikesCount] = useState<number>(likesScore);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(user ? !!likes?.includes(user.id) : false);
  const [isDisliked, setIsDisliked] = useState<boolean>(user ? !!dislikes?.includes(user.id) : false);
  const [newTitle, setNewTitle] = useState(title);
  const [newText, setNewText] = useState(text);

  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentCount, setCommentCount] = useState(commentsScore);

  const handleLike = async () => {
    try {
      if (!isLiked) {
        setLikesCount((prev) => prev + 1);
        setIsLiked(true);
        if (isDisliked) {
          setIsDisliked(false);
          setLikesCount((prev) => prev + 1);
        }
        await giveLike(id);
      } else {
        setLikesCount((prev) => prev - 1);
        setIsLiked(false);
        await giveDislike(id);
      }
    } catch (error) {
      console.error('Error while sending like:', error);
    }
  };

  const handleDislike = async () => {
    try {
      if (!isDisliked) {
        setLikesCount((prev) => prev - 1);
        setIsDisliked(true);
        if (isLiked) {
          setIsLiked(false);
          setLikesCount((prev) => prev - 1);
        }
        await giveDislike(id);
      } else {
        setIsDisliked(false);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error while sending dislike:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);

    console.log('Edit post', id);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewTitle(title);
    setNewText(text);
  };

  const handleDelete = async () => {
    try {
      await onDelete(id);
      console.log('Delete post', id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    try {
      const updatedPost = { ...currentPost, title: newTitle, text: newText };
      setCurrentPost(updatedPost);

      await updatePost(id, updatedPost);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getCommentsByPostId(post.id);
      setComments(response);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
    if (!showComments) {
      fetchComments();
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    try {
      await addComment(post.id, newComment, authorNickname);
      setComments((prev) => [...prev, { text: newComment, postId: id, authorName: authorNickname }]);
      setNewComment('');
      setCommentCount((prev) => prev + 1);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="box">
      <article className="media">
        <figure className="media-left">
          <p className="image is-64x64">
            <img className="is-rounded" src={user?.photo ? user.photo : STANDARD_AVATAR_LINK} />
          </p>
        </figure>
        <div className="media-content is-flex is-flex-direction-column">
          <div className="content">
            {isEditing ? (
              <div>
                <div className="field">
                  <label className="label">Title</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Text</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="field is-grouped">
                  <div className="control">
                    <button className="button is-link" onClick={handleSave}>
                      Save
                    </button>
                  </div>
                  <div className="control">
                    <button className="button is-light" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p>
                <a className="has-text-weight-semibold has-text-important">{authorNickname}</a>{' '}
                <small>{`@${authorNickname}`}</small>
                <br />
                <span className="has-text-weight-bold">{title}</span>
                <br />
                {text}
                {mediaUrl && <img className="image is-128x128 is-4by3" src={mediaUrl}></img>}
              </p>
            )}
          </div>
          {!isEditing && (
            <nav className="level ml-2">
              <div className="level-left is-flex is-align-items-center">
                <div className="level-item">
                  <span className="icon is-small is-flex is-flex-direction-row ">
                    <i
                      className="fas fa-regular fa-heart mr-1"
                      onClick={user ? handleLike : undefined}
                      style={user ? {} : { pointerEvents: 'none' }}
                    ></i>
                    <span className="">{likesCount}</span>
                  </span>
                </div>

                <div className="level-item">
                  <span className="icon is-small is-flex is-flex-direction-row mr-4">
                    <i
                      className={`fas ${isDisliked ? 'fa-solid' : 'fa-regular'} fa-heart-crack mr-1`}
                      onClick={user ? handleDislike : undefined}
                      style={user ? {} : { pointerEvents: 'none' }}
                    ></i>
                  </span>
                </div>

                <button className="level-item" onClick={handleToggleComments}>
                  <span className="icon is-small is-flex is-flex-direction-row mr-4">
                    <i className="fa-regular fa-comment"></i>
                    <span className="ml-1">{commentCount}</span>
                  </span>
                </button>
              </div>
            </nav>
          )}
        </div>

        <div className="media-right">
          {user?.id === authorId && !isEditing && (
            <div className="buttons">
              <button className="button is-small" onClick={handleEdit}>
                <span className="icon">
                  <i className="fas fa-edit"></i>
                </span>
              </button>
              <button className="button is-small" onClick={handleDelete}>
                <span className="icon">
                  <i className="fas fa-trash"></i>
                </span>
              </button>
            </div>
          )}
        </div>
      </article>

      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.map((comment, index) => (
              <div key={comment.text} className="comment">
                <p>
                  <strong>{`Author #${index + 1}`}</strong>: {comment.text}
                </p>
              </div>
            ))}
          </div>
          <div className="new-comment">
            <textarea
              className="textarea mb-2"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            ></textarea>
            <button className="button is-link" onClick={handleAddComment}>
              Add Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
