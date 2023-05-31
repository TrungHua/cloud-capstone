export default interface Post {
  userId: string;
  postId: string;
  createdAt: string;
  title: string;
  description: string;
  content: string;
  status: 'inactive' | 'active';
  attachmentUrl?: string;
}
