const tagRegEx = /(<\/?[a-z][a-z0-9]*(?::[a-z][a-z0-9]*)?\s*(?:\s+[a-z0-9-_]+=(?:(?:'[\s\S]*?')|(?:"[\s\S]*?")))*\s*\/?>)|([^<]|<(?![a-z\/]))*/gi;
const tagNameRegEx = /^<([^\s-]*).*>$/;
const attributesRegEx = /\s[a-z0-9-_]+\b(\s*=\s*('|")[\s\S]*?\2)?/gi;
const cssRegEx = /(\.[^{]*){([^}]*)}/gi;
const cssRuleNameRegEx = /^([^{]*){/;
const cssRuleValueRegEx = /^[^{]*{([^}]*)}/;
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// const telRegEx = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

module.exports = {
    tagRegEx,
    tagNameRegEx,
    attributesRegEx,
    cssRegEx,
    cssRuleNameRegEx,
    cssRuleValueRegEx,
    emailRegEx
};
