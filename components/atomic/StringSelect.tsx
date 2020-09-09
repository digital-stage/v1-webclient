import React from "react";
import {OnChangeParams, Select} from "baseui/select/index";

const StringSelect = (props: {
    options: string[],
    value: string,
    onSelect: (value: string) => any
}) => (
    <Select
        options={props.options.map((option, index) => ({
            id: index,
            label: option
        }))}
        onChange={(params: OnChangeParams) => {
            if (props.value.length > 0) {
                const value = params.value[0].label as string;
                props.onSelect(value);
            } else {
                props.onSelect(undefined);
            }
        }}
        value={props.value ? [{
            id: props.options.indexOf(props.value),
            label: props.value
        }] : undefined}
    >

    </Select>
);

export default StringSelect;