import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createAttachmentPresignedUrl } from '../../businessLogic/posts';
import { getUserId } from '../utils';

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const postId = event.pathParameters.postId;
    const userId = getUserId(event);

    try {
        const uploadUrl = await createAttachmentPresignedUrl(postId, userId);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                uploadUrl
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
                message: 'Error when generating upload url',
                error
            })
        };
    }
};
