/**
 * Represents a node in the doubly linked list used by the SieveCache.
 * @template T The type of the value stored in the node.
 */
class Node<T = any> {
    public key: string;
    public value: T;
    public prev: Node<T> | null;
    public next: Node<T> | null;
    public visited: boolean;

    constructor(key: string, value: T) {
        this.key = key;
        this.value = value;
        this.next = null;
        this.prev = null;
        this.visited = false;
    }
}

/**
 * An implementation of the Sieve caching algorithm.
 * @template V The type of the values stored in the cache.
 */
class SieveCache<V = any> {
    public head: Node<V> | null = null;
    public tail: Node<V> | null = null;
    public hand: Node<V> | null = null;
    public size: number = 0;
    public capacity: number;
    // The map is now strictly typed to hold Nodes with values of type V.
    public map: Map<string, Node<V>>;

    constructor(capacity: number) {
        this.map = new Map<string, Node<V>>();
        this.capacity = capacity;
    }

    /**
     * Adds or updates a key-value pair in the cache.
     * @param key The key to identify the entry.
     * @param value The value to be stored.
     * @returns The node that was created or updated.
     */
    public set(key: string, value: V): Node<V> {
        const existing = this.map.get(key);

        if (existing) {
            existing.value = value;
            // The 'visited' flag is now set on insertion/update, per Sieve algorithm.
            existing.visited = true; 
            return existing;
        }

        if (this.size === this.capacity) {
            this._evict();
        }

        const node = new Node<V>(key, value);
        this.map.set(key, node);
        this._addToHead(node);
        this.size++;

        return node;
    }

    /**
     * Retrieves a value from the cache by its key.
     * @param key The key of the value to retrieve.
     * @returns The value if found, otherwise undefined.
     */
    public get(key: string): V | undefined {
        const node = this.map.get(key);
        if (!node) return undefined;

        node.visited = true;
        return node.value;
    }

    /**
     * Retrieves a node from the cache by its key.
     * @param key The key of the node to retrieve.
     * @returns The node if found, otherwise null.
     */
    public getNode(key: string): Node<V> | null {
        return this.map.get(key) || null;
    }

    /**
     * Deletes an entry from the cache by its key.
     * @param key The key to delete.
     * @returns True if the deletion was successful, otherwise false.
     */
    public delete(key: string): boolean {
        const node = this.map.get(key);
        if (!node) return false;
        
        // If the hand is pointing to the node being deleted, move it.
        if (this.hand === node) {
            this.hand = node.prev;
        }

        this.map.delete(key);
        this._removeNode(node);
        this.size--;
        return true;
    }

    /**
     * Adds a new node to the front (head) of the list.
     * @param node The node to add.
     */
    private _addToHead(node: Node<V>) {
        node.next = this.head;
        node.prev = null;

        if (this.head) this.head.prev = node;
        this.head = node;

        if (!this.tail) this.tail = node;
    }

    /**
     * Removes a node from the list.
     * @param node The node to remove.
     */
    private _removeNode(node: Node<V>) {
        if (node.prev) node.prev.next = node.next;
        else this.head = node.next;

        if (node.next) node.next.prev = node.prev;
        else this.tail = node.prev;

        node.next = null;
        node.prev = null;
    }

    /**
     * Evicts an item from the cache based on the Sieve algorithm.
     */
    private _evict() {
        let object = this.hand || this.tail;

        while (object && object.visited) {
            object.visited = false;
            object = object.prev;
            // If we loop all the way around, start from the tail again.
            if (!object) {
                object = this.tail;
            }
        }

        if (!object) {
            // This case should ideally not be reached in a non-empty cache.
            // Fallback to evicting the tail if logic fails.
            object = this.tail;
            if (!object) return;
        };

        this.hand = object.prev;
        this.delete(object.key);
    }

    /**
     * Clears all entries from the cache.
     */
    public clear() {
        this.head = null;
        this.tail = null;
        this.hand = null;
        this.map.clear();
        this.size = 0;
    }

    /**
     * Returns an iterator for the cache entries.
     */
    *[Symbol.iterator](): Generator<{ key: string; value: V; }> {
        let cursor = this.head;

        while (cursor) {
            yield { key: cursor.key, value: cursor.value };
            cursor = cursor.next;
        }
    }

    /**
     * Converts the cache content to an array of objects.
     * @returns An array of key-value pairs.
     */
    public toArray(): ArrayObject<V>[] {
        return [...this].map(({ key, value }) => ({ key, value }));
    }
}

interface ArrayObject<T> {
    key: string;
    value: T
}

export {
    SieveCache,
    Node
};