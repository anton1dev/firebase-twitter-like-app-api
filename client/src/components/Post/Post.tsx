import { useState } from 'react';
import { giveDislike, giveLike } from '../../lib/api';
import { PostType } from '../../types/PostType';
import { useAppSelector } from '../../app/hooks';

export const Post = ({ post }: { post: PostType }) => {
  const { user } = useAppSelector((state) => state.user);

  const { text, authorNickname, commentsScore, likesScore, likes, dislikes, id } = post;
  const [likesCount, setLikesCount] = useState<number>(likesScore);
  const [commentsCount] = useState<number>(commentsScore);
  const [isLiked, setIsLiked] = useState<boolean>(user ? !!likes?.includes(user.id) : false);
  const [isDisliked, setIsDisliked] = useState<boolean>(user ? !!dislikes?.includes(user.id) : false);

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
      console.log('Like sent successfully');
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
      console.log('Dislike sent successfully');
    } catch (error) {
      console.error('Error while sending dislike:', error);
    }
  };

  return (
    <div className="box">
      <article className="media">
        <figure className="media-left">
          <p className="image is-64x64">
            <img className="is-rounded" src="https://bulma.io/assets/images/placeholders/128x128.png" />
          </p>
        </figure>
        <div className="media-content is-flex is-flex-direction-column">
          <div className="content">
            <p>
              <strong>{authorNickname}</strong> <small>{`@${authorNickname}`}</small>
              <br />
              {text}
            </p>
          </div>
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

              <a className="level-item">
                <span className="icon is-small is-flex is-flex-direction-row mr-4">
                  <i className="fa-regular fa-comment"></i>
                  <span className="ml-1">{commentsCount}</span>
                </span>
              </a>
            </div>
          </nav>
        </div>
      </article>
    </div>
  );
};
