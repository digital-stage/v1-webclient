import React from 'react';
import { Select } from 'theme-ui';

const SingleSelect = (props: {
  options?: {
    id: string;
    label: string;
  }[];
  defaultValue?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}): JSX.Element => {
  const selected = props.options.filter((option) => option.id === props.defaultValue);
  const selectedValue = selected.length > 0 ? selected[0].label : null;
  return (
    <div>
      <Select
        onChange={props.onChange}
        defaultValue={selectedValue}
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
