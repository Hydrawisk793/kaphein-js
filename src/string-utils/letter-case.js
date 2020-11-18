var isUndefinedOrNull = require("../type-trait").isUndefinedOrNull;

module.exports = (function ()
{
    var isAlphabetic = /[^.,/#!$%^&*;:{}=\-_`~()0-9]/;
    var isPunctuation = /[.,/#!$%^&*;:{}=\-_`~()]/;

    /**
     *  @param {string} text
     *  @param {string} [delimiter]
     *  @param {{}} [option]
     */
    function toDelimiterSeparatedCase(text)
    {
        var delimiter = arguments[1];
        if(isUndefinedOrNull(delimiter))
        {
            delimiter = "_";
        }

        var option = arguments[2];
        if(isUndefinedOrNull(option))
        {
            option = {};
        }

        var shouldIncrementE = false;
        var shouldExtractToken = false;
        var initial;
        var tokens = [];
        var s = 0, e = 1;
        while(s < text.length)
        {
            if(e < text.length)
            {
                var c = text[e];
                if(
                    c === c.toUpperCase()
                    && (e < 1 || (isAlphabetic.test(text[e - 1])))
                )
                {
                    shouldExtractToken = true;
                }

                shouldIncrementE = true;
            }
            else
            {
                shouldExtractToken = true;
            }

            if(shouldExtractToken)
            {
                shouldExtractToken = false;

                initial = text[s];
                tokens.push(initial.toLowerCase() + text.substring(s + 1, e).toLowerCase());

                s = e;
            }

            if(shouldIncrementE)
            {
                shouldIncrementE = false;
                ++e;
            }
        }

        return tokens.join(delimiter);
    }

    /**
     *  @param {string} text
     *  @param {string | RegExp} [delimiter]
     *  @param {{
            capitalizeInitial? : boolean;
        }} [option]
     */
    function toCapitalizedCase(text)
    {
        var delimiter = arguments[1];
        if(isUndefinedOrNull(delimiter))
        {
            delimiter = isPunctuation;
        }

        var option = arguments[2];
        if(isUndefinedOrNull(option))
        {
            option = {};
        }

        var tokens = text.split(delimiter);
        for(var i = 0; i < tokens.length; ++i)
        {
            var finalToken = tokens[i].toLowerCase();
            if(finalToken.length > 0)
            {
                if(i > 0 || option.capitalizeInitial)
                {
                    finalToken = finalToken[0].toUpperCase() + finalToken.substring(1);
                }
            }

            tokens[i] = finalToken;
        }

        return tokens.join("");
    }

    /**
     *  @deprecated Use `toCapitalizedCase` function instead.
     *  @param {string} str
     *  @param {string} delimiter
     */
    function toCamelCase(str, delimiter)
    {
        return str
            .split(delimiter)
            .reduce(
                function (acc, token)
                {
                    var tokenLowerCase = token.toLowerCase();

                    return (
                        "" === acc
                        ? tokenLowerCase
                        : acc + ("" !== tokenLowerCase.length ? tokenLowerCase[0].toUpperCase() + tokenLowerCase.slice(1) : tokenLowerCase)
                    );
                },
                ""
            )
        ;
    }

    return {
        toDelimiterSeparatedCase : toDelimiterSeparatedCase,
        toCapitalizedCase : toCapitalizedCase,
        toCamelCase : toCamelCase
    };
})();
