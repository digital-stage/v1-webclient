import NextI18Next from "next-i18next";
import next from "next/config";
import path from "path";

const {localeSubpaths} = next().publicRuntimeConfig

const i18n: NextI18Next = new NextI18Next({
    defaultLanguage: "de",
    otherLanguages: ['en'],
    localeSubpaths,
    localePath: path.resolve('./public/static/locales')
});

export default i18n;