import React, {ReactNode} from 'react';
import { User } from '../../libs/room/roomInfo';
import styled from 'styled-components';

type Props = {
    children: ReactNode;
    userList: Array<User>;
};

const UserListItem = styled.li`{

}`;

export const UserListView = ({children,userList}: Props) => {
    return(
        <div>
            {userList.map(x=><UserListItem>{x.userName}</UserListItem>)}
        </div>
    );
};

export default UserListView;