import { v4 as uuidV4 } from 'uuid';
import {
    getAllPosts,
    getPostItemDetail,
    getPostById,
    getPostsByUserId,
    createPostItem,
    deletePostItem,
    updatePostItem,
    updatePostAttachmentUrl,
} from '../dataLayer/postsAccess';
import { getSignedUrl } from '../helpers/attachmentUtils';
import IPost from '../models/IPost';
import CreatePostRequest from '../requests/CreatePostRequest';
import UpdatePostRequest from '../requests/UpdatePostRequest';
import { createLogger } from '../utils/logger';

const logger = createLogger('Posts');

export const createPost = async (
    post: CreatePostRequest,
    userId: string,
): Promise<IPost> => {
    logger.info('createPost');

    return await createPostItem({
        userId,
        postId: uuidV4(),
        createdAt: new Date().toISOString(),
        ...post,
    });
};

export const updatePost = async (
    postId: string,
    updatedPost: UpdatePostRequest,
    userId: string,
): Promise<IPost> => await updatePostItem(postId, updatedPost, userId);

export const deletePost = async (
    postId: string,
    userId: string,
): Promise<void> => await deletePostItem(postId, userId);

export const createAttachmentPresignedUrl = async (
    postId: string,
    userId: string,
): Promise<string> => {
    await updatePostAttachmentUrl(postId, userId);

    return getSignedUrl(postId);
};

export const getPosts = async () => await getAllPosts();

export const getPostDetail = async (postId: string): Promise<IPost> => await getPostItemDetail(postId);

export const getPostForUser = async (
    postId: string,
    userId: string,
): Promise<IPost> => await getPostById(postId, userId);

export const getPostsForUser = async (userId: string): Promise<IPost[]> => await getPostsByUserId(userId);
