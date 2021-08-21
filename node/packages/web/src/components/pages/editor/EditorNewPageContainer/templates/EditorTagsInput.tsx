import Input from '@components/molecules/form/Input';
import React, { FC, ReactNode } from 'react';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface PropsType {
  loading?: boolean;
  children?: ReactNode;
}

const EditorTagsInput: FC<PropsType> = props => {
  const [tagList, setTagList] = useState<string[]>([]);
  const [value, setValue] = useState<string>('');

  return (
    <div>
      <input
        disabled={props.loading}
        type="text"
        name="tagList"
        placeholder="Enter tags"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyPress={e => {
          if (e.key !== 'Enter') {
            return;
          }
          e.preventDefault();

          if (!value) {
            return;
          }

          setTagList(prev => {
            if (prev.indexOf(value) !== -1) {
              return prev;
            }
            return [...prev, value];
          });
          setValue('');
        }}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="w-full mt-2">
        {tagList.map(tag => (
          <div className="inline-block rounded-full py-1 px-2 text-sm text-white bg-gray-500 mx-1" key={tag}>
            <div className="flex items-center">
              <span>
                <AiOutlineClose
                  className="cursor-pointer mr-1"
                  onClick={() => setTagList(prev => prev.filter(p => p !== tag))}
                />
              </span>
              <span>{tag}</span>
            </div>
          </div>
        ))}
      </div>
      {tagList.map((tag, index) => (
        <Input key={tag} hidden type="text" name={`tagList.${index}`} value={tag} />
      ))}
    </div>
  );
};

export default EditorTagsInput;
