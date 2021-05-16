import { ModuleLoader, TestRunnerAdapter } from '@serenity-js/core/lib/io';
import reporter = require('../index');
import { JasmineConfig } from './JasmineConfig';
import { ExecutionIgnored, Outcome } from '@serenity-js/core/lib/model';
import { GrepSpecFilter, CustomFunctionSpecFilter, InvertedGrepSpecFilter, AcceptingSpecFilter, SpecFilter } from './filters';

/**
 * @desc
 *  Allows for programmatic execution of Jasmine test scenarios,
 *  using {@link SerenityReporterForJasmine} to report progress.
 *
 * @implements {@serenity-js/core/lib/io~TestRunnerAdapter}
 */
export class JasmineAdapter implements TestRunnerAdapter {

    private runner: any;
    private totalScenarios: number;

    /**
     * @param {JasmineConfig} config
     * @param {@serenity-js/core/lib/io~ModuleLoader} loader
     */
    constructor(
        private readonly config: JasmineConfig,
        private readonly loader: ModuleLoader,
    ) {
    }

    /**
     * @desc
     *  Scenario success threshold for this test runner.
     *
     * @returns {Outcome | { Code: number }}
     */
    successThreshold(): Outcome | { Code: number } {
        return ExecutionIgnored;
    }

    /**
     * @desc
     *  Loads test scenarios.
     *
     * @param {string[]} pathsToScenarios
     *
     * @returns {Promise<void>}
     */
    async load(pathsToScenarios: string[]): Promise<void> {
        const JasmineRunner = this.loader.require('jasmine');
        this.runner         = new JasmineRunner({ projectBaseDir: '' });

        if (this.config.defaultTimeoutInterval) {
            this.runner.jasmine.DEFAULT_TIMEOUT_INTERVAL = this.config.defaultTimeoutInterval;
        }

        this.runner.clearReporters();

        // tslint:disable-next-line:prefer-object-spread
        this.runner.loadConfig(Object.assign(
            {
                /*
                 * Serenity/JS doesn't use Jasmine's assertions, so this mechanism can be disabled
                 */
                oneFailurePerSpec: true,

                /*
                 * A spec should stop execution as soon as there's a hook or spec failure
                 * See https://github.com/angular/protractor/issues/3234
                 */
                stopSpecOnExpectationFailure: true,

                /*
                 * Default to not executing tests at random.
                 * See https://github.com/angular/protractor/blob/4f74a4ec753c97adfe955fe468a39286a0a55837/lib/frameworks/jasmine.js#L76
                 */
                random: false,
            },
            this.config,
        ));

        this.runner.addReporter(reporter(this.runner.jasmine));
        this.runner.configureDefaultReporter(this.config);

        /*
         * Configure spec filter
         */
        this.runner.env.configure({
            specFilter: spec => this.specFilter().matches(spec.getFullName()),
        })

        /*
         * Load files
         * todo: extract
         */
        this.runner.specDir     = '';
        this.runner.specFiles   = [];
        this.runner.addSpecFiles(pathsToScenarios);

        await this.runner.loadSpecs();

        //
        // // todo: count files
        // this.runner.env.topSuite()
    }

    private specFilter(): SpecFilter {
        if (this.config.specFilter) {
            return new CustomFunctionSpecFilter(this.config.specFilter);
        }

        if (this.config.grep) {
            return this.config.invertGrep
                ? new InvertedGrepSpecFilter(this.config.grep)
                : new GrepSpecFilter(this.config.grep);
        }

        return new AcceptingSpecFilter();
    }

    /**
     * @desc
     *  Returns the number of loaded scenarios
     *
     * @throws {@serenity-js/core/lib/errors~LogicError}
     *  If called before `load`
     *
     * @returns {number}
     */
    scenarioCount(): number {
        // todo: implement counting
        return 1;

        // if (this.totalScenarios === undefined) {
        //     throw new LogicError('Make sure to call `load` before calling `scenarioCount`');
        // }
        //
        // return this.totalScenarios;
    }

    /**
     * @desc
     *  Runs loaded test scenarios.
     *
     * @throws {LogicError}
     *  If called before `load`
     *
     * @returns {Promise<void>}
     */
    run(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.runner.onComplete((passed: boolean) => resolve());

            // todo: move paths to load
            //  -> this.runner.execute()
            // this.runner.execute(this.pathsToScenarios, this.config.grep);
            this.runner.execute();
        });
    }
}
