import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import CreatePostRequest from '../../requests/CreatePostRequest';
import { getUserId } from '../utils';
import { createPost } from '../../businessLogic/posts';

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const newPost: CreatePostRequest = JSON.parse(event.body);

    const userId = getUserId(event);

    try {
        const post = await createPost(newPost, userId);

        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
              },
            body: JSON.stringify({
                item: post
            })
        };
    } catch (error) {
        return {
            statusCode: 403,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
              },
            body: JSON.stringify({
                message: 'Can not create a new feed',
                error
            })
        };
    }
};
