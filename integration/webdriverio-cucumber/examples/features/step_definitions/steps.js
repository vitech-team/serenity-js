const
    { configure } = require('@serenity-js/core'),
    { StdOutReporter } = require('@integration/testing-tools'),
    { Given } = require('@cucumber/cucumber');

configure({
    crew: [
        new StdOutReporter(),   // defined here to allow for native Cucumber native reporter tests
    ],
})

Given('a passing step', () => {

});
