const { runCallbackDemo } = require("./callback");
const { runPromiseChainDemo, runPromiseAllDemo } = require("./promise");
const { runAsyncAwaitDemo, runAsyncAwaitAllDemo } = require("./await");

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function main() {
    runCallbackDemo();
    await wait(3500);

    await runPromiseChainDemo();
    await wait(500);

    await runPromiseAllDemo();
    await wait(500);

    await runAsyncAwaitDemo();
    await wait(500);

    await runAsyncAwaitAllDemo();
}

main();
