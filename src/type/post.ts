import type {User} from '@/type/user'
export interface Post {
  id: number;
  userID: number;
  user: User;
  type: number;
  title: string;
  content: string;
  cover: string;
  video: string;
  part: number;
  isAudit: number;
  createdAt: string;  // ISO时间字符串
}