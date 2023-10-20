# No-Node Mocha.js setup

This is an example project demonstrating how you could use mocha in the browser to test your javascript files without any complicated node setup.

This example uses Deno to implement the file server but you could use anything that renders an HTML template.

For continuous integration this project uses GitHub Actions and `playwright`. They do require node but that's managed by the GitHub Action.

## All tasks are scripts in the `tasks/` directory

Instead of a task runner this project uses the file system and your shell. Tasks
are in the `tasks/` directory and are all executable scripts. Edit the scripts
to configure them (although this is rarely necessary).

### Run `tasks/setup` first

The setup script has only been tested on Linux.

Running `tasks/setup` will download a pinned version of `deno` into `.bin`. This
is the version that the task scripts will use. There is also a
`.vscode/settings.json` file that tells your deno extension in VS Code to use
the local binary.

This setup doesn't interfere with your shell's `$PATH` in any way.

The version is pinned to `v1.36.4`. This can be changed by editing the
`DENO_VERSION` variable and the `DENO_SHA` checksum variable in
the `tasks/setup` script.

The `deno.jsonc` configuration file is set up so that deno knows that `js` files
in this project are primarily for the browser. It is also documented with
comments. It will use the provided `import_map.json` file as the project's
primary import map

The setup task will also generate a self-signed certificate that the `serve`
task will then use to provide an `https` server.

### Run `tasks/serve` for unit testing in the browser with mocha

Tests are based on mocha.

Running `tasks/serve` will start up a simple `https` web server that hosts the
current directory and an HTML page that runs all test files found in `tests/`
and automatically includes the `import_map.json` file as an import map.

This server is set up to deliver files with all the necessary headers to enable
[cross-site isolation](https://web.dev/coop-coep/). This means that features
such as `SharedArrayBuffer`, high resolution timers, and `Atomics.wait()`. As a
result cross-origin resources are likely to break. At some point I'll update
this to make this configurable so you can turn isolation off if necessary.

This page will automatically refresh any time something in the current working
directory is changed.

Running `tasks/chrome` or `tasks/firefox` will attempt to launch browser
instances with fresh profiles and, if necessary, exceptions for self-signed
https certificates.

For coverage, use the coverage panel in Chrome's development tools.

To configure the test file (i.e. change mocha's interface or timeout settings),
edit the configuration variables in the `tasks/serve` script itself.

#### `.test` and `tests`

The `.test` directory contains vendored copies of `mocha` and `chai` to simplify
test setup.

I've also included an example `simpletest.js` file that shows how `mocha` and
`chai` are set up by default.

## Continuous Integration and automated test runs

This setup includes continuous integration. Whenever you push to GitHub it will
run an Action that installs [Playwright](https://playwright.dev/), runs the
Mocha tests in Firefox, WebKit, and Chrome and passes or fails depending on the
results of the Mocha unit tests.

These tests only run in the action and you don't need to have node or a node
version manager to use this setup.

The GitHub Action workflow does this by running `tasks/ci`,
`npx playwright install --with-deps`, and `tasks/ci-test`.

If you already have node setup on your machine, you could use Playwright as a
test runner for mocha with coverage. Just run `tasks/ci` to move the config
files to project root, commit, and finally run
`npx playwright install --with-deps`.

then you can use `tasks/ci-test` to run the tests with coverage.

This is error-prone if your platform isn't well-supported by the Playwright
team. You may have to edit `playwright.config.js` and remove the `webkit`
project for it to run.

### `tasks/ci-test`

Run this task after `tasks/ci` to have Playwright run all of the tests files in
`ci/tests`. You can include additional integration tests by adding Playwright
test files to `ci/tests`. This task will automatically gather coverage
information from Playwright and use the local copy of deno to both report
coverage data to standard out (should be visible in Action logs) and to
`cov_profile.lcov` which can be sent to coverage reporting services by adding
their actions to the workflow.

To automatically gather coverage data from additional integration tests, you
need to import the `pageWithCoverage` fixture from `ci/pageWithCoverage.js` and
use that as the main `page` object for interacting with the page. See
`ci/tests/mocha-spec.js` as an example.
