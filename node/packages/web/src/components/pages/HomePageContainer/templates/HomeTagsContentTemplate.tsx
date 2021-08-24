import React, { FC } from 'react';
import { UseQueryResult } from 'react-query';
import styled from 'styled-components';
import tw from 'twin.macro';

interface PropsType {
  tagsResult: UseQueryResult<string[]>;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => unknown;
}

const HomeTagsContentTemplate: FC<PropsType> = props => {
  const { tagsResult } = props;
  return (
    <Container>
      <Content>
        {tagsResult.isLoading && <span>Loading tags.</span>}
        {tagsResult.isError && <span>Cannot load popular tags.</span>}
        {tagsResult.data && tagsResult.data?.length > 0 && (
          <>
            <div className="font-bold">Popular Tags</div>
            <Tags>
              {tagsResult.data?.map(tag => (
                <Tag
                  key={tag}
                  selected={props.selectedTag === tag}
                  onClick={() => props.onSelectTag(props.selectedTag !== tag ? tag : null)}
                >
                  {tag}
                </Tag>
              ))}
            </Tags>
          </>
        )}
        {tagsResult.data?.length === 0 && <span>No tags.</span>}
      </Content>
    </Container>
  );
};

export default HomeTagsContentTemplate;

const Container = styled.div`
  ${tw`w-64`}
`;

const Content = styled.div`
  ${tw`bg-gray-100 px-3 py-2`}
`;

const Tags = styled.div``;

const Tag = styled.div<{ selected: boolean }>`
  ${tw`text-xs text-white font-semibold leading-none whitespace-nowrap rounded-full inline-flex justify-center items-center cursor-pointer`}
  padding: 4px 10px;
  margin-right: 3px;
  ${({ selected }) => (selected ? tw`bg-gray-500` : tw`bg-gray-400`)}
`;
