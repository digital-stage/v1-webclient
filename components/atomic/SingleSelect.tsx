import React from "react";
import {OnChangeParams, Option, Select} from "baseui/select/index";
import {SIZE} from "baseui/input/index";

const SingleSelect = (props: {
    options?: {
        id: string;
        label: string;
    }[],
    id?: string,
    onSelect: (id?: string) => any,
    className?: string
}) => {
    const value: Option = props.options && props.id && props.options.find(option => option.id === props.id);
    return (
        <div className={props.className}>
            <Select
                size={SIZE.compact}
                options={props.options}
                onChange={(params: OnChangeParams) => {
                    if (params.value.length > 0) {
                        const id = params.value[0].id as string;
                        props.onSelect(id);
                    } else {
                        props.onSelect(undefined);
                    }
                }}
                value={value && [value]}
            />
        </div>
    )
}

export default SingleSelect;