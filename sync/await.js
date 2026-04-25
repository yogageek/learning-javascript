const { fetchUser, fetchAct } = require("./promise");

async function runAsyncAwaitDemo() {
    console.log("=== async/await demo ===");

    try {
        const data = await fetchUser();
        console.log("data:", data);

        const data2 = await fetchAct(data.id);
        console.log("data2:", data2);
    } catch (err) {
        console.error("error:", err);
    }
}

async function runAsyncAwaitAllDemo() {
    console.log("=== async/await Promise.all demo ===");

    try {
        const [user, act] = await Promise.all([fetchUser(), fetchAct(1)]);

        console.log("user:", user);
        console.log("act:", act);
    } catch (err) {
        console.error("error:", err);
    }
}

module.exports = {
    runAsyncAwaitDemo,
    runAsyncAwaitAllDemo,
};

if (require.main === module) {
    runAsyncAwaitDemo().then(() => runAsyncAwaitAllDemo());
}
