import { Subject } from "rxjs";

interface FollowState {
  id: string;
  loading?: boolean;
  followed?: boolean;
}

export const followStateSubject = new Subject<FollowState>();

export const sendFollowEvent = ({ id, loading, followed }: FollowState) => {
  followStateSubject.next({ id, loading, followed });
};
