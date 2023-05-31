import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPostForUser } from '../../businessLogic/posts';
import { getUserId } from '../utils';

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const postId: string = event.pathParameters.postId;
    const post = await getPostForUser(postId, userId);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ item: post })
    };
};
