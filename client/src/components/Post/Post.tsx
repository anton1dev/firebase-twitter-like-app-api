import { API_URL } from '../../api';
import { PostType } from '../../types/PostType';

export const Post = ({ post }: { post: PostType }) => {
  const { authorId, text, authorNickname } = post;

  return (
    <div className="card is-small is-centred">
      <div className="card-image">
        <figure className="image is-4by3">
          <img src="https://bulma.io/assets/images/placeholders/1280x960.png" alt="Placeholder image" />
        </figure>
      </div>
      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <figure className="image is-48x48">
              <img src="https://bulma.io/assets/images/placeholders/96x96.png" alt="Placeholder image" />
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-4">{}</p>
            <a href={`${API_URL}users/${authorId}`}>
              <p className="subtitle is-6">{authorNickname}</p>
            </a>
          </div>
        </div>

        <div className="content">
          {text}
          <br />
        </div>
      </div>
    </div>
  );
};
