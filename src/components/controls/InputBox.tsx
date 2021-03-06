import React, { ReactNode, useRef } from 'react';
import styled,{keyframes} from 'styled-components';

const TextInput = styled.input`
    position: absolute;
    border: none;
	outline: none;
	background: none;
    width: 100%;
    font-size: 1.2rem;
    left: 0;
    top: 0; 
`;

const WaterMark = styled.div`
    position: absolute;
	top: 50%;
    font-size: 2rem;
    background: none;
	transform: translateY(-50%);
	color: #999;
	font-size: 18px;
	transition: .3s;
`;

const InputFrame = styled.div`
    position: relative;
    display: grid;
    content: '';
    width: 100%;
    height: 2rem;
    border-bottom: 2px solid #d9d9d9;
    &.focus > ${WaterMark}{
        font-size: 0.5rem;
        top: -0.5rem;
        left: 0;
    }
    &.focus::after, &.focus::before{
        position: absolute;
        width: 50%;
    }
    ::after{
        right: 50%;
    }
    ::before{
        left: 50%;
    }
    ::after, ::before{
        content: '';
        position: absolute;
        bottom: -2px;
        width: 0%;
        height: 2px;
        background-color: #aaaaaa;
        transition: .4s;
    }
`;

type Props = {
    children: ReactNode;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setValue?: {func: any};
};

export const InputBox =({children, onChange, setValue}:Props) => {
    let InputFrameRef = React.useRef<HTMLDivElement>(null);
    let InputRef = React.useRef<HTMLInputElement>(null);
    if(setValue)
        setValue.func = (str: string) => {        
            if(InputRef.current)
                InputRef.current.value = str;
        };

    React.useEffect(()=>{
        if(InputRef.current){
            let input = InputRef.current;
            input.onfocus = () => {
                InputFrameRef.current?.classList.add("focus");
            }
            input.onblur = () => {
                if(InputRef.current?.value.length === 0)
                    InputFrameRef.current?.classList.remove("focus");
            }
        }
    });

    return (
        <InputFrame ref={InputFrameRef}>
            <WaterMark>{children}</WaterMark>
            <TextInput type={"text"} ref={InputRef} onChange={onChange}></TextInput>
        </InputFrame>
    );
};

export default InputBox;