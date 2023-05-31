import React, { useEffect, useState } from 'react';
import Auth from '../auth/Auth';
import { History } from 'history';
import Post from '../types/Post';
import { deletePost, getPosts } from '../api/posts-api';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Item,
  Label
} from 'semantic-ui-react';
import Loading from './Loading';
import { dateTimeFormater } from '../utilities/dateTimeFormater';

interface MyPostsProps {
  auth: Auth;
  history: History;
}

const MyPosts = ({ auth, history }: MyPostsProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const isAuthenticated = auth.isAuthenticated();
  const idToken = auth.getIdToken();

  const onActionPostClick = (postId: string) => {
    history.push(`/posts/${postId}`);
  };

  const onPostDetailClick = (postId: string) => {
    history.push(`/posts/${postId}/detail`);
  };

  const onPostDelete = async (postId: string) => {
    try {
      await deletePost(idToken, postId);
      setPosts((prevState) =>
        prevState.filter((post) => post.postId !== postId)
      );
    } catch {
      alert('Post deletion failed');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/');
      return;
    }
    const fetchData = async () => {
      try {
        const posts = await getPosts(idToken);
        setPosts(posts);
        setIsLoading(false);
      } catch (e) {
        alert(`Failed to fetch posts: ${(e as Error).message}`);
      }
    };
    fetchData();
  }, [history, idToken, isAuthenticated]);

  const renderCreatePostInput = () => {
    return (
      <Grid.Row>
        <Grid.Column>
          <Button
            icon
            fluid
            color="red"
            onClick={() => onActionPostClick('create-post')}
          >
            <Icon name="plus" /> Create a new feed
          </Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    );
  };

  const renderButtonsAction = (post: Post) => {
    return (
      <Container textAlign="right">
        <Button
          icon
          color="blue"
          onClick={() => onActionPostClick(post.postId)}
        >
          <Icon name="pencil" />
        </Button>
        <Button icon color="red" onClick={() => onPostDelete(post.postId)}>
          <Icon name="delete" />
        </Button>
      </Container>
    );
  };

  const renderLabelStatus = (status: 'inactive' | 'active') => {
    const isActive = status === 'active';
    return (
      <Label as="a" color={isActive ? 'green' : 'grey'} ribbon="right">
        {isActive ? 'Published' : 'Hided'}
      </Label>
    );
  };

  const renderPostsList = () => {
    return (
      <Item.Group>
        {posts.map((post: Post, index: number) => {
          return (
            <>
              <Item key={post.postId}>
                <Item.Image size="medium" src={post.attachmentUrl} />
                <Item.Content>
                  <div onClick={() => onPostDetailClick(post.postId)}>
                    {renderLabelStatus(post.status)}
                    <Item.Header as="h1">{post.title}</Item.Header>
                    <Item.Description>
                      <i>{post.description}</i>
                      <p>{`${post.content.substring(0, 500)}...`}</p>
                    </Item.Description>
                  </div>
                  <Item.Meta>{dateTimeFormater(post.createdAt)}</Item.Meta>
                  <Item.Extra>{renderButtonsAction(post)}</Item.Extra>
                </Item.Content>
              </Item>
              <Divider />
            </>
          );
        })}
      </Item.Group>
    );
  };

  const renderPosts = () => (isLoading ? <Loading /> : renderPostsList());

  return (
    <div>
      <Header as="h1">My Feed</Header>
      {renderCreatePostInput()}
      {renderPosts()}
    </div>
  );
};

export default MyPosts;
