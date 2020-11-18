import React from 'react';
import { Select } from 'theme-ui';

const SingleSelect = (props: {
  options?: {
    id: string;
    label: string;
  }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}): JSX.Element => {
  return (
    <div>
      <Select
        onChange={props.onChange}
        sx={{
          border: 0,
          borderBottom: '1px solid white',
          borderRadius: 0,
          py: 3,
          px: 2,
          bg: 'gray.3',
        }}
      >
        {props.options.length > 0
          ? props.options.map((option) => {
              return <option key={option.id}>{option.label}</option>;
            })
          : 'No options'}
      </Select>
    </div>
  );
};

export default SingleSelect;
