import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deletePost } from '../../businessLogic/posts';
import { getUserId } from '../utils';

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const postId = event.pathParameters.postId;

    try {
        await deletePost(postId, userId);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                message: `Post ${postId} has been deleted`
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
                message: `Can not delete post: ${postId}`,
                error
            })
        };
    }
};
