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
    display: flex;
`;

const Container = styled.div`

`;

const TagList = styled.div`

`;

const CreateTagButton = styled.button`
    font-size: 1rem;
    background-color: #88ff88;
    border-width: thin;
    cursor: pointer;
    &:hover{
        background-color: #66ff66;
    }
    
`;

type Props = {
    getTagList: (arr: string[]) => void;
};

export const TagInput = ({getTagList}: Props) => {
    let [tagList, setTagList] = React.useState<Array<string>>(new Array<string>());
    let [tagInputString, setTagInputString] = React.useState<string>("");
    let tagTextBoxRef = React.useRef<HTMLInputElement>(null);
    const onAddTag = () => {
        let line = 0;
        let curLine = 0;
        tagList.forEach(x=>{
            let length = x.length;

            curLine += length + 1;
            if(curLine === 16){
                curLine = 0;
                line++;
                return;
            }
            if(curLine + length > 16){
                curLine = length + 1;
                line++;
            }
        });

        if(curLine + tagInputString.length > 16){
            curLine = 0;
            line++;
            curLine += tagInputString.length + 1;
        }

        console.log(line);
        

        if(line > 4){
            alert("태그를 더 추가할 수 없습니다.");
            return;
        }
        if(tagInputString === ""){
            return;
        }
        if(tagTextBoxRef.current){
            tagTextBoxRef.current.value = "";
        }
        if(tagList.find(x=>x === tagInputString)){
            alert("이미 추가된 태그입니다.");
            return;
        }
        setTagList([...tagList, tagInputString]);
        setTagInputString("");
    }

    useEffect(()=>{
        getTagList(tagList);
    });

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