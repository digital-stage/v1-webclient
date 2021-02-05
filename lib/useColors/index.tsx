import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import HSLColor from './HSLColor';

function randomHue(): HSLColor {
  return new HSLColor(~~(360 * Math.random()), 70, 80, 1);
}

export interface ColorContext {
  generatedColors: {
    [id: string]: HSLColor;
  };

  generateColor(id: string);
}

const Context = createContext<ColorContext>(undefined);

const ColorProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  const [generatedColors, setGeneratedColors] = useState<{
    [id: string]: HSLColor;
  }>({});

  return (
    <Context.Provider
      value={{
        generatedColors,
        generateColor: (id: string) => {
          setGeneratedColors((prev) => ({
            ...prev,
            [id]: randomHue(),
          }));
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

const useColors = (): ((id: string) => HSLColor) => {
  const { generatedColors, generateColor } = useContext<ColorContext>(Context);

  const getColor = useCallback(
    (id: string) => {
      if (generatedColors[id]) {
        return generatedColors[id];
      } else {
        return generateColor(id);
      }
    },
    [generatedColors, generateColor]
  );

  return getColor;
};

export { ColorProvider };

export default useColors;