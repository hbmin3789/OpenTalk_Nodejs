import React, { useEffect } from 'react';
import styled from 'styled-components';
import TagItem from './TagItem';

const TagInputBox = styled.input`
    font-size: 2rem;
    width: 50%;
`;

const Hint = styled.div`
    width: 30%;
    display: inline-block;
`;

const TagInputArea = styled.div`

`;

const Container = styled.div`

`;

const TagList = styled.div`

`;

const CreateTagButton = styled.button`
    font-size: 1rem;
`;

type Props = {
    getTagList: (arr: string[]) => void;
};

export const TagInput = ({getTagList}: Props) => {
    let [tagList, setTagList] = React.useState<Array<string>>(new Array<string>());
    let [tagInputString, setTagInputString] = React.useState<string>("");
    let tagTextBoxRef = React.useRef<HTMLInputElement>(null);
    const onAddTag = () => {
        getTagList(tagList);
        if(tagTextBoxRef.current){
            tagTextBoxRef.current.value = "";
        }
        if(tagList.find(x=>x === tagInputString)){
            alert("이미 추가된 태그입니다.");
            return;
        }
        setTagList([...tagList, tagInputString]);
    }

    return (
        <Container>
            <TagInputArea>
                <Hint>태그</Hint>
                <TagInputBox ref={tagTextBoxRef} onChange={e=>{
                    if(e.target.value.length >= 13){
                        e.target.value = e.target.value.slice(0,12);
                    }
                    setTagInputString(e.target.value);
                }}></TagInputBox>
                <CreateTagButton onClick={onAddTag}>추가</CreateTagButton>
            </TagInputArea>
            
            <TagList>
                {tagList ? tagList.map(x=><TagItem key={x}
                 onRemove={()=>setTagList(tagList.filter((s)=>s !== x))}>#{x}</TagItem>) : <div></div>}
            </TagList>
        </Container>
    
    );
};

export default TagInput;