import type {Channel} from './channel';
import type {Message} from './message';
import type {User} from './user';
import type {UserChannel} from './user-channel';

export interface ChatServer {
  users: User[];
  channels: Channel[];
  messages: Message[];
  user_channels: UserChannel[];
}
