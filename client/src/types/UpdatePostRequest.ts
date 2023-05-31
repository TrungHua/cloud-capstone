export default interface UpdatePostRequest {
  title: string;
  description: string;
  content: string;
  status: 'inactive' | 'active';
}
