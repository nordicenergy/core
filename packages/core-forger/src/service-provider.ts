import { Container, Contracts, Enums, Providers, Services } from "@arkecosystem/core-kernel";

import { ForgeNewBlockAction, IsForgingAllowedAction } from "./actions";
// import { DelegateFactory } from "./delegate-factory";
import { DelegateTracker } from "./delegate-tracker";
import { ForgerService } from "./forger-service";
import { Delegate } from "./interfaces";
import { Delegate as Method } from "./methods/delegate";
import { CurrentDelegateProcessAction, LastForgedBlockRemoteAction, NextSlotProcessAction } from "./process-actions";

/**
 * @export
 * @class ServiceProvider
 * @extends {Providers.ServiceProvider}
 */
export class ServiceProvider extends Providers.ServiceProvider {
    /**
     * @returns {Promise<void>}
     * @memberof ServiceProvider
     */
    public async register(): Promise<void> {
        this.app.bind<ForgerService>(Container.Identifiers.ForgerService).to(ForgerService).inSingletonScope();

        this.app.get<ForgerService>(Container.Identifiers.ForgerService).register(this.config().all()); // ? why it isn't in boot?

        this.registerActions();

        this.registerProcessActions();
    }

    /**
     * @returns {Promise<void>}
     * @memberof ServiceProvider
     */
    public async boot(): Promise<void> {
        const delegates: Delegate[] = this.makeDelegates();

        await this.app.get<ForgerService>(Container.Identifiers.ForgerService).boot(delegates);

        this.startTracker(delegates);

        // // Don't keep bip38 password in memory
        // this.config().set("app.flags.bip38", undefined);
        // this.config().set("app.flags.password", undefined);
    }

    /**
     * @returns {Promise<void>}
     * @memberof ServiceProvider
     */
    public async dispose(): Promise<void> {
        await this.app.get<ForgerService>(Container.Identifiers.ForgerService).dispose();
    }

    /**
     * @returns {Promise<boolean>}
     * @memberof ServiceProvider
     */
    public async bootWhen(): Promise<boolean> {
        const { secrets, bip38 }: { secrets: string[]; bip38: string } = this.app.config("delegates")!;

        if (!bip38 && (!secrets || !secrets.length || !Array.isArray(secrets))) {
            return false;
        }

        return true;
    }

    private registerActions(): void {
        this.app
            .get<Services.Triggers.Triggers>(Container.Identifiers.TriggerService)
            .bind("forgeNewBlock", new ForgeNewBlockAction());

        this.app
            .get<Services.Triggers.Triggers>(Container.Identifiers.TriggerService)
            .bind("isForgingAllowed", new IsForgingAllowedAction());
    }

    private registerProcessActions(): void {
        this.app
            .get<Contracts.Kernel.ProcessActionsService>(Container.Identifiers.ProcessActionsService)
            .register(this.app.resolve(CurrentDelegateProcessAction));

        this.app
            .get<Contracts.Kernel.ProcessActionsService>(Container.Identifiers.ProcessActionsService)
            .register(this.app.resolve(NextSlotProcessAction));

        this.app
            .get<Contracts.Kernel.ProcessActionsService>(Container.Identifiers.ProcessActionsService)
            .register(this.app.resolve(LastForgedBlockRemoteAction));
    }

    /**
     * @private
     * @memberof ServiceProvider
     */
    private startTracker(delegates: Delegate[]): void {
        if (!Array.isArray(delegates) || !delegates.length) {
            return;
        }

        if (this.config().get("tracker") === true) {
            this.app
                .get<Contracts.Kernel.EventDispatcher>(Container.Identifiers.EventDispatcherService)
                .listen(
                    Enums.BlockEvent.Applied,
                    this.app.resolve<DelegateTracker>(DelegateTracker).initialize(delegates),
                );
        }
    }

    /**
     * @private
     * @returns {Delegate[]}
     * @memberof ServiceProvider
     */
    private makeDelegates(): Delegate[] {
        return [
            "022ffb5fa4eb5b2e71c985b1d796642528802f04a6ddf9a449ba1aab292a9744aa",
            "031a6d8dab63668e901661c592dfe4bcc75793959d6ee6300408482840487d1faf",
            "032cfbb18f4e49952c6d6475e8adc6d0cba00b81ef6606cc4927b78c6c50558beb",
            "033a5474f68f92f254691e93c06a2f22efaf7d66b543a53efcece021819653a200",
            "03ccf15ff3a07e1a4b04692f7f2db3a06948708dacfff47661c259f2fa689e1941",
            "02c3d1ae1b8fe831218f78cf09d864e60818ebdba4aacc74ecc2bcf2734aadf5ea",
            "035c14e8c5f0ee049268c3e75f02f05b4246e746dc42f99271ff164b7be20cf5b8",
            "0306950dae7158103814e3828b1ab97a87dbb3680db1b4c6998b8208865b2f9db7",
            "02e345079aca0567db96ec0ba3acf859b7cfd15134a855671f9c0fe8b1173767bd",
            "03b906102928cf97c6ddeb59cefb0e1e02105a22ab1acc3b4906214a16d494db0a",
            "023ee98f453661a1cb765fd60df95b4efb1e110660ffb88ae31c2368a70f1f7359",
            "02951227bb3bc5309aeb96460dbdf945746012810bb4020f35c20feae4eea7e5d4",
            "023e3b421c730f85d2db546ee58f2b8d81dc141c3b12f8b8efadba8ddf085a4db6",
            "02d0244d939fad9004cc104f71b46b428d903e4f2988a65f39fdaa1b7482894c9e",
            "0352e9ea81b7fb78b80ab6598e66d23764249c77b9492e3c1b0705d9d0722b729f",
            "02257c58004e5ae23716d1c44beea0cca7f5b522a692df367bae9015a4f15c1670",
            "03b12f99375c3b0e4f5f5c7ea74e723f0b84a6f169b47d9105ed2a179f30c82df2",
            "02ff842d25fc8eec9e1382e6468188b3fd130ab6246240fc97958ce83d6d147eaf",
            "03d60e675b8a4b461361689e29fcf809cc4724de57ad7e7f73825e16d7b092d338",
            "0242555e90957de10e3912ce8831bcc985a40a645447dbfe8a0913ee6d89914707",
            "03c57b6a3eb7d01ade51f95c8ae4e8ebeb7ca7b8422ab0fb2a236de5d1a5bc6a1b",
            "02747353898e59c4f784542f357d5dd938a2872adb53abb94924091fddfdd83dc3",
            "02789894f309f08a4e7833452552aa39e168005d893cafc8ef995edbfdba396d2c",
            "03ce92e54f9dbb5e4a050edddf5862dee29f419c60ceaad052d50aad6fcced5652",
            "02d2f48a7ebb5b6d484de15b4cab8ab13c1d39b7141301efe048714aa9d82eb1cd",
            "0236d5232cdbd1e7ab87fad10ebe689c4557bc9d0c408b6773be964c837231d5f0",
            "0304d0c477d634cc85d89c1a4afee8f51168d1747fe8fd79cabc26565e49eb8a7a",
            "03f3512aa9717b2ca83d371ed3bb2d3ff922969f3ceef92f65c060afa2bc2244fb",
            "029918d8fe6a78cc01bbab31f636494568dd954431f75f4ea6ff1da040b7063a70",
            "02cd9f56a176c843724eb58d3ef89dc88915a814bdcf284b02933e0dd203630a83",
            "03a8ff0a3cbdcb3bfbdb84dbf83226f338ba1452047ac5b8228a1513f7f1de80de",
            "039b5a3a71335bfa6c72b82498f814123e0678f7cd3d8e7221ec7124918736e01c",
            "03dcb84917cf6d7b742f58c04693c5e00c56a4ae83feec129b3e3cc27111796232",
            "0296893488d335ff818391da7c450cfeb7821a4eb535b15b95808ea733915fbfb1",
            "024d5eacc5e05e1b05c476b367b7d072857826d9b271e07d3a3327224db8892a21",
            "03d3c6889608074b44155ad2e6577c3368e27e6e129c457418eb3e5ed029544e8d",
            "02e311d97f92dc879860ec0d63b344239f17149ed1700b279b5ef52d2baaa0226f",
            "03eda1b9127d9a12a7c6903ca896534937ec492afa12ffa57a9aa6f3c77b618fdb",
            "027716e659220085e41389efc7cf6a05f7f7c659cf3db9126caabce6cda9156582",
            "022eedf9f1cdae0cfaae635fe415b6a8f1912bc89bc3880ec41135d62cbbebd3d3",
            "0250b742256f9321bd7d46f3ed9769b215a7c2fb02be951acf43bc51eb57ceadf6",
            "02ac8d84d81648154f79ba64fbf64cd6ee60f385b2aa52e8eb72bc1374bf55a68c",
            "03153c994e5306b2fbba9bb533f22871e12e4c1d1d3960d1eeef385ab143b258b4",
            "02062f6f6d2aabafd745e6b01f4aa788a012c4ce7131312026bdb6eb4e74a464d2",
            "02aabcdb8511f55b6a28593979b726ef55b1f5bbf16a83205c2e2bfc9d8c2909e3",
            "02677f73453da6073f5cf76db8f65fabc1a3b7aadc7b06027e0df709f14e097790",
            "02adfadcf8b9c8c1925c8662ac9cde0763c92b06404dfffad8555f41638cdf4780",
            "037997a6553ea8073eb199e9f5ff23b8f0892e79433ef35e13966e0a12849d02e3",
            "0215789ac26155b7a338708f595b97c453e08918d0630c896cbd31d83fe2ad1c33",
            "03f6af8c750b9d29d9da3d4ddf5818a1fcdd4558ba0dde731f9c4b17bcbdcd83f2",
            "037850667ea2c8473adf7c87ee4496af1b7821f4e10761e78c3b391d6fcfbde9bb",
        ].map((publicKey: string) => new Method(publicKey));

        // const delegates: Set<Delegate> = new Set<Delegate>();

        // for (const secret of this.app.config("delegates.secrets")) {
        //     delegates.add(DelegateFactory.fromBIP39(secret));
        // }

        // const { bip38, password } = this.app.config("app.flags")!;

        // if (bip38) {
        //     delegates.add(DelegateFactory.fromBIP38(bip38, password));
        // }

        // return [...delegates];
    }
}
