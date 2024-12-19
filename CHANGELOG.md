# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.2.0](https://bitbucket.org/manxtech/pound-app/branches/compare/v0.2.0..v0.1.1) (2024-12-19)


### ⚠ BREAKING CHANGES

* **user screen:** (NOBRIDGE) ERROR  {"error": "Unauthorized", "message": "new row violates row-level
security policy", "statusCode": "403"}

POUND-28

### Others

* remove unused package ([ddd1a2d](https://bitbucket.org/manxtech/pound-app/commits/ddd1a2dc36a7ff0736fc80c27e6e11e20d531039))
* update linting tools and bump husky ([cf125d9](https://bitbucket.org/manxtech/pound-app/commits/cf125d9a68ebed86780d359002d1ba4d6fe296b3))


### Features

* add api routes to add cards and make payments ([c81d130](https://bitbucket.org/manxtech/pound-app/commits/c81d130161018545df915e14b321ec7c6d603892))
* add bottom-sheet for card selection ([3225d2a](https://bitbucket.org/manxtech/pound-app/commits/3225d2ab7b55545dc4df93ec3fa276f0475f43ba))
* add contacts to database ([0a99cce](https://bitbucket.org/manxtech/pound-app/commits/0a99cce4b72f0b0f9476ce69bad9d5b13da60e69))
* add deposit page & addcard page ([a201633](https://bitbucket.org/manxtech/pound-app/commits/a201633c22b2faf8324f9ca590b479fceb06865f))
* add indivisual tx screens ([7fcb420](https://bitbucket.org/manxtech/pound-app/commits/7fcb4202f7193e37913f2bdcdf3a58397cfd19cd))
* add network context ([cda6ac0](https://bitbucket.org/manxtech/pound-app/commits/cda6ac0fd0d66d249503a4a272f21a13dcf93848))
* add payment confirm page ([f2f0b2e](https://bitbucket.org/manxtech/pound-app/commits/f2f0b2e6e4e6978be1ec09666e4c89aa8612d0e6))
* **amount:** add ability to write message when sending money ([f5eaa23](https://bitbucket.org/manxtech/pound-app/commits/f5eaa2354e4f5dc232957ebb47fbb6d2535bfcda))
* default card select ([3d403eb](https://bitbucket.org/manxtech/pound-app/commits/3d403eb886e50fea317eda0b20e8fc796bae998a))
* **kyc:** create placeholder KYC screens and UI ([8d5193f](https://bitbucket.org/manxtech/pound-app/commits/8d5193fa8a852f78221b01bb600dab3fe65ce34f))
* manage card screen ([b950733](https://bitbucket.org/manxtech/pound-app/commits/b950733705c9eb5da993eaf9b7babcf4a8f56c13))
* offline mode ([9614b08](https://bitbucket.org/manxtech/pound-app/commits/9614b083fc30644f2bc5ae73d89c7e3475c0f2b8))
* **profile:** ability to add/edit first_name and last_name ([772cfbf](https://bitbucket.org/manxtech/pound-app/commits/772cfbfb5b859a914557964c01edac518fa86562))
* send user to confirm page on scan ([fde7262](https://bitbucket.org/manxtech/pound-app/commits/fde72627c46d337e72d64208ca889dd4e2915c9d))
* **transfer:** add message to transfer ([9aa1b65](https://bitbucket.org/manxtech/pound-app/commits/9aa1b65704bd89ea1470fd2e659253ed4e840ba4))
* **transfer:** add message to transfer ([9301ccc](https://bitbucket.org/manxtech/pound-app/commits/9301cccf72a92a9dc3352db9845d1d07e9146482))
* **user screen:** ability to upload avatar ([bdb6d66](https://bitbucket.org/manxtech/pound-app/commits/bdb6d6637e20ff1b40865b41f6e87420a1b96dbe))


### Bug Fixes

* add 20px hitSlop for back buttons ([8b7560b](https://bitbucket.org/manxtech/pound-app/commits/8b7560b5838f8777ca18cc66d0a84b74d7491285))
* add auth errors ([9b70d2e](https://bitbucket.org/manxtech/pound-app/commits/9b70d2e762ff19a17112394b13fc7e5fbaf3a280))
* **add-card:** add proper formating and validation based on cardType ([bee2725](https://bitbucket.org/manxtech/pound-app/commits/bee2725ed306626518083c4e98ac5fcbfa5870bd))
* android modal issues ([902d5a1](https://bitbucket.org/manxtech/pound-app/commits/902d5a1f35c601a52325907f7e82de749b60e41d))
* **avatar:** change local to global person instance ([8dbe242](https://bitbucket.org/manxtech/pound-app/commits/8dbe242d3f0a9ada8a0984883d39134271547be9))
* fix broken paths ([c514818](https://bitbucket.org/manxtech/pound-app/commits/c5148185fb534e8acac5e3f7a8b13577cf74935a))
* fix deposit routes ([ab2513d](https://bitbucket.org/manxtech/pound-app/commits/ab2513dc6765cf38851bd05a1c9191cf3bcbcba1))
* **header buttons:** change onPress to onPressIn ([d78c054](https://bitbucket.org/manxtech/pound-app/commits/d78c0545cc8391b832068b9b894851d3dda830b7))
* make whole card clickable and reusable ([8b0a9aa](https://bitbucket.org/manxtech/pound-app/commits/8b0a9aa57eadb1c32f45ae2da7b321efca2062c5))
* missing link to deposit screen ([97799ba](https://bitbucket.org/manxtech/pound-app/commits/97799ba9065355599262db7c14960790872ef407))
* **register:** add truncate in email text ([81d23b3](https://bitbucket.org/manxtech/pound-app/commits/81d23b33f75dd3a18cb0a96c3ec31c9ea3c42a6a))
* **register:** add truncate in email text ([9b64837](https://bitbucket.org/manxtech/pound-app/commits/9b648373f2a7838b3a19ed3ee6012c0656e14372))
* **register:** breaking email text ([3e4e746](https://bitbucket.org/manxtech/pound-app/commits/3e4e746116f5cc4b8dcc478278f36e398d09fe5a))
* **register:** breaking email text ([a73e4a8](https://bitbucket.org/manxtech/pound-app/commits/a73e4a8c326133fc2163dc58430ef5b71629aebb))
* replace expo-network with @react-native-community/netinfo ([23586e2](https://bitbucket.org/manxtech/pound-app/commits/23586e27d88fe6374c199bb3ddec9966ff0abeb6))
* route issues ([542d32a](https://bitbucket.org/manxtech/pound-app/commits/542d32a20700efe67a9bcd63974dadb9a1ef3db4))
* transaction catching all routes ([5bb32ba](https://bitbucket.org/manxtech/pound-app/commits/5bb32ba0eb45e507763b72b0245c2dd31695c17e))
* **types:** add return type to make_deposit ([d32e8bf](https://bitbucket.org/manxtech/pound-app/commits/d32e8bfa9b611a6457e5505eea871d260cea3084))


### Docs

* update database types ([a5759f5](https://bitbucket.org/manxtech/pound-app/commits/a5759f52b1e6bd27319092890f378214da59dc34))


### Styling

* add cssInterop for FontAwesome icons ([0982475](https://bitbucket.org/manxtech/pound-app/commits/09824752916439362453f6f2cbe9b45e30227da8))
* changes broder radius of btns & adds icon wrappers ([1497ea2](https://bitbucket.org/manxtech/pound-app/commits/1497ea244ffde9fc9f7de26e6577a1ffdc71ddb8))
* **profile:** minor fixes ([b420f48](https://bitbucket.org/manxtech/pound-app/commits/b420f485f2fdc8bf27467fb8e1b839f6f4f699e9))
* **profile:** touchableOpacity -> Pressable ([fa16dfa](https://bitbucket.org/manxtech/pound-app/commits/fa16dfae2a1e89adec5c1956665fb4fb4c569a8e))
* **qr code:** style qr code ([a1e364b](https://bitbucket.org/manxtech/pound-app/commits/a1e364be25ca2a2c25c1d89f1ab83c988ea0752f))
* replace Biome with ESLint + Prettier and add Husky ([a7459f8](https://bitbucket.org/manxtech/pound-app/commits/a7459f8bb940003a4973f51474ca47540acf2c19))
* ui improvements & cleanup ([52cf943](https://bitbucket.org/manxtech/pound-app/commits/52cf9437ba81987e93b5febc124a3daec8b052d4))


### Code Refactoring

* add library to help with queries ([1a250b6](https://bitbucket.org/manxtech/pound-app/commits/1a250b6db667e94cfd006592bbe64030c0dbf0e8))
* cleanup ([4fc4699](https://bitbucket.org/manxtech/pound-app/commits/4fc469907d2309ae7d001ace28f085560caca80e))
* rename add-card ([285b560](https://bitbucket.org/manxtech/pound-app/commits/285b560ae94812f839f2565574237cdc13d2f4b2))
* **splash:** update splash screen according to latest teccomendations ([b089ed9](https://bitbucket.org/manxtech/pound-app/commits/b089ed90b435dfe1ea2435f5cee10480fefdfe83))
* **transaction-item:** deposit -> account credit ([3dc080a](https://bitbucket.org/manxtech/pound-app/commits/3dc080a882c38ad1057ba08b2266dc9266f55d02))
* **types:** add return to make_transfer ([478aded](https://bitbucket.org/manxtech/pound-app/commits/478aded64e790dafe428fb4ebe343f10a9ae7a43))
* **types:** add return to make_transfer ([dd8e92e](https://bitbucket.org/manxtech/pound-app/commits/dd8e92e602b5185a880e25f6b55192fbbfadd22a))


### Performance Improvements

* replace controlled inputs with react-hook-form ([14a595b](https://bitbucket.org/manxtech/pound-app/commits/14a595b9657649247f79e3ab3342613343e1fb65))


### Build System

* bump all packages to latest versions ([91a6d17](https://bitbucket.org/manxtech/pound-app/commits/91a6d171dd0b2e314ff549e0fc7a7ae72393f449))
* bump all packages to latest versions ([ea63fef](https://bitbucket.org/manxtech/pound-app/commits/ea63fefede3529c08876b7cec969e9e5b3d987a1))
* bump expo packages ([1e5f9c0](https://bitbucket.org/manxtech/pound-app/commits/1e5f9c0bee5109dc095cc65916764ed47b3e1fe2))
* bump expo sdk to 52 ([1ddb766](https://bitbucket.org/manxtech/pound-app/commits/1ddb7666212537b0cc714cd394d1f50c268e6289))
* bump expo sdk to 52 ([bc58622](https://bitbucket.org/manxtech/pound-app/commits/bc58622b0f3946717806ff71c0ee6e5404d47a86))
* **npm:** bump expo packages to latest ([4cdf582](https://bitbucket.org/manxtech/pound-app/commits/4cdf582480a2824f2608990ba0197b607402c090))
* **npm:** bump packages ([a384db5](https://bitbucket.org/manxtech/pound-app/commits/a384db5bd7e6cb86aab2b1074da96133b81b510f))

## 0.1.1 (2024-11-13)

### Others

- add googleServicesFile ([b785743](https://bitbucket.org/manxtech/pound-app/commits/b78574377b384ad77937cd1c6ea86fd11320273f))
- add unknow word ([3484cc2](https://bitbucket.org/manxtech/pound-app/commits/3484cc20d4bfde49286fb41ec03dfbd758711e48))

### Features

- add ability to update poundTag ([c48511e](https://bitbucket.org/manxtech/pound-app/commits/c48511e0334f8e39d9a5b1b38306dd618aaea035))
- add account balance and ability to transfer money via QR codes ([aaa5e0c](https://bitbucket.org/manxtech/pound-app/commits/aaa5e0c758d5c9152a22e64b51ff6d0737d2d60d))
- add avatars and display names ([9543ca4](https://bitbucket.org/manxtech/pound-app/commits/9543ca40124bb2b7f869ed397fb94b80996fabde))
- add avatars and display names ([0133a0e](https://bitbucket.org/manxtech/pound-app/commits/0133a0e1a853335703d78be97ed2330538507556))
- add basic account balance to home screen ([826c455](https://bitbucket.org/manxtech/pound-app/commits/826c4559048bc8fdd7e9f2f45d05b19cbdb49748))
- add green/red to account balance change ([622af08](https://bitbucket.org/manxtech/pound-app/commits/622af08435dd9817ab285ccc883de02a87b91e68))
- add send button ([72e3e9f](https://bitbucket.org/manxtech/pound-app/commits/72e3e9f2896f8925323313900f852c055657e035))
- **login,register:** add show password ability ([bec3bbe](https://bitbucket.org/manxtech/pound-app/commits/bec3bbe645a3691016790c10c0a2880901ed6e8c))
- move qr scanner to its own screen ([190d52a](https://bitbucket.org/manxtech/pound-app/commits/190d52abfde3fa8ffa213f121e0edea9dbc33c6e))
- move send to its own screen ([e9606c6](https://bitbucket.org/manxtech/pound-app/commits/e9606c6034763ef0dd8a47e2b0a5f0f21e4d29ff))
- **push notifications:** enable push notifications ([d121c9a](https://bitbucket.org/manxtech/pound-app/commits/d121c9ac75a8ee7fdf306cd2b36a3ef894d14d48))
- **push notifications:** register for push notifications ([fcf1563](https://bitbucket.org/manxtech/pound-app/commits/fcf15637920883be9eb3c086f7951a5edf82af45))
- **register:** add password schema hint on register ([2c8fa58](https://bitbucket.org/manxtech/pound-app/commits/2c8fa58e12f011b21dfa05589f7b2d13af6c0076))
- **scan:** add payment success modal ([340a32d](https://bitbucket.org/manxtech/pound-app/commits/340a32d3de0d4b91f6891aaec708ee85ac3f103a))
- **scan:** add flash control and animated box ([13da59c](https://bitbucket.org/manxtech/pound-app/commits/13da59c94da4f66340dc802f6a7106ed923eceda))
- **send:** pay via contacts modal ([3f02ae8](https://bitbucket.org/manxtech/pound-app/commits/3f02ae8980585a3d8ba9913224f76f9712f631d3))
- **settings:** add settings context and page ([019edc3](https://bitbucket.org/manxtech/pound-app/commits/019edc3ca46d4b3ae7d4e951b4b740ed18bec169))
- setup animations and haptic feedback ([21e01a3](https://bitbucket.org/manxtech/pound-app/commits/21e01a3655f5e35fd5f7fc078b4f31ffcfd4f446))
- **tabs:** style tabs & add recent screen ([82821ba](https://bitbucket.org/manxtech/pound-app/commits/82821ba9cc5178ef7e7ef8998ceeba497621a364))
- **transactions page:** render transacctions in a sectionlist ([4625e54](https://bitbucket.org/manxtech/pound-app/commits/4625e54f0603d9253be9a81bd48006101fd1c5c0))
- **transactions:** add search and time in transactions ([4cbfc0a](https://bitbucket.org/manxtech/pound-app/commits/4cbfc0a6cefa958bcafefe8428f9dd2bee776bff))
- **welcome:** add apple and google btns ([d3a8c05](https://bitbucket.org/manxtech/pound-app/commits/d3a8c05b385bf6da858ae9bb0c7e3a74b92f5cee))
- **welcome:** add bottom sheet for login and register btns ([b481a5d](https://bitbucket.org/manxtech/pound-app/commits/b481a5da3fbcf32a64d57b0bd10b9f55c661ca2d))
- **welcome:** placeholder carousel ([7148e08](https://bitbucket.org/manxtech/pound-app/commits/7148e08b60ba30890e10f615891928a4a60439ae))

### Bug Fixes

- **auth:** sign out function now signs out only from local session, not all of them ([29898d0](https://bitbucket.org/manxtech/pound-app/commits/29898d04d4b57a7d77c9dd75747b3a5b1b1316c9))
- dark theme ([f1c9268](https://bitbucket.org/manxtech/pound-app/commits/f1c92688575ba04633e5a343e30d7e0f6e473c4d))
- enable RLS and views ([f8e25d8](https://bitbucket.org/manxtech/pound-app/commits/f8e25d836ad58f8dac18fb0273a5e791c6486d79))
- enable staging app badge and add push notification icon ([7bba471](https://bitbucket.org/manxtech/pound-app/commits/7bba47125bfa7ec39ef4d015e7d48e6afb78a1b9))
- fix image typo ([60702e6](https://bitbucket.org/manxtech/pound-app/commits/60702e6a840f12799696a04b5888e2bbfdcbb0f4))
- icons according to Expo figma dimensions ([1785c33](https://bitbucket.org/manxtech/pound-app/commits/1785c33cff22283a68c8f308af643dcd2d353ea7))
- reference is now set ([47ee19b](https://bitbucket.org/manxtech/pound-app/commits/47ee19b46c9a1c26b195c70127f91b7b5d0e255a))
- **welcome:** add pound splash image as placeholder ([669b11f](https://bitbucket.org/manxtech/pound-app/commits/669b11ffbaa6f1ada90ba73cb214f0b032343a42))

### Styling

- cleanup ([08bcb7f](https://bitbucket.org/manxtech/pound-app/commits/08bcb7f1731656b6c4c3a4b450509cfeb7083dc7))
- **ios:** add white bg for icon ([49f53d6](https://bitbucket.org/manxtech/pound-app/commits/49f53d6fa03a96afabf8e4f7e4befaeab97b77ad))
- list dependancies alphabetically ([c7d1de2](https://bitbucket.org/manxtech/pound-app/commits/c7d1de2a6c6f839ca815eb7f603bcf98a9afb3fa))
- **login,register:** modal presentation, keyboard auto focus ([23b0dea](https://bitbucket.org/manxtech/pound-app/commits/23b0deab8122089b365c6f2112d85d72b5b08511))
- **request button:** create light background for QR code ([5c24457](https://bitbucket.org/manxtech/pound-app/commits/5c2445735593af603a3b1f3c95730173e58c33ff))
- **sendbutton:** separate logic & style ([6c3548b](https://bitbucket.org/manxtech/pound-app/commits/6c3548b4906372f9cc1e6089a76e0fb500766f06))
- theme ([a0833b6](https://bitbucket.org/manxtech/pound-app/commits/a0833b6ee1e16100309d405c4a462fc25e8193a8))

### Code Refactoring

- **account-balance:** separate components ([2621a6d](https://bitbucket.org/manxtech/pound-app/commits/2621a6dc9fdd183c1a7413bb94e3259926bce4d1))
- change manncoin to pound and create tabs ([5b19f0f](https://bitbucket.org/manxtech/pound-app/commits/5b19f0ffeb500e25ab671509d5d6298289fc505e))
- **icons:** remove lucide-icons in favour of Ionicons ([e8cb17f](https://bitbucket.org/manxtech/pound-app/commits/e8cb17f9a4aa05617204471082b99964adc0a954))
- move cssInterop to Providers ([ab614dc](https://bitbucket.org/manxtech/pound-app/commits/ab614dc9568619ded5572f1d091eb691b456c9c5))
- move everything out of tabs execpt of home, scan and recent ([0180e07](https://bitbucket.org/manxtech/pound-app/commits/0180e076522d286ed8baaff12a7eceb8778585a9))
- point biome to installed version ([c4900dc](https://bitbucket.org/manxtech/pound-app/commits/c4900dc050d31d908dac5c622c3419e2dfae0689))

### Build System

- add App icon badges for dev and staging builds ([f67d1ed](https://bitbucket.org/manxtech/pound-app/commits/f67d1ed9982d933a11853a40b28066938e2179e9))
- add camera package and cleanup unused packages ([b890451](https://bitbucket.org/manxtech/pound-app/commits/b890451a658b03bbbb9158a8f587a4a1df9eceb8))
- add ios local builds ([27954cc](https://bitbucket.org/manxtech/pound-app/commits/27954cc7406126f254cf37cc661adf8d7ca22d97))
- add NFC package ([d96d87e](https://bitbucket.org/manxtech/pound-app/commits/d96d87e9b53855a67a46ca643081af73e1053a8e))
