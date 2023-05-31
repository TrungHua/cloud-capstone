import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import UpdatePostRequest from '../../requests/UpdatePostRequest';
import { getUserId } from '../utils';
import { updatePostItem } from '../../dataLayer/postsAccess';

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const postId = event.pathParameters.postId;
    const updatedPost: UpdatePostRequest = JSON.parse(event.body);
    const userId = getUserId(event);

    try {
        await updatePostItem(postId, updatedPost, userId);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                message: `Post ${postId} has been updated`
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
                message: `Can not update post: ${postId}`,
                error
            })
        };
    }
};
