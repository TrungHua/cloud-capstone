import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';
import IPost from '../models/IPost';
import IPostUpdate from '../models/IPostUpdate';

const logger = createLogger('PostsAccess');
const XAWS = AWSXRay.captureAWS(AWS);

const attachmentS3Bucket = process.env.ATTACHMENT_S3_BUCKET;
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient();
const postAtIndex = process.env.POST_AT_INDEX;
const postsCreatedAtIndex = process.env.POSTS_CREATED_AT_INDEX;
const postsTable = process.env.POSTS_TABLE;

export const getPostItemDetail = async (postId: string): Promise<IPost> => {
    logger.info(`Getting post: ${postId}`);

    const getParams = {
        TableName: postsTable,
        IndexName: postAtIndex,
        KeyConditionExpression: 'postId = :postId',
        ExpressionAttributeValues: {
            ':postId': postId,
        },
    };
    const result = await docClient.query(getParams).promise();

    return result.Items[0] as IPost;
};

export const getAllPosts = async (): Promise<IPost[]> => {
    logger.info('Getting posts');

    const params = {
        TableName: postsTable,
    };
    const result = await docClient.scan(params).promise();

    return result.Items as IPost[];
};

export const getPostById = async (
    postId: string,
    userId: string,
): Promise<IPost> => {
    logger.info(`Getting post: ${postId}`);

    const getParams = {
        TableName: postsTable,
        Key: {
            userId,
            postId,
        },
    };
    const result = await docClient.get(getParams).promise();

    return result.Item as IPost;
};

export const getPostsByUserId = async (userId: string): Promise<IPost[]> => {
    logger.info('Getting Posts');

    const params = {
        TableName: postsTable,
        IndexName: postsCreatedAtIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId,
        },
    };

    const result = await docClient.query(params).promise();

    return result.Items as IPost[];
};

export const createPostItem = async (item: object | any): Promise<IPost> => {
    logger.info('Creating Post');
    const params = {
        TableName: postsTable,
        Item: item,
    };

    await docClient.put(params).promise();

    logger.info(`Creating Post: ${{ item }}`);

    return item;
};

export const updatePostItem = async (
    postId: string,
    updatedPost: IPostUpdate,
    userId: string,
): Promise<IPost> => {
    logger.info(`Updating post: ${postId}`);

    const params = {
        TableName: postsTable,
        Key: {
            userId,
            postId,
        },
        UpdateExpression:
            'set #title = :title, #description = :description, #content = :content, #status = :status',
        ExpressionAttributeNames: {
            '#title': 'title',
            '#description': 'description',
            '#content': 'content',
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ':title': updatedPost.title,
            ':description': updatedPost.description,
            ':content': updatedPost.content,
            ':status': updatedPost.status,
        },
        ReturnValues: 'ALL_NEW',
    };

    const result = await docClient.update(params).promise();
    const item = result.Attributes;

    return item as IPost;
};

export const deletePostItem = async (postId: string, userId: string) => {
    logger.info(`Deleting post: ${postId}`);

    const params = {
        TableName: postsTable,
        Key: {
            userId,
            postId,
        },
    };

    await docClient.delete(params).promise();
    logger.info('Post is deleted!');
};

export const updatePostAttachmentUrl = async (
    postId: string,
    userId: string
): Promise<IPost> => {
    logger.info(`Editing attachment url: ${postId}`);

    const attachmentUrl: string = `https://${attachmentS3Bucket}.s3.amazonaws.com/${postId}`;

    const params = {
        TableName: postsTable,
        Key: {
            userId: userId,
            postId: postId,
        },
        UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
        ExpressionAttributeNames: {
            '#attachmentUrl': 'attachmentUrl',
        },
        ExpressionAttributeValues: {
            ':attachmentUrl': attachmentUrl,
        },
        ReturnValues: 'ALL_NEW',
    };

    const result = await docClient.update(params).promise();
    const item = result.Attributes;

    return item as IPost;
};

const PostsAccess = {
    createPostItem,
    deletePostItem,
    getPostById,
    getPostsByUserId,
    updatePostAttachmentUrl,
    updatePostItem,
};

export default PostsAccess;
