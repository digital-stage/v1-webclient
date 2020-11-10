/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx } from 'theme-ui';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

//fill: `black`,

const Logo = ({
  icon = false,
  single = false,
  width = 110,
}: {
  icon?: boolean;
  single?: boolean;
  width?: string | number;
}): JSX.Element => {
  const viewBoxWidth = icon ? '36' : '110';
  const StyledSvg = styled('svg')({
    '.st0': { clipPath: 'url(#SVGID_2_)' },
    '.st1': { fill: single ? 'currentColor' : 'url(#SVGID_3_)' },
    '.st2': { clipPath: 'url(#SVGID_5_)' },
    '.st3': { fill: single ? 'currentColor' : 'url(#SVGID_6_)' },
    '.st4': { clipPath: 'url(#SVGID_8_)' },
    '.st5': { fill: single ? 'currentColor' : 'url(#SVGID_9_)' },
    '.st6': { fill: single ? 'currentColor' : '#E41446' },
    width: width,
  });

  return (
    <StyledSvg
      viewBox={`16 16 ${viewBoxWidth} 44`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
    >
      <title>Digital Stage Logo</title>
      <g>
        <g>
          <g>
            <defs>
              <path
                id="SVGID_1_"
                d="M18,36.6c-0.4,1.5-0.6,3-0.6,4.6c0,0.5,0,1,0.1,1.5c10.5-2.3,21.2,3.6,24.8,13.7c1.8-0.9,3.5-2.2,4.9-3.7
					c-4.3-10-14.1-16.4-25-16.4C20.7,36.2,19.3,36.3,18,36.6"
              />
            </defs>
            <clipPath id="SVGID_2_">
              <use xlinkHref="#SVGID_1_" style={{ overflow: 'visible' }} />
            </clipPath>
            <g className="st0">
              <linearGradient
                id="SVGID_3_"
                gradientUnits="userSpaceOnUse"
                x1="-2017.0023"
                y1="1017.7028"
                x2="-2016.0143"
                y2="1017.7028"
                gradientTransform="matrix(14.9844 -39.0969 39.0969 14.9844 -9544.3213 -94032.8594)"
              >
                <stop offset="0" stopColor="#193154" />
                <stop offset="1" stopColor="#E51947" />
              </linearGradient>

              <polygon className="st1" points="10.6,53.8 21.1,26.3 53.8,38.8 43.3,66.3 				" />
            </g>
          </g>
          <g>
            <defs>
              <path
                id="SVGID_4_"
                d="M34.4,17.1V24c-5.3,0-10.4,2.5-13.6,6.7c12.2-0.5,23.6,5.8,29.6,16.4c0.7-1.9,1.1-4,1.1-6v-24H34.4z"
              />
            </defs>
            <clipPath id="SVGID_5_">
              <use xlinkHref="#SVGID_4_" style={{ overflow: 'visible' }} />
            </clipPath>
            <g className="st2">
              <linearGradient
                id="SVGID_6_"
                gradientUnits="userSpaceOnUse"
                x1="-2017.0023"
                y1="1017.6491"
                x2="-2016.0143"
                y2="1017.6491"
                gradientTransform="matrix(14.9844 -39.0969 39.0969 14.9844 -9543.4756 -94032.5234)"
              >
                <stop offset="0" stopColor="#193154" />
                <stop offset="1" stopColor="#E51947" />
              </linearGradient>
              <polygon className="st3" points="10.8,43.3 24.8,6.9 61.6,21 47.6,57.4 				" />
            </g>
          </g>
          <g>
            <defs>
              <path
                id="SVGID_7_"
                d="M18.8,48c1.1,2.6,2.9,4.9,5.1,6.6c1.3-0.3,2.6,0,3.6,0.8l0,0c0.7,0.5,1.2,1.2,1.5,2
					c2.6,0.8,5.3,1.1,7.9,0.7C34.2,50.7,26.5,46.4,18.8,48"
              />
            </defs>
            <clipPath id="SVGID_8_">
              <use xlinkHref="#SVGID_7_" style={{ overflow: 'visible' }} />
            </clipPath>
            <g className="st4">
              <linearGradient
                id="SVGID_9_"
                gradientUnits="userSpaceOnUse"
                x1="-2017.0022"
                y1="1017.6951"
                x2="-2016.0143"
                y2="1017.6951"
                gradientTransform="matrix(14.9844 -39.0969 39.0969 14.9844 -9545.5889 -94033.3281)"
              >
                <stop offset="0" stopColor="#193154" />
                <stop offset="1" stopColor="#E51947" />
              </linearGradient>
              <polygon className="st5" points="15.2,56.9 21.1,41.6 40.5,49 34.6,64.3 				" />
            </g>
          </g>
        </g>
        {icon || (
          <g>
            <path
              className="st6"
              d="M64.4,21.7c1.4,0,2.8,0.6,3.7,1.8v-5.4H71v15.2h-2.9v-1.7c-0.8,1.2-2.2,1.9-3.7,1.9c-2.9,0-5.2-2.4-5.2-5.9
			S61.5,21.7,64.4,21.7 M65.1,24.2c-1.7,0-3,1.4-3,3.1c0,0.1,0,0.2,0,0.3c0,2.2,1.5,3.4,3,3.4c1.7,0,3-1.4,3-3.1c0-0.1,0-0.2,0-0.2
			c0.1-1.7-1.1-3.2-2.8-3.3C65.2,24.3,65.2,24.3,65.1,24.2"
            />
            <path
              className="st6"
              d="M73.5,18.8c-0.1-1,0.7-1.8,1.7-1.9s1.8,0.7,1.9,1.7c0.1,1-0.7,1.8-1.7,1.9c0,0-0.1,0-0.1,0
			c-0.9,0.1-1.7-0.6-1.8-1.6C73.5,18.9,73.5,18.9,73.5,18.8 M73.8,21.9h2.9v11.3h-2.9V21.9z"
            />
            <path
              className="st6"
              d="M83.9,21.7c1.5-0.1,2.9,0.6,3.8,1.8v-1.6h2.9v11.4c0,3.1-1.9,5.5-5.6,5.5c-3.2,0-5.4-1.6-5.7-4.2h2.8
			c0.3,1,1.4,1.7,2.8,1.7c1.6,0,2.8-0.9,2.8-3v-1.8c-0.9,1.2-2.3,1.9-3.8,1.9c-2.9,0-5.2-2.4-5.2-5.9S81.1,21.7,83.9,21.7
			 M84.7,24.2c-1.7,0-3,1.4-3,3.1c0,0.1,0,0.2,0,0.3c0,2.2,1.5,3.4,3,3.4c1.7,0,3-1.4,3-3.1c0-0.1,0-0.2,0-0.2
			c0.1-1.7-1.1-3.2-2.8-3.3C84.8,24.3,84.8,24.2,84.7,24.2"
            />
            <path
              className="st6"
              d="M93.1,18.8c-0.1-1,0.7-1.8,1.7-1.9c1-0.1,1.8,0.7,1.9,1.7c0.1,1-0.7,1.8-1.7,1.9c0,0-0.1,0-0.1,0
			c-0.9,0.1-1.7-0.6-1.8-1.5C93.1,18.9,93.1,18.9,93.1,18.8 M93.4,21.9h2.9v11.3h-2.9V21.9z"
            />
            <path
              className="st6"
              d="M99.5,24.2h-1.4v-2.4h1.4v-2.8h2.9v2.8h2.5v2.4h-2.5v5.5c0,0.8,0.3,1.1,1.2,1.1h1.3v2.4h-1.8
			c-2.2,0-3.6-0.9-3.6-3.5L99.5,24.2z"
            />
            <path
              className="st6"
              d="M111.5,21.7c1.5-0.1,2.9,0.6,3.8,1.8v-1.6h2.9v11.3h-2.9v-1.7c-0.9,1.2-2.3,1.9-3.8,1.8
			c-2.9,0-5.2-2.4-5.2-5.9S108.6,21.7,111.5,21.7 M112.2,24.2c-1.7,0-3,1.4-3,3.1c0,0.1,0,0.2,0,0.3c0,2.2,1.5,3.4,3,3.4
			c1.7,0,3-1.4,3-3.1c0-0.1,0-0.2,0-0.2c0.1-1.7-1.1-3.2-2.8-3.3C112.4,24.3,112.3,24.2,112.2,24.2"
            />
            <rect x="120.9" y="18.1" className="st6" width="2.9" height="15.2" />
            <path
              className="st6"
              d="M64.3,52.8c-2.8,0-4.8-1.7-5-3.8h2.9c0.2,1,1.1,1.6,2.1,1.5c1.1,0,1.7-0.5,1.7-1.2c0-2-6.4-0.7-6.4-4.9
			c0-1.9,1.7-3.4,4.5-3.4s4.4,1.5,4.6,3.7h-2.7c-0.1-0.9-0.9-1.6-1.8-1.5c0,0-0.1,0-0.1,0c-1.1,0-1.6,0.4-1.6,1.1
			c0,2.1,6.3,0.8,6.4,5C68.7,51.4,67,52.9,64.3,52.8"
            />
            <path
              className="st6"
              d="M71.5,43.6h-1.4v-2.3h1.4v-2.8h2.9v2.8H77v2.3h-2.5v5.5c0,0.8,0.3,1.1,1.2,1.1H77v2.4h-1.8
			c-2.2,0-3.6-0.9-3.6-3.5V43.6z"
            />
            <path
              className="st6"
              d="M83.5,41.1c1.5-0.1,2.9,0.6,3.7,1.8v-1.7h2.9v11.3h-2.9V51c-0.9,1.2-2.3,1.9-3.8,1.8c-2.9,0-5.2-2.4-5.2-5.9
			S80.6,41.1,83.5,41.1 M84.2,43.6c-1.7,0-3,1.4-3,3c0,0.1,0,0.2,0,0.3c0,2.2,1.5,3.4,3,3.4c1.5,0,3-1.2,3-3.3
			c0.1-1.7-1.1-3.2-2.8-3.3C84.4,43.7,84.3,43.7,84.2,43.6"
            />
            <path
              className="st6"
              d="M97.4,41.1c1.5-0.1,2.9,0.6,3.8,1.8v-1.7h2.9v11.5c0,3.1-1.9,5.5-5.6,5.5c-3.2,0-5.4-1.6-5.7-4.2h2.8
			c0.3,1,1.4,1.7,2.8,1.7c1.6,0,2.8-0.9,2.8-3V51c-0.9,1.2-2.3,1.9-3.8,1.9c-2.9,0-5.2-2.4-5.2-5.9S94.5,41.1,97.4,41.1 M98.1,43.6
			c-1.7,0-3,1.4-3,3c0,0.1,0,0.2,0,0.3c0,2.2,1.5,3.4,3,3.4c1.8,0,3.3-1.5,3.3-3.3S99.9,43.6,98.1,43.6"
            />
            <path
              className="st6"
              d="M111.8,52.8c-3.3,0-5.7-2.3-5.7-5.9c0-3.6,2.3-5.8,5.7-5.8c2.9-0.2,5.4,2.1,5.6,5c0,0.2,0,0.4,0,0.6
			c0,0.4,0,0.7-0.1,1.1H109c0,1.5,1.2,2.6,2.7,2.6c0,0,0,0,0,0c1,0.1,1.9-0.5,2.3-1.4h3.1C116.4,51.4,114.2,53,111.8,52.8 M109,45.9
			h5.4c0-1.4-1.2-2.5-2.5-2.4c-0.1,0-0.1,0-0.2,0C110.3,43.5,109.1,44.5,109,45.9"
            />
          </g>
        )}
      </g>
    </StyledSvg>
  );
};

Logo.propTypes = {
  icon: PropTypes.bool,
  single: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
};

export default Logo;
