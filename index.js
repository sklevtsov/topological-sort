'use strict';

const assert = require('assert');

class TopologicalSort {

    constructor(nodes) {
        this._nodes = new Map;
        this._addNodes(nodes);
    }

    addNode(key, node) {
        return this._addNode(key, node);
    }

    addNodes(nodes) {
        this._addNodes(nodes);
    }

    addEdge(fromKey, toKey) {
        assert(this._nodes.has(fromKey), `Source node with ${fromKey} key should exist`);
        assert(this._nodes.has(toKey), `Target node with ${toKey} key should exist`);

        const sourceNode = this._nodes.get(fromKey);
        const targetNode = this._nodes.get(toKey);

        assert.strictEqual(sourceNode !== undefined, true, `Source node with key ${fromKey} doesn't exist`);
        assert.strictEqual(targetNode !== undefined, true, `Target node with key ${toKey} doesn't exist`);
        assert.strictEqual(sourceNode.children.has(toKey), false, `Source node ${fromKey} already has an adge to target node ${toKey}`);

        sourceNode.children.set(toKey, targetNode);
    }

    sort() {
        this._visitedNodes = new Set;
        this._sortedKeysStack = [];
        this._pickNodes = new Set;
        const output = new Map;

        for (const [key] of this._nodes) {
            this._pickNodes.add(key);
            this._exploreNode(key, [key], true);
        }

        for (let i = this._sortedKeysStack.length - 1; i >= 0; i--) {
            output.set(this._sortedKeysStack[i], this._nodes.get(this._sortedKeysStack[i]));
        }

        return output;
    }

    _exploreNode(nodeKey, explorePath, skipCurrentNodeCheck = false) {
        if (!skipCurrentNodeCheck) {
            assert(!this._pickNodes.has(nodeKey), `Node ${nodeKey} forms circular dependency: ${explorePath.join(' -> ')}`);
        }

        const node = this._nodes.get(nodeKey);
        if (this._visitedNodes.has(node)) {
            return;
        }

        // mark node as visited so that it and its children
        // won't be explored next time
        this._visitedNodes.add(node);

        for (const [childNodeKey] of node.children) {
            this._exploreNode(
                childNodeKey,
                [...explorePath, childNodeKey]
            );
        }

        this._sortedKeysStack.push(nodeKey);
    }

    _addNode(key, node) {
        assert.strictEqual(this._nodes.has(key), false, `Node ${key} already exists`);

        // TODO: check circular dependencies

        this._nodes.set(key, {
            node,
            children: new Map
        });

        return this;
    }

    _addNodes(nodes) {
        for (let [key, node] of nodes) {
            this._addNode(key, node);
        }
    }

}

module.exports = TopologicalSort;
