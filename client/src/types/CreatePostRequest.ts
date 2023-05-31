export default interface CreatePostRequest {
  title: string;
  description: string;
  content: string;
  status: 'inactive' | 'active';
}
