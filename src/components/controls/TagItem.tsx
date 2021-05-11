import React,{ReactNode} from 'react';
import styled,{keyframes} from 'styled-components';

type Props = {
    children: ReactNode;
    onRemove: ()=>void;
}

const TagHoverBorderColor = "#99dfdf";
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

const ToggleButton = styled.div`
    position: relative;
    display: inline-block;
    border-radius: 100px;
    border-style: solid;
    cursor: pointer;
    border-color: ${TagBorderColor};
    background-color: white;
    font-size: 1.5rem;
    padding: 0.4rem 2rem;
    margin-left: 1rem;
    margin-top: 1rem;
    animation-duration: 100ms;
    animation-name: ${ToggleButtonHleaveAnimation};
    &:hover{
        animation-duration: 100ms;
        animation-name: ${ToggleButtonHoverAnimation};
        animation-fill-mode: forwards;
    }
`;

const ToggleCheck = styled.input.attrs({type: 'checkbox'})`
    &:checked + ${ToggleButton} {
        animation-duration: 100ms;
        animation-name: ${ToggleButtonHoverAnimation};
        animation-fill-mode: forwards;
    }
    
`;

const ToggleButtonFrame = styled.div`

`;

const DeleteButton = styled.button`
    background-color: transparent;
    border: none;
    position: absolute;
    cursor: pointer;
    top: 50%;
    transform: translate(0,-50%);
`;

export const TagItem = ({children, onRemove}: Props) => {
    let [toggled,setToggled] = React.useState<boolean>(false);

    return(
        <ToggleButton>
            {children}
            <DeleteButton onClick={onRemove}>X</DeleteButton>
        </ToggleButton>
    );
}

export default TagItem;