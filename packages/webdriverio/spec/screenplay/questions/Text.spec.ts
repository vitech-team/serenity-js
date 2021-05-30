import 'mocha';
import { by, Navigate, Target, Text } from '../../../src';
import { CreatePage, DeletePage, VisitPage } from '../../pages';
import { actorCalled, Log, replace, toNumber, trim } from '@serenity-js/core';
import { LocalServer, StartLocalServer, StopLocalServer } from '@serenity-js/local-server';
import { ChangeApiConfig } from '@serenity-js/rest';
import { Ensure, equals } from '@serenity-js/assertions';
import { expect } from '@integration/testing-tools';

describe('Text', () => {

    before(() =>
        actorCalled('Wendy').attemptsTo(
            StartLocalServer.onRandomPort(),
            ChangeApiConfig.setUrlTo(LocalServer.url()),
        ));

    after(() =>
        actorCalled('Wendy').attemptsTo(
            StopLocalServer.ifRunning(),
        ));

    describe('of', () => {

        const Header = Target.the('header').located(by.tagName('h1'));

        /** @test {Text.of} */
        it('allows the actor to read the text of the DOM element matching the locator', () =>
            actorCalled('Wendy').attemptsTo(
                CreatePage('hello_world', `
                    <html>
                        <body>
                            <h1>Hello World!</h1>
                        </body>
                    </html>
                `),

                VisitPage('hello_world'),

                Ensure.that(Text.of(Header), equals('Hello World!')),
            ));

        /** @test {Text.of} */
        /** @test {Text#toString} */
        it('produces a sensible description of the question being asked', () => {
            expect(Text.of(Target.the('header').located(by.tagName('h1'))).toString())
                .to.equal('the text of the header');
        });

        describe('when mapping', () => {

            /** @test {Text.of} */
            /** @test {Text#map} */
            it('allows for the answer to be mapped to another type', () =>
                actorCalled('Wendy').attemptsTo(

                    CreatePage('single_number_example', `
                        <html>
                            <body>
                                <h1>2</h1>
                            </body>
                        </html>
                    `),

                    VisitPage('single_number_example'),

                    Ensure.that(Text.of(Header).map(toNumber()), equals(2)),
                ));

            /** @test {Text.of} */
            /** @test {Text#map} */
            it('allows for the transformations to be chained', () =>
                actorCalled('Wendy').attemptsTo(

                    CreatePage('date_example', `
                        <html>
                            <body>
                                <h1>
                                2020-09-11T19:53:18.160Z
                                </h1>
                            </body>
                        </html>
                    `),

                    VisitPage('date_example'),

                    Ensure.that(
                        Text.of(Header).map(trim()).map(actor => value => new Date(value)), // eslint-disable-line unicorn/consistent-function-scoping
                        equals(new Date('2020-09-11T19:53:18.160Z'))
                    ),
                ));
        });
    });

    describe('ofAll', () => {

        const Shopping_List_Items = Target.all('shopping list items').located(by.css('li'));

        /** @test {Text.ofAll} */
        it('allows the actor to read the text of all DOM elements matching the locator', () =>
            actorCalled('Wendy').attemptsTo(

                CreatePage('shopping_list', `
                    <html>
                    <body>
                        <h1>Shopping list</h1>
                        <ul>
                            <li>milk</li>
                            <li>oats</li>
                        </ul>
                    </body>
                    </html>
                `),
                VisitPage('shopping_list'),

                Ensure.that(Text.ofAll(Shopping_List_Items), equals(['milk', 'oats'])),
            ));

        // todo: relative questions

        /** @test {Text.ofAll} */
        it('allows for a question relative to another target to be asked', () =>
            actorCalled('Wendy').attemptsTo(
                CreatePage('shopping_list', `
                    <html>
                    <body>
                        <h1>Shopping list</h1>
                        <ul>
                            <li>milk</li>
                            <li>oats</li>
                        </ul>
                    </body>
                    </html>
                `),
                VisitPage('shopping_list'),

                Ensure.that(
                    Text.ofAll(Shopping_List_Items).of(Target.the('body').located(by.tagName('body'))),
                    equals(['milk', 'oats'])
                ),
            ));

        /** @test {Text.ofAll} */
        /** @test {Text#toString} */
        it('produces sensible description of the question being asked', () => {
            expect(Text.ofAll(Shopping_List_Items).toString())
                .to.equal('the text of shopping list items');       // todo: the text of ALL, of THE ?
        });

        /** @test {Text.ofAll} */
        /** @test {Text#map} */
        it('allows for the answer to be mapped', () =>
            actorCalled('Wendy').attemptsTo(

                CreatePage('percentages', `
                    <html>
                    <body>
                        <ul id="answers">
                            <li>
                                6.67%
                            </li>
                            <li>
                                3.34%
                            </li>
                        </ul>
                    </body>
                    </html>
                `),

                VisitPage('percentages'),

                Ensure.that(
                    Text.ofAll(Target.all('possible answers').located(by.css('#answers li')))
                        .map(trim())
                        .map(replace('%', ''))
                        .map(toNumber()),
                    equals([6.67, 3.34])
                ),
            ));
    });
});
