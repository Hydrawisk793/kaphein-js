function isSymbolSupported()
{
    return Symbol && "function" === typeof Symbol;
}

module.exports = {
    isSymbolSupported : isSymbolSupported
};
