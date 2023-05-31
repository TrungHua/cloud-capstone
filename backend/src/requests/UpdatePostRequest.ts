/**
 * Fields in a request to update a single Post item.
 */
export default interface UpdatePostRequest {
    title: string;
    description: string;
    content: string;
    status: 'inactive' | 'active';
}
