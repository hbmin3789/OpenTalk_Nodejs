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

type Props = {
    getTagList: (arr: string[]) => void;
};

export const TagInput = ({getTagList}: Props) => {
    let [tagList, setTagList] = React.useState<Array<string>>(new Array<string>());
    let [tagInputString, setTagInputString] = React.useState<string>("");
    let setTagInput: {func: any} = {func: ""};

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
        console.log(setTagInput);
        setTagInput.func("");
    }

    useEffect(()=>{
        getTagList(tagList);
    });

    window.onkeyup = (e: any) => {
        if(e.key === "Enter"){
            onAddTag();
        }
    };

    return (
        <Container>
            <TagInputArea>
                <InputBox setValue={setTagInput} onChange={e=>{
                    if(e.target.value.length >= 13){
                        e.target.value = e.target.value.slice(0,12);
                    }
                    setTagInputString(e.target.value);
                }}>태그</InputBox>
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