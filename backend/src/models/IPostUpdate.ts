export default interface IPostUpdate {
    title: string;
    description: string;
    content: string;
    status: 'inactive' | 'active';
}
