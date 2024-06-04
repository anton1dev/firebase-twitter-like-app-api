import { FormEvent, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, text: string, image?: string) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      let mediaUrl = '';

      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        mediaUrl = await getDownloadURL(imageRef);
      }

      onSubmit(title, text, mediaUrl);

      setTitle('');
      setText('');
      setImage(null);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <div className="box">
          <p className="title">Create a new post</p>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Title</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Text</label>
              <div className="control">
                <textarea
                  className="textarea"
                  required
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="field">
              <label className="label">Image</label>
              <div className="control">
                <input className="input" type="file" onChange={handleFileChange} />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button type="submit" className="button is-link">
                  Create Post
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  );
};
