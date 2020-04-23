const { xmlToLocales } = require('./modules/localization/localization');

console.warn(xmlToLocales(`
<locales>
    <locale path="routes/href">
        <en>me <em>1</em></en>
    </locale>
</locales>
`))

