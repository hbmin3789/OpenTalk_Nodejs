import React, { useEffect } from 'react';
import styled from 'styled-components';
import TagItem from './TagItem';
import InputBox from '../controls/InputBox';

const TagInputArea = styled.div`
    display: flex;
`;

const Container = styled.div`
    flex-grow: 1;
`;

const TagList = styled.div`
    font-size: 1rem;
    text-align: left;
`;

const CreateTagButton = styled.button`
    font-size: 1rem;
    flex-grow: 1;
    width: 5rem;
    margin: 0.5rem;
    border: none;
    border-radius: 3px;
    background-color: #666666;
    color: white;
    border-width: thin;
    cursor: pointer;
    &:hover{
        box-shadow: 1px 1px 2px black;
    }
    
`;

const Description = styled.div`
    font-size: 0.6rem;
    color: gray;
    margin-top: 0.7rem;
    margin-left: auto;
    margin-right: 0;
    margin-bottom: 2rem;
    text-align: left;
`;


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
    getTagList: (arr: string[]) => void;
};

export const TagInput = ({getTagList}: Props) => {
    let InputFrameRef = React.useRef<HTMLDivElement>(null);
    let InputRef = React.useRef<HTMLInputElement>(null);
    let [tagList, setTagList] = React.useState<Array<string>>(new Array<string>());
    let [tagInputString, setTagInputString] = React.useState<string>("");

    const onAddTag = () => {
        if(tagInputString === ""){
            return;
        }
        if(tagList.find(x=>x === tagInputString)){
            alert("이미 추가된 태그입니다.");
            return;
        }

        setTagList([...tagList, tagInputString]);
        setTagInputString("");
        if(InputRef.current)
            InputRef.current.value = "";
    }

    useEffect(()=>{
        getTagList(tagList);
    });

    window.onkeyup = (e: any) => {
        if(e.key === "Enter"){
            onAddTag();
        }
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
        <Container>
            <TagInputArea>
                <InputFrame ref={InputFrameRef}>
                    <WaterMark>태그</WaterMark>
                    <TextInput ref={InputRef} type={"text"} onChange={e=>{
                        if(e.target.value.length >= 13){
                            e.target.value = e.target.value.slice(0,12);
                        }
                        setTagInputString(e.target.value);
                    }}></TextInput>
                </InputFrame>
                <CreateTagButton onClick={onAddTag}>추가</CreateTagButton>
            </TagInputArea>
            <Description>
                엔터키로도 추가할 수 있습니다.
            </Description>
            <TagList>
                {tagList ? tagList.map(x=><TagItem key={x} deleteBtnVisible={true}
                 onRemove={()=>setTagList(tagList.filter((s)=>s !== x))}>{x}</TagItem>) : <div></div>}
            </TagList>
        </Container>
    
    );
};

export default TagInput;