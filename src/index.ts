import { Axon, Router, axonLogger } from "@axonlabs/core";
import { SieveCache } from "./Sieve.ts";
import type { User } from "./types";

const cache = new SieveCache<User>(3);

const core = Axon();
const router = Router();

const fetchUsers = async (user?: string) => {
    let url;

    if (user) url = `https://jsonplaceholder.typicode.com/users/${user}`;
    else url = "https://jsonplaceholder.typicode.com/users"

    return await (await fetch(url)).json() as User;
}

const getCache = (cache: SieveCache) => {
    let keys: string[] = [];

    for (const node of cache) {
        keys.push(node.key);
    }

    return keys;
}

router.get("/users", async (req, res) => {
    let users = cache.get("users");

    if (!users) {
        users = await fetchUsers();
        cache.set("users", users);
    }

    res.status(200).body({
        error: false,
        data: users
    });

    axonLogger.info(`Cached Data:\x1b[35m ${getCache(cache).join(" | ")}`);
});

router.get("/users/{id}", async (req, res) => {
    let user = cache.get(`user:${req.params?.id}`);

    if (!user) {
        user = await fetchUsers(req.params?.id);
        cache.set(`user:${req.params?.id}`, user);
    }

    if (!Object.keys(user).length) return res.status(404).body({
        error: true,
        message: "User not found"
    });

    res.status(200).body({
        error: false,
        data: user
    });

    axonLogger.info(`Cached Data:\x1b[35m ${getCache(cache).join(" | ")}`);
});

core.loadRoute(router);

core.listen();