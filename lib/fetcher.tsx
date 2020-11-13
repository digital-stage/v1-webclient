import fetch from 'isomorphic-unfetch';

const fetcher = (input: RequestInfo, init?: RequestInit) => fetch(input, init).then((res) => res.json());

export default fetcher;
