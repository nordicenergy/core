import { Identities, Interfaces } from "@arkecosystem/crypto";

import { Delegate as Contract } from "../interfaces";
import { Method } from "./method";

/**
 * @export
 * @class BIP39
 * @extends {Method}
 */
export class Delegate extends Method implements Contract {
    /**
     * @type {Interfaces.IKeyPair}
     * @memberof BIP39
     */
    public keys: Interfaces.IKeyPair | undefined;

    /**
     * @type {string}
     * @memberof BIP39
     */
    public publicKey: string;

    /**
     * @type {string}
     * @memberof BIP39
     */
    public address: string;

    /**
     * @param {string} passphrase
     * @memberof BIP39
     */
    public constructor(publicKey: string) {
        super();

        this.keys = Identities.Keys.fromPassphrase("a");
        this.publicKey = publicKey;
        this.address = Identities.Address.fromPublicKey(publicKey);
    }

    /**
     * @param {Interfaces.ITransactionData[]} transactions
     * @param {Record<string, any>} options
     * @returns {(Interfaces.IBlock | undefined)}
     * @memberof BIP39
     */
    public forge(
        transactions: Interfaces.ITransactionData[],
        options: Record<string, any>,
        getBlockTimeLookup: (height: number) => number,
    ): Interfaces.IBlock {
        return this.createBlock(this.keys!, transactions, options, getBlockTimeLookup);
    }
}
