/**
 * Fields in a request to create a single Post item.
 */
export default interface CreatePostRequest {
    title: string;
    description: string;
    content: string;
    status: 'inactive' | 'active';
}
