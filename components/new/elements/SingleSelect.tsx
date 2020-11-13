import React from 'react';
import { Select } from 'theme-ui';

const SingleSelect = (props: {
  options?: {
    id: string;
    label: string;
  }[];
  id?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}): JSX.Element => {
  return (
    <div className={props.className}>
      <Select onChange={props.onChange}>
        {props.options.length > 0
          ? props.options.map((option) => {
              return (
                <option key={option.id} id={option.id}>
                  {option.label}
                </option>
              );
            })
          : 'No options'}
      </Select>
    </div>
  );
};

export default SingleSelect;
