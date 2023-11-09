/*
Copyright (C) 2023 Intel Corporation
SPDX-License-Identifier: MIT
*/
// This file provides a basic service loader for Typescript.
// Why would one need such a thing? To have dynamic features based
// on the mere presence of some source code files in the package.

/**
 * A service loader interface
 */
export interface Loader<T> {
    /**
     * Dynamically load service by name
     * @param name service name
     */
    get(name: string): Promise<T | undefined>;
}

/**
 * A service loader restricted to a single folder subpath
 */
export class PathLoader<T> implements Loader<T> {
    prefix: string;
    cache: Map<string, T | null> = new Map();

    constructor(pathPrefix: string) {
        this.prefix = pathPrefix;
    }

    async get(name: string): Promise<T | undefined> {
        if (!name.match("^[a-zA-Z-]+$")) {
            throw new Error("Only single word accepted for service");
        }

        let s = this.cache.get(name);
        if (s !== undefined) {
            return s ?? undefined; //we return the known null as undefined
        }

        try {
            const module = await import(`${this.prefix}/${name}`);
            const provider = module.default as T;

            this.cache.set(name, provider);

            return provider;
        } catch (e) {
            this.cache.set(name, null);

            this.error(e, name);
            return undefined;
        }
    }

    /**
     * handle error `e` in subclass
     */
    protected error(e: any, name: string) {
    }

}

/**
 * Helper class to map a service. Best for factories.
 */
export class MappedLoader<T, U> implements Loader<U> {
    service: Loader<T>;
    mapper: (service: T) => U;

    cache: Map<string, U | null> = new Map();
    constructor(service: Loader<T>, mapper: (service: T) => U) {
        this.service = service;
        this.mapper = mapper;
    }

    async get(name: string): Promise<U | undefined> {
        let c = this.cache.get(name);
        if (c !== undefined) {
            return c ?? undefined; //we return the known null as undefined
        }

        const s = await this.service.get(name);
        if (s === undefined) {
            this.cache.set(name, null);
            return undefined;
        }

        const o = this.mapper(s);
        this.cache.set(name, o);
        return o;
    }

    /**
     * Call argument for each loaded service
     * @param f
     */
    forEach(f: (value: U) => void): void {
        this.cache.forEach(x => {
            //we skip services we couldn't load
            if (x !== null) {
                f(x);
            }
        });
    }
}