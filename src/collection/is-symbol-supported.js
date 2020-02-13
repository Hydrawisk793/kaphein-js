function isSymbolSupported()
{
    return Symbol && "function" === typeof Symbol;
}

export {
    isSymbolSupported,
};
