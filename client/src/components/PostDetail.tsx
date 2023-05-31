import React, { useEffect, useState } from 'react';
import { History } from 'history';
import Auth from '../auth/Auth';
import { Container, Header, Image } from 'semantic-ui-react';
import Post from '../types/Post';
import { getPostDetailById } from '../api/posts-api';
import Loading from './Loading';

interface PostDetailProps {
  match: {
    params: {
      postId: string;
    };
  };
  auth: Auth;
  history: History;
}

const PostDetail = ({ match, auth, history }: PostDetailProps): JSX.Element => {
  const postId = match.params.postId;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [post, setPost] = useState<Post>({
    userId: '',
    postId: '',
    createdAt: '',
    title: '',
    description: '',
    content: '',
    status: 'inactive',
    attachmentUrl: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const post = await getPostDetailById(postId);
        setPost(post);
        setIsLoading(false);
      } catch (e) {
        alert(`Failed to fetch posts: ${(e as Error).message}`);
      }
    };
    fetchData();
  }, [postId]);

  const renderPostDetail = () => (
    <Container text textAlign="justified">
      <Header as="h1">{post.title}</Header>
      <Image src={post.attachmentUrl} size="medium" centered />
      <Header.Subheader>{post.description}</Header.Subheader>
      <p>{post.content}</p>
    </Container>
  );

  return !isLoading ? renderPostDetail() : <Loading />;
};

export default PostDetail;
