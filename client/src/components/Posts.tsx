import React, { useEffect, useState } from 'react';
import { History } from 'history';
import { Header, Item } from 'semantic-ui-react';
import { getAllPosts } from '../api/posts-api';
import Auth from '../auth/Auth';
import Post from '../types/Post';
import Loading from './Loading';
import { dateTimeFormater } from '../utilities/dateTimeFormater';

interface PostsProps {
  auth: Auth;
  history: History;
}

const Posts = ({ auth, history }: PostsProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);

  const onPostDetailClick = (postId: string) => {
    history.push(`/posts/${postId}/detail`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await getAllPosts();
        setPosts(posts.filter((item) => item.status !== 'inactive'));
        setIsLoading(false);
      } catch (e) {
        alert(`Failed to fetch posts: ${(e as Error).message}`);
      }
    };
    fetchData();
  }, [auth]);

  console.log('posts', posts);

  const renderPostsList = () => {
    return (
      <Item.Group>
        {posts.map((post: Post, index: number) => {
          return (
            <Item key={post.postId}>
              <Item.Image size="medium" src={post.attachmentUrl} />
              <Item.Content>
                <div onClick={() => onPostDetailClick(post.postId)}>
                  <Item.Header as="h1">{post.title}</Item.Header>
                  <Item.Description>
                    <i>{post.description}</i>
                    <p>{`${post.content.substring(0, 500)}...`}</p>
                  </Item.Description>
                </div>
                <Item.Meta>{dateTimeFormater(post.createdAt)}</Item.Meta>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
    );
  };

  const renderPosts = () => (isLoading ? <Loading /> : renderPostsList());

  return (
    <div>
      <Header as="h1">Feed</Header>
      {renderPosts()}
    </div>
  );
};

export default Posts;
