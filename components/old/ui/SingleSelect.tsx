import React from 'react';
import { Select, SxStyleProp } from 'theme-ui';

const SingleSelect = (props: {
  options?: {
    id: string;
    label: string;
  }[];
  defaultValue?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sx?: SxStyleProp;
}): JSX.Element => {
  const selected = props.options.filter((option) => option.id === props.defaultValue);
  const selectedValue = selected.length > 0 ? selected[0].label : null;
  return (
    <Select
      onChange={props.onChange}
      defaultValue={selectedValue}
      sx={{
        ...props.sx,
      }}
    >
      {props.options.length > 0
        ? props.options.map((option) => {
            return (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            );
          })
        : 'No options'}
    </Select>
  );
};

export default SingleSelect;
