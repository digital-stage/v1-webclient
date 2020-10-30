import {createDarkTheme} from 'baseui';
import {ThemePrimitives} from "baseui/theme";

export interface COLOR {
    primary: 'primary';
    secondary: 'secondary';
    tertiary: 'tertiary';
}

const primitives: Partial<ThemePrimitives> = {
    /*
    primary: 'rgba(37, 81, 205, 1)',
    primary50: 'rgba(105, 125, 255, 1)',
    primary700: 'rgba(0, 42, 155, 1)',*/

    accent: 'rgb(242,4,67)',
    accent50: 'rgba(255, 89, 110, 1)',
    accent700: 'rgba(183, 0, 29, 1)',
};

const DarkTheme = createDarkTheme(primitives, /* overrides */);

export default DarkTheme;