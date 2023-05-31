import React, { useEffect, useState } from 'react';
import { Form, Button, Icon } from 'semantic-ui-react';
import Auth from '../auth/Auth';
import { History } from 'history';
import { createPost, getPostById, patchPost } from '../api/posts-api';
import { getUploadUrl, uploadFile } from '../api/posts-api';
import CreatePostRequest from '../types/CreatePostRequest';

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

const statusOptions = [
  { key: 'active', value: 'active', text: 'Active' },
  { key: 'inactive', value: 'inactive', text: 'Inactive' }
];

interface ActionPostProps {
  match: {
    params: {
      postId: string;
    };
  };
  auth: Auth;
  history: History;
}

const ActionPost = ({ match, auth, history }: ActionPostProps) => {
  const [file, setFile] = useState<any>(undefined);
  const [uploadStatus, setUploadStatus] = useState<UploadState>(
    UploadState.NoUpload
  );
  const [post, setPost] = useState<CreatePostRequest>({
    title: '',
    description: '',
    content: '',
    status: 'inactive'
  });
  const idToken = auth.getIdToken();
  const isAuthenticated = auth.isAuthenticated();
  const postId = match.params.postId;
  const isCreation = postId === 'create-post';

  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/');
      return;
    }
    if (!isCreation) {
      const fetchData = async () => {
        try {
          const fetchedPost = await getPostById(idToken, postId) || {};
          setPost({
            title: fetchedPost.title,
            description: fetchedPost.description,
            content: fetchedPost.content,
            status: fetchedPost.status
          });
        } catch (e) {
          alert(`Failed to fetch post: ${(e as Error).message}`);
          history.push('/');
        }
      };
      fetchData();
    }
  }, [isAuthenticated, history, idToken, isCreation, postId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) setFile(files[0]);
  };

  const handleInputChange = (event: any) => {
    const value = event.target.value;
    setPost((prevState) => ({ ...prevState, [event.target.name]: value }));
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      if (!post.title || !post.description || !post.content || !post.status) {
        alert('Inputs are empty');
        return;
      }

      if (isCreation) {
        if (!file) {
          alert('File should be selected');
          return;
        }

        const newPost = await createPost(idToken, { ...post });

        setUploadStatus(UploadState.FetchingPresignedUrl);
        const uploadUrl = await getUploadUrl(auth.getIdToken(), newPost.postId);

        setUploadStatus(UploadState.UploadingFile);
        await uploadFile(uploadUrl, file);

        alert('File was uploaded!');
      } else {
        await patchPost(auth.getIdToken(), postId, { ...post });
        alert('Updated successfully');
      }

      history.push('/');
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message);
    } finally {
      setUploadStatus(UploadState.NoUpload);
    }
  };

  const renderButton = () => {
    return (
      <div>
        {uploadStatus === UploadState.FetchingPresignedUrl && (
          <p>Uploading image metadata</p>
        )}
        {uploadStatus === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={uploadStatus !== UploadState.NoUpload}
          type="submit"
          color="green"
          icon
        >
          <Icon name="save" /> Save
        </Button>
      </div>
    );
  };
  console.log(post);
  return (
    <>
      <h1>{isCreation ? 'Create a new feed' : 'Edit your feed'}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Input title..."
            value={post.title}
            onChange={handleInputChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <input
            type="text"
            name="description"
            placeholder="Input description..."
            value={post.description}
            onChange={handleInputChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Content</label>
          <textarea
            name="content"
            rows={20}
            cols={50}
            value={post.content}
            onChange={handleInputChange}
          ></textarea>
        </Form.Field>
        <Form.Field>
          <label>Status</label>
          <select
            name="status"
            value={post.status}
            onChange={handleInputChange}
          >
            {statusOptions.map((item) => {
              return (
                <option key={item.key} value={item.value}>
                  {item.text}
                </option>
              );
            })}
          </select>
        </Form.Field>
        {isCreation && (
          <Form.Field>
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={handleFileChange}
            />
          </Form.Field>
        )}

        {renderButton()}
      </Form>
    </>
  );
};

export default ActionPost;
