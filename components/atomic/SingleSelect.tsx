import React, {useEffect, useState} from "react";
import {OnChangeParams, Option, OptionsT, Select, Value, Value as BaseValue} from "baseui/select/index";

const SingleSelect = (props: {
    options?: {
        id: string;
        label: string;
    }[],
    id?: string,
    onSelect: (id?: string) => any
}) => {
    const value: Option = props.options && props.id && props.options.find(option => option.id === props.id);
    return (
        <Select
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
    )
}

export default SingleSelect;