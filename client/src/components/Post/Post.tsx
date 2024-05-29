import { API_URL } from '../../api';
import { PostType } from '../../types/PostType';

export const Post = ({ post }: { post: PostType }) => {
  const { authorId, text, authorNickname, commentsScore, likesScore } = post;

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
            <div className="level-left">
              <a className="level-item">
                <span className="icon is-small is-flex is-flex-direction-row mr-4">
                  <i className="fas fa-heart mr-1"></i>
                  <span className="">{likesScore}</span>
                </span>
              </a>

              <a className="level-item">
                <span className="icon is-small is-flex is-flex-direction-row mr-4">
                  <i className="fas fa-heart mr-1"></i>
                  <span className="">{likesScore}</span>
                </span>
              </a>

              <a className="level-item">
                <span className="icon is-small is-flex is-flex-direction-row mr-4">
                  <i className="fa-regular fa-comment"></i>
                  <span className="ml-1">{commentsScore}</span>
                </span>
              </a>
            </div>
          </nav>
        </div>
      </article>
    </div>
  );
};
