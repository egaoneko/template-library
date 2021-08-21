import React, { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';
import tw from 'twin.macro';

interface PropsType {
  pageSize: number;
  perPages?: number;
  marginPages?: number;
  current?: number;
  onChange?: (page: number) => void;
}

const Pagination: FC<PropsType> = props => {
  const { current: currentProps } = props;
  const [current, setCurrent] = useState<number>(typeof currentProps === 'number' ? currentProps : 1);

  useEffect(() => {
    setCurrent(typeof currentProps === 'number' ? currentProps : 1);
  }, [currentProps]);

  return (
    <Container>
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <PrevNextButton
            href="#"
            disabled={current === 1}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();

              setCurrent(prev => {
                const next = prev > 1 ? prev - 1 : 1;
                props.onChange?.(next);
                return next;
              });
            }}
          >
            Previous
          </PrevNextButton>
          <PrevNextButton
            href="#"
            className="ml-3"
            disabled={current === props.pageSize}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();

              setCurrent(prev => {
                const next = prev < props.pageSize ? prev + 1 : props.pageSize;
                props.onChange?.(next);
                return next;
              });
            }}
          >
            Next
          </PrevNextButton>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
          <ReactPaginate
            previousLabel={
              <>
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            }
            nextLabel={
              <>
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            }
            breakLabel={'...'}
            pageCount={props.pageSize}
            marginPagesDisplayed={props.marginPages ?? 2}
            pageRangeDisplayed={props.perPages ?? 10}
            onPageChange={({ selected }) => {
              setCurrent(selected + 1);
              props.onChange?.(selected + 1);
            }}
            initialPage={current - 1}
            forcePage={current - 1}
            breakClassName={'pagination-page-item'}
            breakLinkClassName={'pagination-ellipsis'}
            containerClassName={'pagination'}
            pageClassName={'pagination-page-item'}
            pageLinkClassName={'pagination-page'}
            previousClassName={'pagination-previous-item'}
            previousLinkClassName={'pagination-previous'}
            nextClassName={'pagination-next-item'}
            nextLinkClassName={'pagination-next'}
            activeClassName={'pagination-current-page-item'}
            activeLinkClassName={'pagination-current-page'}
          />
        </div>
      </div>
    </Container>
  );
};

export default Pagination;

const Container = styled.div`
  ${tw`w-full select-none`}

  .pagination {
    ${tw`relative z-0 inline-flex rounded-md shadow-sm -space-x-px`}
  }

  .pagination-page-item {
    ${tw`bg-white border-gray-300 hover:bg-gray-50 border inline-flex items-center cursor-pointer`}

    &.disabled {
      ${tw`cursor-not-allowed bg-gray-200`}
      a {
        ${tw`cursor-not-allowed`}
      }
    }
  }

  .pagination-page {
    ${tw`text-gray-500 relative text-sm font-medium px-4 py-2`}
  }

  .pagination-ellipsis {
    ${tw`relative text-sm font-medium text-gray-700 px-4 py-2`}
  }

  .pagination-previous-item {
    ${tw`bg-white border-gray-300 hover:bg-gray-50 border rounded-l-md inline-flex items-center cursor-pointer`}

    &.disabled {
      ${tw`cursor-not-allowed bg-gray-200`}
      a {
        ${tw`cursor-not-allowed`}
      }
    }
  }

  .pagination-previous {
    ${tw`relative text-sm font-medium text-gray-500 px-2 py-2`}
  }

  .pagination-next-item {
    ${tw`bg-white border-gray-300 hover:bg-gray-50 border rounded-r-md inline-flex items-center cursor-pointer`}

    &.disabled {
      ${tw`cursor-not-allowed bg-gray-200`}
      a {
        ${tw`cursor-not-allowed`}
      }
    }
  }

  .pagination-next {
    ${tw`relative text-sm font-medium text-gray-500 px-2 py-2`}
  }

  .pagination-current-page-item {
    ${tw`z-10 bg-primary border-primary hover:bg-primary hover:bg-opacity-50`}
  }

  .pagination-current-page {
    ${tw`text-white`}
  }
`;

const PrevNextButton = styled.a<{ disabled?: boolean }>`
  ${tw`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50`}
  ${({ disabled }) => disabled && tw`cursor-not-allowed bg-gray-200 hover:bg-gray-200`}
`;
