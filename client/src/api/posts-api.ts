import { apiEndpoint } from '../config';
import Post from '../types/Post';
import CreatePostRequest from '../types/CreatePostRequest';
import UpdatePostRequest from '../types/UpdatePostRequest';
import Axios from 'axios';

export const createPost = async (
  idToken: string,
  newPost: CreatePostRequest
): Promise<Post> => {
  const response = await Axios.post(
    `${apiEndpoint}/posts`,
    JSON.stringify(newPost),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  );
  return response.data.item;
};

export const getPosts = async (idToken: string): Promise<Post[]> => {
  const response = await Axios.get(`${apiEndpoint}/posts`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  });
  return response.data.items;
};

export const getAllPosts = async (): Promise<Post[]> => {
  const response = await Axios.get(`${apiEndpoint}/posts/get-all`, {});
  return response.data.items;
};

export const patchPost = async (
  idToken: string,
  postId: string,
  updatedPost: UpdatePostRequest
): Promise<void> => {
  await Axios.patch(
    `${apiEndpoint}/posts/${postId}`,
    JSON.stringify(updatedPost),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  );
};

export const deletePost = async (
  idToken: string,
  postId: string
): Promise<void> => {
  await Axios.delete(`${apiEndpoint}/posts/${postId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  });
};

export const getUploadUrl = async (
  idToken: string,
  postId: string
): Promise<string> => {
  const response = await Axios.post(
    `${apiEndpoint}/posts/${postId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  );
  return response.data.uploadUrl;
};

export const uploadFile = async (
  uploadUrl: string,
  file: Buffer
): Promise<void> => {
  await Axios.put(uploadUrl, file);
};

export const getPostById = async (
  idToken: string,
  postId: string
): Promise<Post> => {
  const response = await Axios.get(`${apiEndpoint}/posts/${postId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  });
  return response.data.item;
};

export const getPostDetailById = async (postId: string): Promise<Post> => {
  console.log('client');
  const response = await Axios.get(`${apiEndpoint}/posts/${postId}/detail`, {});
  return response.data.item;
};
