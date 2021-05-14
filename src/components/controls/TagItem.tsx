import React,{ReactNode} from 'react';
import styled,{keyframes} from 'styled-components';

type Props = {
    children: ReactNode;
    onRemove?: ()=>void;
    deleteBtnVisible?: boolean;
}

const TagHoverBorderColor = "#666666";
const TagBorderColor = "#999999";

const ToggleButtonHoverAnimation = keyframes`
    0%{
        border-color: ${TagBorderColor};
    }
    100%{
        border-color: ${TagHoverBorderColor};
    }
`;
const ToggleButtonHleaveAnimation = keyframes`
    0%{
        border-color: ${TagHoverBorderColor};
    }
    100%{
        border-color: ${TagBorderColor};
    }
`;

const DeleteButton = styled.button`
    background-color: transparent;
    border: none;
    position: absolute;
    cursor: pointer;
    right: 0.2rem;
    top: 50%;
    transform: translate(0,-50%);
    &:hover{
        color: red;
    }
`;

export const TagItem = ({deleteBtnVisible, children, onRemove}: Props) => {
    let [toggled,setToggled] = React.useState<boolean>(false);

    const ToggleButton = styled.div`
    position: relative;
    display: inline-block;
    border-radius: 100px;
    border-style: solid;
    cursor: pointer;
    border-color: ${TagBorderColor};
    background-color: white;
    padding: 0.3rem 1.2rem;
    padding-bottom: 0.5rem;
    padding-left: ${(deleteBtnVisible) ? "0.6rem" : "1rem"};
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    animation-duration: 100ms;
    animation-name: ${ToggleButtonHleaveAnimation};
    &:hover{
        animation-duration: 100ms;
        animation-name: ${ToggleButtonHoverAnimation};
        animation-fill-mode: forwards;
    }
`;

    return(
        <ToggleButton>
            #{children}
            {deleteBtnVisible ? <DeleteButton onClick={onRemove}>X</DeleteButton> :
             <div></div>}
        </ToggleButton>
    );
}

export default TagItem;